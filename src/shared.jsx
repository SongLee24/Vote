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

// 主要改动：把紫色系替换为蓝色系（主色：#1E90FF，深色：#1877CC，浅色：#63B3FF，浅背景：#E6F3FF）
export const STYLES = {
  container: "min-h-screen bg-[#F0F8FF] text-[#0B2A4A] font-sans pb-20 md:pb-0 md:pl-24",
  navRail: "fixed bottom-0 left-0 w-full h-20 bg-[#E6F8FF] border-t border-[#C7D8E8] md:w-24 md:h-full md:border-t-0 md:border-r md:flex md:flex-col md:items-center md:py-8 z-50",
  navItem: "flex flex-col items-center justify-center w-full h-full md:h-20 md:w-20 md:mb-4 cursor-pointer hover:bg-[#D7EDFF] transition-colors rounded-xl mx-1 md:mx-0",
  navItemActive: "bg-[#D7EDFF] text-[#0B2A4A]",
  navIcon: "mb-1",
  navLabel: "text-xs font-medium",
  pageContainer: "max-w-3xl mx-auto p-4 pt-8 md:p-8",
  card: "bg-white rounded-2xl p-6 shadow-sm border border-[#E6F3FF] mb-4",
  cardTitle: "text-lg font-medium mb-4 flex items-center gap-2 text-[#0B2A4A]",
  primaryBtn: "bg-[#1E90FF] hover:bg-[#1877CC] text-white px-6 py-2.5 rounded-full font-medium shadow-sm active:shadow-none transition-all flex items-center gap-2 justify-center",
  secondaryBtn: "border border-[#7A8796] text-[#1E90FF] hover:bg-[#E6F3FF] px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 justify-center",
  input: "w-full bg-[#F8FCFF] border border-[#7A8796] rounded-md px-4 py-3 text-[#0B2A4A] focus:border-[#1E90FF] focus:ring-1 focus:ring-[#63B3FF] outline-none transition-all placeholder-[#6B7280]",
  chip: "px-3 py-1 rounded-lg text-sm font-medium inline-flex items-center gap-1",
  chipGreen: "bg-[#E6F4EA] text-[#137333]",
  chipRed: "bg-[#FCE8E6] text-[#C5221F]",
  chipNeutral: "bg-[#F0F7FB] text-[#49454F]",
};

export const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: '投票看板', icon: <LayoutDashboard size={24} /> },
    { id: 'profile', label: '账户信息', icon: <UserCircle size={24} /> },
    { id: 'admin', label: '管理功能', icon: <ShieldCheck size={24} /> },
  ];

  return (
    <nav className={STYLES.navRail}>
      <div className="hidden md:block mb-8 font-bold text-[#1E90FF] text-xl tracking-tighter">VOTE</div>
      <div className="flex w-full md:flex-col justify-around md:justify-start">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${STYLES.navItem} ${activeTab === tab.id ? STYLES.navItemActive : 'text-[#49454F]'}`}
          >
            <span className={`${activeTab === tab.id ? 'bg-[#D7EDFF] px-4 py-1 rounded-full' : ''} mb-1`}>
              {tab.icon}
            </span>
            <span className={STYLES.navLabel}>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
