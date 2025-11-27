import React, { useState } from 'react';
import { Users, ShieldCheck } from 'lucide-react';
import { STYLES } from '../shared';

export default function AdminPanel({ onAllocate, isConnected }) {
  // State for Allocate Votes
  const [addresses, setAddresses] = useState("");
  // State for Add Candidate (使用 textarea 支持批量输入)
  const [candidateNames, setCandidateNames] = useState("");

  const handleAllocateSubmit = () => {
    const list = addresses.split('\n').filter(a => a.trim() !== "");
    onAllocate(list);
    setAddresses("");
  };

  const handleAddCandidatesSubmit = (e) => {
    e.preventDefault();
    
    // 按行分割输入，并过滤空行
    const nameList = candidateNames.split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (nameList.length > 0) {
      onAddCandidates(nameList); // 调用批量添加的函数
      setCandidateNames("");
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-4">
        <ShieldCheck size={48} className="text-[#6750A4] mb-4"/>
        <h2 className="text-2xl font-medium mb-2">连接钱包以访问管理功能</h2>
        <p className="text-[#49454F]">仅主持人账户连接后可进行管理操作。</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-[32px] leading-[40px] font-normal text-[#1D1B20]">管理功能</h1>
        <p className="text-[#49454F] mt-2">仅主持人可用。管理候选人列表和投票资格。</p>
      </header>

      {/* 批量新增候选人卡片 */}
      <div className={STYLES.card}>
        <h2 className={STYLES.cardTitle}><Users size={20} className="text-[#6750A4]"/> 批量新增候选人</h2>
        <form onSubmit={handleAddCandidatesSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#49454F] mb-1 ml-1">候选人姓名列表 (每行一个)</label>
            <textarea 
              className={`${STYLES.input} font-mono text-sm h-36 resize-none`}
              placeholder="请输入候选人姓名 (每行一个)\n例如：\n王小明\n李芳\n张伟" 
              value={candidateNames}
              onChange={(e) => setCandidateNames(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button type="submit" className={STYLES.primaryBtn}>
              <Users size={18} />
              批量添加候选人
            </button>
          </div>
        </form>
      </div>

      {/* 批量授权卡片 (分发票权) */}
      <div className={STYLES.card}>
        <h2 className={STYLES.cardTitle}><ShieldCheck size={20} className="text-[#6750A4]"/> 批量授权 (分发票权)</h2>
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
          <button onClick={handleAllocateSubmit} className={STYLES.primaryBtn}>
            执行分发
          </button>
        </div>
      </div>
    </div>
  );
}
