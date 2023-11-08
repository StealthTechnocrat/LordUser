import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-time-countdown',
  templateUrl: './time-countdown.component.html',
  styleUrls: ['./time-countdown.component.scss']
})
export class TimeCountdownComponent implements AfterViewInit {

  difference: number = 0; 
  date: any;
  matchDate: any;
  now: any;
  targetDate: any = new Date(2023, 8, 20);
  targetTime: any = this.targetDate.getTime();
  daysLeft!: number;
  hoursLeft!: number;
  minutesLeft!: number;
  secondsLeft!: number;
  months: Array<string> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  currentTime: any = `${
    this.months[this.targetDate.getMonth()]
  } ${this.targetDate.getDate()}, ${this.targetDate.getFullYear()}`;

  @ViewChild('days', { static: true }) days!: ElementRef;
  @ViewChild('hours', { static: true }) hours!: ElementRef;
  @ViewChild('minutes', { static: true }) minutes!: ElementRef;
  @ViewChild('seconds', { static: true }) seconds!: ElementRef;

  ngAfterViewInit() {
    this.updateCountdown(); // Initial call
    setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }
  updateCountdown() {
    this.date = new Date();
    var specificDate = new Date(2023, 8, 20); // September is 8 (0-based index)
    specificDate.setHours(15); // Set the hour to 15 (3 PM)
    specificDate.setMinutes(0); // Set the minutes to 0
    specificDate.setSeconds(0); // Set the seconds to 0
    this.matchDate = specificDate
    console.log("specificDate.getTime()",specificDate)
    console.log("this.now = this.date.getTime();",this.date)

    const timeDifferenceMs = this.matchDate - this.date;

    // Calculate days, hours, minutes, and seconds
    this.daysLeft = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
    const hoursRemainingMs = timeDifferenceMs % (1000 * 60 * 60 * 24);
    this.hoursLeft = Math.floor(hoursRemainingMs / (1000 * 60 * 60));
    const minutesRemainingMs = hoursRemainingMs % (1000 * 60 * 60);
    this.minutesLeft = Math.floor(minutesRemainingMs / (1000 * 60));
    const secondsRemainingMs = minutesRemainingMs % (1000 * 60);
    this.secondsLeft = Math.floor(secondsRemainingMs / 1000);

    this.days.nativeElement.innerText = this.daysLeft;
    this.hours.nativeElement.innerText = this.hoursLeft;
    this.minutes.nativeElement.innerText = this.minutesLeft;
    this.seconds.nativeElement.innerText = this.secondsLeft;

    // Update current time
    this.currentTime = this.formatCurrentTime();
    //console.log("this.currentTime", this.currentTime)
    console.log(" this.days.nativeElement.innerText",  this.daysLeft)
    console.log("this.hours.nativeElement.innerText", this.hoursLeft)
    console.log("this.minutes.nativeElement.innerText", this.minutesLeft)
    console.log("this.seconds.nativeElement.innerText", this.secondsLeft)
    
  }
  formatCurrentTime(): string {
    const currentDate = new Date();
    const formattedDate = `${this.months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
    const formattedTime = currentDate.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
  }

}
