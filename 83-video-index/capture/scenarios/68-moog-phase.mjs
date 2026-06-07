export const meta = {
    slug: '68-moog-phase',
    title: 'Moog Phase',
    warmupMs: 1500,
    disabled: true,
};

export async function play(page) {
    await page.waitForTimeout(3500);
}
