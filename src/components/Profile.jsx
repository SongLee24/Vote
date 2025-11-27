import React, { useState } from 'react';
import { Users, UserCircle, Send, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { STYLES } from '../shared';

export default function Profile({ user, candidates, onDelegate, isConnected }) {
  const [delegateAddr, setDelegateAddr] = useState("");
  const [delegateTargetId, setDelegateTargetId] = useState("");

  const handleSubmitDelegation = (e) => {
    e.preventDefault();
    onDelegate(delegateAddr, delegateTargetId);
    setDelegateAddr("");
    setDelegateTargetId("");
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-4">
        <UserCircle size={48} className="text-[#6750A4] mb-4"/>
        <h2 className="text-2xl font-medium mb-2">连接钱包以查看个人信息</h2>
        <p className="text-[#49454F]">请连接钱包以管理您的投票权益和委托设置。</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-[32px] leading-[40px] font-normal text-[#1D1B20]">账户信息</h1>
        <p className="text-[#49454F] mt-2">管理您的投票权益与委托设置。</p>
      </header>

      {/* 权益卡片 */}
      <div className={STYLES.card}>
        <h2 className={STYLES.cardTitle}><Info size={20} className="text-[#6750A4]"/> 我的状态</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-[#E7E0EC]">
            <span className="text-[#49454F]">账户地址</span>
            <span className="text-[#49454F]">{user.address}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#E7E0EC]">
            <span className="text-[#49454F]">投票资格</span>
            {user.hasRightToVote ? 
              <span className={STYLES.chipGreen}><CheckCircle size={14}/> 已拥有</span> : 
              <span className={STYLES.chipRed}><AlertCircle size={14}/> 无权</span>
            }
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#E7E0EC]">
            <span className="text-[#49454F]">投票状态</span>
            {user.hasVoted ? 
              <span className={STYLES.chipGreen}>已投给 #{user.personalTargetId}</span> : 
              <span className={STYLES.chipNeutral}>未投票</span>
            }
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[#49454F]">委托状态</span>
            {user.delegateTo !== "0x0000000000000000000000000000000000000000" ? 
              <span className="text-[#6750A4] font-medium text-sm truncate max-w-[150px]">To: {user.delegateTo.slice(0,6)}...</span> : 
              <span className={STYLES.chipNeutral}>未委托</span>
            }
          </div>
        </div>
      </div>

      {/* 委托操作卡片 */}
      <div className={STYLES.card}>
        <h2 className={STYLES.cardTitle}><Send size={20} className="text-[#6750A4]"/> 委托投票</h2>
        <p className="text-sm text-[#49454F] mb-6">
          如果您无法亲自投票，可以将票权委托给他人。注意：您需要指定希望受托人投给哪位候选人。
        </p>
        
        {user.hasRightToVote && !user.hasVoted && user.delegateTo === "0x0000000000000000000000000000000000000000" ? (
          <form onSubmit={handleSubmitDelegation} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#49454F] mb-1 ml-1">受托人地址 (Delegatee)</label>
              <input 
                type="text" 
                placeholder="0x..." 
                className={STYLES.input}
                value={delegateAddr}
                onChange={(e) => setDelegateAddr(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#49454F] mb-1 ml-1">指定候选人ID</label>
              <select 
                className={STYLES.input}
                value={delegateTargetId}
                onChange={(e) => setDelegateTargetId(e.target.value)}
                required
              >
                <option value="">请选择候选人...</option>
                {candidates.map(c => (
                  <option key={c.id} value={c.id}>{c.id} - {c.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className={`w-full ${STYLES.secondaryBtn}`}>
              确认委托
            </button>
          </form>
        ) : (
          <div className="bg-[#F3EFF4] p-4 rounded-lg text-center text-[#49454F] text-sm">
            当前状态无法发起委托（无票权、已投票或已委托）。
          </div>
        )}
      </div>

      {/* 收到的委托列表 */}
      <div className={STYLES.card}>
        <h2 className={STYLES.cardTitle}><Users size={20} className="text-[#6750A4]"/> 收到的委托 (最多3人)</h2>
        <div className="space-y-3">
          {user.delegations.filter(d => d.delegator !== "0x0000000000000000000000000000000000000000").length === 0 ? (
             <p className="text-sm text-[#49454F] italic">暂无收到的委托。</p>
          ) : (
            user.delegations.map((d, idx) => {
              if (d.delegator === "0x0000000000000000000000000000000000000000") return null;
              return (
                <div key={idx} className="bg-[#F3EDF7] p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-xs text-[#49454F]">来自: {d.delegator.slice(0, 6)}...{d.delegator.slice(-4)}</p>
                    <p className="text-sm font-medium text-[#1D192B]">意向候选人: #{d.targetId}</p>
                  </div>
                  {d.hasVoted ? 
                    <span className="text-xs bg-[#E6F4EA] text-[#137333] px-2 py-1 rounded">已帮投</span> :
                    <span className="text-xs bg-[#FFD8E4] text-[#31111D] px-2 py-1 rounded">待处理</span>
                  }
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
