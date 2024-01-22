import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { AccountService } from 'src/app/service/account-service';
import { UiService } from 'src/app/service/ui-service';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-set-bet',
  templateUrl: './set-bet.component.html',
  styleUrls: ['./set-bet.component.scss']
})
export class SetBetComponent implements OnInit {

  sportsId: number;
  eventId: string;
  rtrnObj: any = [];
  sesnObj: any = [];
  type: string = "Before";
  MtchMrkt: string;
  apiData: any = [];
  bookApiData: any = [];
  matchData: any = [];
  url: string;
  scoreData: any = [];
  public _setInterval1: any;
  public _setInterval2: any;
  scoreApi: boolean = true;
  fancy: string;
  ssnBook: any = [];
  date: Date;
  marketName: string = "All";
  BetType: string = "All";
  sessonProfitLoss: any = [];
  sessonBookList: any = [];
  modalVisible: boolean = false;
  closeResult = '';
  evtTime: any;
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  showTimer: boolean = false;
  marketType: string = 'all';

  ballFace: any[] = [];
  overRuns: any[] = [];
  wicketsFall: any[] = [];
  boundaries: any[] = [];
  otherFancy: any[] = [];
  ballsWicketLost: any[] = [];
  scoreUrlFrame: SafeResourceUrl;
  isMuted = true;
  constructor(private router: Router,private toastr: ToastrService,public sanitizer: DomSanitizer, private http: HttpClient, private accountService: AccountService, private route: ActivatedRoute, public uISERVICE: UiService, private modalService: NgbModal) { }
  toggleModal() {
    this.modalVisible = !this.modalVisible;
  }
  ngOnInit(): void {
    this.setIntialValues();
  }
  toggleMute() {
    this.isMuted = !this.isMuted;
  }
  scoreUrl() {
    
    this.url = "https://nxbet247.com/live-score-card/" + this.sportsId + "/" + this.eventId;
    this.scoreUrlFrame = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  setIntialValues() {
    this.type = Cookie.check("usersCookies") ? "After" : "Before";
    if(this.type=="Before"){
      this.router.navigate(["/games"]);
      this.toastr.error('Please login to access all features.', 'LOGIN!');
    }else{
      this.uISERVICE.showSlip = [];
      this.uISERVICE.profit = 0;
      this.uISERVICE.stake = 0;
      this.uISERVICE.exposure = 0;
      this.getRoutesParam();
    }
   
  }

  getRoutesParam() {
    this.route.paramMap.subscribe(params => {
      this.sportsId = parseInt(params.get('sportsId'));
      this.eventId = params.get('eventId');
    });
    setTimeout(() => {
      this.initiateIntervals();
    }, 1000);
  }

  initiateIntervals() {
    setInterval(() => this.updateCountdown(), 1000);
    this.getEventDetail();
    setTimeout(() => {
      this.myFunction();
    }, 2000);
  }

  selectMarket(value) {
    
    if (value == 'all') {
      this.marketType = 'all'
    } else if (value == 'odds') {
      this.marketType = 'odds'
    } else if (value == 'book') {
      this.marketType = 'book'
    } else {
      this.marketType = 'ssn'
    }
  }

  updateCountdown() {
    const currentDate = new Date();
    const formattedDateTime = currentDate.toISOString().slice(0, 19);
    console.log(formattedDateTime);
    const eventTime = new Date(this.evtTime);
    const timeDifference = eventTime.getTime() - currentDate.getTime();
    if (timeDifference <= 0) {
      this.showTimer = false;
      this.days = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
    } else {
      this.days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
      this.showTimer = true;
    }
  }


  GetAllBets() {
    this.uISERVICE.backUpBets = [];
    this.accountService.getPendingBets('Null', this.sportsId, this.marketName, this.BetType, 0, 0).then((response) => {
      if (response.Status) {

        this.uISERVICE.backUpBets = response.Result.filter(x => x.EventName == this.rtrnObj.EventName);
      } else {
        this.uISERVICE.backUpBets = [];
      }
    });
  }



  async myFunction() {
    return await new Promise(resolve => {
      this._setInterval1 = setInterval(() => {
        this.getAPIData();
      }, 1500);
      this._setInterval2 = setInterval(() => {
        this.calculateBook();
      }, 3000);
    });
  }



  ngOnDestroy() {
    clearInterval(this._setInterval1);
    clearInterval(this._setInterval2);
  }


  fancyBook(sId, fancyName) {

    this.fancy = fancyName
    this.sessonBookList = [];
    const fancyBets = this.uISERVICE.Bets.filter(x => x.RunnerId == sId && x.EventId == this.eventId);
    if (fancyBets.length > 0) {
      const minOdds = Math.min(...fancyBets.map(x => x.Odds));
      const maxOdds = Math.max(...fancyBets.map(x => x.Odds));
      const min = minOdds - 5;
      const max = maxOdds + 50;

      this.sessonBookList = Array.from({ length: max - min + 1 }, () => ({ RunValue: 0, Pl: 0 }));

      fancyBets.forEach(element => {
        if (element.BetType == "Yes") {
          for (let index = min; index <= max; index++) {
            const currentIndex = index - min;
            if (index < element.Odds) {
              this.sessonBookList[currentIndex].RunValue = index;
              this.sessonBookList[currentIndex].Pl -= element.Exposure;
            } else {
              this.sessonBookList[currentIndex].RunValue = index;
              this.sessonBookList[currentIndex].Pl += element.Profit;
            }
          }
        } else {
          for (let index = min; index <= max; index++) {
            const currentIndex = index - min;
            if (index < element.Odds) {
              this.sessonBookList[currentIndex].RunValue = index;
              this.sessonBookList[currentIndex].Pl += element.Profit;
            } else {
              this.sessonBookList[currentIndex].RunValue = index;
              this.sessonBookList[currentIndex].Pl -= element.Exposure;
            }
          }
        }
      });
    }

  }

  getSessionPl(runnerId): number {
    this.sessonProfitLoss = [];
    const fancyBets = this.uISERVICE.Bets.filter(x => x.RunnerId == runnerId && x.EventId == this.eventId);
    if (fancyBets.length > 0) {
      const minOdds = Math.min(...fancyBets.map(x => x.Odds));
      const maxOdds = Math.max(...fancyBets.map(x => x.Odds));
      const min = minOdds - 5;
      const max = maxOdds + 50;

      this.sessonProfitLoss = Array.from({ length: max - min + 1 }, () => ({ RunValue: 0, Pl: 0 }));

      fancyBets.forEach(element => {
        if (element.BetType == "Yes") {
          for (let index = min; index <= max; index++) {
            const currentIndex = index - min;
            if (index < element.Odds) {
              this.sessonProfitLoss[currentIndex].RunValue = index;
              this.sessonProfitLoss[currentIndex].Pl -= element.Exposure;
            } else {
              this.sessonProfitLoss[currentIndex].RunValue = index;
              this.sessonProfitLoss[currentIndex].Pl += element.Profit;
            }
          }
        } else {
          for (let index = min; index <= max; index++) {
            const currentIndex = index - min;
            if (index < element.Odds) {
              this.sessonProfitLoss[currentIndex].RunValue = index;
              this.sessonProfitLoss[currentIndex].Pl += element.Profit;
            } else {
              this.sessonProfitLoss[currentIndex].RunValue = index;
              this.sessonProfitLoss[currentIndex].Pl -= element.Exposure;
            }
          }
        }
      });
      const data = this.sessonProfitLoss.find(x => x.RunValue == maxOdds);
      return data ? data.Pl : 0;
    }
    return 0;
  }

  LiveTv() {
    debugger;
  //  if (this.uISERVICE.tv) {
     // this.uISERVICE.tv = false;
    //this.url = "";
     // this.uISERVICE.IframeUrl = "";
    //} else {
     // this.uISERVICE.tv = true;
      this.url = this.rtrnObj.apiUrls.TvUrl + this.eventId;
      this.uISERVICE.IframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
   // }
  }

  counter(i: number) {
    return new Array(i);
  }

  async getScore() {
    this.http.get(this.rtrnObj.apiUrls.ScoreUrl + this.eventId).subscribe(data => {
      this.scoreData = data;

      if (this.scoreData.length > 0) {
        this.scoreApi = true;
      } else {
        this.scoreData = [];
        this.scoreApi = false;
      }
    });
  }




  async getEventDetail() {
    this.uISERVICE.loader = true;
    this.accountService.getEvntDetail(this.eventId, this.type).then((response) => {
      if (response.Status) {
        this.evtTime = response.Result.EventTime;
        this.uISERVICE.Bets = response.Result.Bets;
        response.Result.markets.forEach((element, i) => {
          if (element.marketName == "Match Odds") {
            this.MtchMrkt = element.MarketId;
          }

          if (element.marketName == "To Win the Toss") {
            element.runners.forEach(data => {
              data.runners = {
                'availableToBack': [{ 'price': 1.95, 'size': 100 }, { 'price': 0, 'size': 0 }, { 'price': 0, 'size': 0 }],
                'availableToLay': [{ 'price': 0, 'size': 0 }, { 'price': 0, 'size': 0 }, { 'price': 0, 'size': 0 }]
              }
            });
          } else {
            element.runners.forEach(data => {
              data.runners = {
                'availableToBack': [{ 'price': 0, 'size': 0 }, { 'price': 0, 'size': 0 }, { 'price': 0, 'size': 0 }],
                'availableToLay': [{ 'price': 0, 'size': 0 }, { 'price': 0, 'size': 0 }, { 'price': 0, 'size': 0 }]
              }
            });
          }
        });
        this.uISERVICE.loader = false;
        this.rtrnObj = response.Result;
        this.uISERVICE.betSlip = this.rtrnObj.chips;
        this.getAPIData();
        this.checkToss();
        
        if(this.rtrnObj.Inplay){
          this.scoreUrl();
        }
      } else {
        this.uISERVICE.loader = false;
        this.rtrnObj = [];
      }
    });
  }



  async getAPIData() {
    switch (this.sportsId) {
      case 1:
      case 2:
        this.matchData = this.rtrnObj.markets.find(x => x.marketName === "Match Odds");
        if (this.matchData != null) {
          await this.http.get(this.rtrnObj.apiUrls.BetfairUrl + this.sportsId + "&marketid=" + this.MtchMrkt).subscribe(data => {
            this.apiData = data;
            if (this.apiData.marketId != null) {
              this.updateRunnerData(this.matchData.runners, this.apiData.runners, this.sportsId);
            }
          });
        }
        break;
      case 4:
        this.matchData = this.rtrnObj.markets.find(x => x.marketName === "Match Odds");
        
        const BookData = this.rtrnObj.markets.find(x => x.marketName === "BookMaker");
        if (this.matchData != null) {
          if (this.matchData.ApiUrlType == 1) {
            await this.http.get(this.rtrnObj.apiUrls.DaimondUrl + this.MtchMrkt + "/" + this.eventId).subscribe(data => {
              this.apiData = data;
              if (this.apiData.market != null && this.apiData.market?.length > 0) {
                this.sesnObj = this.apiData.session.filter(x => !x.RunnerName.includes(".3"));

                this.categorizeData();
                this.updateRunnerData(this.matchData.runners, this.apiData.market[0].events, this.sportsId);
              }
            });
          } else {
            await this.http.get(this.rtrnObj.apiUrls.BetfairUrl + this.sportsId + "&marketid=" + this.MtchMrkt).subscribe(data => {
              this.apiData = data;
              if (this.apiData.marketId != null) {
                this.updateRunnerData(this.matchData.runners, this.apiData.runners, 1);
              }
            });
          }
        }
        if (BookData != null) {
          await this.http.get(this.rtrnObj.apiUrls.BookMakerUrl + this.MtchMrkt + "/" + this.eventId).subscribe(data => {
            this.bookApiData = data;
            if (this.bookApiData.market != null && this.bookApiData.market?.length > 0) {
              if (this.sesnObj.length === 0) {
                this.sesnObj = this.bookApiData.session;
              }
              this.updateRunnerData(BookData.runners, this.bookApiData.market[0].events, this.sportsId);
            }
          });
        }
        break;
    }

    if (this.rtrnObj.Inplay && this.scoreApi) {
      //this.getScore();
    }
    this.calculateBook();
  }

  categorizeData() {
    this.wicketsFall = [];
    this.overRuns = [];
    this.boundaries = [];
    this.ballFace = [];
    this.ballsWicketLost = [];
    this.otherFancy = [];
    this.sesnObj.forEach(item => {
      if (item.RunnerName.includes('Fall of') || item.RunnerName.includes('1st')) {
        this.wicketsFall.push(item);
      } else if (item.RunnerName.includes('over runs') || item.RunnerName.includes('over run')) {
        this.overRuns.push(item);
        this.overRuns.sort((a, b) => a.RunnerName.localeCompare(b.RunnerName));
      } else if (item.RunnerName.includes('Boundaries') || item.RunnerName.includes('boundaries')) {
        this.boundaries.push(item);
      } else if (item.RunnerName.includes('face by')) {
        this.ballFace.push(item);
      } else if (item.RunnerName.includes('lost to')) {
        this.ballsWicketLost.push(item);
      }
      else {
        this.otherFancy.push(item);
      }
      // Add similar conditions for other categories
    });

  }

  updateRunnerData(runners, apiRunners, sportsId) {

    runners.forEach(element => {
      if (sportsId == 4) {
        const runner = apiRunners.find(x => x.SelectionId == element.RunnerId.toString());
        element.runners.availableToBack[0].price = runner.BackPrice1;
        element.runners.availableToBack[0].size = runner.BackPrice2;
        element.runners.availableToBack[1].price = runner.BackPrice3;
        element.runners.availableToBack[1].size = runner.BackSize1;
        element.runners.availableToBack[2].price = runner.BackSize2;
        element.runners.availableToBack[2].size = runner.BackSize3;
        element.runners.availableToLay[0].price = runner.LayPrice1;
        element.runners.availableToLay[0].size = runner.LayPrice2;
        element.runners.availableToLay[1].price = runner.LayPrice3;
        element.runners.availableToLay[1].size = runner.LaySize1;
        element.runners.availableToLay[2].price = runner.LaySize2;
        element.runners.availableToLay[2].size = runner.LaySize3;
      } else {
        const runner = apiRunners.find(x => x.selectionId == element.RunnerId);
        element.runners.availableToBack[0].price = runner.availableToBack[0].price;
        element.runners.availableToBack[0].size = runner.availableToBack[0].size;
        element.runners.availableToBack[1].price = runner.availableToBack[1].price;
        element.runners.availableToBack[1].size = runner.availableToBack[1].size;
        element.runners.availableToBack[2].price = runner.availableToBack[2].price;
        element.runners.availableToBack[2].size = runner.availableToBack[2].size;
        element.runners.availableToLay[0].price = runner.availableToLay[0].price;
        element.runners.availableToLay[0].size = runner.availableToLay[0].size;
        element.runners.availableToLay[1].price = runner.availableToLay[1].price;
        element.runners.availableToLay[1].size = runner.availableToLay[1].size;
        element.runners.availableToLay[2].price = runner.availableToLay[2].price;
        element.runners.availableToLay[2].size = runner.availableToLay[2].size;
      }

    });
  }


  reIntBook() {
    if (this.rtrnObj != null && this.uISERVICE.Bets != null) {
      //Match_Odds
      var market = this.rtrnObj.markets.find(x => x.marketName == "Match Odds");
      market.runners.forEach(element => {
        element.Book = 0;
      });
      if (this.sportsId == 4) {
        //BookMaker
        var bookMrkt = this.rtrnObj.markets.find(x => x.marketName == "BookMaker");
        if (bookMrkt != null && bookMrkt != undefined) {
          bookMrkt.runners.forEach(element => {
            element.Book = 0;
          });
        }
        //To Win the Toss
        var tossMrkt = this.rtrnObj.markets.find(x => x.marketName == "To Win the Toss");
        if (tossMrkt != null && tossMrkt != undefined) {
          tossMrkt.runners.forEach(element => {
            element.Book = 0;
          });
        }
      }
    }
  }

  calculateBook() {

    if (this.rtrnObj != null && this.uISERVICE.Bets != null) {
      this.reIntBook();
      //Match_Odds
      var market = this.rtrnObj.markets.find(x => x.marketName == "Match Odds");
      var bets = this.uISERVICE.Bets.filter(x => x.MarketName == "Match Odds");
      if (bets.length > 0) {
        market.runners.forEach(element => {
          bets.forEach(data => {
            ;;
            if (data.RunnerId == element.id.toString()) {
              if (data.BetType == "Back") {
                element.Book = element.Book + data.Profit;
              }
              else {
                element.Book = element.Book - data.Exposure;
              }
            } else {
              if (data.BetType == "Back") {
                element.Book = element.Book - data.Exposure;
              }
              else {
                element.Book = element.Book + data.Profit;
              }
            }
          });
        });
      }
      if (this.sportsId == 4) {
        //BookMaker
        var bookMrkt = this.rtrnObj.markets.find(x => x.marketName == "BookMaker");
        var bets = this.uISERVICE.Bets.filter(x => x.MarketName == "BookMaker");
        if (bets.length > 0) {
          bookMrkt.runners.forEach(element => {
            bets.forEach(data => {
              if (data.RunnerId == element.id.toString()) {
                if (data.BetType == "Back") {
                  element.Book = element.Book + data.Profit;
                }
                else {
                  element.Book = element.Book - data.Exposure;
                }
              } else {
                if (data.BetType == "Back") {
                  element.Book = element.Book - data.Exposure;
                }
                else {
                  element.Book = element.Book + data.Profit;
                }
              }
            });
          });
        }
        //To Win the Toss

        var tossMrkt = this.rtrnObj.markets.find(x => x.marketName == "To Win the Toss");
        var bets = this.uISERVICE.Bets.filter(x => x.MarketName == "To Win the Toss");
        if (tossMrkt != null) {
          if (bets.length > 0) {
            tossMrkt.runners.forEach(element => {
              bets.forEach(data => {
                if (data.RunnerId == element.id.toString()) {
                  if (data.BetType == "Back") {
                    element.Book = element.Book + data.Profit;
                  }
                  else {
                    element.Book = element.Book - data.Exposure;
                  }
                } else {
                  if (data.BetType == "Back") {
                    element.Book = element.Book - data.Exposure;
                  }
                  else {
                    element.Book = element.Book + data.Profit;
                  }
                }
              });
            });
          }
        }
      }

    }
  }

  checkLogin() {
    if (!Cookie.get("usersCookies")) {
      this.uISERVICE.logIn = false;
      this.uISERVICE.logIn = true;
    }
  }


  setValues(betType, odds, price, mId, rId, rName, maxMrkt, minMrkt, rIndx, mrktName, mainIndex, betDly,filterName) {
    debugger;
    if (odds > 0) {
      this.checkLogin();
      if (!this.uISERVICE.logIn) {
        this.uISERVICE.profit = 0;
        this.uISERVICE.exposure = 0;
        this.uISERVICE.stake = 0;
        if (mrktName != "Fancy") {
          this.uISERVICE.fancySlip = [];
          this.uISERVICE.showSlip = [false, false, false, false];
          this.uISERVICE.showSlip[mainIndex] = true;
        } else {
          this.uISERVICE.showSlip = [false, false, false, false];
          switch (filterName) {
            case "overRuns":
              this.uISERVICE.otherFancySlip=[];
                this.uISERVICE.ballsWicketLostSlip=[];
                this.uISERVICE.ballFaceSlip=[];
                this.uISERVICE.boundariesSlip=[];
                this.uISERVICE.wicketsFallSlip=[];
                this.uISERVICE.fancySlip=[];
              if (this.uISERVICE.overRunsSlip.length > 0) {
                let j = 0;
                this.uISERVICE.overRunsSlip.forEach((element, id) => {
                  if (mainIndex == id) {
                    this.uISERVICE.overRunsSlip[id] = true;
                  } else {
                    this.uISERVICE.overRunsSlip[id] = false;
                  }
                });
                if (j == 0) {
                  this.uISERVICE.overRunsSlip[mainIndex] = true;
                }
              } else {
                this.uISERVICE.overRunsSlip[mainIndex] = true;
              }
              break;
              case "wicketsFall":
                this.uISERVICE.otherFancySlip=[];
                this.uISERVICE.ballsWicketLostSlip=[];
                this.uISERVICE.ballFaceSlip=[];
                this.uISERVICE.boundariesSlip=[];
                this.uISERVICE.fancySlip=[];
                this.uISERVICE.overRunsSlip=[];
                if (this.uISERVICE.wicketsFallSlip.length > 0) {
                  let j = 0;
                  this.uISERVICE.wicketsFallSlip.forEach((element, id) => {
                    if (mainIndex == id) {
                      this.uISERVICE.wicketsFallSlip[id] = true;
                    } else {
                      this.uISERVICE.wicketsFallSlip[id] = false;
                    }
                  });
                  if (j == 0) {
                    this.uISERVICE.wicketsFallSlip[mainIndex] = true;
                  }
                } else {
                  this.uISERVICE.wicketsFallSlip[mainIndex] = true;
                }
              break;
              case "boundaries":
                this.uISERVICE.otherFancySlip=[];
                this.uISERVICE.ballsWicketLostSlip=[];
                this.uISERVICE.ballFaceSlip=[];
                this.uISERVICE.fancySlip=[];
                this.uISERVICE.wicketsFallSlip=[];
                this.uISERVICE.overRunsSlip=[];
                if (this.uISERVICE.boundariesSlip.length > 0) {
                  let j = 0;
                  this.uISERVICE.boundariesSlip.forEach((element, id) => {
                    if (mainIndex == id) {
                      this.uISERVICE.boundariesSlip[id] = true;
                    } else {
                      this.uISERVICE.boundariesSlip[id] = false;
                    }
                  });
                  if (j == 0) {
                    this.uISERVICE.boundariesSlip[mainIndex] = true;
                  }
                } else {
                  this.uISERVICE.boundariesSlip[mainIndex] = true;
                }
              break;
              case "ballFace":
                this.uISERVICE.otherFancySlip=[];
                this.uISERVICE.ballsWicketLostSlip=[];
                this.uISERVICE.fancySlip=[];
                this.uISERVICE.boundariesSlip=[];
                this.uISERVICE.wicketsFallSlip=[];
                this.uISERVICE.overRunsSlip=[];
                if (this.uISERVICE.ballFaceSlip.length > 0) {
                  let j = 0;
                  this.uISERVICE.ballFaceSlip.forEach((element, id) => {
                    if (mainIndex == id) {
                      this.uISERVICE.ballFaceSlip[id] = true;
                    } else {
                      this.uISERVICE.ballFaceSlip[id] = false;
                    }
                  });
                  if (j == 0) {
                    this.uISERVICE.ballFaceSlip[mainIndex] = true;
                  }
                } else {
                  this.uISERVICE.ballFaceSlip[mainIndex] = true;
                }
              break;
              case "ballsWicketLost":
                this.uISERVICE.otherFancySlip=[];
                this.uISERVICE.fancySlip=[];
                this.uISERVICE.ballFaceSlip=[];
                this.uISERVICE.boundariesSlip=[];
                this.uISERVICE.wicketsFallSlip=[];
                this.uISERVICE.overRunsSlip=[];
                if (this.uISERVICE.ballsWicketLostSlip.length > 0) {
                  let j = 0;
                  this.uISERVICE.ballsWicketLostSlip.forEach((element, id) => {
                    if (mainIndex == id) {
                      this.uISERVICE.ballsWicketLostSlip[id] = true;
                    } else {
                      this.uISERVICE.ballsWicketLostSlip[id] = false;
                    }
                  });
                  if (j == 0) {
                    this.uISERVICE.ballsWicketLostSlip[mainIndex] = true;
                  }
                } else {
                  this.uISERVICE.ballsWicketLostSlip[mainIndex] = true;
                }
              break;
              case "otherFancy":
                this.uISERVICE.otherFancySlip=[];
                this.uISERVICE.ballsWicketLostSlip=[];
                this.uISERVICE.ballFaceSlip=[];
                this.uISERVICE.boundariesSlip=[];
                this.uISERVICE.wicketsFallSlip=[];
                this.uISERVICE.fancySlip=[];
                if (this.uISERVICE.otherFancySlip.length > 0) {
                  let j = 0;
                  this.uISERVICE.otherFancySlip.forEach((element, id) => {
                    if (mainIndex == id) {
                      this.uISERVICE.otherFancySlip[id] = true;
                    } else {
                      this.uISERVICE.otherFancySlip[id] = false;
                    }
                  });
                  if (j == 0) {
                    this.uISERVICE.otherFancySlip[mainIndex] = true;
                  }
                } else {
                  this.uISERVICE.otherFancySlip[mainIndex] = true;
                }
              break;

              case "All":
                this.uISERVICE.otherFancySlip=[];
                this.uISERVICE.ballsWicketLostSlip=[];
                this.uISERVICE.ballFaceSlip=[];
                this.uISERVICE.boundariesSlip=[];
                this.uISERVICE.wicketsFallSlip=[];
                this.uISERVICE.overRunsSlip=[];

                if (this.uISERVICE.fancySlip.length > 0) {
                  let j = 0;
                  this.uISERVICE.fancySlip.forEach((element, id) => {
                    if (mainIndex == id) {
                      this.uISERVICE.fancySlip[id] = true;
                    } else {
                      this.uISERVICE.fancySlip[id] = false;
                    }
                  });
                  if (j == 0) {
                    this.uISERVICE.fancySlip[mainIndex] = true;
                  }
                } else {
                  this.uISERVICE.fancySlip[mainIndex] = true;
                }
              break;
          }
          
        }

        this.uISERVICE.betType = betType;
        this.uISERVICE.odds = odds;
        this.uISERVICE.price = price;
        this.uISERVICE.marketId = mId;
        this.uISERVICE.rnrId = rId;
        this.uISERVICE.rName = rName;
        this.uISERVICE.maxMarkt = maxMrkt;
        this.uISERVICE.minMarkt = minMrkt;
        this.uISERVICE.betDelay = betDly
        this.uISERVICE.rIndx = rIndx;
        this.uISERVICE.mrktName = mrktName;
        this.uISERVICE.sportsId = this.sportsId;
        this.uISERVICE.eventId = this.eventId;
        this.uISERVICE.EventName = this.rtrnObj.EventName;
      } else {
        this.toastr.error('Please login to access all features.', 'LOGIN!');
      }

    }

  }


  checkToss() {
    this.date = new Date();
    let crntDate = this.date.toString();
    const diffInMs = Date.parse(this.rtrnObj.EventTime) - Date.parse(crntDate);
    const diffInHours = diffInMs / 1000 / 60 / 60;
    if (diffInHours < 1) {
      var tossMrkt = this.rtrnObj.markets.find(x => x.marketName == "To Win the Toss");
      if (tossMrkt != null) {
        tossMrkt.status = true;
        this.rtrnObj.markets.splice(this.rtrnObj.markets.indexOf(tossMrkt), 1);
      }
    }
  }

  // open(content) {
  //   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }
}
