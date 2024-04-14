import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React, { useReducer } from 'react'
import { NewStudent } from '../../../lib/StudentObj';
import { read, utils } from 'xlsx';

interface NewStudentListItem {
  '姓': string
  '名': string
  '姓（かたかな）': string
  '名（かたかな）': string
  '姓（ローマ字）': string
  '名（ローマ字）': string
}

interface ClassEnrollmentState {
  newStudents: (NewStudent)[]
}

type ClassEnrollmentAction = 
  | {type: 'add_new_students_from_spreadsheet'; newStudents: (NewStudent)[]}
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

const initialClassEnrollmentState: ClassEnrollmentState = {
  newStudents: []
}


interface NewStudentModalProps {
  isOpen: boolean
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full' | undefined
  onEnrollmentFinalized: (enrollment: (NewStudent)[]) => void 
}

function readStudentListFile(file: ArrayBuffer | undefined): (NewStudent)[] {
  const wb = read(file)
  const ws = wb.Sheets[wb.SheetNames[0]]
  const data: NewStudentListItem[] = utils.sheet_to_json<NewStudentListItem>(ws)
  const spreadsheetStudentList: (NewStudent)[] = data.map((item: NewStudentListItem) => {
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
  return spreadsheetStudentList
}

function NewStudentModal({isOpen, size, onEnrollmentFinalized}: NewStudentModalProps) {
  const [newClassEnrollmentState, dispatchClassEnrollmentChange] = useReducer<(state: ClassEnrollmentState, action: ClassEnrollmentAction) => ClassEnrollmentState>(classEnrollmentReducer, initialClassEnrollmentState)

  function getNewStudentFormGroups(newStudents: NewStudent[]): JSX.Element[] {
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

  return (
    <Modal id='add-new-students' isOpen={isOpen} size={size}>
      <ModalContent>
        <ModalHeader>
          Create a New Class
        </ModalHeader>
        <ModalBody>
          <div>
            <input type='file' accept='.xls, .xlsx, .csv' onChange={ async (event) => {
              dispatchClassEnrollmentChange({
                type: 'add_new_students_from_spreadsheet',
                newStudents: readStudentListFile(await event.target.files?.item(0)?.arrayBuffer())
              })
            }}/>
            <div>
              {getNewStudentFormGroups(newClassEnrollmentState.newStudents)}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color='primary'
            isDisabled={newClassEnrollmentState.newStudents.length === 0}
            onPress={() => {onEnrollmentFinalized(newClassEnrollmentState.newStudents)}}
          >
            Next
          </Button>
          <Button>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default NewStudentModal
