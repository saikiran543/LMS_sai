import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentPlayerComponent } from './content-player.component';

const routes: Routes = [
  {
    path: '',
    component: ContentPlayerComponent,
    children: [
      {
        path: 'pdf',
        loadChildren: ()=> import('./pdf/pdf.module').then(module=>module.PdfModule)
      },
      {
        path: 'weblink',
        loadChildren: ()=> import('./weblink/weblink.module').then(module=>module.WeblinkModule)
      },
      {
        path: 'image',
        loadChildren: ()=> import('./image/image.module').then(module=>module.ImageModule)
      },
      {
        path: 'epub',
        loadChildren: ()=> import('./epub/epub.module').then(module=>module.EpubModule)
      },
      {
        path: 'other-attachements',
        loadChildren: ()=> import('./other-attachements/other-attachements.module').then(module=>module.OtherAttachementsModule)
      },
      {
        path: 'audio',
        loadChildren: ()=> import('./audio/audio.module').then(module=>module.AudioModule)
      },
      {
        path: 'html',
        loadChildren: ()=> import('./html/html.module').then(module=>module.HtmlModule)
      },
      {
        path: 'scorm',
        loadChildren: ()=> import('./scorm/scorm.module').then(module=>module.ScormModule)
      },
      {
        path: 'unit-folder',
        loadChildren: ()=> import('./unit-folder/unit-folder.module').then(module=>module.UnitFolderModule)
      },
      {
        path: 'excel',
        loadChildren: ()=> import('./excel/excel.module').then(module=>module.ExcelModule)
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentPlayerRoutingModule { }
