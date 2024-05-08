'use client'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React, { Key, useEffect, useReducer } from 'react'
import SeatingGridSettings from './SeatingGridSettings'
import DeskGridCell, { DeskGridCellProps } from './DeskGridCell'
import { Student, StudentObj } from '../../../lib/StudentObj'
import { DeskLayoutTemplate, DeskTemplate, GridSpec } from '../../../lib/SeatingPlan'
import { deepCopyDeskLayout, getCellUsage, getDefaultGridSpec, initializeDeskPlan } from '../../../util/deskLayout'

interface DeskLayoutPlan {
  deskLayout: GridSpec
  desks: (DeskTemplate | {})[][]
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
      const newDesks: (DeskTemplate | {})[][] = deepCopyDeskLayout(layoutPlan.desks)
      newLayoutPlan.deskLayout = {...layoutPlan.deskLayout}
      newLayoutPlan.desks = {...layoutPlan.desks}
      console.log(JSON.stringify(change, null, 2))
      switch (change.newIntent) {
        case 1:
          newDesks[change.templateRow][change.templateColumn] = {
            row: change.templateRow,
            column: change.templateColumn,
            assignmentConfirmed: false,
            assign: false
          }
          break
        case 2:
          newDesks[change.templateRow][change.templateColumn] = {}
          break
        default: 
          newDesks[change.templateRow][change.templateColumn] = {
            row: change.templateRow,
            column: change.templateColumn,
            assignmentConfirmed: false,
            assign: true
          }
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
  isDismissable: boolean
  deskRows: number
  deskColumns: number
  enrollment: StudentObj[]
  desks: (DeskTemplate | {})[][]
  onBackPressed?: () => void
  onNextPressed: (students: Student[], layout: DeskLayoutTemplate) => void
  onCancel: () => void
}

function DeskGridModal({isOpen, size, isDismissable, deskRows, deskColumns, enrollment, desks, onNextPressed, onBackPressed, onCancel }: DeskGridModalProps) {
  const [deskLayoutPlan, dispatchLayoutChange] = useReducer<(layoutPlan: DeskLayoutPlan, change: DeskLayoutPlanChange) => DeskLayoutPlan>(deskLayoutReducer, {deskLayout: {rows: deskRows, columns: deskColumns}, desks: desks})
  useEffect(() => {
    dispatchLayoutChange({type: 'find_initial_desk_layout' , studentList: enrollment})
  }, [enrollment] )

  function handleChangeInDeskGridCellIntent(i: number, j: number) {
    return (key:Key) => {
      // changeIntentForDeskCellLayout(i, j, Number(key))
      dispatchLayoutChange({type: 'change_intent_for_desk_layout_cell', templateRow: i, templateColumn: j, newIntent: Number(key)})
    }
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
    <Modal id='set-desk-layout' isOpen={isOpen} size={size} isDismissable={isDismissable} onClose={onCancel}>
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
          {
            onBackPressed ?
              <Button color='primary' onPress={() => {
                onBackPressed()
              }}>
                Back
              </Button>
            : undefined
          }
          <Button color='primary' onPress={() => {
            onNextPressed(enrollment ,{deskRows: deskLayoutPlan.deskLayout.rows, deskColumns: deskLayoutPlan.deskLayout.columns, deskAt: deskLayoutPlan.desks} )
          }}>
            Next
          </Button>
          <Button color='danger' onPress={() => onCancel()}>
            Cancel
          </Button>
        </ModalFooter>
        <div>
          {JSON.stringify(deskLayoutPlan.desks)}
        </div>
      </ModalContent>
    </Modal>
  )
}

export default DeskGridModal
