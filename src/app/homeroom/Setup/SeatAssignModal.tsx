import React, { useEffect, useReducer } from 'react'
import { Button, Card, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { Student } from '../../../lib/StudentObj'
import { DeskTemplate } from '../../../lib/SeatingPlan'
import { deepCopyDeskLayout, getCellUsage, isDeskTemplate } from '../../../util/deskLayout'

interface AssignSeatProps {
  isOpen: boolean
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full' | undefined
  students: Student []
  desks: (DeskTemplate | {})[][]
}

interface StudentCard {
  student: Student
  card: JSX.Element
}
interface SeatingAssignment {
  desks: (DeskTemplate | {})[][]
  students: StudentCard[]
  draggedStudent?: Student
  unassignedStudents: StudentCard[]
}

type AssignAction = 
  | {type: 'default_seating', students: StudentCard[], desks: (DeskTemplate | {})[][]}
  | {type: 'moving_student', index: number}
  | {type: 'swap_student_desks', index: number}
  | {type: 'unassign_desk', index: number}


function compareStudents(a: StudentCard, b: StudentCard): number {

  // attendance numbers before names.
  if (!a.student.attendanceNumber && b.student.attendanceNumber) return 1
  else if (a.student.attendanceNumber && !b.student.attendanceNumber) return -1

  else if (a.student.attendanceNumber && b.student.attendanceNumber) {
    if (a.student.attendanceNumber > b.student.attendanceNumber) return 1
    else if (a.student.attendanceNumber < b.student.attendanceNumber) return -1
    else return 0
  }

  else {
    if (a.student.familyNames[0].annotation > b.student.familyNames[0].annotation) return 1
    else if (a.student.familyNames[0].annotation < b.student.familyNames[0].annotation) return -1
    else if (a.student.givenNames[0].annotation > b.student.givenNames[0].annotation) return 1  
    else if (a.student.givenNames[0].annotation < b.student.givenNames[0].annotation) return -1
  }
  return 0
}

function sortStudents(students: StudentCard[]): StudentCard[] {
  return students.toSorted(compareStudents)
}

function getDefaultSeating(students: StudentCard[], desks: (DeskTemplate | {})[][]): (DeskTemplate | {})[][] {
  // TODO chagne to cards and move within rfce code
  let studentNumber: number = 0
  const newSeating: (DeskTemplate | {})[][] = deepCopyDeskLayout(desks)
  const sS: StudentCard[] = sortStudents(students)
  for (let j = 0; j < newSeating[0].length; j++) {
    for (let i = 0; i < newSeating.length; i++) {
      const obj: DeskTemplate | {} = newSeating[i][j]
      if (isDeskTemplate(obj) && obj.assign && sS[studentNumber]) {
        obj.assignedTo = sS[studentNumber].student
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
        students: seating.students,
        unassignedStudents: seating.unassignedStudents
      } 
    }

    case 'moving_student' : {
      const newSeatingAssignment: SeatingAssignment = {...seating}
      newSeatingAssignment.draggedStudent = seating.students[action.index].student
      return newSeatingAssignment
    }

    default:
      return seating
  }
}


function SeatAssignModal({ isOpen, size, students, desks } : AssignSeatProps) {
  const [seating, dispatchAssignment] = useReducer<(seating: SeatingAssignment, action: AssignAction) => SeatingAssignment>(seatingReducer, {desks: desks, unassignedStudents: [], students: getStudentCard(students)})

  useEffect(() => {
    dispatchAssignment({type: 'default_seating', students: getStudentCard(students), desks: desks})
  }, [students, desks])

  function getStudentCard(students: Student[]): StudentCard[] {
    return students.map((student, index) => {
      return {
        student: student,
        card: (<Card key={index} draggable>{student.familyNames[0].nameToken.ja + '　' + student.givenNames[0].nameToken.ja}</Card>)
      }
    })
  }
  

  function handleDrag(index: number) {
    return (event: React.DragEvent) => {
      dispatchAssignment({type: 'moving_student', index: index})    
    }
  }
  
function getDesksDisplay(desks: (DeskTemplate | {})[][]): JSX.Element[] {
  const deskDisplay: JSX.Element[] = []
    for (let i = 0; i < desks.length; i++){
      for (let j = 0; j < desks[0].length; j++) {
        const template: DeskTemplate | {} = desks[i][j]
          if (isDeskTemplate(template)){
            if(template.assignedTo){
              deskDisplay.push((<Card key={'desk [' + i + ', ' + j + ']' } className={`col-start-${j + 1} row-start-${desks.length - i}`}>
              <Chip draggable onDrag={(event: React.DragEvent) => {}}>{template.assignedTo.familyNames[0].nameToken.ja}　{template.assignedTo.givenNames[0].nameToken.ja}</Chip>
              </Card>))
            }
            else {
              deskDisplay.push((<Card key={'desk [' + i + ', ' + j + ']'}  className={`col-start-${j + 1} row-start-${desks.length - i}`}>
              </Card>))
            }
            }
          }  
      }
    
  return deskDisplay
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