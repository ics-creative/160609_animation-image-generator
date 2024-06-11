import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { localeData } from 'app/i18n/locale-manager';
import $ from 'jquery';
import { TrackingMode } from '../../../../common-src/type/TrackingMode';

@Component({
  selector: 'app-user-setting-modal',
  templateUrl: './user-setting-modal.html',
  styleUrls: ['./user-setting-modal.scss']
})

/**
 * 設定ダイアログのコンポーネントです。
 */
export class UserSettingModalComponent {
  @Output()
  changeSettingEvent = new EventEmitter<{ trackingMode: TrackingMode }>();

  @Input()
  userSetting: { trackingMode: TrackingMode } = {
    trackingMode: 'enableTracking'
  };

  @ViewChild('trackingCheckbox', { static: true })
  trackingCheckbox?: ElementRef;

  // クラス名を.htmlから使用できるようにする
  localeData = localeData;

  show() {
    $('#user-settings-modal').modal('show');
  }

  handleClose(event: MouseEvent) {
    $('#user-settings-modal').modal('hide');
  }

  handleChange(event: Event) {
    const trackingChecked = this.trackingCheckbox?.nativeElement.checked;
    const trackingMode = trackingChecked ? 'enableTracking' : 'disableTracking';
    this.changeSettingEvent.emit({ trackingMode: trackingMode });
  }
}
