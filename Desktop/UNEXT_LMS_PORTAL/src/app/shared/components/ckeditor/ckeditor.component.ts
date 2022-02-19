import { Component, Input, OnInit, OnChanges } from '@angular/core';
import * as Editor from '@edunxtv2/unext-ck-editor/ckeditor';
import { distinctUntilChanged } from 'rxjs/operators';
import { CommonUtils } from 'src/app/utils/common-utils';

@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss']
})
export class CkeditorComponent implements OnInit, OnChanges {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() ckeditorFormControl!: any;
  @Input() characterCountLimit = 0;
  @Input() lineCountLimit = 0;
  @Input() config = {};
  public Editor = Editor;
  // 0 means unlimited
  public initialText = '';

  constructor(
    private commonUtils: CommonUtils
  ) { }

  ngOnInit(): void {
    this.checkCharacterLineCount();
  }

  ngOnChanges(): void {
    this.checkCharacterLineCount();
  }

  private checkCharacterLineCount(): void {
    let lineCount = 0;
    if (this.ckeditorFormControl && (this.lineCountLimit > 0 || this.characterCountLimit > 0)) {
      this.ckeditorFormControl.valueChanges.pipe(distinctUntilChanged()).subscribe((val: string) => {
        if(val){
          const lines = val.split(/\r*<p>/);
          lineCount = (lines.length) - 1;
          const plainText = this.commonUtils.removeHTML(val);
          if ((lineCount > this.lineCountLimit && this.lineCountLimit > 0) || (plainText.length > this.characterCountLimit && this.characterCountLimit > 0)) {
            this.ckeditorFormControl.setValue(this.initialText, { emitEvent: false });
            this.ckeditorFormControl.updateValueAndValidity();
          } else {
            this.initialText = val;
          }
        }
      });
    }
  }
}
