import React from 'react';
import { Wallet, AlertCircle, CheckCircle, Vote } from 'lucide-react';
import { STYLES } from '../shared';

export default function Dashboard({ candidates, user, onVote, isConnected }) {
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-4">
        <Wallet size={48} className="text-[#6750A4] mb-4"/>
        <h2 className="text-2xl font-medium mb-2">请连接您的钱包</h2>
        <p className="text-[#49454F]">连接钱包后，您将能够查看投票资格并进行投票操作。</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-[32px] leading-[40px] font-normal text-[#1D1B20]">投票看板</h1>
        <p className="text-[#49454F] mt-2">查看实时票数并投出您神圣的一票。</p>
      </header>

      {/* 状态横幅 */}
      {!user.hasRightToVote ? (
        <div className="bg-[#FCE8E6] text-[#601410] p-4 rounded-xl mb-6 flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-medium">您当前没有投票权</p>
            <p className="text-sm opacity-90">请联系主持人获取票权。</p>
          </div>
        </div>
      ) : user.hasVoted ? (
        <div className="bg-[#E6F4EA] text-[#0D3624] p-4 rounded-xl mb-6 flex items-start gap-3">
          <CheckCircle className="shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-medium">您已完成投票</p>
            <p className="text-sm opacity-90">感谢您的参与。</p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4">
        {candidates.map((candidate) => (
          <div key={candidate.id} className={`${STYLES.card} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-shadow hover:shadow-md`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#EADDFF] text-[#21005D] flex items-center justify-center font-bold text-xl">
                {candidate.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#1D1B20]">{candidate.name}</h3>
                <p className="text-[#49454F] text-sm">ID: #{candidate.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <span className="block text-2xl font-normal text-[#1D1B20]">{candidate.voteCount}</span>
                <span className="text-xs text-[#49454F] uppercase tracking-wider">票数</span>
              </div>
              
              <button 
                onClick={() => onVote(candidate.id)}
                disabled={!user.hasRightToVote || user.hasVoted || user.delegateTo !== "0x0000000000000000000000000000000000000000"}
                className={`${STYLES.primaryBtn} ${(!user.hasRightToVote || user.hasVoted) ? 'opacity-50 cursor-not-allowed bg-[#1D1B20]/12 text-[#1D1B20]/38 shadow-none' : ''}`}
              >
                <Vote size={18} />
                投票
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
