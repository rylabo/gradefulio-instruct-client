import React from 'react'
import { Student } from '../../../lib/StudentObj'
import { AssignedDeskInfo, DeskInfo, DeskTemplate, SeatingPlusPreview } from '../../../lib/SeatingPlan'
import { isDeskTemplate } from '../../../util/deskLayout'
import { Card, Chip } from '@nextui-org/react'


interface SeatAssignPanelProps {
  seatingAssignment: SeatingPlusPreview
  onStudentDragStart: (studentIndex: number, students: Student[], deskRow: number, deskCol: number) => (event: React.DragEvent) => void
  onStudentDragEnd: () => (event: React.DragEvent) => void
  onStudentDragOverDesk:(
    sourceDeskInfo: AssignedDeskInfo | undefined,
    destinationStudentIndex?: number
  ) => (event: React.DragEvent) => void
  onStudentDragStudentOntoDesk: (
    sourceDeskInfo: AssignedDeskInfo | undefined,
    destinationDeskRow: number,
    destinationDeskColumn: number,
    destinationStudentIndex?: number
  ) => (event: React.DragEvent) => void
  onStudentDragOutOfDesk: () => (event: React.DragEvent) => void,
  onStudentDrop: (
    destinationDeskRow: number,
    destinationDeskColumn: number,
    destinationStudentIndex?: number
  ) => (event: React.DragEvent) => void
}

function SeatAssignPanel({ seatingAssignment, onStudentDragStart, onStudentDragEnd, onStudentDragOverDesk, onStudentDragStudentOntoDesk, onStudentDragOutOfDesk, onStudentDrop } : SeatAssignPanelProps) {

  const deskCards: JSX.Element[] = getDesksDisplay(seatingAssignment.students, seatingAssignment.desks, seatingAssignment.sourcePreview, seatingAssignment.destinationPreview)
  
  function getDesksDisplay(students: Student[], desks: (DeskTemplate | {})[][], sourcePreview: DeskInfo | undefined, destinationPreview: DeskInfo | undefined): JSX.Element[] {
    const deskDisplay: JSX.Element[] = []
      for (let colIndex = 0; colIndex < desks[0].length; colIndex++) {
        for (let rowIndex = 0; rowIndex < desks.length; rowIndex++){
          const template: DeskTemplate | {} = desks[rowIndex][colIndex]
          if (isDeskTemplate(template)){
            deskDisplay.push((
              <Card 
                key={'desk [' + rowIndex + ', ' + colIndex + ']' }
                className={`col-start-${colIndex + 1} row-start-${desks.length - rowIndex} min-h-32`}
                onDragOver={onStudentDragOverDesk(seatingAssignment.draggedStudentInfo, template.studentIndex)}
                onDragEnter={onStudentDragStudentOntoDesk(seatingAssignment.draggedStudentInfo, rowIndex, colIndex, template.studentIndex)}
                onDrop={onStudentDrop(rowIndex, colIndex, template.studentIndex)}
                style={{minHeight: 128}}
              >
                {
                  // check if this desk is assigned to someone, and put a chip in if so.
                  template.assignedTo && template.studentIndex !== undefined && !(destinationPreview && destinationPreview.deskRow === rowIndex && destinationPreview.deskColumn === colIndex) ? (
                    <Chip
                      draggable
                      onDragStart={onStudentDragStart(template.studentIndex, students, template.row, template.column)}
                      onDragEnd={onStudentDragEnd()}
                      {...(sourcePreview && sourcePreview.deskRow === rowIndex && sourcePreview.deskColumn === colIndex) ? {className: 'animate-drag-start'}: {}} 
                    >
                      {template.assignedTo.familyNames[0].nameToken.ja}　{template.assignedTo.givenNames[0].nameToken.ja}
                    </Chip>
                  ) : undefined
                  // check if a chip is being dragged over, 
                }

                {
                  // check if a for preview data, and put a chip in if present/
                  sourcePreview && sourcePreview.deskRow === rowIndex && sourcePreview.deskColumn === colIndex && sourcePreview.student !== undefined ? (
                    <Chip                    >
                      {sourcePreview.student.familyNames[0].nameToken.ja}　{sourcePreview.student.givenNames[0].nameToken.ja}
                    </Chip>
                  ) : undefined
                }

                {
                  // check if a for preview data, and put a chip in if present/
                  destinationPreview && destinationPreview.deskRow === rowIndex && destinationPreview.deskColumn === colIndex && destinationPreview.student !== undefined ? (
                    <Chip                    >
                      {destinationPreview.student.familyNames[0].nameToken.ja}　{destinationPreview.student.givenNames[0].nameToken.ja}
                    </Chip>
                  ) : undefined
                }
              </Card>
            ))
          }
        }  
      }
    return deskDisplay
  }

  return (
    <div 
      className={`desk-plan grid gap-10 grid-rows-${seatingAssignment.desks.length} grid-cols-${seatingAssignment.desks[0].length} p-10`}
      onDragEnter={onStudentDragOutOfDesk()}
    >
      {deskCards}
    </div>
  )
}

export default SeatAssignPanel