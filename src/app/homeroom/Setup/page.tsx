'use client';
import React, { useState, DragEvent, ChangeEvent, useReducer, Key } from 'react'
import { StudentObj } from '../../../lib/StudentObj';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import DeskGridCell, { DeskGridCellProps } from './DeskGridCell';
// import SeatingPlan from './SeatingPlan';
import { read, utils } from 'xlsx';
import NewStudentModal from './NewStudentModal';
import { BlankNode, DeskLayout, DeskTemplate, GridSpec, SeatingPlan } from '../../../lib/SeatingPlan';
import DeskGridModal from './DeskGridModal';
import { getDefaultGridSpec, initializeDeskPlan } from '../../../util/deskLayout';
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
  studentEnrollment: (StudentObj & BlankNode)[]
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

const initialSeatingPlan: SeatingPlan = {
  deskAt: [[]]
}

type SeatingPlanChange =
| {type: 'initialize_seating_plan', students: StudentObj[], layout: SeatingPlan}
| {type: 'change_desk_layout'}

const seatingStateReducer = (state: SeatingPlan, action: SeatingPlanChange): SeatingPlan => {
  switch (action.type) {
    case 'initialize_seating_plan': {

    }
  }
  return state;
}

const Setup = () => {
  const [currentDialogStep, setCurrentDialogStep] = useState<number>(0)

  const [newClassState, dispatchNewClassAction] = useReducer<(state: ClassroomState, action: ClassroomConfigAction) => ClassroomState>(newClassReducer, initialConfigState)
  const [seatingPlanState, dispatchSeatingPlanChange] = useReducer<(state: SeatingPlan, action: SeatingPlanChange) => SeatingPlan>(seatingStateReducer, initialSeatingPlan)

  function studentDragStartHandler(event: DragEvent) {
    
  }

  function enrollmentFinalizedHandler(enrollment: (StudentObj & BlankNode)[]) {
    dispatchNewClassAction({type:'finalize_student_list', newStudents: enrollment})
    setCurrentDialogStep(2)
  }

  return (
    <>
      <NewStudentModal isOpen={currentDialogStep === 1} size='5xl' onEnrollmentFinalized={enrollmentFinalizedHandler}></NewStudentModal>
      <DeskGridModal isOpen={currentDialogStep === 2} size='5xl' deskRows={newClassState.deskRows} deskColumns={newClassState.deskColumns} enrollment={newClassState.studentEnrollment} desks={newClassState.deskAt} onLayoutFinalized={(layout: DeskLayout) => {
        dispatchNewClassAction({type: 'finalize_desk_layout', rows: layout.deskRows, columns: layout.deskColumns, desks: [...layout.deskAt]})
        setCurrentDialogStep(3)
      }}></DeskGridModal>
      <SeatAssignModal isOpen={currentDialogStep === 3} size='5xl' students={newClassState.studentEnrollment} desks={newClassState.deskAt} >
      </SeatAssignModal>
      {/* <Modal id='assign-seats' isOpen={currentDialogStep === 3} size='5xl'>
        <ModalContent>
          <ModalHeader>
            Assign Seats
          </ModalHeader>
          <ModalBody>
            <div className={`desk-plan grid gap-10 grid-rows-${newClassState.deskLayout.rows} grid-cols-${newClassState.deskLayout.columns}`}>
              <SeatingPlan students={newClassState.studentEnrollment} deskSlots={newClassState.deskLayoutCells} seatingGrid={newClassState.deskLayout}></SeatingPlan>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color='primary'>
              Finish
            </Button>
            <Button>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
      <Button onPress={() => {setCurrentDialogStep(1)}}>
        New Class
      </Button>
    </>

  )
}

export default Setup