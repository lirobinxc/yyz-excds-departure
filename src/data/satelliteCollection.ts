export enum RunwayId {
  '05, 06LR' = '05, 06LR',
  '23, 24LR' = '23, 24LR',
  '15LR' = '15LR',
  '33LR' = '33LR',
}

export interface SatelliteData {
  Type: 'ARRIVAL' | 'DEPARTURE' | 'OVERFLIGHT';
}

type SatelliteCollection = Record<RunwayId, SatelliteData[]>;

export const satelliteCollection: SatelliteCollection = {
  '05, 06LR': [
    {
      Type: 'ARRIVAL',
    },
  ],
  '15LR': [
    {
      Type: 'DEPARTURE',
    },
  ],
  '23, 24LR': [
    {
      Type: 'ARRIVAL',
    },
  ],
  '33LR': [
    {
      Type: 'ARRIVAL',
    },
  ],
};
