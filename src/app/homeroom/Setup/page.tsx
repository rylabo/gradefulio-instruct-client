'use client';
import React, { use, useLayoutEffect, useState, DragEvent, ChangeEvent, useReducer, Key } from 'react'
import Seat, { SeatSpec } from './_Seat'
import { StudentObj } from '../../../lib/StudentObj';
import SeatingPlanBlueprint, { GridSpec } from './SeatingPlanBlueprint';
import SeatingGridSettings from './SeatingGridSettings';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs, useDisclosure, UseDisclosureProps } from '@nextui-org/react';
import DeskPlan from './DeskPlan';
import DeskGridCell, { DeskGridCellProps } from './DeskSlot';
import SeatingPlan from './SeatingPlan';
import { read, utils } from 'xlsx';

function getDefaultGridSpec(studentList: StudentObj[]) : GridSpec {
  let spec: GridSpec = {rows: 2, columns: 3};
  const classSize = studentList.length

  if (classSize > 6 && classSize <= 9) spec = {rows: 3, columns: 3}
  else if (classSize > 9 && classSize <= 12) spec = {rows: 4, columns: 3}
  else if (classSize > 12 && classSize <= 16) spec = {rows: 4, columns: 4}
  else if (classSize > 16 && classSize <= 20)  spec = {rows: 5, columns: 4}
  else if (classSize > 20 && classSize <= 25)  spec = {rows: 5, columns: 5}
  else if (classSize > 25 && classSize <= 30)  spec = {rows: 6, columns: 5}
  else if (classSize > 30 && classSize <= 36)  spec = {rows: 6, columns: 6}
  else if (classSize > 36) spec = {rows: 7, columns: 6}

  return spec
}
interface NewStudentListItem {
  '姓': string
  '名': string
  '姓（かたかな）': string
  '名（かたかな）': string
  '姓（ローマ字）': string
  '名（ローマ字）': string
}

interface ConfigState {
  addNewStudentsModalOpen: boolean
  newStudentListModalOpen: boolean
  deskLayoutModalOpen: boolean
  deskAssignmentModalOpen: boolean
  newStudents: StudentObj[]
  studentEnrollment: StudentObj[]
  deskLayout: GridSpec
  deskLayoutCells: DeskGridCellProps[]
}

const initialConfigState: ConfigState = {
  addNewStudentsModalOpen: false,
  newStudentListModalOpen: false,
  deskLayoutModalOpen: false,
  deskAssignmentModalOpen: false,
  newStudents: [],
  studentEnrollment: [],
  deskLayout: {rows: 0, columns: 0},
  deskLayoutCells: []
}

function assignSeatNumbers(deskPlan: DeskGridCellProps[]) {
  let seatNum: number = 1
  for (let i: number = 0; i < deskPlan.length; i++) {
    if (deskPlan[i].intent !== 2) {
      deskPlan[i].assignedDeskNumber = seatNum
      seatNum++
    } else {
      deskPlan[i].assignedDeskNumber = undefined
    }
  }
}

function newSeat(rowNum: number, colNum: number, spec: GridSpec, slot: number, directive: number): DeskGridCellProps {
  return {
    row: (rowNum + 1),
    column: (colNum + 1),
    cellNumber: slot,
    grid: spec,
    intent: directive,
  }
}

function initializeDeskPlan(spec: GridSpec): DeskGridCellProps[] {
  let plan: DeskGridCellProps[] = [];
  let slotNum: number = 1;
  for (let j: number = 0; j < spec.columns; j++) {
    for(let i: number = 0; i < spec.rows; i++) {
      plan.push(newSeat(i, j, spec, slotNum, 0));
      slotNum++;
    }
  }
  assignSeatNumbers(plan)  
  return plan
}

type ConfigAction =
  | {type: 'create_new_class'}
  | {type: 'create_class_roll'; gradeLevel: string; }
  | {type: 'cancel_configuration'}
  | {type: 'finalize_student_list'}
  | {type: 'add_new_students_from_spreadsheet'; newStudents: StudentObj[]}
  | {type: 'update_new_student_family_name'; newStudentArrayindex: number; newValue: string }
  | {type: 'update_new_student_family_name_katakana'; newStudentArrayindex: number; newValue: string }
  | {type: 'update_new_student_family_name_romaji'; newStudentArrayindex: number; newValue: string }
  | {type: 'update_new_student_given_name'; newStudentArrayindex: number; newValue: string }
  | {type: 'update_new_student_given_name_katakana'; newStudentArrayindex: number; newValue: string }
  | {type: 'update_new_student_given_name_romaji'; newStudentArrayindex: number; newValue: string }
  | {type: 'delete_new_student'; newStudentArrayindex: number}

  | {type: 'change_desk_layout_row_count'; newRowCount: number}
  | {type: 'change_desk_layout_column_count'; newColumnCount: number}

  | {type: 'change_intent_for_desk_layout_cell'; deskCellNumber: number, newIntent: number}

const reducer = (state: ConfigState, action: ConfigAction): ConfigState => {
  switch (action.type) {
    case 'create_new_class':
      return {
        ...state,
        addNewStudentsModalOpen: true
      }

    case 'add_new_students_from_spreadsheet':
      return {
        ...state,
        newStudents: action.newStudents,
        studentEnrollment: []
      }

    case 'cancel_configuration':
      return initialConfigState

    case 'finalize_student_list':{
      const newState: ConfigState = {...state}
      newState.newStudents = []
      newState.studentEnrollment = state.newStudents
      newState.deskLayout = getDefaultGridSpec(newState.studentEnrollment)
      newState.deskLayoutCells = initializeDeskPlan(newState.deskLayout)
      newState.newStudentListModalOpen = false
      newState.deskLayoutModalOpen = true
      return newState
    }

    case 'update_new_student_family_name': {
      const newState = {...state};
      newState.newStudents[action.newStudentArrayindex].familyNames[0].nameToken.ja = action.newValue;
      return newState
    }

    case 'update_new_student_family_name_katakana': {
      const newState = {...state};
      newState.newStudents[action.newStudentArrayindex].familyNames[0].annotation = action.newValue;
      return newState
    }

    case 'update_new_student_family_name_romaji': {
      const newState = {...state};
      newState.newStudents[action.newStudentArrayindex].familyNames[0].nameToken.en = action.newValue;
      return newState
    }

    case 'update_new_student_given_name': {
      const newState = {...state};
      newState.newStudents[action.newStudentArrayindex].givenNames[0].nameToken.ja = action.newValue;
      return newState
    }

    case 'update_new_student_given_name_katakana': {
      const newState = {...state};
      newState.newStudents[action.newStudentArrayindex].givenNames[0].annotation = action.newValue;
      return newState
    }

    case 'update_new_student_given_name_romaji': {
      const newState = {...state};
      newState.newStudents[action.newStudentArrayindex].givenNames[0].nameToken.en = action.newValue;
      return newState
    }
    
    case 'delete_new_student': {
      const newState = {...state};
      newState.newStudents = [...state.newStudents]
      newState.newStudents.splice(action.newStudentArrayindex, 1)
      return newState
    }


    case 'change_desk_layout_row_count': {
      const newState = {...state}
      newState.deskLayout = {...state.deskLayout}
      newState.deskLayoutCells = {...state.deskLayoutCells}
      newState.deskLayout.rows = action.newRowCount
      newState.deskLayoutCells = initializeDeskPlan(newState.deskLayout)
      return newState
    }

    case 'change_desk_layout_column_count': {
      const newState = {...state}
      newState.deskLayout = {...state.deskLayout}
      newState.deskLayoutCells = {...state.deskLayoutCells}
      newState.deskLayout.columns = action.newColumnCount
      newState.deskLayoutCells = initializeDeskPlan(newState.deskLayout)
      return newState
    }

    case 'change_intent_for_desk_layout_cell' :{
      const newState = {...state}
      newState.deskLayout = {...state.deskLayout}
      newState.deskLayoutCells = [...state.deskLayoutCells]
      newState.deskLayoutCells[action.deskCellNumber - 1].intent = action.newIntent
      assignSeatNumbers(newState.deskLayoutCells)
      return newState
    }

    default:
      return {
        ...state
      }
  }
}

const Setup = () => {
  const [configState, dispatch] = useReducer<(state: ConfigState, action: ConfigAction) => ConfigState>(reducer, initialConfigState)

  const deskPlan: JSX.Element[] = []
  for (let i = 0; i < configState.deskLayoutCells.length; i++) {
    deskPlan.push(
      <DeskGridCell 
        key={`${configState.deskLayoutCells[i].cellNumber}`}
        row={configState.deskLayoutCells[i].row}
        column={configState.deskLayoutCells[i].column}
        assignedDeskNumber={configState.deskLayoutCells[i].assignedDeskNumber}
        cellNumber={configState.deskLayoutCells[i].cellNumber}
        intent={configState.deskLayoutCells[i].intent}
        grid={configState.deskLayoutCells[i].grid}
        onIntentChange={handleChangeInDeskGridCellIntent(configState.deskLayoutCells[i].cellNumber)}
      /> 
    )
  }
  function getNewStudentFormGroups(newStudents: StudentObj[]): JSX.Element[] {
    const formGroups: JSX.Element[] = []
    for (let i = 0; i < newStudents.length; i++) {
      formGroups.push((
        <div key={'newStudentFormGroup' + i} className='flex' >
          <Input 
            type='text'
            placeholder='Family Name'
            value={newStudents[i].familyNames[0].nameToken.ja}
            onChange={(event) => {dispatch({type: 'update_new_student_family_name', newStudentArrayindex: i, newValue: event.target.value})}} 
          />
          <Input
            type='text'
            placeholder='Family Name (Katakana)'
            value={newStudents[i].familyNames[0].annotation}
            onChange={(event) => {dispatch({type: 'update_new_student_family_name_katakana', newStudentArrayindex: i, newValue: event.target.value})}} 
          />
          <Input
            type='text'
            placeholder='Family Name (Romaji)'
            value={newStudents[i].familyNames[0].nameToken.en}
            onChange={(event) => {dispatch({type: 'update_new_student_family_name_romaji', newStudentArrayindex: i, newValue: event.target.value})}} 
          />
          <Input
            type='text'
            placeholder='Given Name'
            value={newStudents[i].givenNames[0].nameToken.ja}
            onChange={(event) => {dispatch({type: 'update_new_student_given_name', newStudentArrayindex: i, newValue: event.target.value})}} 
          />
          <Input
            type='text'
            placeholder='Given Name (Katakana)'
            value={newStudents[i].givenNames[0].annotation}
            onChange={(event) => {dispatch({type: 'update_new_student_given_name_katakana', newStudentArrayindex: i, newValue: event.target.value})}} 
          />
          <Input
            type='text'
            placeholder='Given Name (Romaji)'
            value={newStudents[i].givenNames[0].nameToken.en}
            onChange={(event) => {dispatch({type: 'update_new_student_given_name_romaji', newStudentArrayindex: i, newValue: event.target.value})}} 
          />
          <Button color='danger' onPress={() => {dispatch({type: 'delete_new_student', newStudentArrayindex: i})}}>Delete</Button>
      </div>
      ))
    }
    return formGroups
  }
  function studentDragStartHandler(event: DragEvent) {
    
  }

  function rowCountChangeHandler(newRowCount: number) {
    dispatch({type: 'change_desk_layout_row_count', newRowCount: newRowCount})
  }

  function columnCountChangeHandler(newColumnCount: number) {
    dispatch({type: 'change_desk_layout_column_count', newColumnCount: newColumnCount})
}

  function changeIntentForDeskGridCell(i: number, key:Key) {
    dispatch({type: 'change_intent_for_desk_layout_cell', deskCellNumber: i, newIntent: Number(key)})
  }

  function handleChangeInDeskGridCellIntent(i: number) {
    return (key:Key) => {
      changeIntentForDeskGridCell(i, key)
    }
  }

  async function fileSelectHandler(event: ChangeEvent<HTMLInputElement> ) {
    console.log(event);
    const selectedFile: ArrayBuffer | undefined = await event.target.files?.item(0)?.arrayBuffer()
    // todo enclose in try
    const wb = read(selectedFile)
    const ws = wb.Sheets[wb.SheetNames[0]]
    const data: NewStudentListItem[] = utils.sheet_to_json<NewStudentListItem>(ws)
    const spreadsheetStudentList: StudentObj[] = data.map((item: NewStudentListItem) => {
      return {
        "@type": [
          "Student"
        ],
        "givenNames": [
          {
            "annotation": item['名（かたかな）'],
            "nameToken": {
              "en": item['名（ローマ字）'],
              "ja": item['名']
            }
          }
        ],
        "familyNames": [
          {
            "annotation": item['姓（かたかな）'],
            "nameToken": {
              "en": item['姓（ローマ字）'],
              "ja": item['姓']
            }
          }
        ],
      }
    })
    dispatch({type: 'add_new_students_from_spreadsheet', newStudents: spreadsheetStudentList})
  }

  return (
    <>
      <Modal id='add-new-students' isOpen={configState.addNewStudentsModalOpen} size='5xl'>
        <ModalContent>
          <ModalHeader>
            Create a New Class
          </ModalHeader>
          <ModalBody>
            <div>
              <input type='file' accept='.xls, .xlsx, .csv' onChange={fileSelectHandler}/>
              <div>
                {getNewStudentFormGroups(configState.newStudents)}
              </div>
              {JSON.stringify(configState.newStudents, null, 2)}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' isDisabled={configState.newStudents.length === 0} onPress={() => {dispatch({type:'finalize_student_list'})}}>
              Next
            </Button>
            <Button>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal id='set-desk-layout' isOpen={configState.deskLayoutModalOpen} size='5xl'>
        <ModalContent>
          <ModalHeader>
            Set Desk Layout
          </ModalHeader>
          <ModalBody>
            <div className={`desk-plan grid gap-10 grid-rows-${configState.deskLayout.rows} grid-cols-${configState.deskLayout.columns}`}>
              {deskPlan}
            </div>
            <SeatingGridSettings grid={configState.deskLayout} onRowCountChange={rowCountChangeHandler} onColumnCountChange={columnCountChangeHandler}/>
          </ModalBody>
          <ModalFooter>
            <Button color='primary'>
              Next
            </Button>
            <Button>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal id='assign-seats' isOpen={configState.deskAssignmentModalOpen} size='5xl'>
        <ModalContent>
          <ModalHeader>
            Assign Seats
          </ModalHeader>
          <ModalBody>
            <div className={`desk-plan grid gap-10 grid-rows-${configState.deskLayout.rows} grid-cols-${configState.deskLayout.columns}`}>
              <SeatingPlan students={configState.studentEnrollment} deskSlots={configState.deskLayoutCells} seatingGrid={configState.deskLayout}></SeatingPlan>
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
      </Modal>
      <Button onPress={() => {dispatch({type: 'create_new_class'})}}>New Class</Button>
      {/* <Tabs>
        <Tab key='Homeroom Details' title='Homeroom Details'>

        </Tab>
        <Tab key='Student List' title='Student List'>
          <Input type='file' accept='.xls, .xlsx, .csv' onChange={fileSelectHandler}/>
          <div>
            <p>File contents</p>
            <p>{JSON.stringify(configState.newStudents, null, 2)}</p>
          </div>
        </Tab>
        <Tab key='Seating Grid' title='Seating Grid' className='desk-planner grid gap-10 grid-cols-2'>
          <div className={`desk-plan grid gap-10 grid-rows-${spec.rows} grid-cols-${spec.columns}`}>
            {deskPlan}
          </div>
          <SeatingGridSettings grid={spec} onRowCountChange={rowCountChangeHandler} onColumnCountChange={columnCountChangeHandler}/>
        </Tab>
        <Tab key='Desk Plan' title='Desk Plan' className={`grid gap-10 grid-rows-${spec.rows} grid-cols-${spec.columns}`}>
          <SeatingPlan students={studentList} deskSlots={deskSlots} seatingGrid={spec}></SeatingPlan>
        </Tab>
      </Tabs> */}
    </>

  )
}

export default Setup