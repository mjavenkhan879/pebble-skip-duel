/**
 * Nine appearances. All share identical hit geometry, speed and retention —
 * a painting is cosmetic only. Paintings are vector overlays on the slate base
 * (sprite_1), so no extra image filenames are required.
 */
export type PebbleMotif =
  | 'none'
  | 'leaves'
  | 'rings'
  | 'dots'
  | 'swash'
  | 'ridge'
  | 'streak'
  | 'lines'
  | 'summit';

export type Pebble = {
  id: string;
  name: string;
  lakeId: number;
  motif: PebbleMotif;
  color: string;
  accent: string;
};

export const PEBBLES: Pebble[] = [
  { id: 'bare', name: 'Bare Slate', lakeId: 0, motif: 'none', color: '#1A2418', accent: '#B0DDBD' },
  { id: 'fern', name: 'Fern Brush', lakeId: 1, motif: 'leaves', color: '#41AB2A', accent: '#B0DDBD' },
  { id: 'ripple', name: 'Ripple Rings', lakeId: 2, motif: 'rings', color: '#00558B', accent: '#D1E7EE' },
  { id: 'moss', name: 'Moss Dots', lakeId: 3, motif: 'dots', color: '#41AB2A', accent: '#1A2418' },
  { id: 'cloud', name: 'Cloud Wash', lakeId: 4, motif: 'swash', color: '#EFF6ED', accent: '#D1E7EE' },
  { id: 'mountain', name: 'Mountain Line', lakeId: 5, motif: 'ridge', color: '#00558B', accent: '#B0DDBD' },
  { id: 'orchid', name: 'Orchid Streak', lakeId: 6, motif: 'streak', color: '#BF28E0', accent: '#9B59B6' },
  { id: 'wind', name: 'Wind Lines', lakeId: 7, motif: 'lines', color: '#00558B', accent: '#D1E7EE' },
  { id: 'summit', name: 'Summit Paint', lakeId: 8, motif: 'summit', color: '#BF28E0', accent: '#41AB2A' },
];

export const STARTER_PEBBLE = 'bare';
export const PEBBLE_COUNT = PEBBLES.length;

export function getPebble(id: string): Pebble {
  return PEBBLES.find(p => p.id === id) || PEBBLES[0];
}
