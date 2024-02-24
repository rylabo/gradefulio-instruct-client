import React, { useState } from 'react'
// import { SeatSpec } from './_Seat'
import { Card, CardBody } from '@nextui-org/card';
import { Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { GridSpec } from './SeatingPlanBlueprint';

export interface DeskSlotProps {
  row : number,
  column : number,
  directive : number,
  slotNumber : number,
  seatNumber ?: number | undefined,
  grid: GridSpec
  listSelectionHandler: Function
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

function DeskSlot(
  {row, column, seatNumber, grid, directive, slotNumber, listSelectionHandler} : DeskSlotProps 
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
          onAction={(key) => {listSelectionHandler(key)}}>
          {stateButtons}
        </Listbox>
      </PopoverContent>
    </Popover> 
  )
}

export default DeskSlot