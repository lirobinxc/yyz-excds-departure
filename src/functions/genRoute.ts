import _ from 'lodash';
import { RunwayId, sidsCollection } from '../data/sidsCollection';

import { AcType } from './genACID';

export function genRoute(runwayId: RunwayId, acType: AcType) {
  const selectedSidsArr = sidsCollection[runwayId][acType];
  if (!selectedSidsArr) return;

  return _.sample(selectedSidsArr);
}
