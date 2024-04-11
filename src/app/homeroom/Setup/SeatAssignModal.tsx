import React, { useEffect, useReducer } from 'react'
import { Button, Card, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { StudentObj } from '../../../lib/StudentObj'
import { DeskTemplate, BlankNode } from '../../../lib/SeatingPlan'
import { deepCopyDeskLayout, getCellUsage, isDeskTemplate } from '../../../util/deskLayout'

interface AssignSeatProps {
  isOpen: boolean
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full' | undefined
  students: (StudentObj & BlankNode) []
  desks: (DeskTemplate | {})[][]
}

interface SeatingAssignment {
  desks: (DeskTemplate | {})[][]
}

type AssignAction = 
  | {type: 'default_seating', students: (StudentObj & BlankNode) [], desks: (DeskTemplate | {})[][]}


function compareStudents(a: StudentObj, b: StudentObj): number {

  // attendance numbers before names.
  if (!a.attendanceNumber && b.attendanceNumber) return 1
  else if (a.attendanceNumber && !b.attendanceNumber) return -1

  else if (a.attendanceNumber && b.attendanceNumber) {
    if (a.attendanceNumber > b.attendanceNumber) return 1
    else if (a.attendanceNumber < b.attendanceNumber) return -1
    else return 0
  }

  else {
    if (a.familyNames[0].annotation > b.familyNames[0].annotation) return 1
    else if (a.familyNames[0].annotation < b.familyNames[0].annotation) return -1
    else if (a.givenNames[0].annotation > b.givenNames[0].annotation) return 1  
    else if (a.givenNames[0].annotation < b.givenNames[0].annotation) return -1
  }
  return 0
}

function sortStudents(students: (StudentObj & BlankNode) []): (StudentObj & BlankNode) [] {
  return students.toSorted(compareStudents)
}

function getDefaultSeating(students: (StudentObj & BlankNode) [], desks: (DeskTemplate | {})[][]): (DeskTemplate | {})[][] {
  let studentNumber: number = 0
  const newSeating: (DeskTemplate | {})[][] = deepCopyDeskLayout(desks)
  const sS: (StudentObj & BlankNode) [] = sortStudents(students)
  for (let j = 0; j < newSeating[0].length; j++) {
    for (let i = 0; i < newSeating.length; i++) {
      const obj: DeskTemplate | {} = newSeating[i][j]
      if (isDeskTemplate(obj) && obj.assign) {
          obj.assignedTo = sS[studentNumber]
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
        desks: getDefaultSeating(action.students, action.desks)
      } 
    }

    default:
      return seating
  }
}

function SeatAssignModal({ isOpen, size, students, desks } : AssignSeatProps) {
  const [seating, dispatchAssignment] = useReducer<(seating: SeatingAssignment, action: AssignAction) => SeatingAssignment>(seatingReducer, {desks: desks})

  useEffect(() => {
    dispatchAssignment({type: 'default_seating', students, desks})
  }, [students, desks])

function getDesksDisplay(desks: (DeskTemplate | {})[][]): JSX.Element[] {
  const deskDisplay: JSX.Element[] = []
    for (let i = 0; i < desks.length; i++){
      for (let j = 0; j < desks[0].length; j++) {
        const template: DeskTemplate | {} = desks[i][j]
          if (isDeskTemplate(template)){
            if(template.assignedTo){
              deskDisplay.push((<Card key={'desk [' + i + ', ' + j + ']' } className={`col-start-${j + 1} row-start-${desks.length - i}`}>
              <Chip draggable>{template.assignedTo.familyNames[0].nameToken.ja}　{template.assignedTo.givenNames[0].nameToken.ja}</Chip>
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