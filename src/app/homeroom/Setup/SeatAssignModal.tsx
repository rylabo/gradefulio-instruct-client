import React, { useEffect, useReducer } from 'react'
import { StudentObj } from '../../../lib/StudentObj'
import { DeskTemplate } from '../../../lib/SeatingPlan'
import { deepCopyDeskLayout, getCellUsage, isDeskTemplate } from '../../../util/deskLayout'

interface AssignSeatProps {
  students: StudentObj[]
  desks: (DeskTemplate | {})[][]
}

interface SeatingAssignment {
  desks: (DeskTemplate | {})[][]
}

type AssignAction = 
  | {type: 'default_seating', students: StudentObj[], desks: (DeskTemplate | {})[][]}


function compareStudents(a: StudentObj, b: StudentObj): number {

  // attendance numbers before names.
  if (!a.attendanceNumber && b.attendanceNumber) return 1
  else if (a.attendanceNumber && !b.attendanceNumber) return -1

  else if (a.attendanceNumber && b.attendanceNumber) {
    if (a.attendanceNumber > b.attendanceNumber) return 1
    else if (a.attendanceNumber < b.attendanceNumber) return -1
    else return 0
  }

  else {
    if (a.familyNames[0].annotation > b.familyNames[0].annotation) return 1
    else if (a.familyNames[0].annotation < b.familyNames[0].annotation) return -1
    else if (a.givenNames[0].annotation > b.givenNames[0].annotation) return 1  
    else if (a.givenNames[0].annotation < b.givenNames[0].annotation) return -1
  }
  return 0
}

function sortStudents(students: StudentObj[]): StudentObj[] {
  return students.toSorted(compareStudents)
}

function getDefaultSeating(students: StudentObj[], desks: (DeskTemplate | {})[][]): (DeskTemplate | {})[][] {
  let studentNumber: number = 0
  const newSeating: (DeskTemplate | {})[][] = deepCopyDeskLayout(desks)
  const sS: StudentObj[] = sortStudents(students)
  for (let j = 0; j < newSeating[0].length; j++) {
    for (let i = 0; i < newSeating.length; i++) {
      if (Object.keys(newSeating[i][j]).length > 0){
        if (isDeskTemplate(newSeating[i][j])) {
          newSeating[i][j] = sS[studentNumber]
          studentNumber++
        }  
      }
    }
  }
  return newSeating

}

function seatingReducer(seating: SeatingAssignment, action: AssignAction): SeatingAssignment {
  switch (action.type) {
    case 'default_seating': {
      return {
        desks: getDefaultSeating(action.students, action.desks)
      } 
    }

    default:
      return seating
  }
}

function SeatAssignModal({ students, desks } : AssignSeatProps) {
  const [seating, dispatchAssignment] = useReducer<(seating: SeatingAssignment, action: AssignAction) => SeatingAssignment>(seatingReducer, {desks: desks})

  useEffect(() => {
    dispatchAssignment({type: 'default_seating', students, desks})
  }, [students, desks])
  return (
    <div>SeatAssignModal</div>
  )
}

export default SeatAssignModal