export const Colours = {
    WHITE: 'rgb(255, 255, 255)',
    WHITE_TRANSPARENT: 'rgba(255, 255, 255, 0.2)',
    BLACK: 'rgb(0, 0, 0)',
    BLACK_TRANSPARENT: 'rgba(0, 0, 0, 0.5)',
    GREEN: 'rgb(38, 194, 129)',
    RED: 'rgb(239, 62, 54)',
    RED_LIGHT: 'rgb(255, 191, 175)',
    PREMIUM: '#00c096',

    DARK: '#2B303A',
    LIGHT: 'rgb(245, 245, 245)',
    LIGHT_DARK: '#5d6168',
    GRAY: '#aaaaaa',
    GRAY_EXTRA_LIGHT: 'rgba(250, 250, 250, 1)',
    GRAY_TRANSPARENT: 'rgba(236, 236, 236, 0.5)',
    GRAY_LIGHT: 'rgba(225, 225, 225, 1)',
    LIGHT_TRANSPARENCY_80: 'rgba(252, 252, 252, 0.8)',
    LIGHT_TRANSPARENCY: 'rgba(252, 252, 252, 0.5)',

    OFF_PRIMARY: 'rgba(255,139,148, 1)',
    PRIMARY: 'rgba(255,128,96, 1)',
    PRIMARY_LIGHT: 'rgba(255, 165, 130, 1)',
    PRIMARY_DARK: 'rgba(255, 82, 63, 1)',
    PRIMARY_TRANSPARENT_75: 'rgba(255,128,96, 0.75)',
    PRIMARY_TRANSPARENT_50: 'rgba(255,128,96, 0.5)',
    PRIMARY_TRANSPARENT_20: 'rgba(255,128,96, 0.2)',
    TRANSPARENT: 'rgba(255, 255, 255, 0)',

    SECONDARY: 'rgb(240, 204, 176)',

    TERTIARY: 'rgb(66, 151, 160), 42%, 44%)',

    ERROR: '#ff0000',
    WARNING: '#f7b500',
    SUCCESS: '#3cb371',
    CLICKABLE_TEXT: '#0083da',

    MARKER_GRADIENT_1: '#FFB74D',
    MARKER_GRADIENT_2: '#FF9800',
    MARKER_GRADIENT_3: '#F57C00',
};

export const Sizes = {
    ICON_SIZE_XS: 16,
    ICON_SIZE_SM: 20,
    ICON_SIZE_MD: 22,
    ICON_SIZE_LG: 27,
    ICON_SIZE_XL: 32,
    ICON_SIZE_XXL: 48,
    ICON_SIZE_3XL: 56,
    ICON_SIZE_4XL: 64,

    FONT_SIZE_XXS: 10,
    FONT_SIZE_XS: 12,
    FONT_SIZE_SM: 14,
    FONT_SIZE_MD: 16,
    FONT_SIZE_LG: 18,
    FONT_SIZE_XL: 20,
    FONT_SIZE_2XL: 24,
    FONT_SIZE_3XL: 28,
    FONT_SIZE_4XL: 32,

    FONT_SIZE_H1: 28,
    FONT_SIZE_H2: 22,
    FONT_SIZE_H3: 14,
    FONT_SIZE_P: 12,

    BORDER_RADIUS_FULL: 1000,
    BORDER_RADIUS_SM: 4,
    BORDER_RADIUS_MD: 8,
    BORDER_RADIUS_LG: 16,
};

// Prevents object mutation
Object.freeze(Colours);
Object.freeze(Sizes);
