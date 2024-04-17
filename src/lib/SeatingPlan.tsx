import { Student, StudentObj } from "./StudentObj"

export interface GridSpec {
  rows: number
  columns: number
}

export interface SeatingPlan {
  deskAt: (DeskTemplate | {})[][]
}

export type BlankNode = {
  '@id'?: `_:$(string)`
}

export type IdentifiedNode = {
  '@id': string
}

export type DeskTemplate = {
  assignedTo?: Student
  studentIndex?: number
  assign: boolean
  assignmentConfirmed: boolean
}

export interface DeskLayout {
  deskRows: number
  deskColumns: number
  deskAt: (DeskTemplate | {})[][]
}
