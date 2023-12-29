import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as $ from "jquery";
import { AccountService } from "src/app/service/account-service";
import { UiService } from "src/app/service/ui-service";
import { TimepipeService } from "src/app/service/timepipe.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  activeTab = 'allSports';
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
  inplayList: any = [];
  upcomingList: any = [];
  seriesList: any = [];
  eventList: any = [];
  sidebarType: boolean = false;
  list: any = [];
  showStep2Map: { [key: number]: boolean } = {};
  lastOpenedSeriesId: number | null = null;
  selectedSportsId: number | null = null;

  constructor(
    private accountService: AccountService,
    public timePipe: TimepipeService,
    public uISERVICE: UiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void { }

  allSportsTab() {
    this.sidebarType = false;
  }


  inplayTab() {
    this.list = [];
    this.sidebarType = true;
    this.accountService.getAllInplay().then((response) => {
      if (response) {
        this.list = response.Result;
        console.log("comp", this.list);
      } else {
        this.list = [];
      }
    });
  }

  upcomingTab() {
    this.list = [];
    this.sidebarType = true;
    this.accountService.getAllUpcoming().then((response) => {
      if (response) {
        this.list = response.Result;
        console.log("compUpcoming", this.list);
      } else {
        this.list = [];
      }
    });
  }

  redirectfun(sptId, eveId) {
    this.router.navigate(["/set-bet/", sptId, eveId]);
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }

  getCompList(sportsId) {
    // debugger;
    this.sidebarType = false;
    this.seriesList = [];
    this.accountService.getCompList(sportsId).then((response) => {
      if (response) {
        this.seriesList = response.Result;
        console.log("comp", this.seriesList);
      } else {
        this.seriesList = [];
      }
    });
    if (this.selectedSportsId === sportsId) {
      this.selectedSportsId = null; // Close the currently open one
    } else {
        this.selectedSportsId = sportsId; // Open the clicked one
    }
  }

  getEventList(sportsId, seriesId) {
    // debugger;
    this.sidebarType = false;
    this.eventList = [];
    this.accountService.getEventList(sportsId, seriesId).then((response) => {
      if (response) {
        this.eventList = response.Result;
        console.log("evt", this.eventList);
      } else {
        this.eventList = [];
      }
    });
    if (this.lastOpenedSeriesId !== null && this.lastOpenedSeriesId !== seriesId) {
      this.showStep2Map[this.lastOpenedSeriesId] = false;
    }
    this.showStep2Map[seriesId] = !this.showStep2Map[seriesId];
    this.lastOpenedSeriesId = seriesId;
  }

  ngAfterViewInit() {
    $(document).ready(function () {
      $(".slideHoverUl li:first-child a").addClass("active");

      var lastClickedChild = $(".slideHoverUl li:first-child a");

      $(".slideHoverUl li a").hover(function () {
        $(".slideHoverUl li a").removeClass("active");
      });

      $(".slideHoverUl li a").click(function () {
        $(".slideHoverUl li a").removeClass("active");
        $(this).addClass("active");
        lastClickedChild = $(this);
      });
      $(".slideHoverUl").mouseleave(function () {
        lastClickedChild.addClass("active");
      });
    });



    // $(".dropInner").click(function () {
    //   $(".arrow").toggleClass("drop_open");
    // });

  }
}
