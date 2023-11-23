import { Injectable } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'todayTomorrow'
})
export class TimepipeService implements PipeTransform {
  constructor(private datePipe: DatePipe) { }
  
  transform(value: string): string {
    const dateObject = new Date(value);
    const today = new Date();
    const tomorrow = new Date();
    const yesterday = new Date();
    
    tomorrow.setDate(tomorrow.getDate() + 1);
    yesterday.setDate(yesterday.getDate() - 1); // Subtract 1 day to get yesterday's date

    if (this.datePipe.transform(dateObject, 'yyyy-MM-dd') === this.datePipe.transform(today, 'yyyy-MM-dd')) {
      return 'Today';
    } else if (this.datePipe.transform(dateObject, 'yyyy-MM-dd') === this.datePipe.transform(tomorrow, 'yyyy-MM-dd')) {
      return 'Tomorrow';
    } else if (this.datePipe.transform(dateObject, 'yyyy-MM-dd') === this.datePipe.transform(yesterday, 'yyyy-MM-dd')) {
      return 'Yesterday';
    } else {
      return this.datePipe.transform(dateObject, 'yyyy-MM-dd') || '';
    }
  }
}
