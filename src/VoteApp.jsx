import React, { useState } from 'react';
import { INITIAL_CANDIDATES, MOCK_USER, STYLES, Navigation } from './shared';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function VoteApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [user, setUser] = useState(MOCK_USER);

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
          <Dashboard candidates={candidates} user={user} onVote={handleVote} />
        )}
        {activeTab === 'profile' && (
          <Profile user={user} candidates={candidates} onDelegate={handleDelegate} />
        )}
        {activeTab === 'admin' && (
          <AdminPanel onAllocate={handleAllocate} />
        )}
      </main>
    </div>
    </div>
  );
}
