import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import Head from 'next/head';

// PIKO 配置
const PIKO_CA = "0xfb3bff0153a06c07b20de4abc8ad18685e5eb44f";
const ERC20_ABI = [
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: 'balance', type: 'uint256' }] },
] as const;

export default function Home() {
  const { address, isConnected } = useAccount();
  const [displayCA, setDisplayCA] = useState(PIKO_CA);

  // 自动读取余额
  const { data: balance } = useReadContract({
    address: PIKO_CA,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  return (
    <div style={{ backgroundColor: '#05070a', color: '#fff', minHeight: '100vh', padding: '0 20px' }}>
      <Head>
        <title>PIKO TERMINAL | Pro</title>
        {/* 核心：添加这行来显示图标 */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 导航栏 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #333' }}>
        <h1 style={{ color: '#F3BA2F', fontSize: '1.5rem', fontWeight: 'bold' }}>PIKO TERMINAL</h1>
        <ConnectButton />
      </nav>

      {/* 主布局 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '20px', marginTop: '20px' }}>
        
        {/* 左侧 K 线 */}
        <div style={{ height: '750px', borderRadius: '15px', overflow: 'hidden', border: '1px solid #222' }}>
          <iframe 
            src={`https://www.geckoterminal.com/base/pools/${PIKO_CA}?embed=1&info=0&swaps=1`}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>

        {/* 右侧面板 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Uniswap 交易 */}
          <div style={{ height: '520px', borderRadius: '15px', overflow: 'hidden', border: '1px solid #F3BA2F' }}>
            <iframe
              src={`https://app.uniswap.org/#/swap?outputCurrency=${PIKO_CA}&chain=base&theme=dark`}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>

          {/* 实时持仓 */}
          <div style={{ padding: '20px', borderRadius: '15px', background: '#111', border: '1px solid #333' }}>
            <p style={{ fontSize: '0.8rem', color: '#888' }}>YOUR PIKO BALANCE</p>
            <h2 style={{ color: '#F3BA2F', fontSize: '1.8rem' }}>
              {isConnected && balance ? parseFloat(formatUnits(balance, 18)).toLocaleString() : '0.00'}
            </h2>
          </div>

        </div>
      </div>
    </div>
  );
}