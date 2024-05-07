import React, { useEffect, useReducer } from 'react'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { insertSort, insertSortReferences, Student } from '../../../lib/StudentObj'
import { AssignedDeskInfo, DeskTemplate, SeatingPlan, SeatingPlusPreview, StudentReference } from '../../../lib/SeatingPlan'
import { deepCopyDeskLayout, isDeskTemplate } from '../../../util/deskLayout'
import SeatAssignPanel from './SeatAssignPanel'
import UnassignedPanel from './UnassignedPanel'


function getDefaultSeating(students: Student[], desks: (DeskTemplate | {})[][]): [(DeskTemplate | {})[][], StudentReference[]] {
  let studentNumber: number = 0
  const newSeating: (DeskTemplate | {})[][] = deepCopyDeskLayout(desks)
  const unassignedSeating: StudentReference[] = []
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

  for (studentNumber; studentNumber < students.length; studentNumber++) {
    unassignedSeating.push({
      student: students[studentNumber],
      studentIndex: studentNumber
    })
  }
  return [newSeating, unassignedSeating]
}

function deepCopyState(state: SeatingPlusPreview): SeatingPlusPreview {
  const stateCopy: SeatingPlusPreview = {...state}
  stateCopy.desks = deepCopyDeskLayout(state.desks)
  if (state.draggedStudentInfo)
    stateCopy.draggedStudentInfo = {...state.draggedStudentInfo}    // do Insert Sort here

  stateCopy.students = [...state.students]
  stateCopy.unassignedStudents = [...state.unassignedStudents]
  stateCopy.unnassignedArrayIndex = state.unnassignedArrayIndex
  stateCopy.draggingOver = state.draggingOver
  return stateCopy
}

type AssignAction = 
  | {type: 'default_seating', students: Student[], desks: (DeskTemplate | {})[][]}
  | {type: 'desk_reassignment', students: Student[], desks: (DeskTemplate | {})[][], unassignedStudents: Student[]} 
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
      sourceDeskInfo: AssignedDeskInfo
      destinationStudentIndex?: number
      destinationDeskRow: number
      destinationDeskColumn: number
    }

function seatingReducer(seating: SeatingPlusPreview, action: AssignAction): SeatingPlusPreview {
  switch (action.type) {
    case 'default_seating': {
      const newSeatingAssignment: SeatingPlusPreview = deepCopyState(seating)
      const [desks, unassignedStudent] = getDefaultSeating(action.students, action.desks)
      newSeatingAssignment.desks = desks
      newSeatingAssignment.students = action.students
      newSeatingAssignment.unassignedStudents = unassignedStudent
      return newSeatingAssignment
    }

    case 'move_start' : {
      const newSeatingAssignment: SeatingPlusPreview = deepCopyState(seating)

      // set the info of the student being dragged
      newSeatingAssignment.draggedStudentInfo = {
        deskRow: action.deskRow,
        deskColumn: action.deskColumn,
        studentIndex: action.studentIndex,
        student: seating.students[action.studentIndex]
      }

      // set the desk preview to be the seat without a student
      newSeatingAssignment.sourcePreview = {
        deskRow: action.deskRow,
        deskColumn: action.deskColumn
      }
      return newSeatingAssignment
    }

    case 'move_cancel' : {
      const newSeatingAssignment: SeatingPlusPreview = deepCopyState(seating)

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
      const newSeatingAssignment: SeatingPlusPreview = deepCopyState(seating)

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
      const newSeatingAssignment: SeatingPlusPreview = deepCopyState(seating)

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
      const newSeatingAssignment: SeatingPlusPreview = deepCopyState(seating)

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

        // check if this is an unassigned student
        if (action.sourceDeskInfo.deskRow >= 0 && action.destinationDeskRow >= 0) {
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
          }  
        } else if (action.sourceDeskInfo.deskRow < 0 && action.destinationDeskRow >= 0){
          // student is being dropped from staging area to a desk
          const destinationDesk: DeskTemplate | {} = 
            newSeatingAssignment.desks
              [action.destinationDeskRow]
              [action.destinationDeskColumn]

          if (isDeskTemplate(destinationDesk)) {
            newSeatingAssignment.unassignedStudents.splice(action.sourceDeskInfo.deskColumn, 1)
            if (swappedStudent && action.destinationStudentIndex !== undefined) {
              // unnassigned student has been dropped on a desk occupied by a student
              const [unassignedIndex, unassignedStudents] = insertSortReferences(
                { student: swappedStudent, studentIndex: action.destinationStudentIndex },
                newSeatingAssignment.unassignedStudents
              )
              newSeatingAssignment.unassignedStudents = unassignedStudents
            }

            destinationDesk.assignedTo = action.sourceDeskInfo.student
            destinationDesk.studentIndex = action.sourceDeskInfo.studentIndex
          }
        } else if (action.sourceDeskInfo.deskRow >= 0 && action.destinationDeskRow < 0){
          // TODO implement drag from desk to staging area for unassigned students
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

    // case 'move_over_unnassigned_area': {
    //   const newSeatingAssignment: SeatingPlusPreview = deepCopyState(seating)

    //   if (seating.draggedStudentInfo){
    //     [newSeatingAssignment.unnassignedArrayIndex, newSeatingAssignment.unassignedStudents] = 
    //       insertSort(seating.draggedStudentInfo.student, seating.unassignedStudents)
    //   }
    //   return newSeatingAssignment
    // }
    // case 'move_outside_unnassigned_area': {
    //   const newSeatingAssignment: SeatingPlusPreview = deepCopyState(seating)
    //   if (seating.unnassignedArrayIndex)
    //   newSeatingAssignment.unassignedStudents.splice(seating.unnassignedArrayIndex, 1)
    //   newSeatingAssignment.unnassignedArrayIndex = undefined
    // }

    default:
      return seating
  }
}

interface AssignSeatProps {
  isOpen: boolean
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full' | undefined
  students: Student []
  desks: (DeskTemplate | {})[][]
  onBackPressed?: () => void
  onFinishPressed: (seatingPlan: SeatingPlan) => void
  onCancel: () => void
}

function SeatAssignModal({ isOpen, size, students, desks, onBackPressed, onFinishPressed, onCancel } : AssignSeatProps) {
  const [seating, dispatchAssignment] = useReducer<(seating: SeatingPlusPreview, action: AssignAction) => SeatingPlusPreview>(seatingReducer, {desks: desks, unassignedStudents: [], students: students, draggingOver: false})

  useEffect(() => {
    dispatchAssignment({type: 'default_seating', students: students, desks: desks})
  }, [desks])

  function handleDrag(studentIndex: number, students: Student[], deskRow: number, deskColumn: number): (event: React.DragEvent) => void {
    return (event: React.DragEvent) => {
      const transferObject: AssignedDeskInfo = {
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
    sourceDeskInfo: AssignedDeskInfo | undefined,
    destinationStudentIndex?: number
  ): (event: React.DragEvent) => void {
    return (event: React.DragEvent) => {
      if (!event.isDefaultPrevented() && sourceDeskInfo && destinationStudentIndex !== sourceDeskInfo.studentIndex) {
        event.stopPropagation()
        event.preventDefault()
      }
    }
  }


  function handleDragIntoDesk(
    sourceDeskInfo: AssignedDeskInfo | undefined,
    destinationDeskRow: number,
    destinationDeskColumn: number,
    destinationStudentIndex?: number
  ): (event: React.DragEvent) => void {
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
  
  function handleDragOutOfDesk(): (event: React.DragEvent) => void {
    return (event: React.DragEvent) => {
      event.stopPropagation()
      // event.preventDefault()
      console.log("Drag Leave Fired")
      dispatchAssignment({type: 'move_outside_desk'})
    }
  }
  function handleDragEnd(): (event: React.DragEvent) => void {
    return (event: React.DragEvent) => {
      event.stopPropagation()
      dispatchAssignment({type: 'move_cancel'})
    }
  }

  function handleDrop(
    destinationDeskRow: number,
    destinationDeskColumn: number,
    destinationStudentIndex?: number
  ): (event: React.DragEvent) => void {
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
        <ModalBody>
          <SeatAssignPanel
            seatingAssignment={seating}
            onStudentDragStart={handleDrag}
            onStudentDragEnd={handleDragEnd}
            onStudentDragOutOfDesk={handleDragOutOfDesk}
            onStudentDragOverDesk={handleDragOverDesk}
            onStudentDragStudentOntoDesk={handleDragIntoDesk}
            onStudentDrop={handleDrop}
          />
          
          <UnassignedPanel
            seatingAssignment={seating}
            onStudentDragStart={handleDrag}
            onStudentDragEnd={handleDragEnd}
          />
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
    <div className='grid grid-rows-3 grid-cols-3'>
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
      <div>
          <br/>==== Unassigned Students ====<br/>
          {JSON.stringify(seating.unassignedStudents)}
      </div>
      <div>
          <br/>==== Seats ====<br/>
          {JSON.stringify(seating.desks)}
      </div>
    </div>
    </>
  )
}

export default SeatAssignModal