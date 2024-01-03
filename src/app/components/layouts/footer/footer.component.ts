import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';



import * as $ from "jquery";
import { Cookie } from 'ng2-cookies';
import { AccountService } from 'src/app/service/account-service';
import { UiService } from 'src/app/service/ui-service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isDarkMode = false;
  chipData:any=[];
  constructor(private renderer: Renderer2, public uISERVICE: UiService,private router:Router,private accountService:AccountService) {
    const isDarkModeStorage = localStorage.getItem('darkMode');
    this.isDarkMode = isDarkModeStorage === 'true';
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    }
  }

  ngOnInit(): void {
  }
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  getChips() {
    this.uISERVICE.loader = true;
    this.accountService.getChips().then((response) => {
      if (response.Status) {
        this.uISERVICE.loader = false;
        this.chipData = response.Result;
        console.log("chipdata", this.chipData)
      } else {
        this.chipData = [];
        this.uISERVICE.loader = false;
      }
    });
  }

  updateChips() {
    this.uISERVICE.loader = true;
    this.accountService.updateChip(this.chipData).then((response) => {
      if (response.Status) {
        this.uISERVICE.loader = false;
        this.uISERVICE.Success = true;
        this.uISERVICE.Message = "Executed Successfully";
        setTimeout(() => {
          this.uISERVICE.Success = false;
        }, 3000);
        document.getElementById("chipsettingBtn").click();
      } else {
        this.uISERVICE.loader = false;
        this.uISERVICE.Error = true;
        this.uISERVICE.Message = response.Result;
        setTimeout(() => {
          this.uISERVICE.Error = false;
        }, 3000);
      }
    });
  }

  LogOut() {
    Cookie.deleteAll();
    this.router.navigate(["/games"]);
    if (localStorage.getItem("logout") == "false") {
      localStorage.clear();
      localStorage.setItem("logout", "true");
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  }
  ngAfterViewInit() {
    //   var btn = $('#backToTop');
    //   $('.center_sec').on('scroll', function () {
    //     if ($('.center_sec').scrollTop() > 250) {
    //       btn.addClass('show');
    //     } else {
    //       btn.removeClass('show');
    //     }
    //   });



    //   btn.on('click', function (e) {
    //     e.preventDefault();
    //     $('html, body').animate({
    //         scrollTop: 0
    //     }, 250);
    // });


    $(".liveTv").click(function () {
      $(".livetvSec").toggleClass("d-block");
    });


    $(document).ready(function () {
      $(".btnCloseMenu").click(function () {
        $(".backdrpmain").removeClass("d-block");
      });
    });

    $(document).ready(function () {
      $(".mobMenuCol ul li a").click(function () {
        $(".backdrpmain").removeClass("d-block");
      });
    });

    $(document).ready(function () {
      $("a.aftLogin").click(function () {
        $(".backdrpmain").toggleClass("d-block");
      });
    });


    $(document).ready(function () {
      $("a.Btnall").click(function () {
        $(".big").toggleClass("all-items");
      });
    });
  }


}
