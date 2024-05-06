import React from 'react'
import { AssignedDeskInfo, DeskInfo, SeatingPlusPreview, StudentReference } from '../../../lib/SeatingPlan'
import { Student } from '../../../lib/StudentObj'
import { Chip } from '@nextui-org/react'

interface UnassignedPanelProps {
  seatingAssignment: SeatingPlusPreview
  onStudentDragStart: (studentIndex: number, deskRow: number, deskCol: number) => (event: React.DragEvent) => void
  onStudentDragEnd: () => (event: React.DragEvent) => void
  onStudentDragOverDesk:(
    sourceDeskInfo: AssignedDeskInfo | undefined,
    destinationStudentIndex?: number
  ) => (event: React.DragEvent) => void
  onStudentDragOverUnassigned: (
    sourceDeskInfo: AssignedDeskInfo | undefined,
    destinationColumn?: number
  ) => (event: React.DragEvent) => void
  onStudentDragIntoUnassigned: (
    sourceDeskInfo: AssignedDeskInfo | undefined,
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

function UnassignedPanel({seatingAssignment, onStudentDragStart, onStudentDragEnd, onStudentDragOverUnassigned, onStudentDragIntoUnassigned, onStudentDragOutOfDesk, onStudentDrop}: UnassignedPanelProps) {
  const unassignedStudentChips: JSX.Element[] = getUnassignedStudentChips(seatingAssignment.students, seatingAssignment.unassignedStudents, seatingAssignment.sourcePreview, seatingAssignment.unnassignedArrayIndex)

  function getUnassignedStudentChips(
    students: Student[],
    unassignedStudents: StudentReference[],
    sourcePreview: DeskInfo | undefined,
    studentPreviewIndex?: number
  ): JSX.Element[] {
    const unassignedStudentChips: JSX.Element[] = []

    for (let i = 0; i < unassignedStudents.length; i++) {
      unassignedStudentChips.push((
        <Chip
          draggable
          // onDragStart={onStudentDragStart(unassignedStudents[i].studentIndex, -1, i)}

          // onDragEnd={onStudentDragEnd()}
        // {...(sourcePreview && sourcePreview.deskRow === rowIndex && sourcePreview.deskColumn === colIndex) ? {className: 'animate-drag-start'}: {}} 
        >
          {unassignedStudents[i].student.familyNames[0].nameToken.ja}　{unassignedStudents[i].student.givenNames[0].nameToken.ja}
        </Chip>
      ))
    }
    // const unassignedStudentChips: JSX.Element[] = unassignedStudents.map((student: Student) => {
    //   return (
    //     <Chip
    //       draggable
    //       onDragStart={onStudentDragStart(template.studentIndex, template.row, template.column)}
    //       onDragEnd={onStudentDragEnd()}
    //     {...(sourcePreview && sourcePreview.deskRow === rowIndex && sourcePreview.deskColumn === colIndex) ? {className: 'animate-drag-start'}: {}} 
    //     >
    //     {template.assignedTo.familyNames[0].nameToken.ja}　{template.assignedTo.givenNames[0].nameToken.ja}
    //     </Chip>
    //   )
      
    // })
    return unassignedStudentChips
  }

  return (
    <div 
      // onDragEnter={onStudentDragOutOfDesk()}
    >
      <div 
        className='flex'
        // onDragOver={onStudentDragOverUnassigned(seatingAssignment.draggedStudentInfo, seatingAssignment.destinationPreview?.deskColumn)}
        // onDragEnter={onStudentDragIntoUnassigned(seatingAssignment.draggedStudentInfo, seatingAssignment.)}
      >
        {unassignedStudentChips}
     </div>
    </div>
  )
}

export default UnassignedPanel