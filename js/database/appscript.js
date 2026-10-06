// ==========================================
// 谷歌表格后端交互逻辑 (js/database/appscript.js)
// ==========================================

window.Blog = window.Blog || {};

Blog.validateEmailDomain = async function(domain) {
    const queryDNS = async (type) => {
        const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`, {
            headers: { 'Accept': 'application/dns-json' }
        });
        if (!response.ok) return false;
        const data = await response.json();
        return Array.isArray(data.Answer) && data.Answer.some(record => record.type === ({ MX: 15, A: 1, AAAA: 28 }[type]));
    };

    try {
        if (await queryDNS('MX')) return true;
        return await queryDNS('A') || await queryDNS('AAAA');
    } catch (error) {
        console.error('Error validating email domain!', error);
        return false;
    }
};

Blog.subscribeEmailToSheet = async function() {
    const config = window.SITE_CONFIG;
    const emailInput = document.getElementById('subscriber-email');
    const submitBtn = document.getElementById('submit-btn');

    if (!emailInput || !submitBtn) return;

    const email = emailInput.value.trim();

    // 更靠谱一点的邮箱检查
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        Blog.showToast(config.messages.emailInvalid);
        return;
    }

    const domain = email.split('@').pop().toLowerCase();
    const originalText = submitBtn.innerText;
    submitBtn.innerText = config.messages.emailSubmitting;
    submitBtn.disabled = true;

    // 检查邮箱域名是否真实存在
    if (!await Blog.validateEmailDomain(domain)) {
        Blog.showToast(config.messages.emailInvalid);
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        return;
    }

    const scriptURL = config.api && config.api.googleScriptURL;
    if (!scriptURL) {
        console.error("Google Apps Script URL not configured!");
        Blog.showToast(config.messages.emailError);
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        return;
    }

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
    })
    .then(() => {
        Blog.showToast(config.messages.emailSuccess);
        emailInput.value = '';
    })
    .catch(error => {
        console.error('Error submitting email!', error);
        Blog.showToast(config.messages.emailError);
    })
    .finally(() => {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    });
};