import { DeskTemplate, IdentifiedNode } from "./SeatingPlan"
import { NewStudent, Student } from "./StudentObj"

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

export type CourseTemplate = {
  '@type': [ 'Course' ]
  courseName: Name
  gradeLevel: SchoolGrade
  classNumber: number | string | undefined
  enrollment: Student[]
  deskRows: number
  deskColumns: number
  deskAt: (DeskTemplate | {}) [][]
}

export type SchoolCourse  = CourseTemplate & IdentifiedNode

/*
{
  "@type": ["Course"],
  "courseName": {
    "ja": "英語",
    "en": "English"
  },
  "gradeLevel": "中1",
  "classNumber": 1,
  "deskRows": 3,
  "deskColumns": 3,
  "deskAt": [[
    {"@type": ["Desk"], "assignedTo":{
        "@type": ["Student"],
        "givenNames": [{
          "annotation": "ケンタロ",
          "nameToken": {"en": "Kentaro", "ja": "健太郎"}
        }],
        "familyNames": [{
          "annotation": "サトウ",
          "nameToken": {"en": "Satou", "ja": "佐藤"}
        }],
    }},
    {"@type": ["Desk"], "assignedTo":{
        "@type": ["Student"],
        "givenNames": [{
          "annotation": "ユウ",
          "nameToken": {"en": "Yuu", "ja": "ゆう"}
        }],
        "familyNames": [{
          "annotation": "タナカ",
          "nameToken": {"en": "Tanaka", "ja": "田中"}
        }],
    }},
    {"@type": ["Desk"], "assignedTo":{
        "@type": ["Student"],
        "givenNames": [{
          "annotation": "ハナコ",
          "nameToken": {"en": "Hanako", "ja": "花子"}
        }],
        "familyNames": [{
          "annotation": "ヤマダ",
          "nameToken": {"en": "Yamada", "ja": "山田"}
        }],
    }}
  ], [
    {"@type": ["Desk"], "assignedTo":{
        "@type": ["Student"],
        "givenNames": [{
          "annotation": "マリコ",
          "nameToken": {"en": "Mariko", "ja": "まり子"}
        }],
        "familyNames": [{
          "annotation": "スズキ",
          "nameToken": {"en": "Suzuki", "ja": "鈴木"}
        }],
    }},
    {"@type": ["Desk"], "assignedTo":{
        "@type": ["Student"],
        "givenNames": [{
          "annotation": "タロウ",
          "nameToken": {"en": "Tarou", "ja": "太郎"}
        }],
        "familyNames": [{
          "annotation": "ヤマダ",
          "nameToken": {"en": "Yamada", "ja": "山田"}
        }],
    }},
    {"@type": ["Desk"]}
  ], [
    {},
    {"@type": ["Desk"]},
    {}
  ]]
}
*/


export type Overview = {
  "@type": ["Course"]
  courseName: Name
  gradeLevel: SchoolGrade
  classNumber: string
  deskRows: number
  deskColumns: number
  studentCount: number
} & IdentifiedNode
