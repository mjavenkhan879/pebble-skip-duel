/**
 * OCEAN_FRESH preset — color tokens overridden to the PebbleSkipDuel brief.
 * The `name` field stays EXACTLY as in .codegen-context/preset.ts.
 * Style: SOFT_UI — pale panels, short soft shadows, 1dp borders, 16-18dp corners.
 */
export const theme = {
  name: 'ocean-fresh',
  colors: {
    bg: {
      primary: '#EFF6ED',
      secondary: '#D1E7EE',
      tertiary: '#B0DDBD',
      accent: '#9DCEDB',
      deep: '#1A2418',
    },
    lake: {
      green: '#41AB2A',
      mist: '#B0DDBD',
      cool: '#D1E7EE',
      deep: '#00558B',
      purple: '#BF28E0',
      purpleEnd: '#9B59B6',
    },
    text: {
      primary: '#1A2418',
      secondary: '#00558B',
      onDark: '#EFF6ED',
      onAccent: '#EFF6ED',
      muted: 'rgba(26,36,24,0.76)',
      disabled: 'rgba(26,36,24,0.48)',
    },
    ui: {
      surface: '#EFF6ED',
      surfaceCool: '#D1E7EE',
      surfaceSoft: 'rgba(239,246,237,0.94)',
      border: '#B0DDBD',
      borderCool: 'rgba(0,85,139,0.36)',
      scrim: 'rgba(26,36,24,0.35)',
      track: '#00558B',
    },
    player: {
      one: '#41AB2A',
      two: '#BF28E0',
    },
  },
  gradients: {
    primary: ['#BF28E0', '#9B59B6'] as [string, string],
    secondary: ['#EFF6ED', '#D1E7EE'] as [string, string],
    sheet: ['#EFF6ED', '#D1E7EE'] as [string, string],
    controls: ['#EFF6ED', '#B0DDBD'] as [string, string],
    progress: ['#41AB2A', '#B0DDBD'] as [string, string],
    loaderOverlay: ['rgba(26,36,24,0.94)', 'rgba(0,85,139,0.90)', 'rgba(26,36,24,0.95)'] as [
      string,
      string,
      string,
    ],
    menuOverlay: ['rgba(239,246,237,0.18)', 'rgba(176,221,189,0.52)', '#EFF6ED'] as [
      string,
      string,
      string,
    ],
    gameOverlay: ['rgba(209,231,238,0.55)', 'rgba(239,246,237,0.88)'] as [string, string],
    resultOverlay: ['rgba(176,221,189,0.78)', 'rgba(239,246,237,0.96)'] as [string, string],
    replayOverlay: ['rgba(0,85,139,0.42)', 'rgba(209,231,238,0.92)'] as [string, string],
    duelOverlay: ['rgba(239,246,237,0.72)', 'rgba(176,221,189,0.88)'] as [string, string],
    pouchOverlay: ['rgba(239,246,237,0.90)', 'rgba(209,231,238,0.94)'] as [string, string],
    recordsOverlay: ['rgba(209,231,238,0.86)', 'rgba(239,246,237,0.96)'] as [string, string],
    settingsOverlay: ['rgba(239,246,237,0.94)', 'rgba(176,221,189,0.94)'] as [string, string],
    water: ['rgba(0,85,139,0.30)', 'rgba(209,231,238,0.72)'] as [string, string],
  },
  typography: {
    hero: { fontSize: 40, fontWeight: '800' as const, lineHeight: 44, letterSpacing: -0.5 },
    result: { fontSize: 56, fontWeight: '800' as const, lineHeight: 64 },
    live: { fontSize: 48, fontWeight: '800' as const, lineHeight: 56 },
    menuTitle: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
    heading: { fontSize: 24, fontWeight: '700' as const, lineHeight: 30 },
    section: { fontSize: 16, fontWeight: '700' as const, lineHeight: 24 },
    body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 21 },
    caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  },
  radius: { sm: 10, md: 14, lg: 16, xl: 18, pill: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  shadow: {
    card: {
      shadowColor: '#1A2418',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    sheet: {
      shadowColor: '#1A2418',
      shadowOpacity: 0.14,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: -2 },
      elevation: 4,
    },
    primary: {
      shadowColor: '#BF28E0',
      shadowOpacity: 0.18,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
  },
};

export type Theme = typeof theme;
export default theme;
