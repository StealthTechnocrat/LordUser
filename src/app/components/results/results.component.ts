import { Component, OnInit } from "@angular/core";
import { Cookie } from "ng2-cookies";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountService } from "src/app/service/account-service";
import { UiService } from "src/app/service/ui-service";
import { HttpClient } from "@angular/common/http";
import * as XLSX from "xlsx";
import * as $ from "jquery";
import { DatePipe } from "@angular/common";
@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.scss"],
})
export class ResultsComponent implements OnInit {
  seriesList: any = [];
  eventList: any = [];
  marketList: any = [];
  resultList: any = [];
  selectedSeriesId: number = 0;
  sportsId: number = 0;
  seriesId: string = "";
  eventId: string = "";
  marketName: string = "";
  last: string;
  latest_date: any;
  startDate: string = "";
  endDate: string = "";
  skipRec: number = 0;
  pageNo: number = 0;
  totalRec: number;
  perPageItem: number;
  constructor(
    private http: HttpClient,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    public uISERVICE: UiService,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getDate();
  }
  pageChanged(pageNo) {
    this.pageNo = pageNo;
    if(this.uISERVICE.take == null || this.uISERVICE.take == undefined){
      this.uISERVICE.take = 10
    }
    this.skipRec = (pageNo - 1) * this.uISERVICE.take;
    this.getAllResultList();
  }

  onSportSelection(selectedValue: number) {
    
    this.sportsId = selectedValue;
    this.getCompList(this.sportsId);
  }

  onSeriesSelection(selectedValue: string) {
    
    this.seriesId = selectedValue;
    this.getEventList(this.sportsId, this.seriesId);
  }

  onEventSelection(selectedValue: string) {
    
    this.eventId = selectedValue;
    this.getAllMarketList(this.eventId);
  }

  onMarketSelection(selectedValue: string) {
    
    if (selectedValue == "1") {
      this.marketName = "Fancy";
    }else if(selectedValue == "0"){
      this.marketName = "All";
    } else {
      this.marketName = selectedValue;
    }
  }

  updateRecValue(value) {
    this.accountService.UpdateRecVal(value).then((response) => {
      if (response.Status) {
        this.uISERVICE.take = value;
        this.getAllResultList();
      } else {
        this.uISERVICE.Error = true;
        this.uISERVICE.Message = response.Result;
        setTimeout(() => {
          this.uISERVICE.Error = false;
        }, 2000);
      }
    });
  }

  getFilteredResults() {
    
    if(this.eventId == "" || this.eventId == undefined || this.sportsId == undefined || this.sportsId == 0){
      this.getAllResultList();
    }else{
      if(this.uISERVICE.take == null || this.uISERVICE.take == undefined){
        this.uISERVICE.take = 10
      }
      this.resultList = [];
      this.accountService
        .GetResults(
          this.eventId,
          this.marketName,
          this.skipRec,
          this.uISERVICE.take,
          this.startDate,
          this.endDate
        )
        .then((response) => {
          if (response) {
            this.resultList = response.Result;
            console.log("rslt", this.resultList);
          } else {
            this.resultList = [];
          }
        });
    }
  }


  getAllResultList() {
    
    if(this.uISERVICE.take == null || this.uISERVICE.take == undefined){
      this.uISERVICE.take = 10
    }
    this.resultList = [];
    this.accountService
      .GetAllResults(
        this.skipRec,
        this.uISERVICE.take,
        this.startDate,
        this.endDate
      )
      .then((response) => {
        if (response) {
          this.resultList = response.Result;
          console.log("rslt", this.resultList);
        } else {
          this.resultList = [];
        }
      });
  }

  selectFilterType(value : string){
    this.marketName = value;
    if(this.uISERVICE.take == null || this.uISERVICE.take == undefined){
      this.uISERVICE.take = 10
    }
    this.resultList = [];
    this.accountService
      .filteredResult(
        this.marketName,
        this.skipRec,
        this.uISERVICE.take,
        this.startDate,
        this.endDate
      )
      .then((response) => {
        if (response) {
          this.resultList = response.Result;
          console.log("rslt", this.resultList);
        } else {
          this.resultList = [];
        }
      });
  }

  getCompList(sportsId: number) {
    this.seriesList = [];
    this.accountService.getCompList(sportsId).then((response) => {
      if (response) {
        this.seriesList = response.Result;
        console.log("comp", this.seriesList);
      } else {
        this.seriesList = [];
      }
    });
  }

  getEventList(sportsId, seriesId) {
    
    this.eventList = [];
    this.accountService.getEventList(sportsId, seriesId).then((response) => {
      if (response) {
        this.eventList = response.Result;
        console.log("evt", this.eventList);
      } else {
        this.eventList = [];
      }
    });
  }

  getAllMarketList(eventId) {
    
    this.marketList = [];
    this.accountService.GetAllMarkets(eventId).then((response) => {
      if (response) {
        this.marketList = response.Result;
        console.log("mrkt", this.marketList);
      } else {
        this.marketList = [];
      }
    });
  }

  getStartDate(data) {
    this.startDate = data + " " + "00:00:00";
  }

  getEndDate(data) {
    this.endDate = data + " " + "23:59:59";
  }

  getDate() {
    var date = new Date();
    this.last = new Date(
      date.getTime() - 6 * 24 * 60 * 60 * 1000
    ).toDateString();
    this.latest_date = this.datepipe.transform(this.last, "yyyy-MM-dd");
    this.startDate = this.latest_date + " " + "00:00:00";
    this.last = this.datepipe.transform(date, "yyyy-MM-dd");
    this.endDate =
      this.datepipe.transform(date, "yyyy-MM-dd") + " " + "23:59:59";
      this.getAllResultList();
  }
}
