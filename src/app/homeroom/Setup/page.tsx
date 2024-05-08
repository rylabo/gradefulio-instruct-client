'use client';
import React, { useState, DragEvent, useReducer } from 'react'
import { NewStudent, sortStudents, Student, StudentObj } from '../../../lib/StudentObj';
import { Button } from '@nextui-org/react';
import NewStudentModal from './NewStudentModal';
import { BlankNode, DeskLayoutTemplate, DeskTemplate, GridSpec, SeatingPlan } from '../../../lib/SeatingPlan';
import DeskGridModal from './DeskGridModal';
import { deepCopyDeskLayout, getDefaultGridSpec, initializeDeskPlan, isDeskTemplate } from '../../../util/deskLayout';
import SeatAssignModal from './SeatAssignModal';

type Name = 
  | {
      key: string
      en: string
      ja: string  
    }
  | {}

type SchoolGrade = 
| '小1'
| '小2'
| '小3'
| '小4'
| '小5'
| '小6'
| '中1'
| '中2'
| '中3'
| '高1'
| '高2'
| '高3'
| undefined

interface ClassroomState {
  className: Name
  gradeLevel: SchoolGrade
  classNumber: number | undefined
  studentEnrollment: NewStudent[]
  deskRows: number
  deskColumns: number
  deskAt: (DeskTemplate | {}) [][]
}

const initialConfigState: ClassroomState = {
  className: {
    key: undefined,
    en: undefined,
    ja: undefined
  },
  gradeLevel: undefined,
  classNumber: undefined,
  studentEnrollment: [],
  deskRows: 1,
  deskColumns: 1,
  deskAt: [[]]
}

type ClassroomConfigAction =
  | {type: 'create_class_roll'; gradeLevel: string; }
  | {type: 'cancel_configuration'}
  | {type: 'finalize_desk_layout'; rows: number, columns: number, desks: (DeskTemplate | {})[][]}
  | {type: 'finalize_student_list'; newStudents: (StudentObj & BlankNode)[]}


const newClassReducer = (state: ClassroomState, action: ClassroomConfigAction): ClassroomState => {
  switch (action.type) {

    case 'cancel_configuration':
      return initialConfigState

    case 'finalize_desk_layout': {
      const newState: ClassroomState = {...state}
      newState.deskRows = action.rows
      newState.deskRows = action.columns
      newState.deskAt = action.desks
      return newState
    }

    case 'finalize_student_list':{
      const newState: ClassroomState = {...state}
      const deskGrid: GridSpec = getDefaultGridSpec(action.newStudents) 
      newState.studentEnrollment = action.newStudents
      newState.deskRows = deskGrid.rows
      newState.deskColumns = deskGrid.columns
      newState.deskAt = initializeDeskPlan({rows: deskGrid.rows, columns: deskGrid.columns})
      return newState
    }


    default:
      return {
        ...state
      }
  }
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
        obj.row = i
        obj.column = j
        studentNumber++
      }
    }
  }
  return newSeating

}


const initialSeatingPlan: SeatingPlan = {
  students: [],
  deskAt: [[]]
}

type SeatingPlanChange =
| {type: 'initialize_seating_plan', students: Student[], layout: SeatingPlan}
| {type: 'finalize_seating_plan', newLayout: SeatingPlan}

const seatingStateReducer = (state: SeatingPlan, action: SeatingPlanChange): SeatingPlan => {
  switch (action.type) {
    case 'initialize_seating_plan': {
      const newSeatingPlan: SeatingPlan = {
        students: sortStudents(action.students),
        deskAt: getDefaultSeating(
          sortStudents(action.students), action.layout.deskAt
        )
      }
      return newSeatingPlan 
    }
    case 'finalize_seating_plan': {
      const newSeatingPlan: SeatingPlan = {
        students: state.students,
        deskAt: action.newLayout.deskAt
      }
      return newSeatingPlan
    }
  }
  return state;
}

const NewCourseDialog = () => {
  const [currentDialogStep, setCurrentDialogStep] = useState<number>(0)

  const [newClassState, dispatchNewClassAction] = useReducer<(state: ClassroomState, action: ClassroomConfigAction) => ClassroomState>(newClassReducer, initialConfigState)
  const [seatingPlanState, dispatchSeatingPlanChange] = useReducer<(state: SeatingPlan, action: SeatingPlanChange) => SeatingPlan>(seatingStateReducer, initialSeatingPlan)

  function enrollmentFinalizedHandler(enrollment: (StudentObj & BlankNode)[]): void {
    dispatchNewClassAction({type:'finalize_student_list', newStudents: enrollment})
    setCurrentDialogStep(2)
  }

  function deskGridModalNextHandler(students: Student[], layout: DeskLayoutTemplate): void {
    dispatchNewClassAction({type: 'finalize_desk_layout', rows: layout.deskRows, columns: layout.deskColumns, desks: [...layout.deskAt]})
    dispatchSeatingPlanChange({type: 'initialize_seating_plan', students: sortStudents(students), layout: {students: sortStudents(students), deskAt: layout.deskAt}})
    setCurrentDialogStep(3)
  }

  function deskGridModalPreviousHandler(): void {
    setCurrentDialogStep(1)
  }

  function seatAssignModalPreviousHandler(): void {
    setCurrentDialogStep(2)
  }

  function seatAssignModalProceedHandler(seatingPlan: SeatingPlan): void {
    dispatchSeatingPlanChange({type: 'finalize_seating_plan', newLayout: seatingPlan})
    setCurrentDialogStep(0)
  }
  
  function cancelHandler(): void {
    dispatchNewClassAction({type: 'cancel_configuration'})
    setCurrentDialogStep(0)
  }

  return (
    <>
      <NewCourseDialog.NewStudentModal
        isOpen={currentDialogStep === 1}
        size='5xl'
        isDismissable={false}
        onNextPressed={enrollmentFinalizedHandler}
        enrollment={newClassState.studentEnrollment}
        onCancel={cancelHandler}
      />
      <NewCourseDialog.DeskGridModal
        isOpen={currentDialogStep === 2}
        size='5xl'
        isDismissable={false}
        deskRows={newClassState.deskRows}
        deskColumns={newClassState.deskColumns}
        enrollment={newClassState.studentEnrollment}
        desks={newClassState.deskAt}
        onBackPressed={deskGridModalPreviousHandler}
        onNextPressed={deskGridModalNextHandler}
        onCancel={cancelHandler}
      />
      <NewCourseDialog.SeatAssignModal
        isOpen={currentDialogStep === 3}
        size='5xl'
        isDismissable={false}
        students={seatingPlanState.students}
        desks={seatingPlanState.deskAt}
        onBackPressed={seatAssignModalPreviousHandler}
        onFinishPressed={seatAssignModalProceedHandler}
        onCancel={cancelHandler}
      />
      <Button onPress={() => {setCurrentDialogStep(1)}}>
        New Class
      </Button>
    </>

  )
}

export default NewCourseDialog
NewCourseDialog.NewStudentModal = NewStudentModal
NewCourseDialog.DeskGridModal = DeskGridModal
NewCourseDialog.SeatAssignModal = SeatAssignModal