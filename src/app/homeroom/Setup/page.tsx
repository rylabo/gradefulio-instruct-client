'use client';
import React, { useState, DragEvent, useReducer, useEffect } from 'react'
import { NewStudent, sortStudents, Student, StudentObj } from '../../../lib/StudentObj';
import { Button } from '@nextui-org/react';
import NewStudentModal, { ClassEnrollmentState } from './NewStudentModal';
import { BlankNode, DeskLayoutTemplate, DeskTemplate, GridSpec, SeatingPlan } from '../../../lib/SeatingPlan';
import DeskGridModal from './DeskGridModal';
import { deepCopyDeskLayout, getDefaultGridSpec, initializeDeskPlan, isDeskTemplate } from '../../../util/deskLayout';
import SeatAssignModal from './SeatAssignModal';
import { CourseState, Name, SchoolGrade } from '../../../lib/Course';
import axios from 'axios';

const initialConfigState: CourseState = {
  courseName: {
    key: undefined,
    en: undefined,
    ja: undefined
  },
  gradeLevel: '',
  classNumber: undefined,
  studentEnrollment: [],
  deskRows: 1,
  deskColumns: 1,
  deskAt: [[]]
}

type ClassroomConfigAction =
  | {type: 'create_class_roll', gradeLevel: string; }
  | {type: 'cancel_configuration'}
  | {type: 'finalize_desk_layout', rows: number, columns: number, desks: (DeskTemplate | {})[][]}
  | {type: 'finalize_student_list', newCourseInfo: ClassEnrollmentState}
  | {type: 'finalize_seating_assignments', seatingPlan: SeatingPlan}


const newClassReducer = (state: CourseState, action: ClassroomConfigAction): CourseState => {
  switch (action.type) {

    case 'cancel_configuration':
      return initialConfigState

    case 'finalize_desk_layout': {
      const newState: CourseState = {...state}
      newState.deskRows = action.rows
      newState.deskRows = action.columns
      newState.deskAt = action.desks
      return newState
    }

    case 'finalize_student_list':{
      const newState: CourseState = {...state}
      const deskGrid: GridSpec = getDefaultGridSpec(action.newCourseInfo.newStudents)
      newState.courseName = action.newCourseInfo.courseName
      newState.gradeLevel = action.newCourseInfo.grade

      if (/^\d+$/.test(action.newCourseInfo.grade)){
        newState.classNumber = parseInt(action.newCourseInfo.grade)
      }

      newState.studentEnrollment = action.newCourseInfo.newStudents
      newState.deskRows = deskGrid.rows
      newState.deskColumns = deskGrid.columns
      newState.deskAt = initializeDeskPlan({rows: deskGrid.rows, columns: deskGrid.columns})
      return newState
    }

    case 'finalize_seating_assignments':{
      const newState: CourseState = {...state}
      newState.studentEnrollment = action.seatingPlan.students
      newState.deskAt = action.seatingPlan.deskAt
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

  const [newClassState, dispatchNewClassAction] = useReducer<(state: CourseState, action: ClassroomConfigAction) => CourseState>(newClassReducer, initialConfigState)
  const [seatingPlanState, dispatchSeatingPlanChange] = useReducer<(state: SeatingPlan, action: SeatingPlanChange) => SeatingPlan>(seatingStateReducer, initialSeatingPlan)
  const [detailsFinalized, setDetailsFinalized] = useState<boolean>(false)

  useEffect(() => {
    if (detailsFinalized) {
      axios.post('/api/course', newClassState)
      .then(response => {
        console.log('Seating plan submitted successfully:', response.data);
      })
      .catch(error => {
        console.error('Error submitting seating plan:', error);
      });
    }
  }, [detailsFinalized])
  function enrollmentFinalizedHandler(enrollment: ClassEnrollmentState): void {
    dispatchNewClassAction({type:'finalize_student_list', newCourseInfo: enrollment})
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
    dispatchNewClassAction({type: 'finalize_seating_assignments', seatingPlan: seatingPlan})
    setDetailsFinalized(true)
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
        size='full'
        isDismissable={false}
        onNextPressed={enrollmentFinalizedHandler}
        enrollment={newClassState.studentEnrollment as NewStudent[]}
        onCancel={cancelHandler}
      />
      <NewCourseDialog.DeskGridModal
        isOpen={currentDialogStep === 2}
        size='full'
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
        size='full'
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