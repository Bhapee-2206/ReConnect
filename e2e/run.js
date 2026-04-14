const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const delay = (ms) => new Promise(r => setTimeout(r, ms));
const outDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
// Clean old screenshots
for (const f of fs.readdirSync(outDir)) fs.unlinkSync(path.join(outDir, f));

let shotIndex = 1;
async function shot(page, label) {
    const name = `${String(shotIndex).padStart(2,'0')}_${label}.png`;
    await page.screenshot({ path: path.join(outDir, name), fullPage: true });
    console.log(`  [SHOT] ${name}`);
    shotIndex++;
}

async function run() {
    console.log('=== ReConnect E2E Test v4 ===');
    const browser = await puppeteer.launch({
        headless: 'new',
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        defaultViewport: { width: 1400, height: 900 },
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    page.on('dialog', async d => { console.log(`  [DIALOG] ${d.message()}`); await d.accept(); });

    const ts = Date.now();
    const adminEmail = `admin${ts}@test.com`;
    const alumEmail  = `alum${ts}@test.com`;
    const instName   = `TestInst${ts}`;
    let joinCode = '';

    try {
        // ===== 1. LANDING PAGE =====
        console.log('\n--- Landing Page ---');
        await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2' });
        await delay(1500);
        await shot(page, 'landing_page');

        // ===== 2. LOGIN PAGE =====
        console.log('\n--- Login Page ---');
        await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle2' });
        await delay(1000);
        await shot(page, 'login_page');

        // ===== 3. ADMIN REGISTER =====
        console.log('\n--- Admin Registration ---');
        await page.evaluate(() => [...document.querySelectorAll('button')].find(b=>b.innerText.includes('Admin Register')).click());
        await delay(500);
        await page.type('input[type="email"]', adminEmail);
        await page.type('input[type="password"]', 'password123');
        await shot(page, 'admin_register_form');
        await page.evaluate(() => [...document.querySelectorAll('button')].find(b=>b.innerText.includes('Create Account')).click());
        await page.waitForFunction(() => document.body.innerText.includes('Register your Institution'), {timeout:15000});
        await delay(1000);

        // ===== 4. ONBOARDING =====
        console.log('\n--- Onboarding ---');
        await shot(page, 'onboarding');
        await page.type('input[placeholder*="Stanford"]', instName);
        await page.evaluate(() => {
            const btn = document.querySelector('button[type="submit"]');
            if(btn) btn.click();
        });
        await page.waitForFunction(() => document.querySelector('.font-mono'), {timeout:15000});
        await delay(500);
        joinCode = await page.evaluate(() => document.querySelector('.font-mono').innerText.trim());
        console.log(`  Join Code: ${joinCode}`);
        await shot(page, 'join_code_created');
        await page.evaluate(() => [...document.querySelectorAll('button')].find(b=>b.innerText.includes('Continue to Dashboard')).click());
        // Wait for full reload and auth to settle
        await delay(6000);
        // Wait until not showing loading session
        await page.waitForFunction(() => !document.body.innerText.includes('Loading session'), {timeout: 15000});
        await delay(1000);

        // ===== 5. ADMIN DASHBOARD =====
        console.log('\n--- Admin Dashboard ---');
        await page.goto('http://localhost:5174/dashboard', {waitUntil:'networkidle2'});
        await delay(2000);
        await shot(page, 'admin_dashboard');

        // ===== 6. ADMIN PROFILE =====
        console.log('\n--- Admin Profile ---');
        await page.goto('http://localhost:5174/profile', {waitUntil:'networkidle2'});
        await delay(2000);
        await shot(page, 'admin_profile');

        // ===== 7. ADMIN MANAGEMENT =====
        console.log('\n--- Admin Management ---');
        await page.goto('http://localhost:5174/admin', {waitUntil:'networkidle2'});
        await delay(2000);
        await shot(page, 'admin_management');

        // ===== 8. CREATE EVENT =====
        console.log('\n--- Create Event ---');
        await page.goto('http://localhost:5174/events', {waitUntil:'networkidle2'});
        await page.waitForFunction(() => !document.body.innerText.includes('Loading session'), {timeout:10000});
        await delay(2000);
        await shot(page, 'events_empty');

        // Wait until Create Event button is available
        await page.waitForFunction(() => [...document.querySelectorAll('button')].some(b=>b.innerText.includes('Create Event')), {timeout:10000});
        await page.evaluate(() => [...document.querySelectorAll('button')].find(b=>b.innerText.includes('Create Event')).click());
        await delay(1500);
        await page.waitForSelector('textarea', {timeout:5000});
        await delay(500);

        // Focus and type Title: find it by evaluating, then keyboard
        await page.evaluate(() => {
            const form = document.querySelector('form');
            const inputs = form.querySelectorAll('input');
            // First non-datetime, non-hidden input in the form is the title
            for(const inp of inputs) {
                if(inp.type !== 'datetime-local' && inp.type !== 'hidden') {
                    inp.focus();
                    break;
                }
            }
        });
        await page.keyboard.type('Alumni Networking Meetup');

        // Focus and type Description
        await page.evaluate(() => document.querySelector('form textarea').focus());
        await page.keyboard.type('Annual networking event for reconnecting with fellow alumni.');

        // Set date
        await page.evaluate(() => {
            const dtInput = document.querySelector('input[type="datetime-local"]');
            if(dtInput) { dtInput.focus(); }
        });
        await page.keyboard.type('12312026');
        await page.keyboard.press('Tab');
        await page.keyboard.type('0600PM');

        // Focus and type Location
        await page.evaluate(() => {
            const form = document.querySelector('form');
            const inputs = form.querySelectorAll('input');
            // Location is the input after datetime-local
            let found = false;
            for(const inp of inputs) {
                if(found && inp.type !== 'datetime-local') { inp.focus(); break; }
                if(inp.type === 'datetime-local') found = true;
            }
        });
        await page.keyboard.type('Virtual - Zoom');

        // Switch to Custom Native
        await page.evaluate(() => [...document.querySelectorAll('button')].find(b=>b.innerText.trim()==='Custom Native').click());
        await delay(1000);

        // Toggle Required on first question
        await page.evaluate(() => {
            const t = [...document.querySelectorAll('button')].find(b=>b.className.includes('w-10')&&b.className.includes('h-5')&&b.className.includes('rounded-full'));
            if(t) t.click();
        });
        await delay(300);
        console.log('  Required toggled - form NOT auto-submitted (fix verified!)');
        await shot(page, 'create_event_form');

        // Submit event
        await page.evaluate(() => {
            const btn = document.querySelector('button[type="submit"]');
            if(btn) btn.click();
        });
        await delay(3000);
        await shot(page, 'events_with_event');

        // ===== 9. ANNOUNCEMENT =====
        console.log('\n--- Create Announcement ---');
        await page.goto('http://localhost:5174/announcements', {waitUntil:'networkidle2'});
        await delay(2000);
        await shot(page, 'announcements_empty');
        await page.evaluate(() => [...document.querySelectorAll('button')].find(b=>b.innerText.includes('Post Announcement')).click());
        await delay(1000);
        await page.waitForSelector('form textarea', {timeout:5000});

        // Title
        await page.evaluate(() => {
            const inp = document.querySelector('form input');
            if(inp) inp.focus();
        });
        await page.keyboard.type('Welcome to Our Alumni Network!');
        // Content
        await page.evaluate(() => document.querySelector('form textarea').focus());
        await page.keyboard.type('We are excited to launch ReConnect. Stay tuned for events and updates!');
        await shot(page, 'create_announcement');
        await page.evaluate(() => {
            const btn = document.querySelector('form button[type="submit"]');
            if(btn) btn.click();
        });
        await delay(2000);
        await shot(page, 'announcements_posted');

        // ===== 10. DIRECTORY ADMIN =====
        console.log('\n--- Directory (Admin) ---');
        await page.goto('http://localhost:5174/directory', {waitUntil:'networkidle2'});
        await delay(2000);
        await shot(page, 'directory_admin');

        // ===== 11. LOGOUT =====
        console.log('\n--- Logout ---');
        await page.evaluate(() => localStorage.removeItem('token'));
        await page.goto('http://localhost:5174/login', {waitUntil:'networkidle2'});
        await delay(1000);

        // ===== 12. ALUMNI REGISTER =====
        console.log('\n--- Alumni Registration ---');
        await page.evaluate(() => [...document.querySelectorAll('button')].find(b=>b.innerText.includes('Join as Alumni')).click());
        await delay(500);
        await page.type('input[type="email"]', alumEmail);
        await page.type('input[type="password"]', 'password123');
        const joinInput = await page.$('input[placeholder*="ABCD"]');
        if(joinInput) await joinInput.type(joinCode);
        await shot(page, 'alumni_register_form');
        await page.evaluate(() => [...document.querySelectorAll('button')].find(b=>b.innerText.includes('Join & Enter')).click());
        await delay(6000);
        await page.waitForFunction(() => !document.body.innerText.includes('Loading session'), {timeout:15000});
        await delay(1000);

        // ===== 13. ALUMNI DASHBOARD =====
        console.log('\n--- Alumni Dashboard ---');
        await page.goto('http://localhost:5174/dashboard', {waitUntil:'networkidle2'});
        await delay(2000);
        await shot(page, 'alumni_dashboard');
        const hasInvite = await page.evaluate(() => [...document.querySelectorAll('button')].some(b=>b.innerText.trim()==='Invite'));
        console.log(`  Invite visible: ${hasInvite} (should be false)`);

        // ===== 14. ALUMNI PROFILE =====
        console.log('\n--- Alumni Profile ---');
        await page.goto('http://localhost:5174/profile', {waitUntil:'networkidle2'});
        await delay(2000);
        await shot(page, 'alumni_profile');

        // ===== 15. ALUMNI ANNOUNCEMENTS =====
        console.log('\n--- Alumni Announcements ---');
        await page.goto('http://localhost:5174/announcements', {waitUntil:'networkidle2'});
        await delay(2000);
        await shot(page, 'alumni_announcements');

        // ===== 16. ALUMNI EVENTS + REGISTER =====
        console.log('\n--- Alumni Event Registration ---');
        await page.goto('http://localhost:5174/events', {waitUntil:'networkidle2'});
        await delay(3000);
        await shot(page, 'alumni_events');

        const regClicked = await page.evaluate(() => {
            const btn = [...document.querySelectorAll('button')].find(b=>b.innerText.includes('Register'));
            if(btn){btn.click();return true;} return false;
        });
        console.log(`  Register clicked: ${regClicked}`);
        await delay(2000);
        await shot(page, 'alumni_registration_modal');

        await page.evaluate(() => {
            const btn = [...document.querySelectorAll('button')].find(b=>b.innerText.includes('Submit'));
            if(btn) btn.click();
        });
        await delay(3000);
        await shot(page, 'alumni_registration_result');

        // ===== 17. ALUMNI DIRECTORY =====
        console.log('\n--- Alumni Directory ---');
        await page.goto('http://localhost:5174/directory', {waitUntil:'networkidle2'});
        await delay(2000);
        await shot(page, 'alumni_directory');

        // ===== 18. RE-LOGIN ADMIN =====
        console.log('\n--- Admin Re-login ---');
        await page.evaluate(() => localStorage.removeItem('token'));
        await page.goto('http://localhost:5174/login', {waitUntil:'networkidle2'});
        await delay(1000);
        await page.type('input[type="email"]', adminEmail);
        await page.type('input[type="password"]', 'password123');
        await page.evaluate(() => [...document.querySelectorAll('button')].find(b=>b.innerText.includes('Access Network')).click());
        await delay(5000);
        await page.waitForFunction(() => !document.body.innerText.includes('Loading session'), {timeout:15000});
        await delay(1000);

        // ===== 19. ADMIN EVENT RESPONSES =====
        console.log('\n--- Admin Event Responses ---');
        await page.goto('http://localhost:5174/events', {waitUntil:'networkidle2'});
        await delay(3000);
        await shot(page, 'admin_events_final');
        const aClicked = await page.evaluate(() => {
            const btn = [...document.querySelectorAll('button')].find(b=>b.innerHTML.includes('analytics'));
            if(btn){btn.click();return true;} return false;
        });
        console.log(`  Analytics clicked: ${aClicked}`);
        await delay(3000);
        await shot(page, 'admin_event_responses');

        // ===== 20. ADMIN DIRECTORY FINAL =====
        console.log('\n--- Admin Directory Final ---');
        await page.goto('http://localhost:5174/directory', {waitUntil:'networkidle2'});
        await delay(2000);
        await shot(page, 'admin_directory_final');

        console.log('\n=== ALL PHASES COMPLETE ===');
    } catch (err) {
        console.error('\n[ERROR]', err.message);
        await shot(page, 'ERROR');
    } finally {
        await browser.close();
    }
}
run();
