import React, { useState, Key } from 'react'
// import { SeatSpec } from './_Seat'
import { Card, CardBody } from '@nextui-org/card';
import { Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { GridSpec } from './SeatingPlanBlueprint';

export interface DeskGridCellProps {
  row : number,
  column : number,
  intent : number,
  cellNumber : number,
  assignedDeskNumber ?: number | undefined,
  grid: GridSpec,
}

export interface DeskGridCellEvents {
  onIntentChange: (key: Key) => void
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
  {row, column, assignedDeskNumber: seatNumber, grid, intent: directive, cellNumber: slotNumber, onIntentChange} : DeskGridCellProps & DeskGridCellEvents 
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
            {directive}
            <br />
            {seatNumber ? seatNumber : "empty"}
            <br />
            {slotNumber}
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