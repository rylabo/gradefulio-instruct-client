'use client';

import { createServer } from 'miragejs';
import { useEffect } from 'react';
import { SchoolCourseModel, SchoolCourseFactory } from './course.mock';
import { StudentModel, StudentFactory } from './student.mock';

export default function MirageServerProvider(
// @ts-ignore
{ children, mockCourses }   
) {

  const models = {
    overview: SchoolCourseModel,
    student: StudentModel,
  }
  
  const factories = {
    overview: SchoolCourseFactory,
    student: StudentFactory
  }
  


  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      createServer({
        // environment,
        models: models,

        factories: factories,

        // @ts-ignore      
        seeds(server) {
          // const course1 = {... mockCourses[0]}
          // course1.enrollment = mockCourses[0].enrollment.map( studentData => {
          //   return server.create('student', studentData)
          // })
          // server.create('overview', course1)
          for (let i = 0; i < mockCourses.length; i++){
            let mockCourse = { ...mockCourses[i] }
            console.log(JSON.stringify(mockCourse, null, 2))
            mockCourse.enrollment = mockCourses[i].enrollment.map( studentData => {
              return server.create('student', studentData)
            })
            server.create('overview', mockCourse)
          }
        },
    
        routes() {
          // this.namespace = '/api'
          this.get('/api/course', (schema) => {
            console.log('Mock server called')
            const courseModels = schema.all('overview').models
            const courses = schema.all('overview').models.map( course => {
              const enrolledStudents = course.enrollment.models
              const result = {
                ...course.attrs,
                enrollment: enrolledStudents
              }
              return result
            })
            const result = {
              courses: courses,
              students: schema.all('student').models
            }
            return result;
          });
      
          // this.post('/api/course', (schema, request) => {
          //   let rc = JSON.parse(request.requestBody)
          // });
      
          this.passthrough()
        }
      
      })
    }    
  }, [])
  return <>{children}</>
}