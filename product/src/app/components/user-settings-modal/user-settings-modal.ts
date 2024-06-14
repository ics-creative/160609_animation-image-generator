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
import { TrackingEnabled } from '../../../../common-src/type/TrackingEnabled';
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
  changeSettings = new EventEmitter<{ trackingEnabled: TrackingEnabled }>();

  @Output()
  close = new EventEmitter<void>();

  @Input()
  userSettings: UserSettings = {
    trackingEnabled: true
  };

  @ViewChild('trackingCheckbox', { static: true })
  trackingCheckbox?: ElementRef;

  // クラス名を.htmlから使用できるようにする
  localeData = localeData;

  show() {
    $('#user-settings-modal').modal('show');
  }

  handleClose() {
    $('#user-settings-modal').modal('hide');
    this.close.emit();
  }

  handleChange() {
    const trackingChecked = this.trackingCheckbox?.nativeElement.checked;
    const trackingEnabled: TrackingEnabled = trackingChecked;
    this.changeSettings.emit({ trackingEnabled: trackingEnabled });
  }
}
