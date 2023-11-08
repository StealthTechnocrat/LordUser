import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Cookie } from "ng2-cookies";
import { AccountService } from "src/app/service/account-service";
import { UiService } from "src/app/service/ui-service";
@Component({
  selector: "app-live-markets",
  templateUrl: "./live-markets.component.html",
  styleUrls: ["./live-markets.component.scss"],
})
export class LiveMarketsComponent implements OnInit {
  sportsId: number = 4;
  rtrnObj: any;
  reqType: string = "All";
  chkCnd: string = "Before";
  cndtn: string = "1";
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
    public uISERVICE: UiService
  ) { }

  ngOnInit(): void {
    if (Cookie.check('usersCookies')) {
      this.chkCnd = "After";
      this.GetDetail();
    } else {
      this.uISERVICE.Header = false;
      this.GetDetail();
    }
    setInterval(() => {
      this.changeFunc();
    }, 2000);
  }

  GetDetail() {
    this.uISERVICE.loader = true;
    this.accountService.getDetailLst(this.sportsId, this.reqType, this.chkCnd).then((response) => {

      if (response.Status) {
        this.uISERVICE.loader = false;
        this.rtrnObj = response.Result;
        if (this.reqType == "All") {
          console.log("rtrn",this.rtrnObj);
          this.uISERVICE.News = this.rtrnObj.News;
          this.uISERVICE.TopEvents = this.rtrnObj.TopEvents;
          this.uISERVICE.TopInplay = this.rtrnObj.TopInplay;
          this.uISERVICE.cricketEventCount = this.rtrnObj.CricketEventCount;
          this.uISERVICE.cricketInPlayEventCount = this.rtrnObj.CricketInplayEventCount;
          this.uISERVICE.tennisEventCount = this.rtrnObj.TennisEventCount;
          this.uISERVICE.tennisInPlayEventCount = this.rtrnObj.TennisInplayEventCount;
          this.uISERVICE.footballEventCount = this.rtrnObj.FootballEventCount;
          this.uISERVICE.footballInPlayEventCount = this.rtrnObj.FootbalInplayEventCount;
          this.uISERVICE.Bets = this.rtrnObj.Bets;
          this.totalBets1 = this.rtrnObj.Events.length;
          this.totalBets2 = this.rtrnObj.NxtEvnts.length;
          localStorage.setItem('TopEvents', JSON.stringify(this.rtrnObj.TopEvents));
          localStorage.setItem('News', JSON.stringify(this.rtrnObj.News));
          localStorage.setItem('TopInplay', JSON.stringify(this.rtrnObj.TopInplay));
          if (this.chkCnd == "After") {
            localStorage.setItem('Bets', JSON.stringify(this.rtrnObj.Bets));
          }
        }
      } else {
        this.uISERVICE.loader = false;
        this.rtrnObj = [];
      }
    });
  }

  changeSportsId(sportsId, reqType) {
    this.sportsId = sportsId;
    this.reqType = reqType;
    this.uISERVICE.News = JSON.parse(localStorage.getItem("News"));
    this.uISERVICE.TopEvents = JSON.parse(localStorage.getItem("TopEvents"));
    this.uISERVICE.TopInplay = JSON.parse(localStorage.getItem("TopInplay"));
    if (this.chkCnd == "After") {
      this.uISERVICE.Bets = JSON.parse(localStorage.getItem("Bets"));
    }
    this.GetDetail();
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

  checkLogin(type, systemId) {
    if (!Cookie.get("usersCookies")) {
      if (type == "Live") {
        this.uISERVICE.live = true;
        this.router.navigate(["games"]);
      } else if (type == "UpCom") {
        this.uISERVICE.live = false;
        this.router.navigate(["games"]);
      } else {
        switch (type) {
          case 'table':
            this.router.navigate(["/casino/", type]);
            break;
          case 'live-games':
            this.router.navigate(["/casino/", type]);
            break;
          case 'SatkaMatka':
            this.router.navigate(["/satka-matka/"]);
            break;
          case 'CupRate':
            this.router.navigate(["/cup-rate/", 4, 28127348]);
            break;
          case 'Live':
            this.uISERVICE.live = true;
            this.router.navigate(["games"]);
            break;
          case 'UpCom':
            this.uISERVICE.live = false;
            this.router.navigate(["games"]);
            break;
        }
      }
    } else {
      switch (type) {
        case 'table':
          this.router.navigate(["/casino/", type]);
          break;
        case 'live-games':
          this.router.navigate(["/casino/", type]);
          break;
        case 'SatkaMatka':
          this.router.navigate(["/satka-matka/"]);
          break;
        case 'CupRate':
          this.router.navigate(["/cup-rate/", 4, 28127348]);
          break;
        case 'Live':
          this.uISERVICE.live = true;
          this.router.navigate(["games"]);
          break;
        case 'UpCom':
          this.uISERVICE.live = false;
          this.router.navigate(["games"]);
          break;
      }

    }
  }

}
