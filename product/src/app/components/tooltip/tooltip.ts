import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
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
  lineStampAlertButtonPos = { x: 0, y: 0 };

  @Input()
  validationErrorsMessage: string[] = [''];

  @Output()
  changeTooltipShowing = new EventEmitter<Tooltip | null>();

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

  get getLineStampAlertButtonPos() {
    // ボタン位置とのx座標の差
    const DIFF_X = -234;
    // ボタン位置とのy座標の差
    const DIFF_Y = 36;
    return {
      x: this.lineStampAlertButtonPos.x + DIFF_X,
      y: this.lineStampAlertButtonPos.y + DIFF_Y
    };
  }
}
