import { Component, EventEmitter, Output, Input, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-preview-layout',
  templateUrl: './preview-layout.component.html',
  styleUrls: ['./preview-layout.component.scss']
})
export class PreviewLayoutComponent {
  @Output() previewEvent: EventEmitter<string> = new EventEmitter<string>();
  @Input() type = 'login';
  isPreview = true;
  isClicked = false;

  constructor (
    @Inject(DOCUMENT) private document: Document,private renderer: Renderer2,) { }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  clickEvent(event: any): void {
    this.renderer.removeClass(this.document.body, 'stop-body-scroll');
    if (event === 'publish') {
      this.isClicked = true;
    }
    this.previewEvent.emit(event);
  }

}
