import React from 'react';
import { Student } from '../../components/_student';
import { StudentObj } from '../../lib/StudentObj';



export default function Seating( {studentList}: {studentList : StudentObj[]}) {
  
  const students = studentList.map((studentInfo: StudentObj) => {
    return (
      <Student
        key={studentInfo.attendanceNumber}
        student={studentInfo}
      />
    );
  });
  return (
    <div>{students}</div>
  );

}