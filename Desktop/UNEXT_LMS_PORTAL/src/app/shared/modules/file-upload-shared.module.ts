import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from '../components/file-upload/file-upload.component';
import { TranslateModule } from '@ngx-translate/core';
import { DragDirective } from 'src/app/directives/dragDrop.directive';
import { VideoUploadComponent } from '../components/video-upload/video-upload.component';
import { ExpressrecorderComponent } from '../components/expressrecorder/expressrecorder.component';

@NgModule({
  declarations: [
    FileUploadComponent,
    DragDirective,
    VideoUploadComponent,
    ExpressrecorderComponent,
  ],
  imports: [CommonModule, TranslateModule,],
  exports: [
    FileUploadComponent,
    VideoUploadComponent,
    ExpressrecorderComponent,
  ],
})
export class FileUploadSharedModule {}
