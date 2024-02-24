'use client'
import React, { useState } from "react";
import { StudentObj } from "../lib/StudentObj";

export function Student ({ student }: {student: StudentObj }) {
  const attendanceStatuses: string[] = [
    "present",
    "absent",
    "late",
    "left early"
  ];
  const [currentStatus, setCurrentStatus] = useState(0);
  const [attendanceStatus, setStatus] = useState(attendanceStatuses[currentStatus]);

  function nextStatus(attendanceStatuses: string[]) {
    const max = attendanceStatuses.length;
    const nextStatus = (currentStatus + 1) % max; 
    setCurrentStatus(nextStatus);
    setStatus(attendanceStatuses[nextStatus]);
  }

  return (
    <div>
      <p>{student.attendanceNumber}</p>
      <p>{student.familyNames[0].annotation} {student.givenNames[0].annotation}</p>
      <p>{student.familyNames[0].nameToken.ja} {student.givenNames[0].nameToken.ja}</p>
      <p>{student.familyNames[0].nameToken.en} {student.givenNames[0].nameToken.en}</p>
      <p>{attendanceStatus}</p>
    </div>
  )
}
