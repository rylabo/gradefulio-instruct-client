import React, { useState, Key } from 'react'
// import { SeatSpec } from './_Seat'
import { Card, CardBody } from '@nextui-org/card';
import { Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { StudentObj } from '../../../lib/StudentObj';
import { GridSpec } from '../../../lib/SeatingPlan';

export interface DeskGridCellProps {
  row : number,
  column : number,
  intent : number,
  grid: GridSpec,
}

export interface DeskGridCellEvents {
  onIntentChange: (key: Key) => void
}

export interface AssignedDeskGridCell {
  assignedTo: StudentObj
}

function getDirectiveListItems(slotStates: string[]) {
  const slotItems = [];
  for (let i: number = 0; i < slotStates.length; i++){
    slotItems.push((
      <ListboxItem key={i}>{slotStates[i]}</ListboxItem>
    ));
  }
  return slotItems
}

function DeskGridCell(
  {row, column, grid, intent, onIntentChange} : DeskGridCellProps & DeskGridCellEvents
) {
  const slotStates: string[] = [
    'Use',
    'Don\'t Use',
    'Empty',  
  ]

  const stateButtons = getDirectiveListItems(slotStates);
 
  return (
    <Popover triggerType='listbox'>
      <PopoverTrigger className={`col-start-${column} row-start-${grid.rows - row + 1}`}>
        <Card isPressable>
          <CardBody>
            {intent}
            <br />
            {intent!== 2 ? "desk" : "empty"}
          </CardBody>
        </Card>
      </PopoverTrigger>
      <PopoverContent>
        <Listbox
          aria-label='Actions'
          disallowEmptySelection
          selectionMode='single'
          onAction={(key) => {onIntentChange(key)}}>
          {stateButtons}
        </Listbox>
      </PopoverContent>
    </Popover> 
  )
}

export default DeskGridCell