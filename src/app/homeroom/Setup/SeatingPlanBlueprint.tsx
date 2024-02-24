import React, { useState } from 'react'
import Seat, { DeskSlotProps } from './DeskSlot'
import { StudentObj } from '../../../lib/StudentObj';
import DeskSlot from './DeskSlot';


export interface GridSpec {
  rows: number
  columns: number
}

export interface BlueprintProps {
  studentList: StudentObj[],
  gridSpec: GridSpec,
  deskSlots: DeskSlotProps[]
}

export default function SeatingPlanBlueprint( {studentList, gridSpec, deskSlots} : BlueprintProps){

  const deskPlan = deskSlots.map( (seat : DeskSlotProps) => {
    return (
      <DeskSlot 
        key={`${seat.slotNumber}`}
        row={seat.row}
        column={seat.column}
        slotNumber={seat.slotNumber}
        directive={seat.directive}
        grid={seat.grid}
        listSelectionHandler={seat.listSelectionHandler}
      /> 
    )
  })

  const desksJson: string = JSON.stringify(deskSlots, null, 2)
  return (
    <div className={`desk-plan grid gap-10 grid-rows-${gridSpec.rows} grid-cols-${gridSpec.columns}`}>
      { deskPlan }
      <br />
      <p>{desksJson}</p>
    </div>
  )
}
