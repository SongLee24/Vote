// 将配置改为 CommonJS，内部动态 import ESM 插件以避免 "ESM file cannot be loaded by `require`" 错误
module.exports = async () => {
  const { default: react } = await import('@vitejs/plugin-react');
  return {
    plugins: [react()]
  };
};
