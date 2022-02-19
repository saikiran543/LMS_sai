/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientService } from 'src/app/services/http-client.service';

import { CourseListService } from './course-list.service';

describe('CourseListService', () => {
  let service: CourseListService;
  let httpClient: HttpClientService;
  const expectedResult = {
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClientService],
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(CourseListService);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    httpClient = TestBed.inject(HttpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the getProgramAndSemester', async () => {
    const fecthedResult = await service.getProgramAndSemester();
    expect(service.getProgramAndSemester).toHaveBeenCalled;
    expect(fecthedResult).toEqual(expectedResult);
  });

  it('should call the getCourseList', async () => {
    const fecthedResult = await service.getCourseList();
    expect(service.getCourseList).toHaveBeenCalled;
    expect(fecthedResult).toEqual(fecthedResult);
  });
});
