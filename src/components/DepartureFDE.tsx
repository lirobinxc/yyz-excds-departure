import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

// import { ReactComponent as UpArrow } from '../images/up-arrow.svg';
import upArrow from '../images/up-arrow.png';
import { useAppDispatch } from '../state/hooks';

import './DepartureFDE.scss';
import { airborneListActions } from '../state/slices/airborneSlice';
import { AcType } from '../functions/genACID';

interface DepartureFDEProps {
  acId: string;
  acFullName: string;
  acType: string;
  assignedAlt: number;
  coordinatedAlt?: number;
  assignedHeading: string;
  onCourseWP: string;
  ETA: string;
  runwayId: string;
  transponderCode: string;
  filedAlt: number;
  filedRoute: string;
  destination: string;
  remarks?: string;
  isNADP1?: boolean;
  isQ400?: boolean;
  departurePoint?: string;
}

function DepartureFDE({
  acId,
  acFullName,
  acType,
  assignedAlt,
  coordinatedAlt,
  assignedHeading,
  onCourseWP,
  ETA,
  runwayId,
  transponderCode,
  filedAlt,
  filedRoute,
  destination,
  remarks,
  isNADP1 = false,
  isQ400 = false,
  departurePoint,
}: DepartureFDEProps) {
  const dispatch = useAppDispatch();

  const [currentAlt, setCurrentAlt] = useState(assignedAlt);
  const [isCorrectAlt, setIsCorrectAlt] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onCourse, setOnCourse] = useState(false);

  function handleClickAlt() {
    setCurrentAlt(currentAlt + 10);
  }

  useEffect(() => {
    if (currentAlt >= filedAlt || currentAlt >= 230) {
      setIsCorrectAlt(true);
    } else setIsCorrectAlt(false);
  }, [currentAlt]);

  function openModal() {
    setIsModalOpen(true);
  }
  function closeModal() {
    setIsModalOpen(false);
  }

  function handleOnCourse() {
    setOnCourse(true);
  }

  function removeStrip() {
    dispatch(airborneListActions.deleteStrip(acId));
  }

  function displayAssignedHeading() {
    if (onCourse) return onCourseWP;
    if (assignedHeading === 'No turns') return '';
    return assignedHeading;
  }

  return (
    <section className={clsx('FlightStrip', 'flexCol')}>
      <div className={clsx('topRow', 'flexRow')}>
        <div className={clsx('col1')}>
          <div className={clsx('acId')}>{acId}</div>
        </div>
        <div className={clsx('col2')}>
          <div className={clsx('ETA')}>{ETA}Z</div>
          <div className={clsx('transponderCode')}>{transponderCode}</div>
        </div>
        <div className={clsx('col3')}>
          <div className={clsx('arrow')} onClick={handleClickAlt}>
            🡱
          </div>
          {/* <img src={upArrow} className="arrowPng" alt="departureArrow" /> */}
        </div>
        <div className={clsx('col4')}>
          <aside
            className={clsx('altModalWrapper', { displayNone: !isModalOpen })}
          >
            <div className={clsx('altModalContent')}>
              <button
                onClick={() => {
                  setCurrentAlt(80);
                  closeModal();
                }}
              >
                80
              </button>
              <button
                onClick={() => {
                  setCurrentAlt(90);
                  closeModal();
                }}
              >
                90
              </button>
              <button
                onClick={() => {
                  setCurrentAlt(150);
                  closeModal();
                }}
              >
                150
              </button>
              <button
                onClick={() => {
                  setCurrentAlt(230);
                  closeModal();
                }}
              >
                230
              </button>
            </div>
            <div className={clsx('altModalOverlay')} onClick={closeModal}></div>
          </aside>
          <div className={clsx('assignedAlt')} onClick={openModal}>
            {currentAlt}
          </div>
        </div>
        <div className={clsx('col5')}>
          <div className={clsx('remarks')}>{remarks}</div>
        </div>
        <div className={clsx('col6')} onClick={handleOnCourse}>
          <div className={clsx('assignedHeading', { colorRed: !onCourse })}>
            {displayAssignedHeading()}
          </div>
        </div>
        <div className={clsx('col7')}>
          <div className={clsx('isNADP1')}>{isNADP1 && 1}</div>
        </div>
        <div className={clsx('col8')} onClick={removeStrip}>
          <div className={clsx('runwayId')}>{runwayId}</div>
        </div>
      </div>
      <div className={clsx('bottomRow', 'flexRow')}>
        <div className={clsx('col1', { bgWhite: isQ400 })}>
          <div className={clsx('acType')}>{acFullName}</div>
        </div>
        <div className={clsx('col2')}>
          <div
            className={clsx('filedAlt', {
              colorRed: acType === AcType.Jet && filedAlt < 230,
            })}
          >
            {filedAlt}
          </div>
        </div>
        <div className={clsx('col3')}></div>
        <div className={clsx('col4')}>
          <div className={clsx('filedRoute')}>{filedRoute}</div>
        </div>
        <div className={clsx('col5')}>
          <div className={clsx('destination')}>{destination}</div>
        </div>
        <div className={clsx('col6')}>
          <div className={clsx('coordinatedAlt')}>{coordinatedAlt}</div>
        </div>
      </div>
    </section>
  );
}

export default DepartureFDE;
