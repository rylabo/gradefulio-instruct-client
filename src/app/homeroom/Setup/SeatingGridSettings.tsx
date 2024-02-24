import { Slider } from '@nextui-org/react'
import React from 'react'
import { GridSpec } from './SeatingPlanBlueprint'

export default function SeatingGridSettings({grid, onRowCountChange, onColumnCountChange} : {grid: GridSpec, onRowCountChange: Function, onColumnCountChange: Function}) {
  return (
    <div className='flex flex-col gap-6 w-full max-w-md'>
      <Slider
        label='Rows'
        minValue={1}
        maxValue={6}
        defaultValue={5}
        step={1}
        className='row-setting'
        onChangeEnd={(rows) => {onRowCountChange(grid, rows)}}
      />
      <Slider 
        label='Columns'
        minValue={1}
        maxValue={7}
        defaultValue={4}
        step={1}
        className='column-setting'
        onChangeEnd={(columns) => {onColumnCountChange(grid, columns)}}
      />
    </div>
  )
}