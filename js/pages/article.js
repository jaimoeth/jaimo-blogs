// ==========================================
// 文章页面主逻辑入口 / Article page entry point
// ==========================================

window.Blog = window.Blog || {};

document.addEventListener("DOMContentLoaded", () => {
    if (!window.SITE_CONFIG || !window.DATABAR_CONFIG) {
        console.error("Configurations not found!");
        return;
    }

    const commonConfig = window.SITE_CONFIG;
    const database = window.DATABAR_CONFIG.database;

    Blog.initDocumentMeta(commonConfig.meta);

    Blog.renderNavbar();
    Blog.renderHero(commonConfig);

    const mainContainer = document.getElementById("main-container");

    if (mainContainer) {
        mainContainer.innerHTML = `
            <div class="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div class="lg:col-span-4 lg:sticky lg:top-20 space-y-6">
                    ${Blog.renderSidebar(database)}
                </div>
                <div id="article-container" class="lg:col-span-8 min-w-0"></div>
            </div>
        `;
    }

    Blog.renderArticle(database);

    Blog.renderContactSection(commonConfig);
    Blog.renderFooter(commonConfig);

    Blog.initSidebar();
    Blog.initGlobalEvents();

    Blog.tryRestoreWallet();
    Blog.bindWalletEvents();
});