// ==========================================
// 1. 官网数据配置文件 (config.js)
// ==========================================

window.SITE_CONFIG = {

    siteName: "JaiMo Blogs",
    logoImg: "picture/avatar.png",
    headerSlogan: "Build from first principles.",
    walletAddress: "jaimo.eth", // 点击 Support 时复制的地址

    // 顶部下拉目录
    topicsMenu: [
        { name: "Token Price Simulation", link: "https://github.com/jaimoeth/topics/token-price-simulation.ipynb" },
        { name: "Contact us", link: "#contact-section" }
    ],

    // 全宽 Hero 头图区域new
    hero: {
        backgroundImage: "picture/background.png",
        title: "JaiMo Blogs",
        subtitle: "Build from first principles."
    },

    // 左侧 Database 目录树与文章源数据new
    // 所有的文章在这里维护，右侧会自动取前 5 篇显示最新，左侧会完整展示全部
    database: {
        title: "Database",
        categories: [
            {
                name: "Topics",
                icon: "📊",
                articles: [
                    {
                        id: "token-price-pimulation",
                        title: "Token Price Simulation",
                        date: "2026/10/10",
                        tag: "Topics",
                        url: "https://github.com/jaimoeth/topics/token-price-simulation.ipynb",
                        summary: "From fundamental assumptions to the derivation of Stochastic Differential Equations (SDEs). The complete process of mathematical modeling and quantitative simulation for token price generation functions."
                    }
                ]
            },
            {
                name: "Python",
                icon: "🐍",
                articles: [
                    {
                        id: "basics-chinese",
                        title: "Basics - English",
                        date: "2026/10/12",
                        tag: "Python",
                        url: "https://github.com/jaimoeth/python/basics-english.ipynb",
                        summary: "These open-source study notes are compiled based on MIT 6.0001, Introduction to Computer Science and Programming in Python, taught by Dr. Ana Bell, Prof. Eric Grimson, and Prof. John Guttag.This note is shared under the CC-BY-NC-SA license."
                    },
                    {
                        id: "basics-chinese",
                        title: "Basics - Chinese",
                        date: "2026/10/11",
                        tag: "Python",
                        url: "https://github.com/jaimoeth/python/basics-chinese.ipynb",
                        summary: "这份开源学习笔记基于 Ana Bell 博士、Eric Grimson 教授和 John Guttag 教授讲授的 MIT 6.0001 课程——“计算机科学与 Python 编程导论”——整理而成。本笔记采用 CC-BY-NC-SA 许可协议进行分享。"
                    }
                ]
            },
            {
                name: "Products",
                icon: "🔬",
                articles: [
                    {
                        id: "blog-website",
                        title: "Blog Website",
                        date: "2026/10/03",
                        tag: "Products",
                        url: "https://github.com/JaiMoLabs/blog-web",
                        summary: "An open-source template for Web3 static blogs and personal knowledge bases, showcasing decentralized web practices that combine IPFS hosting with ENS domain binding."
                    }
                ]
            }
        ]
    },


    // 底部底页配置（完全可配）
    footerConfig: {
        copyright: "@2026 JaiMo Labs. All rights reserved.",
        tagline: "Decentralized & Autonomous",
        columns: [
            {
                title: "Topics",
                links: [
                    { name: "Token Price Simulation", url: "https://github.com/jaimoeth/topics/token-price-simulation.ipynb" }
                ]
            },
            {
                title: "Products",
                links: [
                    { name: "Blog Website", url: "https://github.com/JaiMoLabs/blog-web" }
                ]
            },
            {
                title: "Career",
                links: [
                    { name: "Stay Tuned", url: "#" }
                ]
            },
            {
                title: "Python",
                links: [
                    { name: "Basics - English", url: "https://github.com/jaimoeth/python/basics-english.ipynb" },
                    { name: "Basics - Chinese", url: "https://github.com/jaimoeth/python/basics-chinese.ipynb" }
                ]
            }
        ]
    },

    // 社交媒体统一配置（升级为支持图标）
    socialLinks: [
        {
            name: "X (Twitter)",
            url: "https://x.com/jaimoeth",
            // X (Twitter) 官方 SVG 路径
            svg: '<path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>'
        },
        {
            name: "Bluesky",
            url: "https://bsky.app/profile/jaimo.eth.limo",
            // Bluesky 官方 SVG 路径
            svg: '<path fill="currentColor" d="M12 10.8c-1.087-2.114-4.046-6.052-7.983-8.73-2.16-1.464-3.517-1.144-4.017-.924-.656.292-.767 1.218-.767 1.838 0 1.077.585 7.18 1.133 8.356 1.049 2.27 3.447 3.013 5.568 3.272-1.77.302-3.414 1.144-3.414 3.125 0 2.215 1.93 3.033 4.295 3.033 4.706 0 6.185-3.327 6.185-5.96 0-.27-.015-.54-.035-.81.02.27.035.54.035.81 0 2.633 1.479 5.96 6.185 5.96 2.365 0 4.295-.818 4.295-3.033 0-1.981-1.644-2.823-3.414-3.125 2.121-.259 4.519-1.002 5.568-3.272.548-1.176 1.133-7.279 1.133-8.356 0-.62-.111-1.546-.767-1.838-.5-.22-1.857-.54-4.017.924-3.937 2.678-6.896 6.616-7.983 8.73z"/>'
        },
        {
            name: "GitHub",
            url: "https://github.com/JaiMoLabs",
            // GitHub 官方 SVG 路径
            svg: '<path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>'
        }
    ]
};