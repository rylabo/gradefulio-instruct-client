import { StudentObj } from "./StudentObj"

export interface GridSpec {
  rows: number
  columns: number
}

export interface SeatingPlan {
  deskAt: (DeskTemplate | {})[][]
}

export type BlankNode = {
  '@id': never | `_:$(string)`
}

export type DeskTemplate = {
  assignedTo?: StudentObj & BlankNode
  assign: boolean
}

export interface DeskLayout {
  deskRows: number
  deskColumns: number
  deskAt: DeskTemplate[][]
}
