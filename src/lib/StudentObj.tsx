import { BlankNode, IdentifiedNode, StudentReference } from "./SeatingPlan";

type Name = {
  annotation: string;
  nameToken: {
    en: string;
    ja: string;
  };
};

export type NewStudent = StudentObj & BlankNode
export type ExistingStudent = StudentObj & IdentifiedNode

export type Student = 
  | NewStudent
  | ExistingStudent

export type StudentObj = {
  '@type': [string];
  attendanceNumber?: string;
  familyNames: [Name];
  givenNames: [Name];
  status?: string;
};

export function nameCompareStudents(a: Student, b:Student): number {
  if (a.familyNames[0].annotation > b.familyNames[0].annotation) return 1
  else if (a.familyNames[0].annotation < b.familyNames[0].annotation) return -1
  else if (a.givenNames[0].annotation > b.givenNames[0].annotation) return 1  
  else if (a.givenNames[0].annotation < b.givenNames[0].annotation) return -1
  else if (a.familyNames[0].nameToken.ja > b.familyNames[0].nameToken.ja) return 1
  else if (a.givenNames[0].nameToken.ja < b.givenNames[0].nameToken.ja) return -1
  else if (a.givenNames[0].nameToken.ja > b.givenNames[0].nameToken.ja) return 1
  return 0
}
  
export function insertSort(student: Student, array: Student[]): [number, Student[]] {

  // find the index
  const newArray: Student[] = {...array}
  let index: number = 0
  while (index < newArray.length && nameCompareStudents(student, newArray[index]) <= 0) index++

  // insert at index there
  newArray.splice(index, 0, student)
  return [index, newArray]
}

export function insertSortReferences(studentReference: StudentReference, array: StudentReference[]): StudentReference[] {

  // find the index
  const newArray: StudentReference[] = [...array]
  newArray.push(studentReference)
  return sortStudentReferences(newArray)
}

export function insertSortWithIndex(studentReference: StudentReference, array: StudentReference[]): [number, StudentReference[]] {
  const newArray: StudentReference[] = [...array]
  let index: number = 0
  while (index < newArray.length && compareStudentReferences(studentReference, newArray[index]) >= 0) index++
  
  newArray.splice(index, 0, studentReference)
  return [index, newArray]
}


export function compareStudents(a: Student, b: Student): number {

  // attendance numbers before names.
  if (!a.attendanceNumber && b.attendanceNumber) return 1
  else if (a.attendanceNumber && !b.attendanceNumber) return -1

  else if (a.attendanceNumber && b.attendanceNumber) {
    if (a.attendanceNumber > b.attendanceNumber) return 1
    else if (a.attendanceNumber < b.attendanceNumber) return -1
    else return 0
  }

  else return nameCompareStudents(a, b)
}

export function compareStudentReferences(a: StudentReference, b: StudentReference): number {
  const studentComparison: number = compareStudents(a.student, b.student)
  if (studentComparison !== 0) return studentComparison
  else if (a.studentIndex > b.studentIndex) return 1
  else if (a.studentIndex < b.studentIndex) return -1
  else return 0
}

export function sortStudents(students: Student[]): Student[] {
  return students.toSorted(compareStudents)
}

export function nameSortStudents(students: Student[]): Student[] {
  return students.toSorted(nameCompareStudents)
}

export function sortStudentReferences(studentReferences: StudentReference[]) {
  return studentReferences.toSorted(compareStudentReferences)
}