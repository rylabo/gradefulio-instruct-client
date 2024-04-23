// import { Card } from '@nextui-org/card'
// import React from 'react'
// import { DeskLayout, DeskTemplate } from '../../../lib/SeatingPlan'

// interface DeskCardProps {
//   desk: DeskTemplate
//   row: number
//   column: number
//   onDragStudentOver: React.DragEventHandler<HTMLDivElement>
//   onDragStudentExit: React.DragEventHandler<HTMLDivElement>
//   onDragStudentFrom: React.DragEventHandler<HTMLDivElement>
//   onDragStudentCancel: React.DragEventHandler<HTMLDivElement>
//   onDropStudent: React.DragEventHandler<HTMLDivElement>
// }

// function DeskCard({desk}: DeskCardProps) {
//   return (
//     <DeskCardPresentation>

//     </DeskCardPresentation>
//   )
// }

// interface DeskCardPresentationProps{
//   studentChip?: JSX.Element
// }

// function DeskCardPresentation({studentChip}: DeskCardPresentationProps) {
//   return (
//     <Card
//       key={'desk [' + rowIndex + ', ' + colIndex + ']' }
//       className={`col-start-${colIndex + 1} row-start-${desks.length - rowIndex} min-h-32`}
//       style={{minHeight: 128}}
//     >
//       {studentChip}
//     </Card>
//   )
// }

// export default DeskCard