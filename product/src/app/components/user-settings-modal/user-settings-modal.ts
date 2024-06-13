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
import { UserSettings } from '../app/UserConfig';

@Component({
  selector: 'app-user-settings-modal',
  templateUrl: './user-settings-modal.html',
  styleUrls: ['./user-settings-modal.scss']
})

/**
 * 設定ダイアログのコンポーネントです。
 */
export class UserSettingsModalComponent {
  @Output()
  changeSettings = new EventEmitter<{ trackingMode: TrackingMode }>();

  @Input()
  userSettings: UserSettings = {
    trackingMode: true
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
    const trackingMode: TrackingMode = trackingChecked;
    this.changeSettings.emit({ trackingMode: trackingMode });
  }
}
