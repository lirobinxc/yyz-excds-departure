import _ from 'lodash';
import { AcType, genACID } from './genACID';
import { genCallsign } from './genCallsign';
import { genRoute } from './genRoute';
import { RunwayId, SidData } from '../data/sidsCollection';
import { destinationCollection } from '../data/destinationCollection';

let currentHour = _.sample([12, 13, 14, 15, 16, 17, 18]) || 12;
let currentMinute = 0;

export type FDE = ReturnType<typeof genFdeData>;

export function genFdeData(rwyId: RunwayId) {
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

  // Gen Callsign
  const acId = genCallsign();

  // Check if MALs
  if (acId.operatorOnly === 'MAL') {
    ac.acName = 'C208';
    ac.type = AcType.Prop;
    ac.isQ400 = false;
  }

  // Set filed speed and altitude
  let filedTAS = 999;
  let filedAlt = 999;
  if (ac.type === AcType.Prop) {
    filedTAS = _.sample([293, 275]) || 275;
    filedAlt = _.sample([60, 160, 190, 220, 250]) || 220;
    if ((ac.acName = 'C208')) {
      filedTAS = 180;
      filedAlt = 80;
    }
  }
  if (ac.type === AcType.Jet) {
    filedTAS = _.sample([349, 374]) || 349;
    filedAlt = _.sample([220, 310, 330, 350, 360]) || 350;
  }

  // Init route
  const sid = genRoute(rwyId, ac.type) || ({} as SidData);

  // Init Rwy ID
  function randomRwyId(): string {
    let randomRwy: string | undefined = '';

    if (rwyId === RunwayId['05, 06LR']) randomRwy = _.sample(['06L']);
    if (rwyId === RunwayId['15LR']) randomRwy = _.sample(['15L']);
    if (rwyId === RunwayId['23, 24LR']) randomRwy = _.sample(['24R']);
    if (rwyId === RunwayId['33LR']) randomRwy = _.sample(['33R']);

    return randomRwy || 'ERROR';
  }

  const runwayId = randomRwyId();

  const filedRoute = `${sid.Name} ... ...`;

  // Assigned heading
  let assignedHeading =
    (sid['Aircraft type'] !== 'Jet' && sid['Prop or Jet Turns']) || '';

  // Init assigned altitude
  let assignedAlt = 30; // default PROP altitude
  if (assignedHeading === 'No turns' || sid['Aircraft type'] === 'Jet')
    assignedAlt = 50; // default JET altitude

  const onCourseWP = sid['Final WP'];

  // Randomly select a destination
  const destination =
    _.sample(destinationCollection) || destinationCollection[0];

  const transponderCode = `${_.random(0, 7)}${_.random(0, 7)}${_.random(
    0,
    7
  )}${_.random(0, 7)}`;

  // Convert 'Handoff Alt' string to num
  let handoffAlt = 230;

  if (sid['Handoff Alt'] === 'FL230') handoffAlt = 230;
  if (sid['Handoff Alt'] === '15,000') handoffAlt = 150;
  if (sid['Handoff Alt'] === '8000') handoffAlt = 80;

  const fde = {
    debug: ac,
    acId: acId.fullCallsign,
    acType: ac.type,
    acFullName: `${ac.wtc}/${ac.acName}/${ac.equipment}`,
    filedTAS,
    assignedAlt,
    // additionalInfo,
    assignedHeading,
    onCourseWP,
    runwayId,
    transponderCode,
    // assignedSpeed,
    filedAlt,
    // departurePoint,
    filedRoute,
    destination,
    ETA: currentTime,
    isQ400: ac.isQ400,
    isNADP1: false,
    handoffAlt,
  };

  return fde;
}
