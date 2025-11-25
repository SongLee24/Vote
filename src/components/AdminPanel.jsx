import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { STYLES } from '../shared';

export default function AdminPanel({ onAllocate }) {
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
}
