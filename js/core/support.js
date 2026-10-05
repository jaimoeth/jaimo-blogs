// ==========================================
// Support 按钮逻辑 (js/core/support.js)
// ==========================================

window.Blog = window.Blog || {};

/**
 * Support 按钮统一入口
 * - 未连接：复制 ENS
 * - 已连接：向 jaimo.eth 发送 0.002 ETH（以太坊主网）
 */
Blog.handleSupportClick = async function() {
    // 1) 未连接钱包：保持原来的复制 ENS 行为
    if (!Blog.wallet || !Blog.wallet.address) {
        Blog.copyWalletAddress();
        return;
    }

    // 2) 已连接：发起小额打赏
    await Blog.sendSupportEth();
};

/**
 * 向 jaimo.eth 发送 0.002 ETH
 */
Blog.sendSupportEth = async function() {
    if (!Blog.hasEthereumProvider || !Blog.hasEthereumProvider()) {
        Blog.showToast('未检测到钱包，请先安装 MetaMask');
        return;
    }

    if (typeof ethers === 'undefined') {
        Blog.showToast('支付组件未加载，请刷新后重试');
        return;
    }

    const ensName = (window.SITE_CONFIG && window.SITE_CONFIG.navbar && window.SITE_CONFIG.navbar.walletAddress)
        ? window.SITE_CONFIG.navbar.walletAddress
        : 'jaimo.eth';

    const amountEth = '0.002';

    try {
        Blog.showToast('正在准备支付...');

        // 确保在以太坊主网
        const okNetwork = await Blog.ensureMainnet();
        if (!okNetwork) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // 解析 jaimo.eth -> 地址
        const toAddress = await provider.resolveName(ensName);
        if (!toAddress) {
            Blog.showToast('无法解析 ' + ensName + ' 的地址');
            return;
        }

        // 发送 0.002 ETH
        const tx = await signer.sendTransaction({
            to: toAddress,
            value: ethers.parseEther(amountEth)
        });

        Blog.showToast('交易已提交，等待确认...');

        // 等 1 个确认（可选，体验更好）
        await tx.wait(1);

        Blog.showToast('支持成功，感谢！');
        console.log('[Support] tx hash =', tx.hash);
    } catch (error) {
        console.error('sendSupportEth error:', error);

        // 用户拒绝
        if (error && (error.code === 4001 || error.code === 'ACTION_REJECTED')) {
            Blog.showToast('你取消了支付');
            return;
        }

        // 余额不足等
        const msg = (error && error.shortMessage) || (error && error.message) || '';
        if (msg.toLowerCase().includes('insufficient funds')) {
            Blog.showToast('余额不足，请确保主网有足够 ETH');
            return;
        }

        Blog.showToast('支付失败，请稍后重试');
    }
};

/**
 * 确保当前钱包在以太坊主网（chainId = 1）
 * 不在主网时尝试切换；没有该网络则尝试添加
 */
Blog.ensureMainnet = async function() {
    try {
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        const chainId = parseInt(chainIdHex, 16);

        if (chainId === 1) return true;

        Blog.showToast('请切换到以太坊主网...');

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x1' }]
            });
            return true;
        } catch (switchError) {
            // 4902: 钱包里没有该网络
            if (switchError && switchError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x1',
                        chainName: 'Ethereum Mainnet',
                        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                        rpcUrls: ['https://ethereum.publicnode.com'],
                        blockExplorerUrls: ['https://etherscan.io']
                    }]
                });
                return true;
            }

            // 用户拒绝切换
            if (switchError && (switchError.code === 4001 || switchError.code === 'ACTION_REJECTED')) {
                Blog.showToast('需要切换到以太坊主网才能支付');
                return false;
            }

            throw switchError;
        }
    } catch (error) {
        console.error('ensureMainnet error:', error);
        Blog.showToast('切换主网失败，请手动切换后重试');
        return false;
    }
};