// ==========================================
// 2. 底层组件与渲染引擎 (app.js)
// 提供通用的模块渲染器，避免重复代码
// ==========================================

let articleCurrentPage = 0;
const pageSize = 3;

function initSite() {
    if (!window.SITE_CONFIG) return;
    const config = window.SITE_CONFIG;

    // 💡 新增：动态将 config.js 中的 logoImg 设置为浏览器标签页图标
    const faviconLink = document.getElementById('favicon');
    if (faviconLink && config.logoImg) {
        faviconLink.href = config.logoImg;
    }

    renderNavbar(config);
    renderContactSection(config.socialLinks);
    renderFooter(config);
    initGlobalEvents();
}

// 渲染顶部导航栏
function renderNavbar(config) {
    const container = document.getElementById('navbar-container');
    if (!container) return;
    container.innerHTML = `
        <!-- 改用 fixed top-0 left-0 w-full，强制让它永远固定在浏览器视口最顶端 -->
        <header class="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-[#d8e2dc] px-6 py-4 flex items-center justify-between">
            
            <!-- 左侧：Logo、名称与 Topics 下拉菜单 -->
            <div class="flex items-center gap-6">
                <a href="#" onclick="window.scrollTo({top: 0, behavior: 'smooth'}); return false;" class="flex items-center gap-3 group">
                    <div class="w-9 h-9 rounded-lg overflow-hidden bg-[#588157] flex items-center justify-center shadow-sm shrink-0">
                        <img src="${config.logoImg}" alt="${config.siteName}" class="w-full h-full object-cover">
                    </div>
                    <span class="font-bold text-lg tracking-tight text-[#2b2d42]">${config.siteName}</span>
                </a>

                <div class="relative">
                    <button id="topicsBtn" onclick="toggleTopicsMenu()" class="text-xs font-medium px-3.5 py-2 rounded-lg border border-[#d8e2dc] text-[#2b2d42] hover:bg-[#f4f7f4] transition flex items-center gap-1.5 cursor-pointer shadow-sm">
                        Topics <span class="text-[10px]">▾</span>
                    </button>
                    <div id="topicsDropdown" class="hidden absolute left-0 mt-2 w-48 bg-white border border-[#d8e2dc] rounded-xl shadow-lg py-2 z-50">
                        ${config.topicsMenu.map(item => `<a href="${item.link}" class="block px-4 py-2 text-sm text-center hover:bg-[#f4f7f4] text-gray-700 transition">${item.name}</a>`).join('')}
                    </div>
                </div>
            </div>

            <!-- 中间：核心标语 -->
            <div class="hidden md:block text-xs font-semibold tracking-wider text-gray-500 uppercase">
                ${config.headerSlogan}
            </div>

            <!-- 右侧：Support 与 Connect Wallet 按钮 -->
            <div class="flex items-center gap-3">
                <button onclick="copyWalletAddress()" class="text-xs font-medium px-3.5 py-2 rounded-lg border border-[#588157] text-[#588157] hover:bg-[#588157] hover:text-white transition cursor-pointer">
                    Support
                </button>
                <button onclick="alert('Coming soon with Mainnet launch!')" class="text-xs font-medium px-4 py-2 rounded-lg bg-[#588157] text-white hover:bg-[#3a5a40] shadow-sm transition cursor-pointer">
                    Connect Wallet
                </button>
            </div>
        </header>
    `;
}

// 2. 中间new
document.addEventListener("DOMContentLoaded", () => {
    const config = window.SITE_CONFIG;
    if (!config) {
        console.error("SITE_CONFIG not found!");
        return;
    }

    // 3. 渲染 Hero 区域（全宽无缝，背景图 + 左侧解说文字）
    const heroContainer = document.getElementById("hero-container");
    heroContainer.innerHTML = `
        <div class="relative w-full h-[420px] bg-cover bg-center flex items-center -mt-8" style="background-image: url('${config.hero.backgroundImage}');">
            <div class="absolute inset-0 bg-black/10"></div>
            <div class="relative max-w-7xl mx-auto px-6 w-full">
                <div class="max-w-lg text-left">
                    <h1 class="text-4xl md:text-5xl font-extrabold text-green-900 mb-3 drop-shadow-sm">${config.hero.title}</h1>
                    <p class="text-lg md:text-xl text-green-800 font-medium drop-shadow-sm">${config.hero.subtitle}</p>
                </div>
            </div>
        </div>
    `;

    // 4. 收集并扁平化处理所有文章，用于右侧“最新文章流”
    let allArticles = [];
    config.database.categories.forEach(cat => {
        cat.articles.forEach(art => {
            allArticles.push({ ...art, categoryName: cat.name, categoryIcon: cat.icon });
        });
    });

    // 按日期倒序排序（假设日期格式为 YYYY/MM/DD）
    allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    // 取出最新的 5 篇
    const latestArticles = allArticles.slice(0, 5);

    // 5. 渲染主体双栏内容（左侧粘性导航 + 右侧最新文章流）
    const mainContainer = document.getElementById("main-container");
    mainContainer.innerHTML = `
        <div class="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <!-- 左侧粘性导航栏 -->
            <div class="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
                <div class="flex items-center space-x-2 text-green-800 font-bold text-xl mb-4">
                    <span>🌱</span>
                    <span>${config.database.title}</span>
                </div>
                <div class="space-y-6">
                    ${config.database.categories.map(cat => `
                        <div class="space-y-2">
                            <div class="flex items-center space-x-2 text-gray-900 font-semibold text-base">
                                <span>${cat.icon}</span>
                                <span>${cat.name}</span>
                            </div>
                            <div class="pl-6 space-y-1.5 border-l border-gray-100 ml-2">
                                ${cat.articles.map(art => `
                                    <!-- 修改：用普通 div 或保持行内，只让具体的标题文字带有跳转链接和悬停效果 -->
                                    <div class="py-0.5">
                                        <a href="${art.url || '#'}" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-600 hover:text-green-700 transition-colors inline-block">
                                            · ${art.title}
                                        </a>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 右侧核心内容：Latest Articles -->
            <div class="lg:col-span-8 space-y-8">
                <div class="flex items-center space-x-2 text-green-800 font-bold text-xl mb-2">
                    <span>🪵</span>
                    <span>Latest Articles</span>
                </div>

                <div class="space-y-6">
                    ${latestArticles.map(art => `
                        <!-- 卡片本身恢复为普通的静态 div 容器，不再是 a 标签，避免误触 -->
                        <div class="bg-white border border-gray-200/80 rounded-xl p-6 shadow-xs">
                            <div class="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md mb-3">
                                ${art.tag}
                            </div>
                            <!-- 只有标题部分包裹 a 标签，点击标题才跳转外部网址 -->
                            <h3 class="text-xl font-bold text-gray-900 mb-1">
                                <a href="${art.url || '#'}" target="_blank" rel="noopener noreferrer" class="hover:text-green-700 transition-colors">
                                    ${art.title}
                                </a>
                            </h3>
                            <div class="text-xs text-gray-400 mb-3">${art.date}</div>
                            <p class="text-gray-600 text-sm leading-relaxed">${art.summary}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="text-center pt-4 text-sm text-gray-500">
                    Showing ${latestArticles.length} latest updates. Explore all topics in the 🌱 <span class="font-semibold text-gray-700">${config.database.title}</span> on the left.
                </div>
            </div>

        </div>
    `;
});


// 3. 渲染联系我们板块（修复 socialLinks 数组匹配问题）
function renderContactSection(socialLinks) {
    const container = document.getElementById('contact-container');
    if (!container) return;

    // 辅助函数：通过名称安全获取链接
    const getUrl = (name) => {
        const item = socialLinks.find(s => s.name.toLowerCase().includes(name.toLowerCase()));
        return item ? item.url : '#';
    };

    const githubUrl = getUrl('GitHub');
    const xUrl = getUrl('X');

    container.innerHTML = `
        <div class="max-w-3xl mb-6">
            <h2 class="text-3xl font-bold tracking-tight text-[#2b2d42]">Connect with us</h2>
            <p class="text-gray-600 mt-2 text-base">Have questions, feedback, or want to collaborate? Reach out through our official channels.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white border border-[#d8e2dc] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                    <h3 class="text-xl font-bold text-[#588157]">Get Support</h3>
                    <p class="text-sm text-gray-600 mt-2">Explore documentation, GitHub repositories, and technical FAQs for self-hosted tools.</p>
                </div>
                <div class="mt-8">
                    <a href="${githubUrl}" target="_blank" class="inline-block bg-[#f4f7f4] border border-[#d8e2dc] text-[#2b2d42] text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#d8e2dc] transition">
                        💬 Help Center
                    </a>
                </div>
            </div>

            <div class="bg-white border border-[#d8e2dc] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                    <h3 class="text-xl font-bold text-[#2b2d42]">Follow on X</h3>
                    <p class="text-sm text-gray-600 mt-2">Stay tuned for real-time protocol updates, research notes, and community announcements.</p>
                </div>
                <div class="mt-8">
                    <a href="${xUrl}" target="_blank" class="inline-block bg-[#f4f7f4] border border-[#d8e2dc] text-[#2b2d42] text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#d8e2dc] transition">
                        💬 Stay Connected
                    </a>
                </div>
            </div>

            <div class="bg-white border border-[#d8e2dc] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                    <h3 class="text-xl font-bold text-[#588157]">Sign up for research and updates</h3>
                    <p class="text-sm text-gray-600 mt-2">Get the latest technical articles and project milestones delivered directly to your inbox.</p>
                </div>
                <div class="mt-6 flex gap-2">
                    <input type="email" placeholder="Enter Email" class="bg-[#f4f7f4] border border-[#d8e2dc] text-xs rounded-xl px-3 py-2.5 w-full focus:outline-none focus:border-[#588157]">
                    <button onclick="alert('Subscription successful!')" class="bg-[#588157] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#3a5a40] transition cursor-pointer shrink-0">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 4. 渲染底部底页（支持任意列数自动适配）
function renderFooter(config) {
    const container = document.getElementById('footer-container');
    if (!container) return;
    const footer = config.footerConfig;

    // 动态计算总列数：左侧固定占 2 列 + 动态导航栏列数
    const navColCount = footer.columns.length;
    const totalCols = 2 + navColCount;

    // 动态向页面注入响应式网格列数样式，支持任意扩展
    let styleTag = document.getElementById('dynamic-footer-style');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamic-footer-style';
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
        @media (min-width: 768px) {
            .dynamic-footer-grid {
                grid-template-columns: repeat(${totalCols}, minmax(0, 1fr)) !important;
            }
        }
    `;

    container.innerHTML = `
        <footer class="bg-white border-t border-[#d8e2dc] mt-20">
            <div class="max-w-7xl mx-auto px-6 py-12">
                <!-- 使用 dynamic-footer-grid 类名应用动态计算的列数 -->
                <div class="grid grid-cols-1 dynamic-footer-grid gap-8 items-start">
                    <div class="md:col-span-2 space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg overflow-hidden bg-[#588157] flex items-center justify-center shadow-sm shrink-0">
                                <img src="${config.logoImg}" alt="${config.siteName}" class="w-full h-full object-cover">
                            </div>
                            <span class="font-bold text-base text-[#2b2d42]">${config.siteName}</span>
                        </div>
                        <p class="text-xs text-gray-500">${footer.copyright}</p>
                    </div>

                    <!-- 动态循环渲染 Footer 的多列导航 -->
                    ${footer.columns.map(col => `
                        <div>
                            <h4 class="font-semibold text-xs uppercase tracking-wider text-gray-400 mb-3">${col.title}</h4>
                            <ul class="space-y-2 text-xs text-gray-600">
                                ${col.links.map(link => `<li><a href="${link.url}" target="_blank" rel="noopener noreferrer" class="hover:text-[#588157] transition">${link.name}</a></li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>

                <div class="mt-12 pt-6 border-t border-[#d8e2dc] flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span class="text-xs text-gray-400">${footer.tagline}</span>
                    
                    <!-- 动态循环渲染社交媒体官方图标 -->
                    <div class="flex items-center gap-5 text-gray-600">
                        ${config.socialLinks.map(social => `
                            <a href="${social.url}" target="_blank" title="${social.name}" class="hover:text-[#588157] transition flex items-center justify-center w-6 h-6">
                                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    ${social.svg}
                                </svg>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        </footer>
    `;
}

// 辅助交互逻辑
function toggleTopicsMenu() {
    const menu = document.getElementById('topicsDropdown');
    if (menu) menu.classList.toggle('hidden');
}

function initGlobalEvents() {
    window.addEventListener('click', function(e) {
        const btn = document.getElementById('topicsBtn');
        const menu = document.getElementById('topicsDropdown');
        if (btn && menu && !btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.add('hidden');
        }
    });
}

function copyWalletAddress() {
    const address = window.SITE_CONFIG ? window.SITE_CONFIG.walletAddress : "jaimo.eth";
    navigator.clipboard.writeText(address).then(() => {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 2500);
        }
    });
}

window.onload = function() {
    initSite();
};