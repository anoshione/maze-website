/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const themeShowcase = [
  {
    id: "slate",
    title: "Slate Spectre",
    description: "Atmospheric grayscale for ultimate focus.",
    theme: {
      bg: '#171717',
      mazeBg: '#171717',
      grid: '#404040',
      textMain: '#f5f5f5',
      textMuted: '#a3a3a3',
      player: '#a3a3a3',
      playerShadow: 'rgba(163,163,163,0.5)',
      trail: 'rgba(163,163,163,0.3)',
      goal: '#60a5fa',
      goalShadow: 'rgba(96,165,250,0.6)',
      uiBg: 'rgba(23,23,23,0.6)',
      uiBorder: '#525252',
      uiHover: 'rgba(23,23,23,0.8)',
    },
  },
  {
    id: "orange",
    title: "Amber Flare",
    description: "Warm, high-visibility amber tones.",
    theme: {
      bg: '#1c1917',
      mazeBg: '#1c1917',
      grid: '#443f3c',
      textMain: '#fafaf9',
      textMuted: '#a8a29e',
      player: '#fb923c',
      playerShadow: 'rgba(251,146,60,0.5)',
      trail: 'rgba(251,146,60,0.3)',
      goal: '#facc15',
      goalShadow: 'rgba(250,204,21,0.6)',
      uiBg: 'rgba(28,25,23,0.6)',
      uiBorder: '#57534e',
      uiHover: 'rgba(28,25,23,0.8)',
    },
  },
  {
    id: "rose",
    title: "Rose Glitch",
    description: "Aggressive pink and red warnings.",
    theme: {
      bg: '#1c1718',
      mazeBg: '#1c1718',
      grid: '#443c3e',
      textMain: '#faf9fa',
      textMuted: '#a89ea0',
      player: '#fb7185',
      playerShadow: 'rgba(251,113,133,0.5)',
      trail: 'rgba(251,113,133,0.3)',
      goal: '#c084fc',
      goalShadow: 'rgba(192,132,252,0.6)',
      uiBg: 'rgba(28,23,24,0.6)',
      uiBorder: '#574e51',
      uiHover: 'rgba(28,23,24,0.8)',
    },
  },
  {
    id: "emerald",
    title: "Neon Pulse",
    description: "High-contrast digital neon energy.",
    theme: {
      bg: '#171c19',
      mazeBg: '#171c19',
      grid: '#3c443f',
      textMain: '#f9faf9',
      textMuted: '#9ea8a2',
      player: '#34d399',
      playerShadow: 'rgba(52,211,153,0.5)',
      trail: 'rgba(52,211,153,0.3)',
      goal: '#22d3ee',
      goalShadow: 'rgba(34,211,238,0.6)',
      uiBg: 'rgba(23,28,25,0.6)',
      uiBorder: '#4e5753',
      uiHover: 'rgba(23,28,25,0.8)',
    },
  }
];

export const sections = [
  { id: "hero", label: "Maze" },
  { id: "showcase", label: "Design" },
  { id: "gameplay", label: "Gameplay" },
  { id: "features", label: "Features" },
];

export const difficultyLevels = ["Easy", "Medium", "Hard", "Expert"];

export const getGridSize = (lvl: string) => {
  switch(lvl) {
    case "Easy": return 4;
    case "Medium": return 6;
    case "Hard": return 10;
    case "Expert": return 16;
    default: return 6;
  }
};
