const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: true, // 无头模式
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    const url = 'https://icmp9.com/user/dashboard'; // 确保这里是目标网站的正确 URL
    console.log('访问的 URL:', url); // 打印访问的 URL 用于调试
    await page.goto(url, { waitUntil: 'networkidle0' }); // 确保页面加载完成

    try {
        // 等待 Cloudflare 验证框（如果存在）
        await page.waitForSelector('#cf-clearance', { visible: true, timeout: 60000 });
        console.log('Cloudflare 验证框出现，点击确认按钮');
        
        const checkbox = await page.$('#cf-clearance');
        if (checkbox) {
            await checkbox.click();
            console.log('点击了确认按钮');
        }
        
        // 等待页面重新加载
        await page.waitForNavigation();
    } catch (error) {
        console.log('未发现 Cloudflare 验证框，跳过');
    }

    // 增加一个确保页面完全加载的等待
    await page.waitForFunction('document.readyState === "complete"', { timeout: 60000 });

    // 输出当前页面的 HTML 内容，用于调试
    const html = await page.content();
    console.log('当前页面 HTML:', html);  // 输出页面 HTML 进行检查

    // 确保签到按钮存在
    try {
        await page.waitForSelector('#checkin-btn', { visible: true, timeout: 60000 });
        const checkinButton = await page.$('#checkin-btn');
        if (checkinButton) {
            await checkinButton.click();
            console.log('点击了签到按钮');
        } else {
            console.log('未找到签到按钮！');
        }
    } catch (error) {
        console.log('找不到签到按钮:', error);
    }

    // 等待并获取签到结果
    try {
        await page.waitForSelector('#checkin-result', { visible: true, timeout: 60000 });
        const resultText = await page.$eval('#checkin-result', el => el.textContent);
        console.log(`签到结果: ${resultText}`);
    } catch (error) {
        console.log('未找到签到结果元素，输出页面 HTML 进行调试：');
        console.log(await page.content());  // 输出整个页面 HTML，帮助调试
    }

    await browser.close();
})();
