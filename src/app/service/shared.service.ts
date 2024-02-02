
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private eventDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private sportsId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  oneclickBet = new BehaviorSubject<boolean>(false);
  private triggerFunctionSubject = new BehaviorSubject<void>(null);
  private isTriggered = false;

  triggerFunction$ = this.triggerFunctionSubject.asObservable();

  triggerFunction() {
    if (!this.isTriggered) {
      this.isTriggered = true;
      this.triggerFunctionSubject.next();
    }
  }

  resetTrigger() {
    this.isTriggered = false;
  }

  
  setOneClick(value: boolean) {
    this.oneclickBet.next(value);
  }
  setEventData(data: any): void {
    this.eventDataSubject.next(data);
  }

  getEventData(): Observable<any> {
    return this.eventDataSubject.asObservable();
  }


  setSportsId(data: any): void {
    this.sportsId.next(data);
  }

  getSportsId(): Observable<any> {
    return this.sportsId.asObservable();
  }

}
