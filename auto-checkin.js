const puppeteer = require('puppeteer-extra');
const puppeteerExtraPluginStealth = require('puppeteer-extra-plugin-stealth');

// 使用 stealth 插件
puppeteer.use(puppeteerExtraPluginStealth());

(async () => {
    const browser = await puppeteer.launch({
        headless: true, // 确保使用无头模式
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // 可能需要这些参数以避免一些安全限制
    });

    const page = await browser.newPage();

    // 你的签到逻辑代码...
    await page.goto('https://icmp9.com/user/dashboard');

    // 继续你的脚本操作
    await page.click('#checkin-btn');

    // 等待签到结果
    await page.waitForSelector('#checkin-result');

    console.log('签到成功！');

    await browser.close();
})();
