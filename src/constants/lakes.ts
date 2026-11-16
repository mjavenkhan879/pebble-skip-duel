export type Lake = {
  id: number;
  name: string;
  condition: string;
  maxWind: number;
  leaves: number;
  roughness: number;
  target: number;
  pebbleId: string;
  paintingName: string;
  tint: string;
  tintEnd: string;
};

/** All eight lakes are available from first launch. */
export const LAKES: Lake[] = [
  {
    id: 1,
    name: 'Willow Cove',
    condition: 'Pale sheltered inlet, barely a breath of air.',
    maxWind: 1,
    leaves: 2,
    roughness: 0.0,
    target: 4,
    pebbleId: 'fern',
    paintingName: 'Fern Brush',
    tint: 'rgba(239,246,237,0.40)',
    tintEnd: 'rgba(176,221,189,0.46)',
  },
  {
    id: 2,
    name: 'Mirror Tarn',
    condition: 'Clear mountain reflection on glassy water.',
    maxWind: 2,
    leaves: 3,
    roughness: 0.003,
    target: 4,
    pebbleId: 'ripple',
    paintingName: 'Ripple Rings',
    tint: 'rgba(209,231,238,0.44)',
    tintEnd: 'rgba(239,246,237,0.44)',
  },
  {
    id: 3,
    name: 'Fern Reach',
    condition: 'Soft wooded shore with drifting leaves.',
    maxWind: 2,
    leaves: 4,
    roughness: 0.006,
    target: 5,
    pebbleId: 'moss',
    paintingName: 'Moss Dots',
    tint: 'rgba(176,221,189,0.50)',
    tintEnd: 'rgba(65,171,42,0.20)',
  },
  {
    id: 4,
    name: 'Cloud Basin',
    condition: 'A broad white mist band over open water.',
    maxWind: 3,
    leaves: 5,
    roughness: 0.009,
    target: 6,
    pebbleId: 'cloud',
    paintingName: 'Cloud Wash',
    tint: 'rgba(239,246,237,0.56)',
    tintEnd: 'rgba(209,231,238,0.48)',
  },
  {
    id: 5,
    name: 'Slate Sound',
    condition: 'Cool stone reflection, steady crosswind.',
    maxWind: 3,
    leaves: 6,
    roughness: 0.012,
    target: 7,
    pebbleId: 'mountain',
    paintingName: 'Mountain Line',
    tint: 'rgba(0,85,139,0.26)',
    tintEnd: 'rgba(209,231,238,0.52)',
  },
  {
    id: 6,
    name: 'Orchid Inlet',
    condition: 'Purple flower reflections along the bank.',
    maxWind: 4,
    leaves: 7,
    roughness: 0.016,
    target: 8,
    pebbleId: 'orchid',
    paintingName: 'Orchid Streak',
    tint: 'rgba(239,246,237,0.46)',
    tintEnd: 'rgba(191,40,224,0.14)',
  },
  {
    id: 7,
    name: 'Windfall Lake',
    condition: 'Breezy open water, leaves everywhere.',
    maxWind: 4,
    leaves: 8,
    roughness: 0.02,
    target: 9,
    pebbleId: 'wind',
    paintingName: 'Wind Lines',
    tint: 'rgba(209,231,238,0.50)',
    tintEnd: 'rgba(176,221,189,0.48)',
  },
  {
    id: 8,
    name: 'Crownwater',
    condition: 'Layered distant peaks and a hard crosswind.',
    maxWind: 5,
    leaves: 9,
    roughness: 0.024,
    target: 10,
    pebbleId: 'summit',
    paintingName: 'Summit Paint',
    tint: 'rgba(0,85,139,0.30)',
    tintEnd: 'rgba(239,246,237,0.50)',
  },
];

export const LAKE_COUNT = LAKES.length;

export function getLake(id: number): Lake {
  return LAKES[Math.max(0, Math.min(LAKES.length - 1, id - 1))];
}
