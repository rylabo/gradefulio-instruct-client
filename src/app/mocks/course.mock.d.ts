import { FactoryDefinition, ModelDefinition } from "miragejs/-types";
import { Name, SchoolGrade } from "../../lib/Course";
import { IdentifiedNode } from "../../lib/SeatingPlan"; //temp
import { Student } from "../../lib/StudentObj";

export declare type SchoolCourseTemplate = {
  '@type': [ 'Course' ]
  courseName: Name
  gradeLevel: SchoolGrade
  classNumber: number | string | undefined
  enrollment: Student
//  deskRows: number
//  deskColumns: number
  // deskAt: (DeskTemplate | {}) [][]
}

export declare type SchoolCourse = SchoolCourseTemplate & IdentifiedNode

export declare const SchoolCourseModel: ModelDefinition<SchoolCourse>
export declare const SchoolCourseFactory: FactoryDefinition<SchoolCourse>