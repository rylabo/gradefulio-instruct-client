import { DeskTemplate } from "./SeatingPlan"
import { NewStudent } from "./StudentObj"

export type Name = 
  | {
      key: string
      en: string
      ja?: string  
    }
  | {
      key: string
      en?: string
      ja: string  
    }
  | {}

export type NameDto = {
  key: string
  en: string
  ja: string  
}

export type SchoolGrade =
  | '小1'
  | '小2'
  | '小3'
  | '小4'
  | '小5'
  | '小6'
  | '中1'
  | '中2'
  | '中3'
  | '高1'
  | '高2'
  | '高3'
  | ''

export function isSchoolGrade(string: string): string is SchoolGrade {
  return (
    string === '小1'
    || string === '小2'
    || string === '小3'
    || string === '小4'
    || string === '小5'
    || string === '小6'
    || string === '中1'
    || string === '中2'
    || string === '中3'
    || string === '高1'
    || string === '高2'
    || string === '高3'
  )
}

export interface CourseState {
  courseName: Name
  gradeLevel: SchoolGrade
  classNumber: number | undefined
  studentEnrollment: NewStudent[]
  deskRows: number
  deskColumns: number
  deskAt: (DeskTemplate | {}) [][]
}

