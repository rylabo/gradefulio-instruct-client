import React, { useState } from 'react'
import Seat, { DeskGridCellProps } from './DeskSlot'
import { StudentObj } from '../../../lib/StudentObj';
import DeskGridCell from './DeskSlot';


export interface GridSpec {
  rows: number
  columns: number
}

export interface BlueprintProps {
  studentList: StudentObj[],
  gridSpec: GridSpec,
  deskSlots: DeskGridCellProps[]
}

export default function SeatingPlanBlueprint( {studentList, gridSpec, deskSlots} : BlueprintProps){

  const deskPlan = deskSlots.map( (seat : DeskGridCellProps) => {
    return (
      <DeskGridCell 
        key={`${seat.cellNumber}`}
        row={seat.row}
        column={seat.column}
        cellNumber={seat.cellNumber}
        intent={seat.intent}
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
