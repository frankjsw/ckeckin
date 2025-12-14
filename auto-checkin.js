const puppeteer = require('puppeteer');

(async () => {
    // 启动 Puppeteer 浏览器实例
    const browser = await puppeteer.launch({
        headless: true, // 设置为 false 会显示浏览器界面，可以调试
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // 防止在 GitHub Actions 中出现权限问题
    });

    const page = await browser.newPage();

    // 设置用户代理（模拟真实浏览器）
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // 导航到签到页面
    await page.goto('https://example.com'); // 替换为目标签到页面 URL

    // 等待 Cloudflare 验证框出现
    try {
        await page.waitForSelector('#cf-clearance', { visible: true });
        console.log('Cloudflare 验证框已出现，开始模拟点击');

        // 模拟点击 Cloudflare 的 "I’m not a robot" 复选框
        const checkbox = await page.$('#cf-clearance');
        if (checkbox) {
            await checkbox.click();
            console.log('点击了确认按钮！');
        }

        // 等待页面加载完成
        await page.waitForNavigation();
    } catch (error) {
        console.log('未发现 Cloudflare 验证框，跳过验证');
    }

    // 等待并点击签到按钮
    const checkinButton = await page.$('#checkin-btn');
    if (checkinButton) {
        await checkinButton.click();
        console.log('点击了签到按钮！');
    }

    // 等待签到结果显示
    await page.waitForSelector('#checkin-result');
    const resultText = await page.$eval('#checkin-result', el => el.textContent);
    console.log(`签到结果: ${resultText}`);

    // 关闭浏览器
    await browser.close();
})();
