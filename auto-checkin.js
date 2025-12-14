const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const puppeteerExtraPluginStealth = require('puppeteer-extra-plugin-stealth');

puppeteerExtra.use(puppeteerExtraPluginStealth()); // 加载 Stealth 插件，帮助绕过 Cloudflare 验证

(async () => {
    const browser = await puppeteerExtra.launch({
        headless: false, // 设置为 false 以便查看浏览器操作
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    const loginUrl = 'https://icmp9.com/user/dashboard'; // 登录页面 URL
    const username = 'mrfrankjsw'; // 替换为你的用户名
    const password = '17Shihui88!'; // 替换为你的密码

    await page.goto(loginUrl, { waitUntil: 'networkidle0' });

    // 检查是否需要 Cloudflare Turnstile 验证
    try {
        await page.waitForSelector('#cf-clearance', { visible: true, timeout: 30000 });
        console.log('检测到 Cloudflare 验证框，开始点击');
        
        // 如果遇到 Turnstile 验证，模拟点击
        const checkbox = await page.$('#cf-clearance');
        if (checkbox) {
            await checkbox.click();
            console.log('成功点击 Cloudflare 验证框');
        }

        await page.waitForNavigation({ waitUntil: 'networkidle0' });
    } catch (error) {
        console.log('未检测到 Cloudflare 验证框，跳过');
    }

    // 等待并填充登录表单（根据页面实际情况）
    await page.waitForSelector('input[name="username"]'); // 确保用户名输入框加载
    await page.type('input[name="username"]', username); // 填写用户名
    await page.type('input[name="password"]', password); // 填写密码
    await page.click('button[type="submit"]'); // 提交登录表单

    // 等待仪表盘页面加载完成
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    console.log('成功登录，页面加载完成');

    // 等待签到按钮出现
    try {
        await page.waitForSelector('#checkin-btn', { visible: true, timeout: 60000 });
        console.log('签到按钮已加载，开始点击');

        const checkinButton = await page.$('#checkin-btn');
        if (checkinButton) {
            await checkinButton.click();
            console.log('成功点击签到按钮');
        } else {
            console.log('未找到签到按钮');
        }
    } catch (error) {
        console.log('未找到签到按钮:', error);
    }

    // 输出签到结果
    try {
        await page.waitForSelector('#checkin-result', { visible: true, timeout: 60000 });
        const resultText = await page.$eval('#checkin-result', el => el.textContent);
        console.log('签到结果:', resultText);
    } catch (error) {
        console.log('未找到签到结果元素');
    }

    await browser.close();
})();
