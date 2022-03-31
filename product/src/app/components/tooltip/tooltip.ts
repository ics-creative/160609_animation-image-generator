import {
  Component,
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
  element: any;
  @Input()
  showingTooltip: Tooltip | null = null;

  @Output()
  changeTooltipShowing = new EventEmitter<Tooltip | null>();

  hideTooltip(event: MouseEvent) {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }
    if (!this.element.nativeElement.contains(event.target)) {
      this.changeTooltipShowing.emit(null);
    }
  }

  get isShowingOptimiseTooltip() {
    return this.showingTooltip === Tooltip.OPTIMISE;
  }
}
