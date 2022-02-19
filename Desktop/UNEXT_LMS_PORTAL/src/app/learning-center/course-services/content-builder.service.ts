/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpMethod } from 'src/app/enums/httpMethod';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Service } from 'src/app/enums/service';
import { HttpClientService } from '../../services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ContentBuilderService {

  constructor(private httpClient: HttpClientService) {

  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getContentBuilder(orgId:any, type: any): Promise<any> {
    const contentTypeList = await this.httpClient.getResponse(Service.COURSE_SERVICE, `content-activity-type/${orgId}/${type}`, HttpMethod.GET, {});
    return contentTypeList.body;
  }

  /**
   * Function to get the accepted file mime types based on content
   * @param contentType
   * @returns string
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getAcceptedFileTypes(orgId: any, type:any, contentType: string): Promise<string> {
    const contentTypes = await this.getContentBuilder(orgId, type);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = contentTypes.filter((item: any) => item.name === contentType);
    const acceptedFileTypes = JSON.stringify(content[0].allowedFileFormat);
    // eslint-disable-next-line no-useless-escape
    return acceptedFileTypes.replace (/"/g,'').replace(/[\[\]']+/g,'');
  }
}
