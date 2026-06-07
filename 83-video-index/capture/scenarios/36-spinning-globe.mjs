export const meta = {
    slug: '36-spinning-globe',
    title: 'Sentiment + Explanations',
    warmupMs: 1200,
    zoom: 0.75,
    disabled: true,
};

export async function play(page) {
    await page.waitForTimeout(3500);
}
