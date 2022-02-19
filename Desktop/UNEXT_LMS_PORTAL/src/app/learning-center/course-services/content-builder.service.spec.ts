import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { HttpClientService } from 'src/app/services/http-client.service';

import { ContentBuilderService } from './content-builder.service';

// eslint-disable-next-line max-lines-per-function
describe('ContentBuilderService', () => {
  let service: ContentBuilderService;
  let httpClient: HttpClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClientService],
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(ContentBuilderService);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    httpClient = TestBed.inject(HttpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should return content types", async () => {
    const expectedResult = [{"allowedFileFormat": ["png","jpeg"],"allowedFileSize": null,"name": "unit","displayName": "Unit","status": true},{"allowedFileFormat": [],"allowedFileSize": null,"name": "folder","displayName": "Folder","status": true},{"allowedFileFormat": [],"allowedFileSize": null,"name": "liveclassroom","displayName": "Live Classroom","status": true},{"allowedFileFormat": [],"allowedFileSize": null,"name": "video","displayName": "Video","status": true},{"allowedFileFormat": ["txt","odt","ods","doc/docx","ppt/pptx","pps/ppsx","xls/xlsx","pdf"],"allowedFileSize": null,"name": "document","displayName": "Document","status": true},{"allowedFileFormat": ["epub"],"allowedFileSize": null,"name": "epub","displayName": "Epub","status": true},{"allowedFileFormat": ["zip"],"allowedFileSize": null,"name": "scorm","displayName": "Scorm","status": true},{"allowedFileFormat": [],"allowedFileSize": null,"name": "audio","displayName": "Audio","status": true},{"allowedFileFormat": [],"allowedFileSize": null,"name": "image","displayName": "Image","status": true},{"allowedFileFormat": [],"allowedFileSize": null,"name": "html","displayName": "HTML","status": true},{"allowedFileFormat": [],"allowedFileSize": null,"name": "weblink","displayName": "Web Link","status": true},{"allowedFileFormat": [],"allowedFileSize": null,"name": "otherattachements","displayName": "Other Attachements","status": true}];
    spyOn(httpClient, 'getResponse').and.returnValue(Promise.resolve(expectedResult));
    spyOn(service, 'getContentBuilder').and.callThrough();
    const contentType = await httpClient.getResponse(Service.COURSE_SERVICE, `content-activity-type/capgemini/content`, HttpMethod.GET, {});
    await service.getContentBuilder("capgemeni", "content");
    expect(contentType).toBe(expectedResult);
    expect(service.getContentBuilder).toHaveBeenCalled();
  });

  it("should return activity types", async () => {
    const expectedResult = [{"allowedFileFormat": [],"allowedFileSize": null,"name": "quiz","displayName": "Quiz","status": true},{"allowedFileFormat": [],"allowedFileSize": null,"name": "assignment","displayName": "Assignment","status": true},{"allowedFileFormat": [],"allowedFileSize": null,"name": "discussionForum","displayName": "Discussion Forum","status": true},{"allowedFileFormat": [],"allowedFileSize": null,"name": "survey","displayName": "Survey","status": true},{"allowedFileFormat": [],"allowedFileSize": null,"name": "viva","displayName": "Viva","status": true}];
    spyOn(httpClient, 'getResponse').and.returnValue(Promise.resolve(expectedResult));
    spyOn(service, 'getContentBuilder').and.callThrough();
    const activityType = await httpClient.getResponse(Service.COURSE_SERVICE, `content-activity-type/capgemini/activity`, HttpMethod.GET, {});
    await service.getContentBuilder("capgemeni", "activity");
    expect(activityType).toBe(expectedResult);
    expect(service.getContentBuilder).toHaveBeenCalled();
  });

  it("should return accepted file types", async () => {
    const expectedResultDocument = 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const expectedResultVideo = 'video/mp4, video/mpeg';
    const expectedResultEpub = 'application/epub+zip';
    const expectedResultScorm = 'application/zip';
    const expectedResultAudio = 'audio/mpeg, audio/wav';
    const expectedResultImage = 'image/png, image/jpeg, image/gif';
    const expectedResultHtml = 'application/zip';
    const expectedResultOtherattachments = '*';
    spyOn(service, 'getAcceptedFileTypes').and.callThrough();
    const acceptedFileTypesDocument = await service.getAcceptedFileTypes("capgemini","content", "document");
    const acceptedFileTypesVideo = await service.getAcceptedFileTypes("capgemini","content","video");
    const acceptedFileTypesEpub = await service.getAcceptedFileTypes("capgemini","content","epub");
    const acceptedFileTypesScorm = await service.getAcceptedFileTypes("capgemini","content","scorm");
    const acceptedFileTypesAudio = await service.getAcceptedFileTypes("capgemini","content","audio");
    const acceptedFileTypesImage = await service.getAcceptedFileTypes("capgemini","content","image");
    const acceptedFileTypeshtml = await service.getAcceptedFileTypes("capgemini","content","html");
    const acceptedFileTypesotherattachments = await service.getAcceptedFileTypes("capgemini","content","otherattachments");
    expect(acceptedFileTypesDocument).toBe(expectedResultDocument);
    expect(acceptedFileTypesVideo).toBe(expectedResultVideo);
    expect(acceptedFileTypesEpub).toBe(expectedResultEpub);
    expect(acceptedFileTypesScorm).toBe(expectedResultScorm);
    expect(acceptedFileTypesAudio).toBe(expectedResultAudio);
    expect(acceptedFileTypesImage).toBe(expectedResultImage);
    expect(acceptedFileTypeshtml).toBe(expectedResultHtml);
    expect(acceptedFileTypesotherattachments).toBe(expectedResultOtherattachments);
    expect(service.getAcceptedFileTypes).toHaveBeenCalled();
  });

});
