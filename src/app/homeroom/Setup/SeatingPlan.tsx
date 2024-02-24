import React from 'react'
import Seat, { SeatSpec } from './_Seat'
import { StudentObj } from '../../../lib/StudentObj'
import { BlueprintProps, GridSpec } from './SeatingPlanBlueprint'
import { DeskSlotProps } from './DeskSlot'

export interface SeatingPlanProps {
  students: StudentObj[]
  deskSlots: DeskSlotProps[]
  seatingGrid: GridSpec
}

function createDesks(students: StudentObj[], deskSlots: DeskSlotProps[]): JSX.Element[] {
  const 
    seats: JSX.Element[] = []
  let
    studentIndex = 0,
    deskIndex = 1,
    newSeat: JSX.Element

  for (let i: number = 0; i < deskSlots.length; i++) {
    if (deskSlots[i].directive === 0) {
      newSeat = (
        <Seat key={deskSlots[i].seatNumber} deskSlot={deskSlots[i]} occupant={students[studentIndex]}></Seat>
      )
      studentIndex++;
      seats.push(newSeat)
    } else if (deskSlots[i].directive === 1) {
      newSeat = (
        <Seat key={deskSlots[i].seatNumber} deskSlot={deskSlots[i]}></Seat>
      )
      seats.push(newSeat)
    }
  }
  return seats
}

function SeatingPlan({students, deskSlots} : SeatingPlanProps) {
  let desks: JSX.Element[] = createDesks(students, deskSlots)
  return (
    <>
      {desks}
    </>
  )
}

export default SeatingPlan