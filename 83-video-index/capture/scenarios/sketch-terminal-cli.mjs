export const meta = {
    slug: 'sketch-terminal-cli',
    title: 'Terminal Cli',
    path: 'daily-sketch/sketch-terminal-cli',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    // an empty prompt shows nothing — type at it
    await page.keyboard.type('help', { delay: 90 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1300);
    await page.keyboard.type('ls', { delay: 90 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1400);
}
