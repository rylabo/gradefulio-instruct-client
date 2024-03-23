'use client';
import React, { use, useLayoutEffect, useState, DragEvent, ChangeEvent } from 'react'
import Seat, { SeatSpec } from './_Seat'
import { StudentObj } from '../../../lib/StudentObj';
import SeatingPlanBlueprint, { GridSpec } from './SeatingPlanBlueprint';
import SeatingGridSettings from './SeatingGridSettings';
import { Input, Tab, Tabs } from '@nextui-org/react';
import DeskPlan from './DeskPlan';

function getDefaultGridSpec(studentList: StudentObj[]) : GridSpec {
  let spec: GridSpec = {rows: 2, columns: 3};
  const classSize = studentList.length

  if (classSize > 6 && classSize <= 9) spec = {rows: 3, columns: 3}
  else if (classSize > 9 && classSize <= 12) spec = {rows: 4, columns: 3}
  else if (classSize > 12 && classSize <= 16) spec = {rows: 4, columns: 4}
  else if (classSize > 16 && classSize <= 20)  spec = {rows: 5, columns: 4}
  else if (classSize > 20 && classSize <= 25)  spec = {rows: 5, columns: 5}
  else if (classSize > 25 && classSize <= 30)  spec = {rows: 6, columns: 5}
  else if (classSize > 30 && classSize <= 36)  spec = {rows: 6, columns: 6}
  else if (classSize > 36) spec = {rows: 7, columns: 6}

  return spec
}
import DeskSlot, { DeskSlotProps } from './DeskSlot';
import SeatingPlan from './SeatingPlan';

const Setup = () => {
  const [studentList, setStudentList] = useState<StudentObj[]>([
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1101",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "イチ",
          "nameToken": {
            "en": "Ichi",
            "ja": "一"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1102",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ニ",
          "nameToken": {
            "en": "Ni",
            "ja": "二"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1103",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "サン",
          "nameToken": {
            "en": "San",
            "ja": "三"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1104",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "シ",
          "nameToken": {
            "en": "Shi",
            "ja": "四"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1105",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ゴ",
          "nameToken": {
            "en": "Go",
            "ja": "五"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1106",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ロク",
          "nameToken": {
            "en": "Roku",
            "ja": "六"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1107",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ナナ",
          "nameToken": {
            "en": "Nana",
            "ja": "七"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1108",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ハチ",
          "nameToken": {
            "en": "Hachi",
            "ja": "八"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1109",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "キュウ",
          "nameToken": {
            "en": "Kyuu",
            "ja": "九"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1110",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ジュウ",
          "nameToken": {
            "en": "Juu",
            "ja": "十"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1111",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ジュウイチ",
          "nameToken": {
            "en": "Juuichi",
            "ja": "十一"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1112",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ジュウニ",
          "nameToken": {
            "en": "Juuni",
            "ja": "十二"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1113",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ジュウサン",
          "nameToken": {
            "en": "Juusan",
            "ja": "十三"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1114",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ジュウヨン",
          "nameToken": {
            "en": "Juuyon",
            "ja": "十四"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1115",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ジュウゴ",
          "nameToken": {
            "en": "Juugo",
            "ja": "十五"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1116",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ジュウロク",
          "nameToken": {
            "en": "Juuroku",
            "ja": "十六"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1117",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ジュウナナ",
          "nameToken": {
            "en": "Juunana",
            "ja": "十七"
          }
        }
      ],
    },
    {
      "@type": [
        "Student"
      ],
      "attendanceNumber": "1118",
      "givenNames": [
        {
          "annotation": "ガクセイ",
          "nameToken": {
            "en": "Gakusei",
            "ja": "学生"
          }
        }
      ],
      "familyNames": [
        {
          "annotation": "ジュウハチ",
          "nameToken": {
            "en": "Juuhachi",
            "ja": "十八"
          }
        }
      ],
    }
  ]);
  const [spec, setSpec] = useState<GridSpec>(getDefaultGridSpec(studentList)) // default
  const [deskSlots, setDeskSlots] = useState<DeskSlotProps[]>(initializeDeskPlan(spec));
  const [desks, setDesks] = useState<SeatSpec[]>([]);

  let deskPlan: JSX.Element[] = deskSlots.map( (seat : DeskSlotProps) => {
    return (
      <DeskSlot 
        key={`${seat.slotNumber}`}
        row={seat.row}
        column={seat.column}
        seatNumber={seat.seatNumber}
        slotNumber={seat.slotNumber}
        directive={seat.directive}
        grid={seat.grid}
        listSelectionHandler={handleDirectiveChange(seat.slotNumber)}
      /> 
    )
  })
  const desksJson: string = JSON.stringify(deskSlots, null, 2)
  const [readText, setReadText] =  useState<string | null | undefined>('file contents initialized');

  function studentDragStartHandler(event: DragEvent) {
    
  }

  function rowCountChangeHandler(currentSpec: GridSpec, newRowCount: number) {
    const newDeskPlan: DeskSlotProps[] = initializeDeskPlan({rows: newRowCount, columns: currentSpec.columns})
    setSpec({rows: newRowCount, columns: currentSpec.columns})
    setDeskSlots(newDeskPlan)
  }

  function columnCountChangeHandler(currentSpec: GridSpec, newColumnCount: number) {
    const newDeskPlan: DeskSlotProps[] = initializeDeskPlan({rows: currentSpec.rows, columns: newColumnCount})
    setSpec({rows: currentSpec.rows, columns: newColumnCount});
    setDeskSlots(newDeskPlan)
  }

  function assignSeatNumbers(deskPlan: DeskSlotProps[]) {
    let seatNum: number = 1
    for (let i: number = 0; i < deskPlan.length; i++) {
      if (deskPlan[i].directive !== 3) {
        deskPlan[i].seatNumber = seatNum
        seatNum++
      } else {
        deskPlan[i].seatNumber = undefined
      }
    }
  }

  function changeDirective(i: number, key:string) {
    const newDeskPlan: DeskSlotProps[] = [...deskSlots]
    newDeskPlan[i - 1].directive = Number(key)
    assignSeatNumbers(newDeskPlan)
    setDeskSlots(newDeskPlan)
  }

  function handleDirectiveChange(i: number) {
    return (key:string) => {
      changeDirective(i, key)
    }
  }

  function initializeDeskPlan(spec: GridSpec): DeskSlotProps[] {
    let plan: DeskSlotProps[] = [];
    let slotNum: number = 1;
    for (let j: number = 0; j < spec.columns; j++) {
      for(let i: number = 0; i < spec.rows; i++) {
        plan.push(newSeat(i, j, spec, slotNum, 0));
        slotNum++;
      }
    }
    assignSeatNumbers(plan)  
    return plan
  }

  function newSeat(rowNum: number, colNum: number, spec: GridSpec, slot: number, directive: number): DeskSlotProps {
    return {
      row: (rowNum + 1),
      column: (colNum + 1),
      slotNumber: slot,
      grid: spec,
      directive: directive,
      listSelectionHandler: handleDirectiveChange(slot - 1)
    }
  }

  function fileSelectHandler(event: ChangeEvent<HTMLInputElement> ) {
    console.log(event);
    const selectedFile = event.target.files?.item(0)
    const fr = new FileReader()
    fr.addEventListener('load', (event) => {
      if (event.target?.result instanceof ArrayBuffer){
        setReadText(new TextDecoder().decode(event.target?.result));
      }
      else {
        setReadText(event.target?.result);
      }
        
    })
    if (selectedFile)
      fr.readAsText(selectedFile)
  }

  return (
    <Tabs>
      <Tab key='Homeroom Details' title='Homeroom Details'>

      </Tab>
      <Tab key='Student List' title='Student List'>
        <Input type='file' accept='.txt' onChange={fileSelectHandler}/>
        <div>
          <p>File contents</p>
          <p>{readText}</p>
        </div>
      </Tab>
      <Tab key='Seating Grid' title='Seating Grid' className='desk-planner grid gap-10 grid-cols-2'>
        <div className={`desk-plan grid gap-10 grid-rows-${spec.rows} grid-cols-${spec.columns}`}>
          {deskPlan}
        </div>
        <SeatingGridSettings grid={spec} onRowCountChange={rowCountChangeHandler} onColumnCountChange={columnCountChangeHandler}/>
      </Tab>
      <Tab key='Desk Plan' title='Desk Plan' className={`grid gap-10 grid-rows-${spec.rows} grid-cols-${spec.columns}`}>
        <SeatingPlan students={studentList} deskSlots={deskSlots} seatingGrid={spec}></SeatingPlan>
      </Tab>
    </Tabs>
  )
}

export default Setup