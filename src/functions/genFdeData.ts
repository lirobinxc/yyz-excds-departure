import _ from 'lodash';
import { AcType, genACID } from './genACID';
import { genCallsign } from './genCallsign';
import { genRoute } from './genRoute';

import { RunwayId } from '../data/sidsCollection';
import { destinationCollection } from '../data/destinationCollection';

let currentHour = _.sample([12, 13, 14, 15, 16, 17, 18]) || 12;
let currentMinute = 0;

export function genFdeData(runwayId: RunwayId) {
  // Set timestamp
  const minuteJitter = _.sample([1, 1, 1, 1, 2, 2, 3]) || 1;
  currentMinute = currentMinute + minuteJitter;

  if (currentMinute > 59) {
    currentHour = currentHour + 1;
    currentMinute = currentMinute - 60;
  }

  if (currentHour > 23) currentHour = 0;

  const currentTime = `${String(currentHour).padStart(2, '0')}${String(
    currentMinute
  ).padStart(2, '0')}`;

  // Init aircraft
  const ac = genACID();

  // Set filed speed and altitude
  let filedTAS = 999;
  let filedAlt = 999;
  if (ac.type === AcType.Prop) {
    filedTAS = _.sample([293, 275]) || 275;
    filedAlt = _.sample([60, 160, 190, 220, 250]) || 220;
  }
  if (ac.type === AcType.Jet) {
    filedTAS = _.sample([349, 374]) || 349;
    filedAlt = _.sample([220, 310, 330, 350, 360]) || 350;
  }

  // Init route
  const sid = genRoute(runwayId, ac.type);

  const filedRoute = `${sid.Name}${_.random(1, 5)}`;

  // Assigned heading
  let assignedHeading = sid['Prop or Jet Turns'];

  // Init assigned altitude
  let assignedAlt = 30; // default PROP altitude
  if (assignedHeading === 'No turns') assignedAlt = 50; // default JET altitude

  // Randomly select a destination
  const destination =
    _.sample(destinationCollection) || destinationCollection[0];

  const fde = {
    debug: ac,
    acId: genCallsign(),
    acType: ac.type,
    acFullName: ac.fullName,
    filedTAS,
    assignedAlt,
    // additionalInfo,
    assignedHeading,
    runwayId,
    transponderCode: `${_.random(0, 7)}${_.random(0, 7)}${_.random(
      0,
      7
    )}${_.random(0, 7)}`,
    // assignedSpeed,
    filedAlt,
    // departurePoint,
    filedRoute,
    destination,
    ETA: currentTime,
    isQ400: ac.isQ400,
  };

  return fde;
}
