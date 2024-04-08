'use client'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React, { Key, useEffect, useReducer } from 'react'
import SeatingGridSettings from './SeatingGridSettings'
import DeskGridCell, { DeskGridCellProps } from './DeskGridCell'
import { StudentObj } from '../../../lib/StudentObj'
import { DeskLayout, DeskTemplate, GridSpec } from '../../../lib/SeatingPlan'
import { getDefaultGridSpec, initializeDeskPlan } from '../../../util/deskLayout'

interface DeskLayoutPlan {
  deskLayout: GridSpec
  desks: (DeskTemplate | {})[][]
}

const startingDeskLayoutPlan: DeskLayoutPlan = {
  deskLayout: {rows: 1, columns: 1},
  desks: []
}

type DeskLayoutPlanChange =
| {type: 'find_initial_desk_layout'; studentList: StudentObj[]} 
| {type: 'change_desk_layout_row_count'; newRowCount: number}
| {type: 'change_desk_layout_column_count'; newColumnCount: number}
| {type: 'change_intent_for_desk_layout_cell'; templateRow: number, templateColumn: number, newIntent: number}

const deskLayoutReducer = (layoutPlan: DeskLayoutPlan, change: DeskLayoutPlanChange): DeskLayoutPlan => {
  switch (change.type) {
    case 'find_initial_desk_layout' : {
      const gridSpec: GridSpec = getDefaultGridSpec(change.studentList)
      return {
        deskLayout: getDefaultGridSpec(change.studentList),
        desks: initializeDeskPlan(gridSpec)
      }
    }

    case 'change_desk_layout_row_count': {
      const newLayoutPlan = {...layoutPlan}
      newLayoutPlan.deskLayout = {...layoutPlan.deskLayout}
      newLayoutPlan.desks = {...layoutPlan.desks}
      newLayoutPlan.deskLayout.rows = change.newRowCount
      newLayoutPlan.desks = initializeDeskPlan(newLayoutPlan.deskLayout)
      return newLayoutPlan
    }

    case 'change_desk_layout_column_count': {
      const newLayoutPlan = {...layoutPlan}
      newLayoutPlan.deskLayout = {...layoutPlan.deskLayout}
      newLayoutPlan.desks = {...layoutPlan.desks}
      newLayoutPlan.deskLayout.columns = change.newColumnCount
      newLayoutPlan.desks = initializeDeskPlan(newLayoutPlan.deskLayout)
      return newLayoutPlan
    }

    case 'change_intent_for_desk_layout_cell' :{
      const newLayoutPlan = {...layoutPlan}
      const newDesks = layoutPlan.desks.map( (row : (DeskTemplate | {})[]) =>{
        return row.map( (template: DeskTemplate | {}) => {
          return {...template}
        } )
      })
      newLayoutPlan.deskLayout = {...layoutPlan.deskLayout}
      newLayoutPlan.desks = {...layoutPlan.desks}
      console.log(JSON.stringify(change, null, 2))
      switch (change.newIntent) {
        case 1:
          newDesks[change.templateRow][change.templateColumn] = {assign: false}
          break
        case 2:
          newDesks[change.templateRow][change.templateColumn] = {}
          break
        default: 
          newDesks[change.templateRow][change.templateColumn] = {assign: true}
          break

      }
      newLayoutPlan.desks = newDesks
      return newLayoutPlan
    }

    default:
      return {
        ...layoutPlan
      }
  }
}

interface DeskGridModalProps {
  isOpen: boolean
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full' | undefined
  deskRows: number
  deskColumns: number
  enrollment: StudentObj[]
  desks: (DeskTemplate | {})[][]
  onLayoutFinalized: (layout: DeskLayout) => void
}

function DeskGridModal({isOpen, size, deskRows, deskColumns, enrollment, desks, onLayoutFinalized}: DeskGridModalProps) {
  const [deskLayoutPlan, dispatchLayoutChange] = useReducer<(layoutPlan: DeskLayoutPlan, change: DeskLayoutPlanChange) => DeskLayoutPlan>(deskLayoutReducer, {deskLayout: {rows: deskRows, columns: deskColumns}, desks: desks})
  useEffect(() => {
    dispatchLayoutChange({type: 'find_initial_desk_layout' , studentList: enrollment})
  }, [enrollment] )

  function handleChangeInDeskGridCellIntent(i: number, j: number) {
    console.log('(' +i + ', ' + j+ ')')
    return (key:Key) => {
      // changeIntentForDeskCellLayout(i, j, Number(key))
      dispatchLayoutChange({type: 'change_intent_for_desk_layout_cell', templateRow: i, templateColumn: j, newIntent: Number(key)})
    }
  }

  function getCellUsage(deskCell: DeskTemplate | {}) : number {
    let intent = 0
    if (!('assign' in deskCell)) intent = 2
    else if (deskCell.assign === false) intent = 1
    return intent
  }

  function getDeskLayout(desks: (DeskTemplate | {}) [][] ): JSX.Element[] {
    const deskPlan: JSX.Element[] = []
    for (let i = 0; i < desks.length; i++) {
      for (let j = 0; j < desks[i].length; j++) {
        const intent = getCellUsage(desks[i][j]) 
        deskPlan.push(
          <DeskGridCell 
            key={`${i}-${j}`}
            row={i + 1}
            column={j + 1}
            intent={intent}
            grid={{rows: desks.length, columns: desks[0].length}}
            onIntentChange={handleChangeInDeskGridCellIntent(i, j)}
          /> 
        )
      }
    }
    return deskPlan
  }

  return (
    <Modal id='set-desk-layout' isOpen={isOpen} size={size}>
      <ModalContent>
        <ModalHeader>
          Set Desk Layout
        </ModalHeader>
        <ModalBody>
          <div className={`desk-plan grid gap-10 grid-rows-${deskLayoutPlan.deskLayout.rows} grid-cols-${deskLayoutPlan.deskLayout.columns}`}>
            {getDeskLayout(deskLayoutPlan.desks)}
          </div>
          <SeatingGridSettings 
            grid={{rows: deskRows, columns: deskColumns}}
            onRowCountChange={(newRowCount: number) => {dispatchLayoutChange({type: 'change_desk_layout_row_count', newRowCount: newRowCount})}}
            onColumnCountChange={(newColumnCount: number) => {dispatchLayoutChange({type: 'change_desk_layout_column_count', newColumnCount: newColumnCount})}}
          />
        </ModalBody>
        <ModalFooter>
          <Button color='primary'>
            Next
          </Button>
          <Button>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeskGridModal
