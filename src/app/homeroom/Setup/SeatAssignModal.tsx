import React, { useEffect, useMemo, useReducer, useRef } from 'react'
import { Button, Card, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { insertSort, sortStudents, Student } from '../../../lib/StudentObj'
import { DeskLayoutTemplate, DeskTemplate, SeatingPlan } from '../../../lib/SeatingPlan'
import { deepCopyDeskLayout, getCellUsage, isDeskTemplate } from '../../../util/deskLayout'
import { assert } from 'console'

interface AssignSeatProps {
  isOpen: boolean
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full' | undefined
  students: Student []
  desks: (DeskTemplate | {})[][]
  onBackPressed?: () => void
  onFinishPressed: (seatingPlan: SeatingPlan) => void
  onCancel: () => void
}

interface SeatingAssignment {
  desks: (DeskTemplate | {})[][]
  students: Student[]
  draggedStudentInfo?: {
    student: Student
    studentIndex: number
    deskRow: number
    deskColumn: number
  } | undefined
  displacedStudentInfo?: {
    student?: Student
    studentIndex?: number
    deskRow: number
    deskColumn: number
  } | undefined
  sourcePreview?: {
    student?: Student
    studentIndex?: number
    deskRow: number
    deskColumn: number
  } | undefined
  destinationPreview?: {
    student: Student
    studentIndex: number
    deskRow: number
    deskColumn: number
  } | undefined
  draggingOver: boolean
  unnassignedArrayIndex?: number
  
  unassignedStudents: Student[]
}

type AssignAction = 
  | {type: 'default_seating', students: Student[], desks: (DeskTemplate | {})[][]}
  | {
      type: 'move_start'
      studentIndex: number
      deskRow: number
      deskColumn: number
    }
  | { type: 'move_cancel' }
  | { 
      type: 'move_over_desk'
      destinationStudentIndex?: number
      destinationDeskRow: number
      destinationDeskColumn: number
    }
  | { type: 'move_outside_desk' }
  | { type: 'move_over_unnassigned_area', unnassignedStudentsIndex: number }
  | { type: 'move_outside_unnassigned_area' }
  | { 
      type: 'move_finalize'
      sourceDeskInfo: {
        student: Student
        studentIndex: number
        deskRow: number
        deskColumn: number
      } 
      destinationStudentIndex?: number
      destinationDeskRow: number
      destinationDeskColumn: number
    }

function getDefaultSeating(students: Student[], desks: (DeskTemplate | {})[][]): (DeskTemplate | {})[][] {
  let studentNumber: number = 0
  const newSeating: (DeskTemplate | {})[][] = deepCopyDeskLayout(desks)
  for (let j = 0; j < newSeating[0].length; j++) {
    for (let i = 0; i < newSeating.length; i++) {
      const obj: DeskTemplate | {} = newSeating[i][j]
      if (isDeskTemplate(obj) && obj.assign && students[studentNumber]) {
        obj.assignedTo = students[studentNumber]
        obj.studentIndex = studentNumber 
        obj.assignmentConfirmed = true
        studentNumber++
      }
    }
  }
  return newSeating

}

function deepCopyState(state: SeatingAssignment): SeatingAssignment {
  const stateCopy: SeatingAssignment = {...state}
  stateCopy.desks = deepCopyDeskLayout(state.desks)
  if (state.draggedStudentInfo)
    stateCopy.draggedStudentInfo = {...state.draggedStudentInfo}
  if (state.displacedStudentInfo)
    stateCopy.displacedStudentInfo = {...state.displacedStudentInfo}
  if (state.sourcePreview)
    stateCopy.sourcePreview = {...state.sourcePreview}
  if (state.destinationPreview)
    stateCopy.destinationPreview = {...state.destinationPreview}
  stateCopy.students = [...state.students]
  stateCopy.unassignedStudents = [...state.unassignedStudents]
  stateCopy.unnassignedArrayIndex = state.unnassignedArrayIndex
  stateCopy.draggingOver = state.draggingOver
  return stateCopy
}

function seatingReducer(seating: SeatingAssignment, action: AssignAction): SeatingAssignment {
  switch (action.type) {
    case 'default_seating': {
      return {
        desks: getDefaultSeating(action.students, action.desks),
        students: action.students,
        unassignedStudents: [],
        draggingOver: false
      } 
    }

    case 'move_start' : {
      const newSeatingAssignment: SeatingAssignment = deepCopyState(seating)
      const sourceDesk: DeskTemplate | {} = newSeatingAssignment.desks[action.deskRow][action.deskColumn]
      if (isDeskTemplate(sourceDesk)) {
        sourceDesk.assignmentConfirmed = false
      }

      // se the info of the student being dragged
      newSeatingAssignment.draggedStudentInfo = {
        deskRow: action.deskRow,
        deskColumn: action.deskColumn,
        studentIndex: action.studentIndex,
        student: newSeatingAssignment.students[action.studentIndex]
      }

      // set the desk preview to be the seat without a student
      newSeatingAssignment.sourcePreview = {
        deskRow: action.deskRow,
        deskColumn: action.deskColumn
      }
      return newSeatingAssignment
    }

    case 'move_cancel' : {
      const newSeatingAssignment: SeatingAssignment = deepCopyState(seating)

    // put student back
    // wipe the sourceDeskInfo and destinationDeskInfo
      newSeatingAssignment.draggedStudentInfo = undefined
      newSeatingAssignment.displacedStudentInfo = undefined
      newSeatingAssignment.sourcePreview = undefined
      newSeatingAssignment.destinationPreview = undefined
      newSeatingAssignment.draggingOver = false
      return newSeatingAssignment
    }

    case 'move_over_desk' : {
      // may have been triggered as part of drag start

      // deep copy state
      const newSeatingAssignment: SeatingAssignment = deepCopyState(seating)

      // has dragEnter fired previously? Is so, students have already been swapped so don't do a thing!
      if(!newSeatingAssignment.draggingOver){
        // check that there is a student being dragged and if that student is being dragged over their own desk
        if (newSeatingAssignment.draggedStudentInfo && newSeatingAssignment.draggedStudentInfo.studentIndex !== action.destinationStudentIndex){
          newSeatingAssignment.draggingOver = true
          // store student info from destination desk
          newSeatingAssignment.displacedStudentInfo = {
            studentIndex: action.destinationStudentIndex,
            deskRow: action.destinationDeskRow,
            deskColumn: action.destinationDeskColumn
          }
          let swappedStudent: Student | undefined = undefined
          if (action.destinationStudentIndex !== undefined && newSeatingAssignment.sourcePreview !== undefined){

            newSeatingAssignment.displacedStudentInfo.student = seating.students[action.destinationStudentIndex]

            newSeatingAssignment.sourcePreview.studentIndex = action.destinationStudentIndex
            newSeatingAssignment.sourcePreview.student = seating.students[action.destinationStudentIndex]
          }

          newSeatingAssignment.destinationPreview = {
            deskRow: action.destinationDeskRow,
            deskColumn: action.destinationDeskColumn,
            studentIndex: newSeatingAssignment.draggedStudentInfo.studentIndex,
            student: newSeatingAssignment.draggedStudentInfo.student
          }            
        }
      }
      return newSeatingAssignment
    }

    case 'move_outside_desk' : {
      // deep copy state
      const newSeatingAssignment: SeatingAssignment = deepCopyState(seating)

      // we should have both dragged and swapped student info, just need to check 

      if(newSeatingAssignment.draggingOver){
        newSeatingAssignment.draggingOver = false

        if( newSeatingAssignment.draggedStudentInfo  !== undefined && newSeatingAssignment.displacedStudentInfo !== undefined){
          newSeatingAssignment.displacedStudentInfo = undefined
          newSeatingAssignment.destinationPreview = undefined
          if (newSeatingAssignment.sourcePreview?.student !== undefined && newSeatingAssignment.sourcePreview.studentIndex !== undefined){
            newSeatingAssignment.sourcePreview.student = undefined
            newSeatingAssignment.sourcePreview.studentIndex = undefined
          }
        }
      }
      return newSeatingAssignment
    }

    case 'move_finalize' : {
      // deep copy state
      const newSeatingAssignment: SeatingAssignment = deepCopyState(seating)

        // check that there is a student being dragged and if that student is being dragged over their own desk
      if (action.sourceDeskInfo.studentIndex !== action.destinationStudentIndex){
        // store student info from destination desk
        newSeatingAssignment.displacedStudentInfo = {
          studentIndex: action.destinationStudentIndex,
          deskRow: action.destinationDeskRow,
          deskColumn: action.destinationDeskColumn
        }
        let swappedStudent: Student | undefined = undefined
        if (action.destinationStudentIndex !== undefined){
          swappedStudent = seating.students[action.destinationStudentIndex]
          newSeatingAssignment.displacedStudentInfo.student = swappedStudent
        }

        // setting placeholder vars for type guarding
        const sourceDesk: DeskTemplate | {} = 
          newSeatingAssignment.desks
            [action.sourceDeskInfo.deskRow]
            [action.sourceDeskInfo.deskColumn]
        const destinationDesk: DeskTemplate | {} = 
          newSeatingAssignment.desks
            [action.destinationDeskRow]
            [action.destinationDeskColumn]
        
        if(isDeskTemplate(sourceDesk) && isDeskTemplate(destinationDesk)){
          // perform swap
          sourceDesk.assignedTo = swappedStudent ? swappedStudent : undefined
          sourceDesk.studentIndex = swappedStudent ? action.destinationStudentIndex : undefined

          destinationDesk.assignedTo = action.sourceDeskInfo.student
          destinationDesk.studentIndex = action.sourceDeskInfo.studentIndex
          destinationDesk.assignmentConfirmed = true
          sourceDesk.assignmentConfirmed = true
        }

        // wipe preview states
        newSeatingAssignment.draggingOver = false
        newSeatingAssignment.draggedStudentInfo = undefined
        newSeatingAssignment.displacedStudentInfo = undefined
        newSeatingAssignment.sourcePreview = undefined
        newSeatingAssignment.destinationPreview = undefined

        return newSeatingAssignment
      }
    }

    case 'move_over_unnassigned_area': {
      // deep copy state
      const newSeatingAssignment: SeatingAssignment = {...seating}
      newSeatingAssignment.desks = deepCopyDeskLayout(seating.desks)
      if (seating.draggedStudentInfo)
        newSeatingAssignment.draggedStudentInfo = {...seating.draggedStudentInfo}
      newSeatingAssignment.unassignedStudents = {...seating.unassignedStudents}

      if (seating.draggedStudentInfo){
        [newSeatingAssignment.unnassignedArrayIndex, newSeatingAssignment.unassignedStudents] = 
          insertSort(seating.draggedStudentInfo.student, seating.unassignedStudents)
      }
      return newSeatingAssignment
    }
    case 'move_outside_unnassigned_area': {
      // deep copy state
      const newSeatingAssignment: SeatingAssignment = {...seating}
      newSeatingAssignment.desks = deepCopyDeskLayout(seating.desks)
      if (seating.draggedStudentInfo)
        newSeatingAssignment.draggedStudentInfo = {...seating.draggedStudentInfo}
      if (seating.unnassignedArrayIndex)
      newSeatingAssignment.unassignedStudents.splice(seating.unnassignedArrayIndex, 1)
      newSeatingAssignment.unnassignedArrayIndex = undefined
    }

    default:
      return seating
  }
}


function SeatAssignModal({ isOpen, size, students, desks, onBackPressed, onFinishPressed, onCancel } : AssignSeatProps) {
  const [seating, dispatchAssignment] = useReducer<(seating: SeatingAssignment, action: AssignAction) => SeatingAssignment>(seatingReducer, {desks: desks, unassignedStudents: [], students: students, draggingOver: false})

  useEffect(() => {
    dispatchAssignment({type: 'default_seating', students: students, desks: desks})
  }, [desks])

  const deskCards: JSX.Element[] = getDesksDisplay(seating.desks)

  function getDesksDisplay(desks: (DeskTemplate | {})[][]): JSX.Element[] {
    const deskDisplay: JSX.Element[] = []
      for (let colIndex = 0; colIndex < desks[0].length; colIndex++) {
        for (let rowIndex = 0; rowIndex < desks.length; rowIndex++){
          const template: DeskTemplate | {} = desks[rowIndex][colIndex]
          if (isDeskTemplate(template)){
            deskDisplay.push((
              <Card 
                key={'desk [' + rowIndex + ', ' + colIndex + ']' }
                className={`col-start-${colIndex + 1} row-start-${desks.length - rowIndex} min-h-32`}
                onDragOver={handleDragOverDesk(seating.draggedStudentInfo, rowIndex, colIndex, template.studentIndex)}
                onDragEnter={handleDragIntoDesk(seating.draggedStudentInfo, rowIndex, colIndex, template.studentIndex)}
                onDrop={handleDrop(rowIndex, colIndex, template.studentIndex)}
                style={{minHeight: 128}}
              >
                {
                  // check if this desk is assigned to someone, and put a chip in if so.
                  template.assignedTo && template.studentIndex !== undefined ? (
                    <Chip
                      draggable
                      onDragStart={handleDrag(template.studentIndex, template.row, template.column)}
                      onDragEnd={handleDragEnd()}
                    >
                      {template.assignedTo.familyNames[0].nameToken.ja}　{template.assignedTo.givenNames[0].nameToken.ja}
                    </Chip>
                  ) : undefined
                  // check if a chip is being dragged over, 
                }
              </Card>
            ))
          }
        }  
      }
    return deskDisplay
  }
  

  function handleDrag(studentIndex: number, deskRow: number, deskColumn: number) {
    return (event: React.DragEvent) => {
      const transferObject = {
        student: students[studentIndex],
        studentIndex: studentIndex,
        deskRow: deskRow,
        deskColumn: deskColumn
      }
      event.dataTransfer.setData('text/plain', JSON.stringify(transferObject))
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      console.log("Drag Start Fired")
      console.log(JSON.stringify(transferObject, null, 2))
      dispatchAssignment({
        type: 'move_start',
        studentIndex: studentIndex,
        deskRow: deskRow,
        deskColumn: deskColumn
      })    
    }
  }
  
  function handleDragOverDesk(
    sourceDeskInfo: {
      student: Student
      studentIndex: number
      deskRow: number
      deskColumn: number
    } | undefined,
    destinationDeskRow: number,
    destinationDeskColumn: number,
    destinationStudentIndex?: number
  ) {
    return (event: React.DragEvent) => {
      if (!event.isDefaultPrevented() && sourceDeskInfo && destinationStudentIndex !== sourceDeskInfo.studentIndex) {
        event.stopPropagation()
        event.preventDefault()
      }
    }
  }


  function handleDragIntoDesk(
    sourceDeskInfo: {
      student: Student
      studentIndex: number
      deskRow: number
      deskColumn: number
    } | undefined,
    destinationDeskRow: number,
    destinationDeskColumn: number,
    destinationStudentIndex?: number
  ) {
    return (event: React.DragEvent) => {
      if (!event.isDefaultPrevented() && sourceDeskInfo && destinationStudentIndex !== sourceDeskInfo.studentIndex) {
        event.stopPropagation()
        console.log("Drag Enter Fired")
        dispatchAssignment({
          type: 'move_over_desk',
          destinationStudentIndex: destinationStudentIndex,
          destinationDeskRow: destinationDeskRow,
          destinationDeskColumn: destinationDeskColumn
        })      
      }
    }
  }
  
  function handleDragOutOfDesk() {
    return (event: React.DragEvent) => {
      event.stopPropagation()
      // event.preventDefault()
      console.log("Drag Leave Fired")
      dispatchAssignment({type: 'move_outside_desk'})
    }
  }
  function handleDragEnd() {
    return (event: React.DragEvent) => {
      event.stopPropagation()
      dispatchAssignment({type: 'move_cancel'})
    }
  }

  function handleDrop(
    destinationDeskRow: number,
    destinationDeskColumn: number,
    destinationStudentIndex?: number
  ) {
    return (event: React.DragEvent) => {
      event.preventDefault()
      event.stopPropagation()
      const data = JSON.parse(event.dataTransfer.getData('text/plain'))

      // TODO validate data
      console.log("Drop Fired")
      dispatchAssignment({
        type: 'move_finalize',
        sourceDeskInfo: data,
        destinationStudentIndex: destinationStudentIndex,
        destinationDeskRow: destinationDeskRow,
        destinationDeskColumn: destinationDeskColumn
      })
    }
  }

  return (
    <>
    <Modal id='assign-desks' isOpen={isOpen} size={size} onClose={onCancel}>
      <ModalContent>
        <ModalHeader>
          Assign Desks
        </ModalHeader>
        <ModalBody >
          <div 
            className={`desk-plan grid gap-10 grid-rows-${seating.desks.length} grid-cols-${seating.desks[0].length} p-10`}
            onDragEnter={handleDragOutOfDesk()}
          >
            {deskCards}
          </div>
          <div>
            {/* staging area for students not assigned desks */}
          </div>
        </ModalBody>
        <ModalFooter>
          {
            onBackPressed ?
              <Button color='primary' onPress={() => {
                onBackPressed()
              }}>
                Back
              </Button>
            : undefined
          }
          <Button color='primary' onPress={() => {
            onFinishPressed({
              students: seating.students,
              deskAt: seating.desks
            })
          }}>
            Finish
          </Button>
          <Button color='danger' onPress={() => onCancel()}>
            Cancel
          </Button>
        </ModalFooter>

      </ModalContent>

    </Modal>
    <div style={{height: 100}}></div>
    <div className='grid grid-rows-3 grid-cols-2'>
      <div className='row-start-1 col-start-1'>
        <br/>
        **** Student Being Dragged ****<br/>
        {JSON.stringify(seating.draggedStudentInfo)}
      </div>
      <div className='row-start-1 col-start-2'>
        <br/>**** Displaced Student ****<br/>
        {JSON.stringify(seating.displacedStudentInfo)}
      </div>
      <div className='row-start-2 col-start-1'>
        <br/>**** Source Desk Preview Data ****<br/>
        {JSON.stringify(seating.sourcePreview)}
      </div>
      <div className='row-start-2 col-start-2'>
        <br/>**** Destination Desk Preview Data ****<br/>
        {JSON.stringify(seating.destinationPreview)}
      </div>
      <div className='row-start-3'>
        <br/>{JSON.stringify('Over valid drop target:' + seating.draggingOver)}
      </div>
    </div>
    </>
  )
}

export default SeatAssignModal