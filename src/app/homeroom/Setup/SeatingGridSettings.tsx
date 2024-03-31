import { Slider, SliderValue } from '@nextui-org/react'
import React from 'react'

export interface GridSpec {
  rows: number
  columns: number
}

export default function SeatingGridSettings({grid, onRowCountChange, onColumnCountChange} : {grid: GridSpec, onRowCountChange: (newRowCount: number) => void, onColumnCountChange: (newcColumnCount: number) => void}) {
  return (
    <div className='flex flex-col gap-6 w-full max-w-md'>
      <Slider
        label='Rows'
        minValue={1}
        maxValue={6}
        defaultValue={grid.rows}
        step={1}
        className='row-setting'
        onChangeEnd={(rows: SliderValue) => {
          if (typeof rows === 'number')
            onRowCountChange(rows)
          else
            onRowCountChange(rows[0])
        }}
      />
      <Slider 
        label='Columns'
        minValue={1}
        maxValue={7}
        defaultValue={grid.columns}
        step={1}
        className='column-setting'
        onChangeEnd={(columns: SliderValue) => {
          if (typeof columns === 'number')
            onColumnCountChange(columns)
          else
            onColumnCountChange(columns[0])
        }}
      />
    </div>
  )
}