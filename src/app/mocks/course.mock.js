// import { FactoryDefinition, ModelDefinition } from "miragejs/-types";
import { Factory, hasMany, Model } from "miragejs";
import { v4 as uuidv4 } from 'uuid';


// Helper function to calculate rows and columns
function calculateRowsAndColumns(numStudents) {
  const sqrt = Math.floor(Math.sqrt(numStudents));
  
  // Start with a square layout and adjust
  let rows = sqrt;
  let columns = Math.ceil(numStudents / sqrt);

  // Adjust if necessary to fit exactly
  while (rows * columns < numStudents) {
    rows++;
  }

  return { rows, columns };
}

export const SchoolCourseModel = Model.extend({
  enrollment: hasMany('student', {inverse: 'enrolledIn'}),
})
export const SchoolCourseFactory = Factory.extend({
  '@id'() {
    return `/api/course/${uuidv4()}`;
  },
  '@type': [ 'Course' ],
  courseName(i) {
    return {
      key: `コース ${i + 1}`,
      en: `Course ${i + 1}`,
      ja: `コース ${i + 1}`,  
    }
  },
  gradeLevel: '中1',
  classNumber: 'A',
  // withEnrollments: trait({
  //   afterCreate(schoolClass, server, options) {
  //     const numStudents = options.numStudents || 20; // Default to 20 students if not specified
  //     const { rows, columns } = calculateRowsAndColumns(numStudents);

  //     // Generate the students
  //     let students = server.createList('student', numStudents);
      
  //     // Update the class with the calculated rows, columns, and enrollments
  //     schoolClass.update({
  //       deskRows: rows,
  //       deskColumns: columns,
  //       enrollment: students
  //     });
  //   }
  // }),  
})

