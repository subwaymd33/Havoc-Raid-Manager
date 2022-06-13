import { Component, Output, EventEmitter } from '@angular/core';
import { faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'cm-filter-textbox',
  templateUrl: './filter-textbox.component.html',
  styleUrls: [ './filter-textbox.component.css' ]
})
export class FilterTextboxComponent {
  closeIcon = faClose;
    model: { filter: string } = { filter: '' };

    @Output()
    changed: EventEmitter<string> = new EventEmitter<string>();

    filterChanged(event: any) {
      event.preventDefault();
      this.changed.emit(this.model.filter); // Raise changed event
    }
}