import { v4 as uuidv4 } from 'uuid';
import { Factory, Model } from "miragejs";

export const StudentModel = Model.extend({})
export const StudentFactory = Factory.extend({
  '@id'(){
    return `/api/student/${uuidv4()}`
  },
  '@type': [ 'Student' ],
  familyNames(i) {
    return [{
      annotation: `${i + 1}`,
      nameToken: {
        en: `${i + 1}`,
        ja: `${i + 1}`,
      }
    }]
},
  givenNames() {
    return [{
      annotation: 'ガクセイ',
      nameToken: {
        en: 'student',
        ja: '学生',
      }
    }]
  },
})
