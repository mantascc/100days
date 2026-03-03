export const THEMES = [
    {
        slug: 'peach',
        name: 'Peach',
        accent: '#F4BFA0',
        pink: [244, 160, 160],
        yellow: [244, 216, 122],
        coral: [240, 112, 96],
        cream: [255, 243, 224],
        deep: [26, 15, 10],
    },
    {
        slug: 'mesa',
        name: 'Clay',
        accent: '#D18A6A',
        pink: [209, 138, 106],
        yellow: [183, 165, 138],
        coral: [122, 139, 79],
        cream: [201, 214, 224],
        deep: [74, 58, 42],
    },
    {
        slug: 'sprig',
        name: 'Aus',
        accent: '#9B8CC8',
        pink: [155, 140, 200],
        yellow: [126, 200, 168],
        coral: [212, 200, 240],
        cream: [168, 184, 176],
        deep: [26, 21, 37],
    },
];

export function getThemeBySlug(slug) {
    return THEMES.find((theme) => theme.slug === slug) ?? THEMES[0];
}

export function rgb([r, g, b]) {
    return `rgb(${r}, ${g}, ${b})`;
}
