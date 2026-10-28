import type { CaptionStyle } from '../src/core';

export type Look = { name: string; bg: string; page: string; props: Partial<CaptionStyle> };
export const LOOKS: Look[] = [
  { name: 'Editorial', page: 'radial-gradient(1200px 600px at 20% -10%, #3a2f2a, #14110f)', bg: '#1b1714',
    props: { fontFamily: '"Iowan Old Style", "Palatino Linotype", Georgia, serif', fontSize: 28, lineHeight: 38, fontWeight: '400' as const, color: '#f3ece2', spokenOpacity: 0.38, nowColor: '#ffcf8a', nowFontWeight: '600' as const, letterSpacing: -0.2, textAlign: 'left' as const, fadeHeight: 60 } },
  { name: 'Karaoke', page: 'radial-gradient(900px 600px at 80% 0%, #4b1d6b, #0e0818)', bg: '#150c24',
    props: { fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif', fontSize: 32, lineHeight: 40, fontWeight: '800' as const, color: '#ffffff', spokenColor: '#7c5cff', nowColor: '#ff4fa3', nowFontWeight: '800' as const, letterSpacing: -0.6, textAlign: 'center' as const, fadeHeight: 64 } },
  { name: 'Minimal', page: 'linear-gradient(180deg, #f4f4f2, #e6e6e2)', bg: '#ffffff',
    props: { fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif', fontSize: 22, lineHeight: 32, fontWeight: '400' as const, color: '#111', spokenOpacity: 0.32, nowColor: '#111', nowFontWeight: '600' as const, letterSpacing: -0.1, textAlign: 'left' as const, fadeHeight: 48 } },
  { name: 'Terminal', page: 'radial-gradient(800px 500px at 50% 0%, #0b2a1a, #040a07)', bg: '#06110b',
    props: { fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: 19, lineHeight: 28, fontWeight: '400' as const, color: '#8dffb4', spokenOpacity: 0.4, nowColor: '#eafff1', nowFontWeight: '700' as const, letterSpacing: 0, textAlign: 'left' as const, fadeHeight: 44 } },
];
