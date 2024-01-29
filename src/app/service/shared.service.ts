
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private eventDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private sportsId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  oneclickBet = new BehaviorSubject<boolean>(false);
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
