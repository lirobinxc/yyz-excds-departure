import React, { useEffect, useState } from 'react';
import useInterval from 'use-interval';
import Modal from 'react-modal';

import './App.scss';
import DepartureFDE from './components/DepartureFDE/DepartureFDE';
import { RunwayId } from './data/sidsCollection';
import { useAppSelector, useAppDispatch } from './state/hooks';
import {
  airborneListActions,
  selectAirborneList,
} from './state/slices/airborneSlice';
import SatelliteFDE from './components/SatelliteFDE/SatelliteFDE';

interface ILocalStorage extends Storage {
  runwayId?: RunwayId;
  totalItems?: number;
  timedAdd?: number;
  onlySatellites?: boolean;
}

const localStorage: ILocalStorage = window.localStorage;

// const localStorageRunwayId =
//   (localStorage.getItem('runwayId') as RunwayId) || RunwayId['05, 06LR'];
// console.log(localStorageRunwayId);

function App() {
  const dispatch = useAppDispatch();

  const airborneList = useAppSelector(selectAirborneList);

  const [options, setOptions] = useState({
    count: Number(localStorage.getItem('count')) || 6,
    timedAdd: Number(localStorage.getItem('timedAdd')) || 6,
    runwayId:
      (localStorage.getItem('runwayId') as RunwayId) || RunwayId['05, 06LR'],
    onlySatellites:
      localStorage.getItem('onlySatellites')?.toLocaleLowerCase() === 'true' ||
      false,
  });
  const [modalIsOpen, setIsOpen] = useState(false);
  const [timedAddEnabled, setTimedAddEnabled] = useState(false);

  useEffect(() => {
    dispatch(
      airborneListActions.refreshStrips({
        runwayId: options.runwayId,
        count: options.count,
        onlySatellites: options.onlySatellites,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.count, options.runwayId]);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  function refreshSeq() {
    dispatch(
      airborneListActions.refreshStrips({
        runwayId: options.runwayId,
        count: options.count,
        onlySatellites: options.onlySatellites,
      })
    );
  }

  function setCount(e: React.FormEvent) {
    const target = e.target as HTMLTextAreaElement;
    let value = Number(target.value);

    if (isNaN(value)) value = 6;
    if (value > 99) value = 99;
    if (value < 1) value = 1;

    localStorage.setItem('count', value.toString());
    setOptions({ ...options, count: value });
  }

  function setTimedAdd(e: React.FormEvent) {
    const target = e.target as HTMLTextAreaElement;
    let value = Number(target.value);

    if (value < 1 || isNaN(value)) value = 6;

    localStorage.setItem('timedAdd', value.toString());
    setOptions({ ...options, timedAdd: value });
  }

  function setRunwayId(e: React.FormEvent) {
    const target = e.target as HTMLTextAreaElement;
    let value = target.value as RunwayId;

    localStorage.setItem('runwayId', value);
    setOptions({ ...options, runwayId: value });
  }

  useEffect(() => {
    localStorage.setItem(
      'onlySatellites',
      options.onlySatellites ? 'true' : 'false'
    );
  }, [options.onlySatellites]);

  useInterval(() => {
    if (!timedAddEnabled) return;
    console.log('ADDED NEW STRIP');

    dispatch(
      airborneListActions.addStrip({
        rwyId: options.runwayId,
        onlySatellites: options.onlySatellites,
      })
    );
  }, 1000 * options.timedAdd);

  console.log(airborneList);
  return (
    <div className="App">
      <div className="headerRow">
        <h2>YYZ Departure EXCDS v1.6</h2>
        <div className="optionsRow">
          <button className="refreshButton" onClick={refreshSeq}>
            Refresh
          </button>
          <label>
            "Timed Add" mode
            <input
              type="checkbox"
              checked={timedAddEnabled}
              onChange={() => setTimedAddEnabled(!timedAddEnabled)}
            />
          </label>
          <label>
            <select
              name="rwy"
              id="rwy"
              onChange={setRunwayId}
              defaultValue={options.runwayId}
            >
              <option value={RunwayId['05, 06LR']}>
                {RunwayId['05, 06LR']}
              </option>
              <option value={RunwayId['15LR']}>{RunwayId['15LR']}</option>
              <option value={RunwayId['23, 24LR']}>
                {RunwayId['23, 24LR']}
              </option>
              <option value={RunwayId['33LR']}>{RunwayId['33LR']}</option>
            </select>
          </label>
          <button onClick={openModal}>Options</button>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Options Modal"
          ariaHideApp={false}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h2>
              Options <button onClick={closeModal}>Close</button>
            </h2>

            <form>
              Starting # of strips (0-99):{' '}
              <input
                type="number"
                name="totalItems"
                defaultValue={options.count}
                onChange={setCount}
              />
              <br />
              <label>
                Only show Satellite strips{' '}
                <input
                  type="checkbox"
                  checked={options.onlySatellites}
                  onChange={() =>
                    setOptions({
                      ...options,
                      onlySatellites: !options.onlySatellites,
                    })
                  }
                />
              </label>
              <h3>"Timed Add" mode options (adds new strip every X seconds)</h3>
              <label>
                {'Timed add interval (suggested > 10 secs)'}{' '}
                <input
                  type="number"
                  name="timedAdd"
                  defaultValue={options.timedAdd}
                  onChange={setTimedAdd}
                />
              </label>
              <br />
            </form>
            <div style={{ alignSelf: 'center', paddingTop: '50vh' }}>
              <a
                href="https://github.com/lirobinxc"
                target={'_blank'}
                rel="noreferrer"
              >
                Github @lirobinxc
              </a>
            </div>
          </div>
        </Modal>
      </div>
      <div className="stripsRowOnly">
        {airborneList
          .map((el) => {
            console.log({ el });
            if (el.isSatellite) {
              return <SatelliteFDE key={el.acId} {...el} />;
            }

            return <DepartureFDE key={el.acId} {...el} />;
          })
          .reverse()}
      </div>
    </div>
  );
}

export default App;
