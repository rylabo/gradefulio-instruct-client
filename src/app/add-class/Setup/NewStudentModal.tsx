import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React, { ChangeEvent, FormEvent, Key, useEffect, useReducer } from 'react'
import { NewStudent, Student } from '../../../lib/StudentObj';
import { read, utils } from 'xlsx';
import { CourseTemplate, isSchoolGrade, NameDto, SchoolGrade } from '../../../lib/Course';

interface NewStudentListItem {
  '姓'?: string
  '名'?: string
  '姓（かたかな）'?: string
  '名（かたかな）'?: string
  '姓（ローマ字）'?: string
  '名（ローマ字）'?: string
}

export interface ClassEnrollmentState {
  courseName: NameDto
  grade: SchoolGrade
  class: string
  newStudents: (NewStudent)[]
}

function deepCopyState (state: ClassEnrollmentState): ClassEnrollmentState {
  const newState: ClassEnrollmentState = {...state}
  newState.courseName = {...state.courseName}
  newState.newStudents = [...state.newStudents]
  return newState
}

type ClassEnrollmentAction = 
  | {type: 'update_course_name', newName: string, subfield: 'key' | 'ja' | 'en'}
  | {type: 'update_grade', newGrade: string | number | bigint}
  | {type: 'update_class_number', newClassNumberString: string}
  | {type: 'add_new_students_from_spreadsheet'; newStudents: (NewStudent)[]}
  | {type: 'add_new_student'}
  | {type: 'initialize_new_students'; newStudents: (NewStudent)[]}
  | {type: 'update_new_student_family_name'; newStudentArrayindex: number; newValue: string }
  | {type: 'update_new_student_family_name_katakana'; newStudentArrayindex: number; newValue: string }
  | {type: 'update_new_student_family_name_romaji'; newStudentArrayindex: number; newValue: string }
  | {type: 'update_new_student_given_name'; newStudentArrayindex: number; newValue: string }
  | {type: 'update_new_student_given_name_katakana'; newStudentArrayindex: number; newValue: string }
  | {type: 'update_new_student_given_name_romaji'; newStudentArrayindex: number; newValue: string }
  | {type: 'delete_new_student'; newStudentArrayindex: number}

const classEnrollmentReducer = (state: ClassEnrollmentState, action: ClassEnrollmentAction): ClassEnrollmentState => {
  switch (action.type) {
    case 'update_course_name': {
      const newState: ClassEnrollmentState = deepCopyState(state)
      newState.courseName[action.subfield] = action.newName
      return newState
    }

    case 'update_grade': {
      const newState: ClassEnrollmentState = deepCopyState(state)
      if (typeof(action.newGrade) === 'string' && isSchoolGrade(action.newGrade)){
        newState.grade = action.newGrade
      }
      return newState
    }    

    case 'update_class_number': {
      const newState: ClassEnrollmentState = deepCopyState(state)
      // if (/^\d+$/.test(action.newClassNumberString)){
      //   const newClassNumber: number = parseInt(action.newClassNumberString)
      //   newState.class = newClassNumber
      // } else {
      //   newState.class = ''
      // }
      newState.class = action.newClassNumberString
      return newState
    }    

    case 'add_new_students_from_spreadsheet': {
      const newState: ClassEnrollmentState = deepCopyState(state)
      newState.newStudents = action.newStudents      
      return newState
    }

    case 'add_new_student': {
      const newState: ClassEnrollmentState = deepCopyState(state)
      newState.newStudents.push({
        '@type': ['Student'],
        'familyNames': [{
          'annotation': '',
          'nameToken': {
            'en': '',
            'ja': ''
          }
        }],
        'givenNames': [{
          'annotation': '',
          'nameToken': {
            'en': '',
            'ja': ''
          }
        }]
      })      
      return newState
    }

    case 'initialize_new_students': {
      const newState: ClassEnrollmentState = deepCopyState(state)
      newState.newStudents = action.newStudents      
      return newState
    }

    
    case 'update_new_student_family_name': {
      const newState: ClassEnrollmentState = deepCopyState(state)
      newState.newStudents[action.newStudentArrayindex].familyNames[0].nameToken.ja = action.newValue;
      return newState
    }

    case 'update_new_student_family_name_katakana': {
      const newState: ClassEnrollmentState = deepCopyState(state)
      newState.newStudents[action.newStudentArrayindex].familyNames[0].annotation = action.newValue;
      return newState
    }

    case 'update_new_student_family_name_romaji': {
      const newState: ClassEnrollmentState = deepCopyState(state)
      newState.newStudents[action.newStudentArrayindex].familyNames[0].nameToken.en = action.newValue;
      return newState
    }

    case 'update_new_student_given_name': {
      const newState: ClassEnrollmentState = deepCopyState(state)
      newState.newStudents[action.newStudentArrayindex].givenNames[0].nameToken.ja = action.newValue;
      return newState
    }

    case 'update_new_student_given_name_katakana': {
      const newState: ClassEnrollmentState = deepCopyState(state)
      newState.newStudents[action.newStudentArrayindex].givenNames[0].annotation = action.newValue;
      return newState
    }

    case 'update_new_student_given_name_romaji': {
      const newState: ClassEnrollmentState = deepCopyState(state)
      newState.newStudents[action.newStudentArrayindex].givenNames[0].nameToken.en = action.newValue;
      return newState
    }
    
    case 'delete_new_student': {
      const newState: ClassEnrollmentState = deepCopyState(state)
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
  courseName: {
    key: '',
    ja: '',
    en: ''
  },
  grade: '',
  class: '',
  newStudents: []
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
          "annotation": item['名（かたかな）'] ? item['名（かたかな）'] : '',
          "nameToken": {
            "en": item['名（ローマ字）'] ? item['名（ローマ字）'] : '',
            "ja": item['名'] ? item['名'] : ''
          }
        }
      ],
      "familyNames": [
        {
          "annotation": item['姓（かたかな）'] ? item['姓（かたかな）'] : '',
          "nameToken": {
            "en": item['姓（ローマ字）'] ? item['姓（ローマ字）'] : '',
            "ja": item['姓'] ? item['姓'] : ''
          }
        }
      ],
    }
  })
  return spreadsheetStudentList
}

interface NewStudentModalProps {
  isOpen: boolean
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full' | undefined
  isDismissable: boolean
  enrollment: NewStudent[]
  onNextPressed: (enrollment: ClassEnrollmentState) => void
  onCancel: () => void 
}

function NewStudentModal({isOpen, size, isDismissable, enrollment, onNextPressed, onCancel}: NewStudentModalProps) {
  const [newClassEnrollmentState, dispatchClassEnrollmentChange] = useReducer<(state: ClassEnrollmentState, action: ClassEnrollmentAction) => ClassEnrollmentState>(classEnrollmentReducer, initialClassEnrollmentState)

  useEffect(() => {
    dispatchClassEnrollmentChange({type: 'initialize_new_students' , newStudents: enrollment})
  }, [enrollment] )



  function getNewStudentFormGroups(newStudents: NewStudent[]): JSX.Element[] {
    const formGroups: JSX.Element[] = []
    for (let i = 0; i < newStudents.length; i++) {
      formGroups.push((
        <fieldset key={'newStudentFormGroup' + i} className='flex' >
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
            onChange={(event: ChangeEvent<HTMLInputElement>) => {dispatchClassEnrollmentChange({type: 'update_new_student_given_name_romaji', newStudentArrayindex: i, newValue: event.target.value})}} 
          />
          <Button color='danger' onPress={() => {dispatchClassEnrollmentChange({type: 'delete_new_student', newStudentArrayindex: i})}}>Delete</Button>
      </fieldset>
      ))
    }
    return formGroups
  }

  return (
    <Modal id='add-new-students' isOpen={isOpen} size={size} isDismissable={isDismissable} onClose={onCancel}>
      <ModalContent>
        <ModalHeader>
          Create a New Class
        </ModalHeader>
        <ModalBody>
          <div>
            <h2>Course Details</h2>
            <Input
              type='text'
              label='Course Name'
              labelPlacement='outside'
              value={newClassEnrollmentState.courseName.ja}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                dispatchClassEnrollmentChange({type: 'update_course_name', newName: event.target.value, subfield: 'ja'})       
              }}
            />
            <Input
              type='text'
              label='Course Name (Kana)'
              labelPlacement='outside'
              value={newClassEnrollmentState.courseName.key}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                dispatchClassEnrollmentChange({type: 'update_course_name', newName: event.target.value, subfield: 'key'})       
              }}
            />
            <Input
              type='text'
              label='Course Name (Romaji)'
              labelPlacement='outside'
              value={newClassEnrollmentState.courseName.en}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                dispatchClassEnrollmentChange({type: 'update_course_name', newName: event.target.value, subfield: 'en'})       
              }}
            />
            <Dropdown>
              <DropdownTrigger>
                <Button>{newClassEnrollmentState.grade !== '' ? newClassEnrollmentState.grade : 'Grade'}</Button>
              </DropdownTrigger>
              <DropdownMenu
              onAction={(key: Key) => {
                dispatchClassEnrollmentChange({type: 'update_grade', newGrade: key.valueOf()})
              }}>
                <DropdownItem key={'小1'}>小1</DropdownItem>
                <DropdownItem key={'小2'}>小2</DropdownItem>
                <DropdownItem key={'小3'}>小3</DropdownItem>
                <DropdownItem key={'小4'}>小4</DropdownItem>
                <DropdownItem key={'小5'}>小5</DropdownItem>
                <DropdownItem key={'小6'}>小6</DropdownItem>
                <DropdownItem key={'中1'}>中1</DropdownItem>
                <DropdownItem key={'中2'}>中2</DropdownItem>
                <DropdownItem key={'中3'}>中3</DropdownItem>
                <DropdownItem key={'高1'}>高1</DropdownItem>
                <DropdownItem key={'高2'}>高2</DropdownItem>
                <DropdownItem key={'高3'}>高3</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Input
              type='text'
              label='Class Number'
              labelPlacement='outside'
              value={newClassEnrollmentState.class.toString()}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                dispatchClassEnrollmentChange({type: 'update_class_number', newClassNumberString: event.target.value})
              }}
            />
            <h2>Course Enrollment</h2>
            <input type='file' accept='.xls, .xlsx, .csv' onChange={ async (event) => {
              dispatchClassEnrollmentChange({
                type: 'add_new_students_from_spreadsheet',
                newStudents: readStudentListFile(await event.target.files?.item(0)?.arrayBuffer())
              })
            }}/>
            <fieldset>
              {getNewStudentFormGroups(newClassEnrollmentState.newStudents)}
            </fieldset>
            <Button color='primary' onPress={() => {
              console.log('add new student press event')
              dispatchClassEnrollmentChange({type: 'add_new_student'})
            }}>Add Student</Button>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color='primary'
            isDisabled={newClassEnrollmentState.newStudents.length === 0}
            onPress={() => {onNextPressed(newClassEnrollmentState)}}
          >
            Next
          </Button>
          <Button color='danger' onPress={() => onCancel()}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default NewStudentModal
