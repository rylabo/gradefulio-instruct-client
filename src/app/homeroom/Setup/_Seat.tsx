import React, { DragEventHandler, useState } from 'react'
import { GridSpec } from './SeatingPlanBlueprint'
import { Card, CardBody, CardFooter, CardHeader, Chip } from '@nextui-org/react'
import { StudentObj } from '../../../lib/StudentObj'
import { DeskSlotProps } from './DeskSlot'

export interface SeatSpec {
  deskSlot: DeskSlotProps
  occupant ?: StudentObj
}

export type SeatSpace = SeatSpec | undefined


export default function Seat(
  {deskSlot, occupant} : SeatSpec
) {
  const [draggedStudent, setDraggedStudent] = useState<string>();

  const dragStartHandler: DragEventHandler<HTMLDivElement> = (event: React.DragEvent) => {
    console.log("dragging!")
    setDraggedStudent(event.dataTransfer.getData("text/plain"));
  }
  
  return (
    <Card 
      className={`row-start-${deskSlot.grid.rows - deskSlot.row + 1} col-start-${deskSlot.column}`}
    >
      <CardHeader>{deskSlot.seatNumber}</CardHeader>
      <CardBody>
        {occupant ? 
          (<Chip draggable='true' onDragStart={dragStartHandler}>
          <ruby>
            {occupant.familyNames[0].nameToken.ja}
            <rt>{occupant.familyNames[0].annotation}</rt>
          </ruby>　
          <ruby>
            {occupant.givenNames[0].nameToken.ja}
            <rp>(</rp><rt>{occupant.givenNames[0].annotation}</rt><rp>)</rp>
          </ruby>
        </Chip>) :
        undefined
        }
      </CardBody>
      <CardFooter>Being dragged: {draggedStudent}</CardFooter>
    </Card>
  )
}
