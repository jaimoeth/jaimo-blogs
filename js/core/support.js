// ==========================================
// Support 按钮逻辑 (js/core/support.js)
// ==========================================

window.Blog = window.Blog || {};

const config = window.SITE_CONFIG.support;
const walletAddr = config.walletAddress;
const amountEth = config.amountEth;
const network = config.network;

Blog.copyWalletAddress = function() {

    navigator.clipboard.writeText(walletAddr).then(() => {
        Blog.showToast(config.messages.copySuccess);
    }).catch(() => {
        Blog.showToast(config.messages.copyError);
    });
}

/**
 * Support 按钮统一入口
 * - 未连接：复制收款地址
 * - 已连接：发起 ETH 打赏
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
 * 发起 ETH 打赏
 */
Blog.sendSupportEth = async function() {

    if (!Blog.hasEthereumProvider || !Blog.hasEthereumProvider()) {
        Blog.showToast(config.messages.walletNotFound);
        return;
    }

    if (typeof ethers === 'undefined') {
        Blog.showToast(config.messages.ethersNotLoaded);
        return;
    }

    try {
        Blog.showToast(config.messages.preparing);

        // 确保在以太坊主网
        const okNetwork = await Blog.ensureMainnet();
        if (!okNetwork) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // 解析 jaimo.eth -> 地址
        const toAddress = await provider.resolveName(walletAddr);
        if (!toAddress) {
            Blog.showToast(config.messages.resolveFailed + ' ' + walletAddr);
            return;
        }

        // 发送 0.002 ETH
        const tx = await signer.sendTransaction({
            to: toAddress,
            value: ethers.parseEther(amountEth)
        });

        Blog.showToast(config.messages.transactionPending);

        // 等 1 个确认（可选，体验更好）
        await tx.wait(1);

        Blog.showToast(config.messages.success);
        console.log('[Support] tx hash =', tx.hash);
    } catch (error) {
        console.error('sendSupportEth error:', error);

        // 用户拒绝
        if (error && (error.code === 4001 || error.code === 'ACTION_REJECTED')) {
            Blog.showToast(config.messages.cancelled);
            return;
        }

        // 余额不足等
        const msg = (error && error.shortMessage) || (error && error.message) || '';
        if (msg.toLowerCase().includes('insufficient funds')) {
            Blog.showToast(config.messages.insufficientFunds);
            return;
        }

        Blog.showToast(config.messages.failed);
    }
};

/**
 * 确保当前钱包连接到指定网络
 * 不在目标网络时尝试切换；没有该网络则尝试添加
 */
Blog.ensureMainnet = async function() {

    try {
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        const chainId = parseInt(chainIdHex, 16);

        if (chainId === network.chainId) return true;

        Blog.showToast(config.messages.switchMainnet);

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: network.chainIdHex }]
            });
            return true;
        } catch (switchError) {
            if (switchError && switchError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [network]
                });
                return true;
            }

            if (switchError && (switchError.code === 4001 || switchError.code === 'ACTION_REJECTED')) {
                Blog.showToast(config.messages.switchMainnetRequired);
                return false;
            }

            throw switchError;
        }
    } catch (error) {
        console.error('ensureMainnet error:', error);
        Blog.showToast(config.messages.switchMainnetFailed);
        return false;
    }
};