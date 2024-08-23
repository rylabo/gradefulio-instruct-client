import { NodeObject } from "jsonld"
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

export function isIdentifiedNode(node: NodeObject): node is IdentifiedNode {
  const regex: RegExp = /^\/api\/*\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
  const idString: string = node['id'] as string
  return idString.match(regex) !== null
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
  desks: (DeskTemplate | {})[][]  // the desks arrangement in the classroom. Empty objects denote no desk
  students: Student[]             // the students enrolled in the course
  draggedStudentInfo?: AssignedDeskInfo | undefined   // the info related to the student currently being dragged. 
  displacedStudentInfo?: DeskInfo | undefined         // the student potentially being kicked out of their desk 
  sourcePreview?: DeskInfo | undefined                // the desk the currently dragged student was dragged from will look like after the student is dropped.
  destinationPreview?: AssignedDeskInfo | undefined   // what the desk 
  draggingOver: boolean                               // true is a student is currently being dragged over a valid drop target
  unassignedArrayIndex?: number                       // an index of a student currently being dragged over the unassigned student list.
  unassignedStudents: StudentReference[]              // a list if currently unassigned students, in increasing order, sorted on their names in Katakana.
  unassignedPreview?: StudentReference[]
}
