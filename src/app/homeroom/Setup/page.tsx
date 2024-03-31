'use client';
import React, { useState, DragEvent, ChangeEvent, useReducer, Key } from 'react'
import { StudentObj } from '../../../lib/StudentObj';
import SeatingGridSettings, { GridSpec } from './SeatingGridSettings';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import DeskGridCell, { DeskGridCellProps } from './DeskGridCell';
// import SeatingPlan from './SeatingPlan';
import { read, utils } from 'xlsx';

interface NewStudentListItem {
  '姓': string
  '名': string
  '姓（かたかな）': string
  '名（かたかな）': string
  '姓（ローマ字）': string
  '名（ローマ字）': string
}

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
  studentEnrollment: StudentObj[]
  deskLayout: GridSpec
  deskLayoutCells: DeskGridCellProps[]
}

interface ClassEnrollmentState {
  newStudents: StudentObj[]
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
  deskLayout: {rows: 0, columns: 0},
  deskLayoutCells: []
}

const initialClassEnrollmentState: ClassEnrollmentState = {
  newStudents: []
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
  return plan
}

type ClassroomConfigAction =
  | {type: 'create_class_roll'; gradeLevel: string; }
  | {type: 'cancel_configuration'}
  | {type: 'finalize_desk_layout'; newLayoutGrid: GridSpec; layoutCells: DeskGridCellProps[]}
  | {type: 'finalize_student_list'; newStudents: StudentObj[]}

type ClassEnrollmentAction = 
  | {type: 'add_new_students_from_spreadsheet'; newStudents: StudentObj[]}
  | {type: 'update_new_student_family_name'; newStudentArrayindex: number; newValue: string }
  | {type: 'update_new_student_family_name_katakana'; newStudentArrayindex: number; newValue: string }
  | {type: 'update_new_student_family_name_romaji'; newStudentArrayindex: number; newValue: string }
  | {type: 'update_new_student_given_name'; newStudentArrayindex: number; newValue: string }
  | {type: 'update_new_student_given_name_katakana'; newStudentArrayindex: number; newValue: string }
  | {type: 'update_new_student_given_name_romaji'; newStudentArrayindex: number; newValue: string }
  | {type: 'delete_new_student'; newStudentArrayindex: number}

const classEnrollmentReducer = (state: ClassEnrollmentState, action: ClassEnrollmentAction): ClassEnrollmentState => {
  switch (action.type) {
    case 'add_new_students_from_spreadsheet':
      return {
        ...state,
        newStudents: action.newStudents,
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
    default:
      return {
        ...state
      }   

  }
}

const newClassReducer = (state: ClassroomState, action: ClassroomConfigAction): ClassroomState => {
  switch (action.type) {

    case 'cancel_configuration':
      return initialConfigState

    case 'finalize_desk_layout': {
      const newState: ClassroomState = {...state}
      newState.deskLayout = action.newLayoutGrid
      newState.deskLayoutCells = action.layoutCells
      return newState
    }

    case 'finalize_student_list':{
      const newState: ClassroomState = {...state}
      // newState.newStudents = []
      newState.studentEnrollment = action.newStudents
      return newState
    }


    default:
      return {
        ...state
      }
  }
}

interface DeskLayoutPlan {
  deskLayout: GridSpec
  deskLayoutCells: DeskGridCellProps[]
}

const startingDeskLayoutPlan: DeskLayoutPlan = {
  deskLayout: {rows: 1, columns: 1},
  deskLayoutCells: []
}

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

type DeskLayoutPlanChange =
| {type: 'find_initial_desk_layout'; studentList: StudentObj[]} 
| {type: 'change_desk_layout_row_count'; newRowCount: number}
| {type: 'change_desk_layout_column_count'; newColumnCount: number}
| {type: 'change_intent_for_desk_layout_cell'; deskCellNumber: number, newIntent: number}

const deskLayoutReducer = (layoutPlan: DeskLayoutPlan, change: DeskLayoutPlanChange): DeskLayoutPlan => {
  switch (change.type) {
    case 'find_initial_desk_layout' : {
      const gridSpec: GridSpec = getDefaultGridSpec(change.studentList)
      return {
        deskLayout: getDefaultGridSpec(change.studentList),
        deskLayoutCells: initializeDeskPlan(gridSpec)
      }
    }

    case 'change_desk_layout_row_count': {
      const newLayoutPlan = {...layoutPlan}
      newLayoutPlan.deskLayout = {...layoutPlan.deskLayout}
      newLayoutPlan.deskLayoutCells = {...layoutPlan.deskLayoutCells}
      newLayoutPlan.deskLayout.rows = change.newRowCount
      newLayoutPlan.deskLayoutCells = initializeDeskPlan(newLayoutPlan.deskLayout)
      return newLayoutPlan
    }

    case 'change_desk_layout_column_count': {
      const newLayoutPlan = {...layoutPlan}
      newLayoutPlan.deskLayout = {...layoutPlan.deskLayout}
      newLayoutPlan.deskLayoutCells = {...layoutPlan.deskLayoutCells}
      newLayoutPlan.deskLayout.columns = change.newColumnCount
      newLayoutPlan.deskLayoutCells = initializeDeskPlan(newLayoutPlan.deskLayout)
      return newLayoutPlan
    }

    case 'change_intent_for_desk_layout_cell' :{
      const newLayoutPlan = {...layoutPlan}
      newLayoutPlan.deskLayout = {...layoutPlan.deskLayout}
      newLayoutPlan.deskLayoutCells = {...layoutPlan.deskLayoutCells}
      newLayoutPlan.deskLayoutCells[change.deskCellNumber - 1].intent = change.newIntent
      return newLayoutPlan
    }

    default:
      return {
        ...layoutPlan
      }
  }
}


const Setup = () => {
  const [currentDialogStep, setCurrentDialogStep] = useState<number>(0)

  const [newClassState, dispatchNewClassAction] = useReducer<(state: ClassroomState, action: ClassroomConfigAction) => ClassroomState>(newClassReducer, initialConfigState)
  const [newClassEnrollmentState, dispatchClassEnrollmentChange] = useReducer<(state: ClassEnrollmentState, action: ClassEnrollmentAction) => ClassEnrollmentState>(classEnrollmentReducer, initialClassEnrollmentState)
  const [deskLayoutPlan, dispatchLayoutChange] = useReducer<(layoutPlan: DeskLayoutPlan, change: DeskLayoutPlanChange) => DeskLayoutPlan>(deskLayoutReducer, startingDeskLayoutPlan)

  function getDeskLayout(deskLayoutCells: DeskGridCellProps[]): JSX.Element[] {
    const deskPlan: JSX.Element[] = []
    for (let i = 0; i < deskLayoutCells.length; i++) {
      deskPlan.push(
        <DeskGridCell 
          key={`${deskLayoutCells[i].cellNumber}`}
          row={deskLayoutCells[i].row}
          column={deskLayoutCells[i].column}
          cellNumber={deskLayoutCells[i].cellNumber}
          intent={deskLayoutCells[i].intent}
          grid={deskLayoutCells[i].grid}
          onIntentChange={handleChangeInDeskGridCellIntent(deskLayoutCells[i].cellNumber)}
        /> 
      )
    }
    return deskPlan
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
            onChange={(event) => {dispatchClassEnrollmentChange({type: 'update_new_student_family_name', newStudentArrayindex: i, newValue: event.target.value})}} 
          />
          <Input
            type='text'
            placeholder='Family Name (Katakana)'
            value={newStudents[i].familyNames[0].annotation}
            onChange={(event) => {dispatchClassEnrollmentChange({type: 'update_new_student_family_name_katakana', newStudentArrayindex: i, newValue: event.target.value})}} 
          />
          <Input
            type='text'
            placeholder='Family Name (Romaji)'
            value={newStudents[i].familyNames[0].nameToken.en}
            onChange={(event) => {dispatchClassEnrollmentChange({type: 'update_new_student_family_name_romaji', newStudentArrayindex: i, newValue: event.target.value})}} 
          />
          <Input
            type='text'
            placeholder='Given Name'
            value={newStudents[i].givenNames[0].nameToken.ja}
            onChange={(event) => {dispatchClassEnrollmentChange({type: 'update_new_student_given_name', newStudentArrayindex: i, newValue: event.target.value})}} 
          />
          <Input
            type='text'
            placeholder='Given Name (Katakana)'
            value={newStudents[i].givenNames[0].annotation}
            onChange={(event) => {dispatchClassEnrollmentChange({type: 'update_new_student_given_name_katakana', newStudentArrayindex: i, newValue: event.target.value})}} 
          />
          <Input
            type='text'
            placeholder='Given Name (Romaji)'
            value={newStudents[i].givenNames[0].nameToken.en}
            onChange={(event) => {dispatchClassEnrollmentChange({type: 'update_new_student_given_name_romaji', newStudentArrayindex: i, newValue: event.target.value})}} 
          />
          <Button color='danger' onPress={() => {dispatchClassEnrollmentChange({type: 'delete_new_student', newStudentArrayindex: i})}}>Delete</Button>
      </div>
      ))
    }
    return formGroups
  }
  function studentDragStartHandler(event: DragEvent) {
    
  }

  function handleChangeInDeskGridCellIntent(i: number) {
    return (key:Key) => {
      dispatchLayoutChange({type: 'change_intent_for_desk_layout_cell', deskCellNumber: i, newIntent: Number(key)})
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
    dispatchClassEnrollmentChange({type: 'add_new_students_from_spreadsheet', newStudents: spreadsheetStudentList})
  }

  return (
    <>
      <Modal id='add-new-students' isOpen={currentDialogStep === 1} size='5xl'>
        <ModalContent>
          <ModalHeader>
            Create a New Class
          </ModalHeader>
          <ModalBody>
            <div>
              <input type='file' accept='.xls, .xlsx, .csv' onChange={fileSelectHandler}/>
              <div>
                {getNewStudentFormGroups(newClassEnrollmentState.newStudents)}
              </div>
              {JSON.stringify(newClassEnrollmentState.newStudents, null, 2)}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button 
              color='primary'
              isDisabled={newClassEnrollmentState.newStudents.length === 0}
              onPress={() => {
                dispatchNewClassAction({type:'finalize_student_list', newStudents: newClassEnrollmentState.newStudents})
                dispatchLayoutChange({type: 'find_initial_desk_layout', studentList: newClassState.studentEnrollment})
                setCurrentDialogStep(2)
              }}
            >
              Next
            </Button>
            <Button>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal id='set-desk-layout' isOpen={currentDialogStep === 2} size='5xl'>
        <ModalContent>
          <ModalHeader>
            Set Desk Layout
          </ModalHeader>
          <ModalBody>
            <div className={`desk-plan grid gap-10 grid-rows-${deskLayoutPlan.deskLayout.rows} grid-cols-${deskLayoutPlan.deskLayout.columns}`}>
              {getDeskLayout(deskLayoutPlan.deskLayoutCells)}
            </div>
            <SeatingGridSettings 
              grid={deskLayoutPlan.deskLayout}
              onRowCountChange={(newRowCount: number) => {dispatchLayoutChange({type: 'change_desk_layout_row_count', newRowCount: newRowCount})}}
              onColumnCountChange={(newColumnCount: number) => {dispatchLayoutChange({type: 'change_desk_layout_column_count', newColumnCount: newColumnCount})}}
            />
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
      <Modal id='assign-seats' isOpen={currentDialogStep === 3} size='5xl'>
        <ModalContent>
          <ModalHeader>
            Assign Seats
          </ModalHeader>
          <ModalBody>
            {/* <div className={`desk-plan grid gap-10 grid-rows-${newClassState.deskLayout.rows} grid-cols-${newClassState.deskLayout.columns}`}>
              <SeatingPlan students={newClassState.studentEnrollment} deskSlots={newClassState.deskLayoutCells} seatingGrid={newClassState.deskLayout}></SeatingPlan>
            </div> */}
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
      <Button onPress={() => {setCurrentDialogStep(1)}}>
        New Class
      </Button>
    </>

  )
}

export default Setup