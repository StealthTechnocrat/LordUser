import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/service/ui-service';
import { HttpClient } from '@angular/common/http';
import { PlaceBetModel } from 'src/app/Model/placebet_model';
import { Cookie } from 'ng2-cookies';
import { AccountService } from 'src/app/service/account-service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-bet-slip',
  templateUrl: './bet-slip.component.html',
  styleUrls: ['./bet-slip.component.scss']
})
export class BetSlipComponent implements OnInit {
  loader: boolean = false;
  apiData: any = [];
  betValid: boolean = true;
  public placeBetModel: PlaceBetModel;

  constructor(private toastr: ToastrService,public uISERVICE: UiService, private http: HttpClient, private accountService: AccountService) { }

  ngOnInit(): void {
    // if(this.uISERVICE.OneClickBet == false){
      if (Cookie.check('usersCookies')) {
        this.placeBetModel = <PlaceBetModel>{
          SportsId: 0,
          EventId: '',
          EventName: '',
          MarketId: '',
          MarketName: '',
          RunnerId: '',
          RunnerName: '',
          Stake: 0,
          Odds: 0,
          Price: '',
          BetType: '',
          BetStatus: 'Pending',
          ParentId: 0,
        };
      } else {
        this.uISERVICE.Header = false;
      }
    }
    // else{
    // this.transform();
    // this.checkBetCond();
    // }
 

  getValue(value) {
    this.uISERVICE.stake = this.uISERVICE.stake + value;
    this.transform();
  }

  keyUp(value) {
    this.uISERVICE.stake = value;
    this.transform();
  }



  transform() {
    switch (this.uISERVICE.betType) {
      case "Yes":
        this.uISERVICE.profit = (this.uISERVICE.stake * parseInt(this.uISERVICE.price)) / 100;
        this.uISERVICE.exposure = this.uISERVICE.stake;
        break;
      case "No":
        this.uISERVICE.profit = this.uISERVICE.stake;
        this.uISERVICE.exposure = (this.uISERVICE.stake * parseInt(this.uISERVICE.price)) / 100;
        break;
      case "Back":
        this.uISERVICE.profit = this.uISERVICE.mrktName=="BookMaker"?this.uISERVICE.stake * (this.uISERVICE.odds/100):this.uISERVICE.stake * (this.uISERVICE.odds - 1);
        this.uISERVICE.exposure = this.uISERVICE.stake;
        break;
      case "Lay":
        this.uISERVICE.profit = this.uISERVICE.stake;
        this.uISERVICE.exposure = this.uISERVICE.mrktName=="BookMaker"?this.uISERVICE.stake * (this.uISERVICE.odds/100):this.uISERVICE.stake * (this.uISERVICE.odds - 1);
        break;
    }
  }

  checkBetCond() {
    this.betValid = true;
    this.uISERVICE.betLoader = true;
    if (this.uISERVICE.odds == 0) {
     
      this.toastr.error('Bet odds cannot be 0.');
      this.betValid = false;
    } if (this.uISERVICE.stake <= 0) {
     
      this.toastr.error('Bet amount cannot be 0.');
      this.betValid = false;
    } if (this.uISERVICE.betType == "Fancy") {
      if (parseInt(this.uISERVICE.price) <= 0) {
       
        this.toastr.error('Fancy odds cannot be 0.');
        this.betValid = false;
      }
    } if (this.uISERVICE.maxMarkt < this.uISERVICE.stake) {
     
      this.toastr.error('Max bet amount on market is not greater then.' + this.uISERVICE.maxMarkt);
      this.betValid = false;
    } if (this.uISERVICE.minMarkt > this.uISERVICE.stake) {
     
      this.toastr.error('Minimum bet amount on market is not less then.'+ this.uISERVICE.minMarkt);
      this.betValid = false;
    }
    if (this.betValid) {
      if (this.uISERVICE.sportsId == 15) {
        this.checkRoundIsValid();
      } else {
        this.placeBet();
      }

    } else {
      this.uISERVICE.betLoader = false;
      setTimeout(() => {
        this.uISERVICE.Error = false;
      }, 2000);
    }
  }

  async checkRoundIsValid() {
    
    if (this.uISERVICE.activeRoundId == this.uISERVICE.marketId && this.uISERVICE.gStatus > 0) {
      this.placeBet();
    } else {
      this.betValid = false;
     
      this.toastr.error('Market Suspended.');
      this.uISERVICE.betLoader = false;
      setTimeout(() => {
        this.uISERVICE.Error = false;
      }, 2000);
    }
  }
  reset(){
    this.uISERVICE.stake = 0;
    this.uISERVICE.exposure = 0;
    this.uISERVICE.stake = 0;
    this.uISERVICE.odds = 0;
  }

  placeBet() {
    
    this.placeBetModel.SportsId = this.uISERVICE.sportsId;
    this.placeBetModel.EventName = this.uISERVICE.EventName;
    this.placeBetModel.EventId = this.uISERVICE.eventId == undefined ? "321654" : this.uISERVICE.eventId;
    this.placeBetModel.MarketId = this.uISERVICE.marketId;
    this.placeBetModel.MarketName = this.uISERVICE.mrktName;
    this.placeBetModel.RunnerId = this.uISERVICE.rnrId;
    this.placeBetModel.RunnerName = this.uISERVICE.rName;
    this.placeBetModel.Stake = this.uISERVICE.stake;
    this.placeBetModel.Odds = this.uISERVICE.odds;
    this.placeBetModel.Price = this.uISERVICE.price;
    this.placeBetModel.Profit = this.uISERVICE.profit;
    this.placeBetModel.Exposure = this.uISERVICE.exposure;
    this.placeBetModel.BetType = this.uISERVICE.betType;
    this.placeBetModel.ParentId = this.uISERVICE.rIndx;
    setTimeout(() => {
      this.accountService.placeBet(this.placeBetModel).then((response) => {
        if (response.Status) {
          if(!this.uISERVICE.betSound){
            this.playAlertTone();
          }
          this.toastr.success('Bet Placed Successfully');
          this.uISERVICE.Bal = response.FreeChips;
          this.uISERVICE.Exp = response.Exp;
          this.uISERVICE.Bets=response.Bets;
          this.uISERVICE.betLoader = false;
          this.cancelAll();
          
        } else {
          
          this.uISERVICE.betLoader = false;
          this.toastr.error(response.Result);
         
        }
      });
    }, this.uISERVICE.betDelay * 1000);

  }

  playAlertTone() {
    const alertTone = new Audio("assets/alertTone/IphoneTing1.mp3");
    alertTone.play();
  }

  cancelAll() {
    this.uISERVICE.profit = 0;
    this.uISERVICE.stake = 0;
    this.uISERVICE.exposure = 0;
    this.uISERVICE.showSlip = [false, false, false, false];
    this.uISERVICE.fancySlip = [];
    this.uISERVICE.overRunsSlip = [];
    this.uISERVICE.boundariesSlip = [];
    this.uISERVICE.wicketsFallSlip = [];
    this.uISERVICE.ballFaceSlip = [];
    this.uISERVICE.otherFancySlip = [];
    this.uISERVICE.ballsWicketLostSlip = [];
  }

  ConcateChipvalue(numberConcate) {
    if (this.uISERVICE.stake > 0 && this.uISERVICE.stake != undefined) {
      this.uISERVICE.stake = parseInt(this.uISERVICE.stake.toString() + numberConcate);
    } else {
      this.uISERVICE.stake = numberConcate;
    }
    this.transform();
  }
  deleteChipVal() {
    if (this.uISERVICE.stake > 0 && this.uISERVICE.stake != undefined) {
      this.uISERVICE.stake = parseInt((this.uISERVICE.stake).toString().substring(0, (this.uISERVICE.stake).toString().length - 1));
      this.transform();
    }
  }
}
