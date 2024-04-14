'use client';

import { BlankNode, IdentifiedNode } from "./SeatingPlan";

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

