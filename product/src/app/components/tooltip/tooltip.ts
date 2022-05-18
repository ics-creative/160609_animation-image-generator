import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { localeData } from 'app/i18n/locale-manager';
import { Tooltip } from '../../../../common-src/type/TooltipType';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.html',
  styleUrls: ['./tooltip.scss']
})
export class TooltipComponent {
  @ViewChild('element')
  element: ElementRef | undefined;
  @Input()
  showingTooltip: Tooltip | null = null;

  @Input()
  showingTooltipButtonPos = { x: 0, y: 0 };

  @Input()
  validationErrorsMessage: string[] = [''];

  @Output()
  changeTooltipShowing = new EventEmitter<Tooltip | null>();

  localeData = localeData;

  hideTooltip(event: MouseEvent) {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }
    if (!this.element?.nativeElement.contains(event.target)) {
      this.changeTooltipShowing.emit(null);
    }
  }

  get isShowingOptimiseTooltip() {
    return this.showingTooltip === Tooltip.OPTIMISE;
  }

  get isShowingLineStampAlertTooltip() {
    return this.showingTooltip === Tooltip.LINE_STAMP_ALERT;
  }

  get getOptimiseTooltipButtonPos() {
    // ボタン位置とのx座標の差
    const DIFF_X = 36;
    // ボタン位置とのy座標の差
    const DIFF_Y = -14;
    return {
      x: this.showingTooltipButtonPos.x + DIFF_X,
      y: this.showingTooltipButtonPos.y + DIFF_Y
    };
  }

  get getLineStampAlertButtonPos() {
    // ボタン位置とのx座標の差
    const DIFF_X = -234;
    // ボタン位置とのy座標の差
    const DIFF_Y = 36;
    return {
      x: this.showingTooltipButtonPos.x + DIFF_X,
      y: this.showingTooltipButtonPos.y + DIFF_Y
    };
  }
}
