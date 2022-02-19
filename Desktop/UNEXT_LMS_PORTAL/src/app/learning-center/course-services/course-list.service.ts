/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpMethod } from 'src/app/enums/httpMethod';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Service } from 'src/app/enums/service';
import { HttpClientService } from 'src/app/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class CourseListService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  courseList: Array<any> | null = null;

  constructor(private httpClient: HttpClientService) { }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getProgramAndSemester() {
    // return await this.httpClient.getResponse(Service.COURSE_LIST_SERVICE, '', HttpMethod.GET,
    //   {});
    return {
      "courseId": "111",
      "courseName": "Crash Course in Account & Finance",
      "childElements": [{
        "id": "001",
        "type": "content",
        "name": "Course Introduction",
        "status": "Unpublished",
        "createdOn": "09/08/2021, 2:35:56 AM",
        "numChildren": 0
      }, {
        "id": "002",
        "type": "unit",
        "name": "Unit 1",
        "description": "Unit 1 - Economical & Financial Aspects",
        "status": "Unpublished",
        "createdOn": "09/08/2021, 2:35:56 AM",
        "numChildren": 3
      }, {
        "id": "001",
        "type": "content",
        "name": "Course Introduction",
        "description": "Course Introduction Description",
        "status": "Unpublished",
        "createdOn": "Unpublished",
        "numChildren": 3
      }]
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getCourseList() {
    this.courseList = [
      {
        title: 'Dev Team',
        tags: ['UI Design','AutoCad', 'Photoshop',],
        facultyName: 'Harry Garza',
        status: 40,
        id: '1152'
      },
      {
        title: 'QA Team',
        tags: ['Business','Balance', 'Profit'],
        facultyName: 'Rishabh Khatri',
        status: 70,
        id: '1147'
      },
      {
        title: 'Mobile Team',
        tags: ['Data','Algorithm'],
        facultyName: 'Akhil Sharma',
        status: 90,
        id: '1148'
      },
      {
        title: 'Communication Skills',
        tags: ['Talk','Communicate','listen'],
        facultyName: 'Saket Ranjan',
        status: 10,
        id: '1149'
      },
      {
        title: 'OOP',
        tags: ['OOP','Objects','Classes','Modularity'],
        facultyName: 'Suhani Jain',
        status: 56,
        id: '1150'
      },
      {
        title: 'Demo Course - Do not modify',
        tags: ['SDLC','Waterfall','Agile','Scrum'],
        facultyName: 'Mohini Khare',
        status: 56,
        id: '1151'
      },
    ];
    return this.courseList;
  }
}
