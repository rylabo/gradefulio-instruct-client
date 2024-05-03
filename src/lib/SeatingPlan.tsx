import { Student, StudentObj } from "./StudentObj"

export interface GridSpec {
  rows: number
  columns: number
}

export interface SeatingPlan {
  students: Student[]
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
  row: number
  column: number
  assign: boolean
  assignmentConfirmed: boolean
}

export interface DeskLayoutTemplate {
  deskRows: number
  deskColumns: number
  deskAt: (DeskTemplate | {})[][]
}

export interface PotentialDeskUse {
  assignmentConfirmed: boolean
  proposedAssignment?: Student
  proposedStudentIndex?: number
}

export type Desk = DeskTemplate & PotentialDeskUse