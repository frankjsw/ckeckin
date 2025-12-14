const puppeteer = require('puppeteer-extra');
const puppeteerExtraPluginStealth = require('puppeteer-extra-plugin-stealth');

// 使用 stealth 插件
puppeteer.use(puppeteerExtraPluginStealth());

(async () => {
    const browser = await puppeteer.launch({
        headless: true, // 确保使用无头模式
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // 跳转到签到页面
    await page.goto('https://icmp9.com/user/dashboard', { waitUntil: 'domcontentloaded' });

    // 等待 #checkin-btn 元素加载完成
    await page.waitForSelector('#checkin-btn', { timeout: 60000 });  // 等待60秒

    // 点击签到按钮
    await page.click('#checkin-btn');

    // 等待签到结果
    await page.waitForSelector('#checkin-result');

    console.log('签到成功！');

    await browser.close();
})();
