'use client';
// mirage.js
import { Server, Model, Factory, Registry, createServer, Collection, Instantiate } from 'miragejs';
import { ModelDefinition, FactoryDefinition } from 'miragejs/-types';
import Schema from 'miragejs/orm/schema';
import { Overview } from '../../lib/Course';
import { v4 as uuidv4 } from 'uuid';

const OverviewModel: ModelDefinition<Overview> = Model.extend({})
const OverviewFactory: FactoryDefinition<Overview> = Factory.extend<Overview>({
  '@id'() {
    return `/api/course/${uuidv4()}`;
  },
  '@type': [ 'Course' ],
  courseName: {
    key: 'エイゴ',
    en: 'English',
    ja: '英語'
  },
  gradeLevel: '中1',
  classNumber: 'A',
  deskRows: 5,
  deskColumns: 5,
  studentCount: 18
})


type AppRegistry = Registry<
  {
    overview: typeof OverviewModel;
  },
  {
    overview: typeof OverviewFactory
  }
>;

if (process.env.NODE_ENV === "development") {
  createServer({
    // environment,
    models: {
      overview: OverviewModel
    },

    factories: {
      overview: OverviewFactory
    },
    
    seeds(server: Server<AppRegistry>) {
      server.create('overview', {
        courseName: {
          key: 'スウガク',
          en: 'Math',
          ja: '数学',
        },
        gradeLevel: '中2',
        classNumber: '2',
        deskRows: 7,
        deskColumns: 8,
        studentCount: 44
      });
      server.create('overview', {
        courseName: {
          key: 'スウガク',
          en: 'Math',
          ja: '数学',
        },
        gradeLevel: '中1',
        classNumber: '1',
        deskRows: 5,
        deskColumns: 5,
        studentCount: 23
      });
      server.create('overview', {
        courseName: {
          key: 'エイゴ',
          en: 'English',
          ja: '英語'
        },
        gradeLevel: '中2',
        classNumber: 'B',
        deskRows: 7,
        deskColumns: 8,
        studentCount: 35
      });
    },

    routes() {
      // this.namespace = '/api'
      this.get("/api/course", (schema) => {
        console.log('Mock server called')
        const result = schema.all('overview').models
        return result;
      });

      this.passthrough()
    }
  });
}
export default function MockProvider(
  { children }: { children: React.ReactNode }   
) {
  return <>{children}</>
}