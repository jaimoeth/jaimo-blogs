// ==========================================
// 文章组件 / Article component
// ==========================================

window.Blog = window.Blog || {};

Blog.renderArticle = function(database) {
    const container = document.getElementById("article-container");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const articleId = params.get("article");

    if (!articleId) {
        container.innerHTML = `
            <div class="text-center py-20 text-gray-500">
                Article not found.
            </div>
        `;
        return;
    }

    const article = Blog.findArticle(database, articleId);

    if (!article) {
        container.innerHTML = `
            <div class="text-center py-20 text-gray-500">
                Article not found.
            </div>
        `;
        return;
    }

    const iframe = document.createElement("iframe");

    iframe.src = Blog.getArticlePath(article);
    iframe.className = "w-full border-0 block";
    iframe.title = article.title;
    iframe.setAttribute("scrolling", "no");

    container.appendChild(iframe);

    iframe.addEventListener("load", () => {
        Blog.resizeArticleFrame(iframe);
    });
};

Blog.findArticle = function(database, articleId) {
    for (const category of database.categories || []) {
        for (const article of category.articles || []) {
            if (article.id === articleId) {
                return {
                    ...article,
                    category: category.name.toLowerCase()
                };
            }
        }
    }

    return null;
};

Blog.getArticlePath = function(article) {
    return `/database/${article.category}/${article.id}.html`;
};

Blog.resizeArticleFrame = function(iframe) {
    try {
        const document = iframe.contentDocument || iframe.contentWindow.document;
        const body = document.body;
        const html = document.documentElement;

        const height = Math.max(
            body?.scrollHeight || 0,
            body?.offsetHeight || 0,
            html?.scrollHeight || 0,
            html?.offsetHeight || 0
        );

        iframe.style.height = `${height}px`;
    } catch (error) {
        console.warn("Unable to resize article iframe:", error);
    }
};