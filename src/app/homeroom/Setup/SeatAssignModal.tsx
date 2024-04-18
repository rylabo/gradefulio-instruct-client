import React, { useEffect, useReducer } from 'react'
import { Button, Card, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { Student } from '../../../lib/StudentObj'
import { DeskTemplate } from '../../../lib/SeatingPlan'
import { deepCopyDeskLayout, getCellUsage, isDeskTemplate } from '../../../util/deskLayout'
import { assert } from 'console'

interface AssignSeatProps {
  isOpen: boolean
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full' | undefined
  students: Student []
  desks: (DeskTemplate | {})[][]
}

interface SeatingAssignment {
  desks: (DeskTemplate | {})[][]
  students: Student[]
  sourceDeskInfo?: {
    student: Student
    studentIndex: number
    deskRow: number
    deskColumn: number
  } | undefined
  destinationDeskInfo?: {
    student?: Student
    studentIndex?: number
    deskRow: number
    deskColumn: number
  } | undefined
  unnassignedArrayIndex?: number
  
  unassignedStudents: Student[]
}

type AssignAction = 
  | {type: 'default_seating', students: Student[], desks: (DeskTemplate | {})[][]}
  | {type: 'move_start'
      studentIndex: number
      deskRow: number
      deskColumn: number
    }
  | { type: 'move_cancel' }
  | { type: 'move_over_desk'
      destinationStudentIndex?: number
      destinationDeskRow: number
      destinationDeskColumn: number
    }
  | { type: 'move_outside_desk' }
  | { type: 'move_over_unnassigned_area', unnassignedStudentsIndex: number }
  | { type: 'move_outside_unnassigned_area' }
  | { type: 'move_finalize' }


function nameCompareStudents(a: Student, b:Student): number {
  if (a.familyNames[0].annotation > b.familyNames[0].annotation) return 1
  else if (a.familyNames[0].annotation < b.familyNames[0].annotation) return -1
  else if (a.givenNames[0].annotation > b.givenNames[0].annotation) return 1  
  else if (a.givenNames[0].annotation < b.givenNames[0].annotation) return -1
  else if (a.familyNames[0].nameToken.ja > b.familyNames[0].nameToken.ja) return 1
  else if (a.givenNames[0].nameToken.ja < b.givenNames[0].nameToken.ja) return -1
  else if (a.givenNames[0].nameToken.ja > b.givenNames[0].nameToken.ja) return 1
  return 0
}
  
function insertSort(student: Student, array: Student[]): [number, Student[]] {

  // find the index
  const newArray: Student[] = {...array}
  let index: number = 0
  while (index < newArray.length && nameCompareStudents(student, newArray[index]) <= 0) index++

  // insert at index there
  newArray.splice(index, 0, student)
  return [index, newArray]
}

function compareStudents(a: Student, b: Student): number {

  // attendance numbers before names.
  if (!a.attendanceNumber && b.attendanceNumber) return 1
  else if (a.attendanceNumber && !b.attendanceNumber) return -1

  else if (a.attendanceNumber && b.attendanceNumber) {
    if (a.attendanceNumber > b.attendanceNumber) return 1
    else if (a.attendanceNumber < b.attendanceNumber) return -1
    else return 0
  }

  else return nameCompareStudents(a, b)
}

function sortStudents(students: Student[]): Student[] {
  return students.toSorted(compareStudents)
}

function nameSortStudents(students: Student[]): Student[] {
  return students.toSorted(nameCompareStudents)
}

function getDefaultSeating(students: Student[], desks: (DeskTemplate | {})[][]): (DeskTemplate | {})[][] {
  let studentNumber: number = 0
  const newSeating: (DeskTemplate | {})[][] = deepCopyDeskLayout(desks)
  const sS: Student[] = sortStudents(students)
  for (let j = 0; j < newSeating[0].length; j++) {
    for (let i = 0; i < newSeating.length; i++) {
      const obj: DeskTemplate | {} = newSeating[i][j]
      if (isDeskTemplate(obj) && obj.assign && sS[studentNumber]) {
        obj.assignedTo = sS[studentNumber]
        obj.studentIndex = studentNumber
        obj.assignmentConfirmed = true
        studentNumber++
      }
    }
  }
  return newSeating

}

function seatingReducer(seating: SeatingAssignment, action: AssignAction): SeatingAssignment {
  switch (action.type) {
    case 'default_seating': {
      return {
        desks: getDefaultSeating(action.students, action.desks),
        students: action.students,
        unassignedStudents: []
      } 
    }

    case 'move_start' : {
      const newSeatingAssignment: SeatingAssignment = {...seating}
      newSeatingAssignment.desks = deepCopyDeskLayout(seating.desks)
      newSeatingAssignment.sourceDeskInfo = {
        student: seating.students[action.studentIndex],
        studentIndex: action.studentIndex,
        deskRow: action.deskRow,
        deskColumn: action.deskColumn
      }
      const sourceDesk: DeskTemplate | {} = newSeatingAssignment.desks[action.deskRow][action.deskColumn]
      if (isDeskTemplate(sourceDesk)){
        sourceDesk.assignedTo = undefined
        sourceDesk.studentIndex = undefined
        sourceDesk.assignmentConfirmed = false
      } 
      return newSeatingAssignment
    }

    case 'move_cancel' : {
      const newSeatingAssignment: SeatingAssignment = {...seating}
      newSeatingAssignment.desks = deepCopyDeskLayout(seating.desks)
      if (seating.sourceDeskInfo) {
        newSeatingAssignment.sourceDeskInfo = {...seating.sourceDeskInfo}
      }

      // put student back
      if (newSeatingAssignment.sourceDeskInfo){
        const sourceDesk: DeskTemplate | {} =
          newSeatingAssignment.desks[newSeatingAssignment.sourceDeskInfo.deskRow][newSeatingAssignment.sourceDeskInfo.deskColumn]
        if (isDeskTemplate(sourceDesk)){
          sourceDesk.assignedTo = newSeatingAssignment.sourceDeskInfo.student
          sourceDesk.studentIndex = newSeatingAssignment.sourceDeskInfo.studentIndex
        }

        // wipe the sourceDeskInfo
        newSeatingAssignment.sourceDeskInfo = undefined
      }
      return newSeatingAssignment
    }

    case 'move_over_desk' : {
      // deep copy state
      const newSeatingAssignment: SeatingAssignment = {...seating}
      newSeatingAssignment.desks = deepCopyDeskLayout(seating.desks)
      if (seating.sourceDeskInfo)
        newSeatingAssignment.sourceDeskInfo = {...seating.sourceDeskInfo}

      // store student info from destination desk
      newSeatingAssignment.destinationDeskInfo = {
        studentIndex: action.destinationStudentIndex,
        deskRow: action.destinationDeskRow,
        deskColumn: action.destinationDeskColumn
      }
      let swappedStudent: Student | undefined = undefined
      if (action.destinationStudentIndex){
        swappedStudent = seating.students[action.destinationStudentIndex]
        newSeatingAssignment.destinationDeskInfo.student = swappedStudent
      }

      if(seating.sourceDeskInfo  !== undefined){
        // setting placeholder vars for type guarding
        const sourceDesk: DeskTemplate | {} = 
          newSeatingAssignment.desks
            [seating.sourceDeskInfo.deskRow]
            [seating.sourceDeskInfo.deskColumn]
        const destinationDesk: DeskTemplate | {} = 
          newSeatingAssignment.desks
            [action.destinationDeskRow]
            [action.destinationDeskColumn]
        
        if(isDeskTemplate(sourceDesk) && isDeskTemplate(destinationDesk)){
          // perform swap
          destinationDesk.assignedTo = seating.sourceDeskInfo.student
          destinationDesk.studentIndex = seating.sourceDeskInfo.studentIndex
          destinationDesk.assignmentConfirmed = false
          if (swappedStudent){
            sourceDesk.assignedTo = swappedStudent
            sourceDesk.studentIndex = action.destinationStudentIndex
            sourceDesk.assignmentConfirmed = false
          }
        }
      }
      return newSeatingAssignment
    }

    case 'move_outside_desk' : {
      // deep copy state
      const newSeatingAssignment: SeatingAssignment = {...seating}
      newSeatingAssignment.desks = deepCopyDeskLayout(seating.desks)
      if (seating.sourceDeskInfo)
        newSeatingAssignment.sourceDeskInfo = {...seating.sourceDeskInfo}
      if (seating.destinationDeskInfo)
        newSeatingAssignment.destinationDeskInfo = {...seating.destinationDeskInfo}

      // we should have both dragged and swapped student info, just need to check 

      if( seating.sourceDeskInfo  !== undefined && seating.destinationDeskInfo !== undefined){
        // type guarding
        const sourceDesk: DeskTemplate | {} = 
          newSeatingAssignment.desks
            [seating.sourceDeskInfo.deskRow]
            [seating.sourceDeskInfo.deskColumn]
        const destinationDesk: DeskTemplate | {} = 
          newSeatingAssignment.desks
          [seating.destinationDeskInfo.deskRow]
          [seating.destinationDeskInfo.deskColumn]
      
        if(isDeskTemplate(sourceDesk) && isDeskTemplate(destinationDesk)){
          // undo swap
          destinationDesk.assignedTo = seating.destinationDeskInfo.student
          destinationDesk.studentIndex = seating.destinationDeskInfo.studentIndex
          destinationDesk.assignmentConfirmed = true
          sourceDesk.assignedTo = seating.sourceDeskInfo.student
          sourceDesk.studentIndex = seating.sourceDeskInfo.studentIndex
          sourceDesk.assignmentConfirmed = true

          // wipe swappedStudentInfo
          newSeatingAssignment.destinationDeskInfo = undefined
        }
      }
      return newSeatingAssignment
    }

    case 'move_finalize' : {
      if( seating.sourceDeskInfo  !== undefined && seating.destinationDeskInfo !== undefined){
        const sourceDesk: DeskTemplate | {} = seating.desks[seating.sourceDeskInfo.deskRow][seating.sourceDeskInfo.deskColumn]
        const destinationDesk: DeskTemplate | {} = seating.desks[seating.destinationDeskInfo.deskRow][seating.destinationDeskInfo.deskColumn]

        // confirm seating
        if (isDeskTemplate(sourceDesk)) 
          sourceDesk.assignmentConfirmed = true
        if (isDeskTemplate(destinationDesk)) 
          destinationDesk.assignmentConfirmed = true
      }

      // wipe draggedStudentInfo and swappedStudentInfo
      seating.sourceDeskInfo = undefined
      seating.destinationDeskInfo = undefined

      return seating
    }

    case 'move_over_unnassigned_area': {
      // deep copy state
      const newSeatingAssignment: SeatingAssignment = {...seating}
      newSeatingAssignment.desks = deepCopyDeskLayout(seating.desks)
      if (seating.sourceDeskInfo)
        newSeatingAssignment.sourceDeskInfo = {...seating.sourceDeskInfo}
      newSeatingAssignment.unassignedStudents = {...seating.unassignedStudents}

      if (seating.sourceDeskInfo){
        [newSeatingAssignment.unnassignedArrayIndex, newSeatingAssignment.unassignedStudents] = 
          insertSort(seating.sourceDeskInfo.student, seating.unassignedStudents)
      }
      return newSeatingAssignment
    }
    case 'move_outside_unnassigned_area': {
      // deep copy state
      const newSeatingAssignment: SeatingAssignment = {...seating}
      newSeatingAssignment.desks = deepCopyDeskLayout(seating.desks)
      if (seating.sourceDeskInfo)
        newSeatingAssignment.sourceDeskInfo = {...seating.sourceDeskInfo}
      if (seating.unnassignedArrayIndex)
      newSeatingAssignment.unassignedStudents.splice(seating.unnassignedArrayIndex, 1)
      newSeatingAssignment.unnassignedArrayIndex = undefined
    }

    default:
      return seating
  }
}


function SeatAssignModal({ isOpen, size, students, desks } : AssignSeatProps) {
  const [seating, dispatchAssignment] = useReducer<(seating: SeatingAssignment, action: AssignAction) => SeatingAssignment>(seatingReducer, {desks: desks, unassignedStudents: [], students: students})

  useEffect(() => {
    dispatchAssignment({type: 'default_seating', students: students, desks: desks})
  }, [students, desks])
  

  function getDesksDisplay(desks: (DeskTemplate | {})[][]): JSX.Element[] {
    const deskDisplay: JSX.Element[] = []
      for (let colIndex = 0; colIndex < desks[0].length; colIndex++) {
        for (let rowIndex = 0; rowIndex < desks.length; rowIndex++){
          const template: DeskTemplate | {} = desks[rowIndex][colIndex]
          if (isDeskTemplate(template)){
            if(template.assignedTo && template.studentIndex !== undefined){
              deskDisplay.push((
              <Card 
                key={'desk [' + rowIndex + ', ' + colIndex + ']' }
                className={`col-start-${colIndex + 1} row-start-${desks.length - rowIndex} min-h-32`}
                onDragEnter={handleDragOverDesk(rowIndex, colIndex, template.studentIndex)}
                onDragLeave={handleDragOutOfDesk()}
                style={{minHeight: 128}}
              >
                <Chip
                  draggable
                  onDrag={handleDrag(template.studentIndex, rowIndex, colIndex)}
                  onDragEnd={handleDragEnd()}
                >
                  {template.assignedTo.familyNames[0].nameToken.ja}　{template.assignedTo.givenNames[0].nameToken.ja}
                </Chip>
              </Card>))
            }
            else {
              deskDisplay.push((
              <Card 
                key={'desk [' + rowIndex + ', ' + colIndex + ']'}
                className={`col-start-${colIndex + 1} row-start-${desks.length - rowIndex}`}
                onDragEnter={handleDragOverDesk(rowIndex, colIndex, template.studentIndex)}
                onDragLeave={handleDragOutOfDesk()}
                style={{minHeight: 128}}
              >
              </Card>))
            }
          }
        }  
      }
    return deskDisplay
  }
  

  function handleDrag(studentIndex: number, deskRow: number, deskColumn: number) {
    return (event: React.DragEvent) => {
      dispatchAssignment({
        type: 'move_start',
        studentIndex: studentIndex,
        deskRow: deskRow,
        deskColumn: deskColumn
      })    
    }
  }
  
  function handleDragOverDesk(
    destinationDeskRow: number,
    destinationDeskColumn: number,
    destinationStudentIndex?: number
  ) {
    return (event: React.DragEvent) => {
      dispatchAssignment({
        type: 'move_over_desk',
        destinationStudentIndex: destinationStudentIndex,
        destinationDeskRow: destinationDeskRow,
        destinationDeskColumn: destinationDeskColumn
      })    
    }
  }

  function handleDragOutOfDesk() {
    return (event: React.DragEvent) => {
      dispatchAssignment({type: 'move_outside_desk'})
    }
  }
  function handleDragEnd() {
    return (event: React.DragEvent) => {
      dispatchAssignment({type: 'move_cancel'})
    }
  }

  return (
    <Modal id='assign-desks' isOpen={isOpen} size={size}>
      <ModalContent>
        <ModalHeader>
          Assign Desks
        </ModalHeader>
        <ModalBody >
          <div className={`desk-plan grid gap-10 grid-rows-${seating.desks.length} grid-cols-${seating.desks[0].length}`}>
            {getDesksDisplay(seating.desks)}
          </div>
          <div>
            {/* staging area for students not assigned desks */}
          </div>
        </ModalBody>
        <ModalFooter>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SeatAssignModal