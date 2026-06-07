export const meta = {
    slug: '79-idle-states',
    title: 'Idle States',
    warmupMs: 800,
};

export async function play(page) {
    await page.waitForTimeout(3500);
}
