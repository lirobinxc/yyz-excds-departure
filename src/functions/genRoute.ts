import _ from 'lodash';
import { RunwayId, SidData, sidsCollection } from '../data/sidsCollection.js';

import { AcType } from './genACID.js';

export function genRoute(runwayId: RunwayId, acType: AcType): SidData {
  const fallbackSidData = sidsCollection[runwayId][acType][0];

  if (acType === AcType.Jet) {
    return _.sample(sidsCollection[runwayId][acType]) || fallbackSidData;
  }

  return _.sample(sidsCollection[runwayId][acType]) || fallbackSidData;
}
