import _ from 'lodash';
import { callsigns } from '../data/callsignCollection';

export function genCallsign() {
  const random = _.random(1, 5);

  let num = _.random(101, 999);

  if (random > 3) num = _.random(1000, 9999);

  const operatorOnly = _.sample(callsigns);
  const fullCallsign = `${operatorOnly}${num}`;

  return { operatorOnly, fullCallsign };
}
