import { DeskTemplate, GridSpec } from "../lib/SeatingPlan";
import { StudentObj } from "../lib/StudentObj";

export function getDefaultGridSpec(studentList: StudentObj[]) : GridSpec {
  let spec: GridSpec = {rows: 2, columns: 3};
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
  else if (classSize > 36) spec = {rows: 7, columns: 6}

  return spec
}

export function initializeDeskPlan(spec: GridSpec): DeskTemplate[][] {
  let plan: DeskTemplate[][] = [];
  for (let i: number = 0; i < spec.rows; i++) {
    plan.push([])
    for (let j: number = 0; j < spec.columns; j++) {
      plan[i].push({assign: true})
    }
  }
  // for (let j: number = 0; j < spec.columns; j++) {
  //   for(let i: number = 0; i < spec.rows; i++) {
  //     plan.push(newSeat(i, j, spec, slotNum, 0));
  //     slotNum++;
  //   }
  // }
  return plan
}
