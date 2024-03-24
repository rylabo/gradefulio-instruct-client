'use client';
type Name = {
  annotation: string;
  nameToken: {
    en: string;
    ja: string;
  };
};

export type StudentObj = {
  '@type': [string];
  attendanceNumber?: string;
  familyNames: [Name];
  givenNames: [Name];
  status?: string;
};

