import _ from 'lodash';
import { callsigns } from '../data/callsignCollection';

export function genCallsign({
  isC208,
  isSatYTZ,
  isSatYKZ,
  isSatYZD,
  isSatYHM,
}: {
  isC208?: boolean;
  isSatYTZ?: boolean;
  isSatYKZ?: boolean;
  isSatYZD?: boolean;
  isSatYHM?: boolean;
}) {
  const random = _.random(1, 5);

  let num = _.random(101, 999);

  if (random > 3) num = _.random(1000, 9999);

  let operatorOnly = _.sample(callsigns);
  if (isC208) operatorOnly = 'MAL';
  if (isSatYTZ) operatorOnly = 'POE';
  if (isSatYKZ) operatorOnly = 'PUL';
  if (isSatYZD) operatorOnly = 'BBA';
  if (isSatYHM) operatorOnly = 'CJT';

  const fullCallsign = `${operatorOnly}${num}`;

  return { operatorOnly, fullCallsign };
}
