import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Cookie } from "ng2-cookies";
import { AccountService } from "src/app/service/account-service";
import { UiService } from "src/app/service/ui-service";
import { TimepipeService } from "src/app/service/timepipe.service";

@Component({
  selector: "app-live-markets",
  templateUrl: "./live-markets.component.html",
  styleUrls: ["./live-markets.component.scss"],
})
export class LiveMarketsComponent implements OnInit {
  sportsId: number = 4;
  type: string = "all";
  rtrnObj: any = [];
  SrNo1: number;
  SrNo2: number;
  SrNo3: number;
  SrNo4: number;
  SrNo5: number;
  SrNo6: number;
  totalBets1: number;
  totalBets2: number;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    public uISERVICE: UiService,
    public timePipe: TimepipeService
  ) {}

  ngOnInit(): void {
    this.getEvents();
    setInterval(() => {
      this.changeFunc();
    }, 2000);
  }

  changeSportsId(sportsId) {
    this.sportsId = sportsId;
    if (this.uISERVICE.inplay == true) {
      this.type = "inplay";
    }
    this.getEvents();
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
    debugger;
    this.rtrnObj = [];
    this.accountService
      .GetAllEventsBySportsId(this.sportsId, this.type)
      .then((response) => {
        if (response) {
          this.rtrnObj = response.Result;
          this.uISERVICE.TopEvents = this.rtrnObj.TopEvents;
          this.uISERVICE.TopInplay = this.rtrnObj.TopInplay;
          this.uISERVICE.TopEvents = JSON.parse(
            localStorage.getItem("TopEvents")
          );
          this.uISERVICE.TopInplay = JSON.parse(
            localStorage.getItem("TopInplay")
          );
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
