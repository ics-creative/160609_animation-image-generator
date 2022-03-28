import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.html',
  styleUrls: ['./tooltip.scss']
})
export class TooltipComponent {
  @ViewChild('element')
  element:any;
  @Input()
  showingTooltip = '';

  @Output()
  changeTooltipShowing =  new EventEmitter<string>()

  hideTooltip(event: MouseEvent) {
    console.log(event.target, this.element.nativeElement,!this.element.nativeElement.contains(event.target));
    if (!(event.target instanceof HTMLElement)) {
      return;
    }
    if(!this.element.nativeElement.contains(event.target)){
      this.changeTooltipShowing.emit("")
    }

  }
}
