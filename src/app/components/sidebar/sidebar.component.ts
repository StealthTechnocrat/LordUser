import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { AccountService } from 'src/app/service/account-service';
import { UiService } from 'src/app/service/ui-service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  crc_Lst: any = [];
  scr_Lst: any = [];
  tns_Lst: any = [];
  seriesList: any = [];
  eventList : any = [];
  sidebarType: number = 1;
  constructor(private accountService: AccountService, public uISERVICE: UiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
  }


  getSrsData(sportsId) {

    this.accountService.getSrsList(sportsId).then((response) => {

      if (response.Status) {
        switch (sportsId) {
          case 4:
            this.crc_Lst = response.Result;
            // console.log('cricket', this.crc_Lst)
            break;
          case 1:
            this.scr_Lst = response.Result;
            // console.log('soccer', this.scr_Lst)
            break;
          case 2:
            this.tns_Lst = response.Result;
            // console.log('tennis', this.tns_Lst)
            break;
        }
      } else {
        switch (sportsId) {
          case 4:
            this.crc_Lst = [];
            break;
          case 1:
            this.scr_Lst = [];
            break;
          case 2:
            this.tns_Lst = [];
            break;
        }
      }
    });
  }

  allSportsTab(){
    this.sidebarType = 1;
  }

  inplayTab(){
    this.sidebarType = 2;
  }

  upcomingTab(){
    this.sidebarType = 3;
  }
  redirectfun(sptId, eveId) {
    this.router.navigate(["/set-bet/", sptId, eveId]);
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }

  getCompList(sportsId) {
    this.seriesList = []
    this.accountService.getCompList(sportsId).then((response) => {
      if (response) {
        this.seriesList = response.Result;
        console.log("comp",this.seriesList)
      } else {
        this.seriesList = [];
      }
    });
  }
  getEventList(sportsId,seriesId) {
    debugger;
    this.eventList = [];
    this.accountService.getEventList(sportsId,seriesId).then((response) => {
      if (response) {
        this.eventList = response.Result;
        console.log("evt",this.eventList)
      } else {
        this.eventList = [];
      }
    });
  }


  ngAfterViewInit() {

    $(document).ready(function () {
      // Add 'active' class to the first child by default
      $(".slideHoverUl li:first-child a").addClass('active');

      // Variable to keep track of the last clicked child
      var lastClickedChild = $(".slideHoverUl li:first-child a");

      // Handle hover for all children
      $(".slideHoverUl li a").hover(
        function () {
          // Remove 'active' class when hovered over
          $(".slideHoverUl li a").removeClass('active');
        }
      );

      $(".slideHoverUl li a").click(function () {
        $(".slideHoverUl li a").removeClass('active');
        $(this).addClass('active');
        lastClickedChild = $(this);
      });

      // When not hovering in any child, add 'active' class back to the last clicked child
      $(".slideHoverUl").mouseleave(function () {
        lastClickedChild.addClass('active');
      });
    });


    


  }
  // toggleMenu() {
  //   this.menulist = !this.menulist;
  // }
  // toggleSubMenu(){
  //   this.menuSublist = !this.menuSublist;
  // }
  
}
