import React, { useState } from 'react';
import { Users, UserCircle, ShieldCheck, Vote, Send, Info, CheckCircle, AlertCircle, LayoutDashboard } from 'lucide-react';

// 模拟合约中的候选人数据
const INITIAL_CANDIDATES = [
  { id: 1, name: "Alice", voteCount: 12 },
  { id: 2, name: "Bob", voteCount: 8 },
  { id: 3, name: "Charlie", voteCount: 5 },
];

// 模拟当前用户 (Voter结构体)
const MOCK_USER = {
  address: "0x123...abc",
  hasRightToVote: true,
  hasVoted: false,
  delegateTo: "0x0000000000000000000000000000000000000000",
  personalTargetId: 0,
  delegations: [
    { delegator: "0x456...def", targetId: 1, hasVoted: false }, // 收到的一份委托
    { delegator: "0x000...000", targetId: 0, hasVoted: false }, // 空槽位
    { delegator: "0x000...000", targetId: 0, hasVoted: false }  // 空槽位
  ]
};

// 样式常量 (基于 Material Design 3)
const STYLES = {
  container: "min-h-screen bg-[#FEF7FF] text-[#1D1B20] font-sans pb-20 md:pb-0 md:pl-24",
  navRail: "fixed bottom-0 left-0 w-full h-20 bg-[#F3EDF7] border-t border-[#CAC4D0] md:w-24 md:h-full md:border-t-0 md:border-r md:flex md:flex-col md:items-center md:py-8 z-50",
  navItem: "flex flex-col items-center justify-center w-full h-full md:h-20 md:w-20 md:mb-4 cursor-pointer hover:bg-[#E8DEF8] transition-colors rounded-xl mx-1 md:mx-0",
  navItemActive: "bg-[#E8DEF8] text-[#1D192B]",
  navIcon: "mb-1",
  navLabel: "text-xs font-medium",
  pageContainer: "max-w-3xl mx-auto p-4 pt-8 md:p-8",
  card: "bg-white rounded-2xl p-6 shadow-sm border border-[#E7E0EC] mb-4",
  cardTitle: "text-lg font-medium mb-4 flex items-center gap-2 text-[#1D1B20]",
  primaryBtn: "bg-[#6750A4] hover:bg-[#5F4998] text-white px-6 py-2.5 rounded-full font-medium shadow-sm active:shadow-none transition-all flex items-center gap-2 justify-center",
  secondaryBtn: "border border-[#79747E] text-[#6750A4] hover:bg-[#F3EDF7] px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 justify-center",
  input: "w-full bg-[#FEF7FF] border border-[#79747E] rounded-md px-4 py-3 text-[#1D1B20] focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4] outline-none transition-all placeholder-[#49454F]",
  chip: "px-3 py-1 rounded-lg text-sm font-medium inline-flex items-center gap-1",
  chipGreen: "bg-[#E6F4EA] text-[#137333]",
  chipRed: "bg-[#FCE8E6] text-[#C5221F]",
  chipNeutral: "bg-[#F3EFF4] text-[#49454F]",
};

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: '投票看板', icon: <LayoutDashboard size={24} /> },
    { id: 'profile', label: '账户信息', icon: <UserCircle size={24} /> },
    { id: 'admin', label: '分发票权', icon: <ShieldCheck size={24} /> },
  ];

  return (
    <nav className={STYLES.navRail}>
      <div className="hidden md:block mb-8 font-bold text-[#6750A4] text-xl tracking-tighter">VOTE</div>
      <div className="flex w-full md:flex-col justify-around md:justify-start">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${STYLES.navItem} ${activeTab === tab.id ? STYLES.navItemActive : 'text-[#49454F]'}`}
          >
            <span className={`${activeTab === tab.id ? 'bg-[#E8DEF8] px-4 py-1 rounded-full' : ''} mb-1`}>
              {tab.icon}
            </span>
            <span className={STYLES.navLabel}>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// --- PAGE 1: 投票看板 ---
const Dashboard = ({ candidates, user, onVote }) => {
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
};

// --- PAGE 2: 账户信息 ---
const Profile = ({ user, candidates, onDelegate }) => {
  const [delegateAddr, setDelegateAddr] = useState("");
  const [delegateTargetId, setDelegateTargetId] = useState("");

  const handleSubmitDelegation = (e) => {
    e.preventDefault();
    onDelegate(delegateAddr, delegateTargetId);
    setDelegateAddr("");
    setDelegateTargetId("");
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-[32px] leading-[40px] font-normal text-[#1D1B20]">账户信息</h1>
        <p className="text-[#49454F] mt-2">管理您的投票权益与委托设置。</p>
      </header>

      {/* 权益卡片 */}
      <div className={STYLES.card}>
        <h2 className={STYLES.cardTitle}><Info size={20} className="text-[#6750A4]"/> 我的权益状态</h2>
        <div className="space-y-4">
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
};

// --- PAGE 3: 分发票权 (Admin) ---
const AdminPanel = ({ onAllocate }) => {
  const [addresses, setAddresses] = useState("");

  const handleAllocate = () => {
    const list = addresses.split('\n').filter(a => a.trim() !== "");
    onAllocate(list);
    setAddresses("");
    alert(`成功为 ${list.length} 个地址分发票权！`);
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-[32px] leading-[40px] font-normal text-[#1D1B20]">分发票权</h1>
        <p className="text-[#49454F] mt-2">仅主持人可用。批量为地址授予投票资格。</p>
      </header>

      <div className={STYLES.card}>
        <h2 className={STYLES.cardTitle}><ShieldCheck size={20} className="text-[#6750A4]"/> 批量授权</h2>
        <div className="mb-6">
          <label className="block text-xs font-medium text-[#49454F] mb-2 ml-1">账户地址列表 (每行一个)</label>
          <textarea 
            className={`${STYLES.input} font-mono text-sm h-48 resize-none`}
            placeholder="0x123...\n0x456...\n0x789..."
            value={addresses}
            onChange={(e) => setAddresses(e.target.value)}
          ></textarea>
          <p className="text-xs text-[#49454F] mt-2 ml-1">* 系统会自动忽略已拥有票权的地址。</p>
        </div>
        <div className="flex justify-end">
          <button onClick={handleAllocate} className={STYLES.primaryBtn}>
            执行分发
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
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
  );
}
