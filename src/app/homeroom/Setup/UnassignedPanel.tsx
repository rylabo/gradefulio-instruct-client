import React from 'react'
import { AssignedDeskInfo, DeskInfo, SeatingPlusPreview, StudentReference } from '../../../lib/SeatingPlan'
import { Student } from '../../../lib/StudentObj'
import { Chip } from '@nextui-org/react'

interface UnassignedPanelProps {
  seatingAssignment: SeatingPlusPreview
  onStudentDragStart: (studentIndex: number, students: Student[], deskRow: number, deskCol: number) => (event: React.DragEvent) => void
  onStudentDragEnd: () => (event: React.DragEvent) => void
  onStudentDragOverUnassigned: (sourceDeskInfo: AssignedDeskInfo | undefined) => (event: React.DragEvent) => void
  onStudentDragIntoUnassigned: (
    sourceDeskInfo: AssignedDeskInfo | undefined,
    // destinationDeskColumn: number,
    // destinationStudentIndex?: number
  ) => (event: React.DragEvent) => void
  onStudentDragOutOfUnassigned: () => (event: React.DragEvent) => void,
  onStudentDrop: (
    destinationDeskRow: number,
    destinationDeskColumn: number,
    destinationStudentIndex?: number
  ) => (event: React.DragEvent) => void
}

function UnassignedPanel({
  seatingAssignment,
  onStudentDragStart,
  onStudentDragEnd,
  onStudentDragOverUnassigned,
  onStudentDragIntoUnassigned,
  onStudentDragOutOfUnassigned, 
  onStudentDrop
}: UnassignedPanelProps) {
  const unassignedStudentChips: JSX.Element[] = getUnassignedStudentChips(seatingAssignment.students, seatingAssignment.unassignedStudents, seatingAssignment.sourcePreview, seatingAssignment.unassignedArrayIndex)

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
          onDragStart={onStudentDragStart(unassignedStudents[i].studentIndex, seatingAssignment.students, -1, i)}
          onDragEnd={onStudentDragEnd()}
          {...(sourcePreview && sourcePreview.deskRow === -1 && sourcePreview.deskColumn === i) ? {className: 'animate-drag-start'}: {}} 
        >
          {unassignedStudents[i].student.familyNames[0].nameToken.ja}　{unassignedStudents[i].student.givenNames[0].nameToken.ja}
        </Chip>
      ))
    }
    return unassignedStudentChips
  }

  return (
    <div 
    className='p-10'
    onDragEnter={onStudentDragOutOfUnassigned()}
    >
      <div 
        className='flex'
        onDragOver={onStudentDragOverUnassigned(seatingAssignment.draggedStudentInfo)}
        onDragEnter={onStudentDragIntoUnassigned(seatingAssignment.draggedStudentInfo)}
        onDrop={onStudentDrop(-1, -1)}
      >
        {unassignedStudentChips}
     </div>
    </div>
  )
}

export default UnassignedPanel