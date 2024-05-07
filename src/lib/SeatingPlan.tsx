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

export interface DeskInfo {
  student?: Student
  studentIndex?: number
  deskRow: number
  deskColumn: number
}

export interface StudentReference {
  student: Student
  studentIndex: number
}

export type AssignedDeskInfo = DeskInfo & StudentReference

export interface SeatingPlusPreview {
  desks: (DeskTemplate | {})[][]
  students: Student[]
  draggedStudentInfo?: AssignedDeskInfo | undefined
  displacedStudentInfo?: DeskInfo | undefined
  sourcePreview?: DeskInfo | undefined
  destinationPreview?: AssignedDeskInfo | undefined
  draggingOver: boolean
  unnassignedArrayIndex?: number
  
  unassignedStudents: StudentReference[]
}
