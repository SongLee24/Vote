import React from 'react';
import { LayoutDashboard, UserCircle, ShieldCheck } from 'lucide-react';

export const INITIAL_CANDIDATES = [
  { id: 1, name: "Alice", voteCount: 12 },
  { id: 2, name: "Bob", voteCount: 8 },
  { id: 3, name: "Charlie", voteCount: 5 },
];

export const MOCK_USER = {
  address: "0x123...abc",
  hasRightToVote: true,
  hasVoted: false,
  delegateTo: "0x0000000000000000000000000000000000000000",
  personalTargetId: 0,
  delegations: [
    { delegator: "0x456...def", targetId: 1, hasVoted: false },
    { delegator: "0x000...000", targetId: 0, hasVoted: false },
    { delegator: "0x000...000", targetId: 0, hasVoted: false }
  ]
};

export const STYLES = {
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

export const Navigation = ({ activeTab, setActiveTab }) => {
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
