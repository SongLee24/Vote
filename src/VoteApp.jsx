import React, { useState } from 'react';
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
  const voteContractAddress = '0x1e7f24a2CbA8122051b66458b8459FD9BDD931A3';
  const [activeTab, setActiveTab] = useState('dashboard');
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  // 获取候选人列表，获取不到默认为空数组
  const { data: candidates } = useReadContract({
    address: voteContractAddress,
    abi: JSON.parse(JSON.stringify(voteABI)),
    functionName: 'getAllCandidates',
  }); 

  // 获取登陆用户信息
  const { data: user } = useReadContract({
    address: voteContractAddress,
    abi: JSON.parse(JSON.stringify(voteABI)),
    functionName: 'getMyInfo',
  })

  // 获取主持人地址
  const { data: host } = useReadContract({
    address: voteContractAddress,
    abi: JSON.parse(JSON.stringify(voteABI)),
    functionName: 'host',
  });

  // 安全 fallback，直到链上返回数据前使用 DEFAULT_USER 和空候选人数组
  const userSafe = user ? { ...user, address: address } : DEFAULT_USER;
  const candidatesSafe = candidates ?? [];
  const hostSafe = host ?? "";

  // 模拟投票动作
  const handleVote = (candidateId) => {
    // 1. 更新候选人票数
    const newCandidates = candidates.map(c => {
      if (c.id === candidateId) return { ...c, voteCount: c.voteCount + 1 };
      return c;
    });

    // 模拟帮代理人投票的逻辑
    user.delegations.forEach(d => {
      if (d.delegator !== "0x0000000000000000000000000000000000000000" && !d.hasVoted) {
        const target = newCandidates.find(c => c.id === d.targetId);
        if (target) target.voteCount += 1;
      }
    });

    setCandidates(newCandidates);

    // 2. 更新用户状态
    setUser({ 
      ...user, 
      hasVoted: true, 
      personalTargetId: candidateId,
      delegations: user.delegations.map(d => ({...d, hasVoted: true}))
    });

    alert(`投票成功！您投给了 ID: ${candidateId}`);
  };

  // 模拟委托动作
  const handleDelegate = (to, targetId) => {
    setUser({ ...user, delegateTo: to });
    alert(`委托成功！已委托给 ${to}，意向候选人 ID: ${targetId}`);
  };

  // 模拟分发票权 (Admin)
  const handleAllocate = (addressList) => {
    console.log("Allocating votes to:", addressList);
  };

  // 批量新增候选人 (Admin)
  const handleAddCandidates = async (nameList) => {
    if (!nameList || nameList.length === 0) return;

    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }

    if (!walletClient) {
      alert('无法获取钱包客户端，请重新连接钱包');
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
      
      const tx = await contract.addCandidate(nameList);
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
          <AdminPanel onAllocate={handleAllocate} onAddCandidates={handleAddCandidates} host={hostSafe} isConnected={isConnected}/>
        )}
      </main>
    </div>
    </div>
  );
}
