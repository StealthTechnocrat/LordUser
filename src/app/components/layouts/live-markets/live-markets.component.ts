import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Cookie } from "ng2-cookies";
import { AccountService } from "src/app/service/account-service";
import { UiService } from "src/app/service/ui-service";
import { TimepipeService } from "src/app/service/timepipe.service";
import { SharedService } from "src/app/service/shared.service";

@Component({
  selector: "app-live-markets",
  templateUrl: "./live-markets.component.html",
  styleUrls: ["./live-markets.component.scss"],
})
export class LiveMarketsComponent implements OnInit {
    sportsId: number = 4;
    rtrnObj: any = [];
    SrNo1: number;
    SrNo2: number;
    SrNo3: number;
    SrNo4: number;
    SrNo5: number;
    SrNo6: number;
    totalBets1: number;
    totalBets2: number;
    topEvents: any = [];
    inplayEvents: any = [];
    eventData: any;
  
    constructor(
      private accountService: AccountService,
      private router: Router,
      private route: ActivatedRoute,
      public uISERVICE: UiService,
      public timePipe: TimepipeService,
      private sharedService: SharedService
    ) { }
  
    ngOnInit(): void {
      this.getEvents();
      
      this.sharedService.getEventData().subscribe((data) => {
        this.topEvents = data;
      });
      setInterval(() => {
        this.changeFunc();
      }, 2000);
    }
  
  
  
    changeSportsId(sportsId) {
      this.sportsId = sportsId;
      this.sharedService.setSportsId(this.sportsId);
      if (this.uISERVICE.inplay == true) {
        this.getInplayEvents();
      } else {
        this.getEvents();
      }
    }
    getRelativeDate(eventTime: Date): string {
      
      const today = new Date();
      const eventDate = new Date(eventTime);
      const diffTime = eventDate.getTime() - today.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
  
      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Tomorrow';
      } else if (diffDays === -1) {
        return 'Yesterday';
      } else {
        // You can return the date in a specific format for other days
        return eventDate.toLocaleDateString(); // Or any other format you prefer
      }
    }
    getInplayEvents() {
      
      this.rtrnObj = [];
      this.accountService
        .GetInplayEventsBySportsId(this.sportsId)
        .then((response) => {
          if (response) {
            console.log("match", response);
            this.rtrnObj = response.Result;
            this.topEvents = this.rtrnObj.TopEvents;
            this.uISERVICE.cricketEventCount = this.rtrnObj.CricketEventCount;
            this.uISERVICE.cricketInPlayEventCount =
              this.rtrnObj.CricketInplayEventCount;
            this.uISERVICE.tennisEventCount = this.rtrnObj.TennisEventCount;
            this.uISERVICE.tennisInPlayEventCount =
              this.rtrnObj.TennisInplayEventCount;
            this.uISERVICE.footballEventCount = this.rtrnObj.FootballEventCount;
            this.uISERVICE.footballInPlayEventCount =
              this.rtrnObj.FootbalInplayEventCount;
            console.log("evt", this.rtrnObj);
          } else {
            this.rtrnObj = [];
          }
        });
    }
    changeFunc() {
      //----
      this.SrNo1 = Math.floor(Math.random() * this.totalBets1);
      this.SrNo2 = Math.floor(Math.random() * this.totalBets1);
      this.SrNo3 = Math.floor(Math.random() * this.totalBets1);
      //----
      this.SrNo4 = Math.floor(Math.random() * this.totalBets2);
      this.SrNo5 = Math.floor(Math.random() * this.totalBets2);
      this.SrNo6 = Math.floor(Math.random() * this.totalBets2);
      //----
    }
  
    getEvents() {
      
      this.rtrnObj = [];
      this.accountService
        .GetAllEventsBySportsId(this.sportsId)
        .then((response) => {
          if (response) {
            console.log("matches", response);
            this.rtrnObj = response.Result;
            this.topEvents = this.rtrnObj.TopEvents;
            this.uISERVICE.cricketEventCount = this.rtrnObj.CricketEventCount;
            this.uISERVICE.cricketInPlayEventCount =
              this.rtrnObj.CricketInplayEventCount;
            this.uISERVICE.tennisEventCount = this.rtrnObj.TennisEventCount;
            this.uISERVICE.tennisInPlayEventCount =
              this.rtrnObj.TennisInplayEventCount;
            this.uISERVICE.footballEventCount = this.rtrnObj.FootballEventCount;
            this.uISERVICE.footballInPlayEventCount =
              this.rtrnObj.FootbalInplayEventCount;
            console.log("evt", this.rtrnObj);
          } else {
            this.rtrnObj = [];
          }
        });
    }
}