import React from 'react'
import { StudentObj } from '../../../lib/StudentObj'
import { GridSpec } from './SeatingGridSettings'
import { DeskGridCellProps } from './DeskGridCell'

export interface DeskLayout {
  grid: GridSpec,
  students: StudentObj[]
  gridCells: DeskGridCellProps[]
}

export interface Desk {
  row: number,
  column: number,
  cellNumber: number,
  assignedTo?: StudentObj
}

function assignDesks(students: StudentObj[], deskGridCells: DeskGridCellProps[]): DeskLayout[] {
  const assignedDeskGridCells: DeskLayout[] = [...deskGridCells]
  let
    studentIndex = 0,
    deskIndex = 1

  for (let i: number = 0; i < assignedDeskGridCells.length; i++) {
    if (assignedDeskGridCells[i].intent === 0) {
      assignedDeskGridCells[i].assignedTo = students[studentIndex]
      studentIndex++
      deskIndex++
    } else if (assignedDeskGridCells[i].intent === 1) {
      deskIndex++
    }
  }
  return assignedDeskGridCells
}

function Desk({row, column, cellNumber, grid, students, gridCells} : DeskLayout) {
  let desks: DeskLayout[] = assignDesks(students, deskSlots)
  return (
    <>
      {desks.map((deskCell: DeskGridCellProps) => {
        return(<>)
      })}
    </>
  )
}

export default SeatingPlan