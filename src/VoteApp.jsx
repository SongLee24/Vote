import React, { useState, useEffect } from 'react';
import { DEFAULT_USER, STYLES, Navigation } from './shared';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import voteABI from './voteABI.json';

// 使用wagmi的hook
import { useAccount, useReadContract, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';

export default function VoteApp() {
  const voteContractAddress = '0x53330bb484a7E3BceEb5a70c2543A1511240c2cd';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [voteContract, setVoteContract] = useState(null);
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  // 初始化合约实例
  useEffect(() => {
    const initContract = async () => {
      if (!walletClient || !isConnected) {
        setVoteContract(null);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          voteContractAddress,
          voteABI,
          signer
        );
        setVoteContract(contract);
      } catch (err) {
        console.error('初始化合约失败：', err);
        setVoteContract(null);
      }
    };

    initContract();
  }, [walletClient, isConnected]);

  // 获取候选人列表，获取不到默认为空数组
  const { data: candidates } = useReadContract({
    address: voteContractAddress,
    abi: JSON.parse(JSON.stringify(voteABI)),
    functionName: 'getAllCandidates',
    account: address,
  }); 

  // 获取登陆用户信息
  const { data: user } = useReadContract({
    address: voteContractAddress,
    abi: JSON.parse(JSON.stringify(voteABI)),
    functionName: 'getMyInfo',
    account: address,
  });

  // 获取主持人地址
  const { data: host } = useReadContract({
    address: voteContractAddress,
    abi: JSON.parse(JSON.stringify(voteABI)),
    functionName: 'host',
    account: address,
  });

  // 安全 fallback，直到链上返回数据前使用 DEFAULT_USER 和空候选人数组
  const userSafe = user ? { ...user, address: address } : DEFAULT_USER;
  const candidatesSafe = candidates ?? [];
  const hostSafe = host ?? "";

  // 投票
  const handleVote = async (candidateId) => {
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }

    if (!voteContract) {
      alert('合约未初始化，请重新连接钱包');
      return;
    }

    try {
      const tx = await voteContract.vote(candidateId);
      await tx.wait();
      alert(`投票成功！您投给了 ID: ${candidateId}`);
    } catch (err) {
      console.error(err);
      alert('调用合约失败：' + (err?.message || err));
    }
  };

  // 委托投票
  const handleDelegate = async (to, targetId) => {
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }

    if (!voteContract) {
      alert('合约未初始化，请重新连接钱包');
      return;
    }

    try {
      const tx = await voteContract.delegateVote(to, targetId);
      await tx.wait();
      alert(`委托成功！已委托给 ${to}，意向候选人 ID: ${targetId}`);
    } catch (err) {
      console.error(err);
      alert('调用合约失败：' + (err?.message || err));
    }
  };

  // 分发票权 (Admin)
  const handleAllocate = async (addressList) => {
    if (!addressList || addressList.length === 0) return;

    for (const addr of addressList) {
      if (!ethers.isAddress(addr)) {
        alert(`无效地址：${addr}`);
        return;
      }
    }

    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }

    if (!voteContract) {
      alert('合约未初始化，请重新连接钱包');
      return;
    }

    try {
      const tx = await voteContract.allocateVotes(addressList);
      await tx.wait();
      alert('批量授权成功');
    } catch (err) {
      console.error(err);
      alert('调用合约失败：' + (err?.message || err));
    }
  };

  // 批量新增候选人 (Admin)
  const handleAddCandidates = async (nameList) => {
    if (!nameList || nameList.length === 0) return;

    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }

    if (!voteContract) {
      alert('合约未初始化，请重新连接钱包');
      return;
    }

    try {
      const tx = await voteContract.addCandidate(nameList);
      await tx.wait();
      alert('新增候选人成功');
    } catch (err) {
      console.error(err);
      alert('调用合约失败：' + (err?.message || err));
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'flex-end', padding: 10, backgroundColor: '#F0F8FF'}}>
      <ConnectButton />
    </div>
    <div className={STYLES.container}>
      {/* 侧边导航 */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 主内容区 */}
      <main className={STYLES.pageContainer}>
        {activeTab === 'dashboard' && (
          <Dashboard candidates={candidatesSafe} user={userSafe} onVote={handleVote} isConnected={isConnected}/>
        )}
        {activeTab === 'profile' && (
          <Profile user={userSafe} candidates={candidatesSafe} onDelegate={handleDelegate} isConnected={isConnected}/>
        )}
        {activeTab === 'admin' && (
          <AdminPanel user={userSafe} onAllocate={handleAllocate} onAddCandidates={handleAddCandidates} host={hostSafe} isConnected={isConnected}/>
        )}
      </main>
    </div>
    </div>
  );
}
