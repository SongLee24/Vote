import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, base, mainnet, optimism, polygon, sepolia, hoodi } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Distributed Voting System',
  projectId: '29a0ecda31fde16f68bcc6745ba628d4',
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia, hoodi],
});
