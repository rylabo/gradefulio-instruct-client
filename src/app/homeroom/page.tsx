import { Slider } from '@nextui-org/react'
import React from 'react'

function Homeroom() {
  return (
    <Slider
    label='Rows'
    color='secondary'
    minValue={1}
    maxValue={6}
    defaultValue={5}
    step={1}
    className='row-setting'
  />
)
}

export default Homeroom