import { DeskTemplate, GridSpec } from "../lib/SeatingPlan";
import { StudentObj } from "../lib/StudentObj";

export function getDefaultGridSpec(studentList: StudentObj[]) : GridSpec {
  let spec: GridSpec = {rows: 1, columns: 1};
  const classSize = studentList.length

  if (classSize === 1) spec = {rows: 1, columns: 1}
  else if (classSize === 2) spec = {rows: 1, columns: 2}
  else if (classSize > 2 && classSize <= 4) spec = {rows: 2, columns: 2}
  else if (classSize > 4 && classSize <= 6) spec = {rows: 2, columns: 3}
  else if (classSize > 6 && classSize <= 9) spec = {rows: 3, columns: 3}
  else if (classSize > 9 && classSize <= 12) spec = {rows: 4, columns: 3}
  else if (classSize > 12 && classSize <= 16) spec = {rows: 4, columns: 4}
  else if (classSize > 16 && classSize <= 20)  spec = {rows: 5, columns: 4}
  else if (classSize > 20 && classSize <= 25)  spec = {rows: 5, columns: 5}
  else if (classSize > 25 && classSize <= 30)  spec = {rows: 6, columns: 5}
  else if (classSize > 30 && classSize <= 36)  spec = {rows: 6, columns: 6}
  else if (classSize > 36 && classSize <= 42) spec = {rows: 7, columns: 6}
  else spec = {rows: 8, columns: 6}

  return spec
}

export function isDeskTemplate(obj: DeskTemplate | {}): obj is DeskTemplate{
  if (Object.getOwnPropertyNames(obj).length > 0) return 'assign' in obj
  else return false
}

export function getCellUsage(deskCell: DeskTemplate | {}) : number {
  let intent = 0
  if (!('assign' in deskCell)) intent = 2
  else if (deskCell.assign === false) intent = 1
  return intent
}

export function deepCopyDeskLayout(layout: (DeskTemplate | {})[][]): (DeskTemplate | {})[][] {
  const newLayout: (DeskTemplate | {})[][]  = layout.map( (row : (DeskTemplate | {})[]) =>{
    return row.map( (template: DeskTemplate | {}) => {
      return {...template}
    } )
  })
  return newLayout
}

export function initializeDeskPlan(spec: GridSpec): DeskTemplate[][] {
  let plan: DeskTemplate[][] = [];
  for (let i: number = 0; i < spec.rows; i++) {
    plan.push([])
    for (let j: number = 0; j < spec.columns; j++) {
      plan[i].push({assign: true, assignmentConfirmed: false})
    }
  }
  return plan
}
