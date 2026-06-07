export const meta = {
    slug: '33-three-body-problem',
    title: 'Three-body Problem',
    warmupMs: 1500,
    disabled: true,
};

export async function play(page) {
    await page.waitForTimeout(3500);
}
