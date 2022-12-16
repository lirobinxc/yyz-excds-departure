import _ from 'lodash';
import { RunwayId, sidsCollection } from '../data/sidsCollection';

import { AcType } from './genACID';

export function genRoute(runwayId: RunwayId, acType: AcType) {
  console.log({ genRouteRwyId: runwayId });
  if (!sidsCollection[runwayId]) return;

  const selectedSidsArr = sidsCollection[runwayId][acType];

  return _.sample(selectedSidsArr);
}
