import { Component, OnInit, Renderer2 } from "@angular/core";
import * as $ from "jquery";
import { Cookie } from "ng2-cookies";
import { AccountService } from "src/app/service/account-service";
import { UiService } from "src/app/service/ui-service";
import jwt_decode from "jwt-decode";
import { Router } from "@angular/router";
import * as XLSX from "xlsx";
import { SignUpModel } from "src/app/Model/Sign_Up_Model";
import { SignInModel } from "src/app/Model/signin-model";
import { SharedService } from "src/app/service/shared.service";
import { windowFactory } from "ngx-owl-carousel-o/lib/services/window-ref.service";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  isDarkMode = false;
  public signInModel: SignInModel;
  public sign_Up_Model: SignUpModel;
  Hide: boolean;
  betArr: any = [];
  sportsId: number = 0;
  sportid: number = 4;
  marketName: string = "All";
  BetType: string = "All";
  userName: string;
  loader: boolean = false;
  validation: any = [];
  logSpan: boolean = false;
  mobileLogo: string;
  webLogo: string;
  IsPwd: boolean = false;
  loginShow: boolean = true;
  confrmPwd: string;
  NewPwd: string = "";
  CnfPwd: string = "";
  OldPwd: string = "";
  rtrnObj: any = [];
  usrDtl: any = [];
  chipData: any = [];
  Balance: number;
  Exposure: number;
  News: any = [];
  Name: string = "";
  betCount: number = 0;
  firstTimeLoginChk: boolean = false;
  domain: string = window.location.origin;
  pendingBets: any = [];
  eventlist: any = [];
  keyword: any = "";
  eventId: any;
  sport: any;
  event: any;
  showMatchListDiv: boolean = false;
  stake: number = 0;
  isPassInvalid: boolean = true;
  constructor(
    private accountService: AccountService,
    public uISERVICE: UiService,
    private router: Router,
    private sharedService: SharedService,
    private renderer: Renderer2
  ) {
    const isExpired = this.isTokenExpired(Cookie.get("usersCookies"));
    if (isExpired) {
      this.LogOut();
    }
    debugger;
    const oneClickBetString: string | null =
      localStorage.getItem("OneClickBet");
    if (oneClickBetString !== null) {
      if (oneClickBetString == "false") {
        this.uISERVICE.OneClickBet = false;
      } else {
        this.uISERVICE.OneClickBet = true;
        if (parseInt(localStorage.getItem("Stake")) != 0) {
          this.uISERVICE.stake = parseInt(localStorage.getItem("Stake"));
          this.stake = parseInt(localStorage.getItem("Stake"));
        }
      }
    }
    const isDarkModeStorage = localStorage.getItem("darkMode");
    this.isDarkMode = isDarkModeStorage === "true";
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, "dark-theme");
    }
  }

  ngOnInit(): void {
    this.user();
    this.sharedService.getSportsId().subscribe((data) => {
      this.sportid = data;
    });
    this.getLogos();
    this.uISERVICE.tv = false;
    if (Cookie.check("usersCookies")) {
      this.uISERVICE.Header = true;
      this.uISERVICE.Bets = JSON.parse(localStorage.getItem("Bets"));

      // this.GetDetail();
      this.myFunction();
    } else {
      this.uISERVICE.Header = false;
      Cookie.deleteAll();
      localStorage.clear();
      this.router.navigate(["/games"]);
    }
    this.signInModel = <SignInModel>{
      LoginID: "",
      Password: "",
    };
    this.sign_Up_Model = <SignUpModel>{
      UserId: "",
      UserName: "",
      Password: "",
      MobileNumber: "",
      Share: 0,
      ParentId: 73,
    };
    console.log("bal", this.uISERVICE.Bal);
  }

  ChangePwd() {
    debugger;
    if (this.isPassInvalid) {
      if (this.NewPwd == "") {
        this.uISERVICE.Error = true;
        this.uISERVICE.Message = "Enter New Password";
        setTimeout(() => {
          this.uISERVICE.Error = false;
        }, 3000);
      } else {
        if (this.CnfPwd == "") {
          this.uISERVICE.Error = true;
          this.uISERVICE.Message = "Enter Confirm Password";
          setTimeout(() => {
            this.uISERVICE.Error = false;
          }, 3000);
        } else {
          if (this.OldPwd == "") {
            this.uISERVICE.Error = true;
            this.uISERVICE.Message = "Enter Current Password";
            setTimeout(() => {
              this.uISERVICE.Error = false;
            }, 3000);
          } else {
            if (this.NewPwd == this.CnfPwd) {
              this.uISERVICE.loader = true;
              this.accountService
                .changePwd(this.OldPwd, this.NewPwd)
                .then((response) => {
                  if (response.Status) {
                    this.uISERVICE.loader = false;
                    this.uISERVICE.Success = true;
                    this.uISERVICE.Message = "Executed Successfully";
                    setTimeout(() => {
                      this.uISERVICE.Success = false;
                    }, 3000);
                    document.getElementById("cls1000").click();
                    this.NewPwd = "";
                    this.CnfPwd = "";
                    this.OldPwd = "";
                  } else {
                    this.uISERVICE.loader = false;
                    this.uISERVICE.Error = true;
                    this.uISERVICE.Message = response.Result;
                    setTimeout(() => {
                      this.uISERVICE.Error = false;
                    }, 3000);
                  }
                });
            } else {
              this.uISERVICE.Message = "Confirm Password not matched";
              this.uISERVICE.Error = true;
              setTimeout(() => {
                this.uISERVICE.Error = false;
              }, 2500);
            }
          }
        }
      }
    } else {
      this.uISERVICE.Error = true;
      this.uISERVICE.Message =
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character.";
      setTimeout(() => {
        this.uISERVICE.Error = false;
      }, 3000);
    }
  }

  getInplay() {
    this.uISERVICE.inplay = true;
    this.getInplayEvents();
  }

  restInplay() {
    this.uISERVICE.inplay = false;
    this.getEvents();
  }

  user() {
    this.accountService.userDetails().then((response) => {
      if (response) {
        this.News = response.Result.News;
        this.Balance = response.Result.Balance;
        this.Exposure = response.Result.Exposure;
        this.Name = response.Result.Name;
        this.uISERVICE.UserName = this.Name;
        this.uISERVICE.take = response.Result.Take;
        this.uISERVICE.News = this.News;
        this.uISERVICE.Points = response.Result.Points
        localStorage.setItem('Points', response.Result.Points.toString());
        console.log("this.uISERVICE.take", this.uISERVICE.take);
      } else {
        this.usrDtl = [];
      }
    });
  }

  getChips() {
    this.uISERVICE.loader = true;
    this.accountService.getChips().then((response) => {
      if (response.Status) {
        this.uISERVICE.loader = false;
        this.chipData = response.Result;
        console.log("chipdata", this.chipData);
      } else {
        this.chipData = [];
        this.uISERVICE.loader = false;
      }
    });
  }

  isPasswordInvalid() {
    if (!this.NewPwd) {
      this.isPassInvalid = false;
    }
    this.isPassInvalid =
      this.NewPwd.length >= 8 &&
      /[a-z]/.test(this.NewPwd) &&
      /[A-Z]/.test(this.NewPwd) &&
      /\d/.test(this.NewPwd) &&
      /[!@#$%^&*()?]/.test(this.NewPwd);
  }

  DeleteChips(data: any) {
    data.status = data.status == true ? false : true;
    this.uISERVICE.loader = true;
    this.accountService.DeleteChips(data.id, data.status).then((response) => {
      if (response.Status) {
        this.uISERVICE.loader = false;
        this.chipData = response.Result;
        console.log("chipdata", this.chipData);
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

  getEvents() {
    this.rtrnObj = [];
    this.accountService
      .GetAllEventsBySportsId(this.sportid)
      .then((response) => {
        if (response) {
          this.rtrnObj = response.Result;
          console.log("this.rtrnObj", this.rtrnObj);
          this.sharedService.setEventData(this.rtrnObj.TopEvents);
          console.log("this.TopEvents", this.uISERVICE.TopEvents);
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

  getInplayEvents() {
    if (this.sportid == null || this.sportid == undefined) {
      this.sportid = 4;
    }
    this.rtrnObj = [];
    this.accountService
      .GetInplayEventsBySportsId(this.sportid)
      .then((response) => {
        if (response) {
          this.rtrnObj = response.Result;
          this.sharedService.setEventData(this.rtrnObj.TopEvents);
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

  isTokenExpired(token: string): boolean {
    try {
      const decodedToken = jwt_decode(token);
      if (!decodedToken || typeof decodedToken["exp"] === "undefined") {
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

      return decodedToken["exp"] < currentTime;
    } catch (error) {
      return true; // Handle decoding errors, assuming the token is expired
    }
  }

  async myFunction() {
    return await new Promise((resolve) => {
      const interval = setInterval(() => {
        this.user();
        this.getBetCount();
      }, 10000);
    });
  }

  getLogos() {
    this.accountService.GetLogo().then((response) => {
      if (response.Status) {
        response.Result.forEach((element) => {
          if (element.Type == "Desktop") {
            this.webLogo = element.LogoPath;
          } else {
            this.mobileLogo = element.LogoPath;
          }
        });
      } else {
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

  usrPWDchk() {
    debugger;
    this.uISERVICE.loader = true;
    this.accountService.usrPWDchk(this.signInModel).then((response) => {
      this.uISERVICE.loader = false;
      if (response.Status) {
        this.firstTimeLoginChk = response.Result;
        if (this.firstTimeLoginChk) {
          document.getElementById("loginClose").click();
          document.getElementById("changepass").click();
        } else {
          this.LogIn();
        }
      } else {
        this.uISERVICE.Error = true;
        this.uISERVICE.Message = response.Result;
        setTimeout(() => {
          this.uISERVICE.Error = false;
        }, 3000);
        this.usrDtl = [];
      }
    });
  }

  LogIn() {
    debugger;
    if (
      this.signInModel.LoginID == "" ||
      this.signInModel.LoginID == undefined
    ) {
      this.uISERVICE.Error = true;
      this.uISERVICE.Message = "Enter LoginId";
      setTimeout(() => {
        this.uISERVICE.Error = false;
      }, 3000);
    } else {
      if (this.signInModel.Password == "") {
        this.uISERVICE.Error = true;
        this.uISERVICE.Message = "Enter Password";
        setTimeout(() => {
          this.uISERVICE.Error = false;
        }, 3000);
      } else {
        this.uISERVICE.loader = true;
        this.accountService.SignIn(this.signInModel).then((response) => {
          if (response.Status) {
            var decodedToken = jwt_decode(response.Result);
            if (decodedToken["Role"] == "Client") {
              localStorage.setItem("IsPwd", this.IsPwd.toString());
              localStorage.setItem("Stake", "0");
              localStorage.setItem("OneClickBet", "false");
              document.getElementById("term").click();
              // document.getElementById("changepass").click();s
              localStorage.setItem("logout", "false");
              localStorage.setItem("alertSound", "false");
              Cookie.set("usersCookies", response.Result);
              Cookie.set("c_id", decodedToken["UserId"]);
              Cookie.set("c_Role", decodedToken["Role"]);
              Cookie.set("c_UserId", decodedToken["unique_name"]);
              this.uISERVICE.loader = false;
              document.getElementById("loginClose").click();
            } else {
              this.uISERVICE.loader = false;
              this.uISERVICE.Error = true;
              this.uISERVICE.Message = "InCorrect LoginId and Password";
              setTimeout(() => {
                this.uISERVICE.Error = false;
              }, 3000);
            }
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
    }
  }

  SetNewPassword() {
    debugger;
    this.uISERVICE.loader = true;
    if (this.NewPwd == this.CnfPwd) {
      this.accountService
        .SetNewPassword(this.signInModel.LoginID, this.OldPwd, this.NewPwd)
        .then((response) => {
          if (response.Status) {
            this.uISERVICE.loader = false;
            this.uISERVICE.Success = true;
            this.uISERVICE.Message = "Password changed successfully";
            document.getElementById("setpwdcls").click();
            // localStorage.setItem("IsPwd", "true");
            setTimeout(() => {
              this.uISERVICE.Success = false;
            }, 3000);
          } else {
            document.getElementById("setpwdcls").click();
            this.uISERVICE.loader = false;
            this.uISERVICE.Error = true;
            this.uISERVICE.Message = response.Result;
            setTimeout(() => {
              this.uISERVICE.Error = false;
            }, 3000);
          }
          this.LogOut();
        });
    } else {
      this.uISERVICE.loader = false;
      this.uISERVICE.Error = true;
      this.uISERVICE.Message =
        "New password and confirm password are not matched";
      setTimeout(() => {
        this.uISERVICE.Error = false;
      }, 3000);
    }
  }

  accept() {
    document.getElementById("termsConditionBtn").click();
    // document.getElementById("changepassClose").click();
    window.location.reload();
  }

  checkLoginId(userId) {
    this.uISERVICE.inplay = false;
    this.accountService.chkLogId(userId).then((response) => {
      if (response) {
        this.logSpan = true;
      } else {
        this.logSpan = false;
      }
    });
  }

  checkVal() {
    const pattern = /^[0-9\-]*$/;
    this.validation = [false, false, false, false, false];
    let valid = true;
    if (this.sign_Up_Model.UserName == "") {
      this.validation[0] = true;
      valid = false;
    }
    if (this.sign_Up_Model.UserId == "") {
      this.validation[1] = true;
      valid = false;
    }
    if (this.sign_Up_Model.MobileNumber != null) {
      if (this.sign_Up_Model.MobileNumber.length < 10) {
        this.validation[2] = true;
        valid = false;
      }
    } else {
      this.validation[2] = true;
      valid = false;
    }
    if (this.sign_Up_Model.Password == "") {
      this.validation[3] = true;
      valid = false;
    }

    if (this.logSpan) {
      this.validation[1] = true;
      valid = false;
    }
    if (valid) {
      //this.Add();
    }
  }

  Add() {
    this.loader = true;
    this.accountService.addUser(this.sign_Up_Model).then((response) => {
      if (response.Status) {
        this.uISERVICE.Success = true;
        this.uISERVICE.Message = "Executed Successfully";
        this.loader = false;
        setTimeout(() => {
          this.uISERVICE.Success = false;
          this.router.navigate(["/user"]);
        }, 2000);
      } else {
        this.loader = false;
        this.uISERVICE.Error = true;
        this.uISERVICE.Message = response.Result;
        setTimeout(() => {
          this.uISERVICE.Error = false;
        }, 3000);
      }
    });
  }

  // GetDetail() {
  //   try {
  //     this.loader = true;
  //     this.accountService
  //       .getUsrDtl(Cookie.get("c_id"), "Client", Cookie.get("usersCookies"))
  //       .then((response) => {
  //         if (response.Status) {
  //           if (response.Result.IsPwd == false) {
  //             document.getElementById("cnfrmPwd").click();
  //           } else {
  //             this.loader = false;
  //             this.userName = response.Result.UserId;
  //             this.uISERVICE.casinoStatus = response.Result.casinoStatus;
  //             this.uISERVICE.liveGameStatus = response.Result.liveGameStatus;
  //             this.uISERVICE.UserName = response.Result.UserId;
  //             this.uISERVICE.Bal = response.Result.Bal;
  //             this.uISERVICE.Exp = response.Result.Exp;
  //             this.uISERVICE.take = response.Result.Take;
  //             this.uISERVICE.News = response.Result.News;

  //             console.log("news", response.Result.News);
  //             localStorage.setItem(
  //               "UserDetail",
  //               JSON.stringify(response.Result)
  //             );
  //             localStorage.setItem("take", this.uISERVICE.take.toString());
  //           }
  //         } else {
  //           this.uISERVICE.loader = false;
  //           this.LogOut();
  //         }
  //       });
  //   } catch (error) {
  //     this.loader = false;
  //     this.uISERVICE.Header = false;
  //     Cookie.deleteAll();
  //     localStorage.clear();
  //     this.router.navigate(["/games"]);
  //   }
  // }

  pwdShowHide(value) {
    this.Hide = value;
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
          case "table":
            this.router.navigate(["/casino/", type]);
            break;
          case "live-games":
            this.router.navigate(["/casino/", type]);
            break;
          case "SatkaMatka":
            this.router.navigate(["/satka-matka/"]);
            break;
          case "CupRate":
            this.router.navigate(["/cup-rate/", 4, 28127348]);
            break;
          case "Live":
            this.uISERVICE.live = true;
            this.router.navigate(["games"]);
            break;
          case "UpCom":
            this.uISERVICE.live = false;
            this.router.navigate(["games"]);
            break;
        }
      }
    } else {
      switch (type) {
        case "table":
          this.router.navigate(["/casino/", type]);
          break;
        case "live-games":
          this.router.navigate(["/casino/", type]);
          break;
        case "SatkaMatka":
          this.router.navigate(["/satka-matka/"]);
          break;
        case "CupRate":
          this.router.navigate(["/cup-rate/", 4, 28127348]);
          break;
        case "Live":
          this.uISERVICE.live = true;
          this.router.navigate(["games"]);
          break;
        case "UpCom":
          this.uISERVICE.live = false;
          this.router.navigate(["games"]);
          break;
      }
    }
  }

  onChange(type, value) {
    if (type == "Sports") {
      this.sportsId = value;
      if (this.sportsId == 1 || this.sportsId == 2) {
        this.marketName = "All";
      } else if (this.sportsId == 0) {
        this.marketName = "All";
        this.BetType = "All";
      }
    } else if (type == "Market") {
      this.marketName = value;
    }
    this.GetAllBets();
  }

  getBetCount() {
    this.uISERVICE.backUpBets = [];
    this.accountService.GetAllPendingBetsCount().then((response) => {
      if (response.Status) {
        this.betCount = response.Result;
        this.uISERVICE.betCount = this.betCount;
      } else {
        this.uISERVICE.backUpBets = [];
      }
    });
  }

  getEvent(value: any) {
    this.accountService
      .SearchEvent((this.keyword = value.target.value))
      .then((response) => {
        if (response.Status) {
          this.showMatchListDiv = true;
          this.eventlist = response.Result;
        } else {
          this.eventlist = [];
          this.showMatchListDiv = false;
        }
      });
  }

  getEventData(data: any) {
    debugger;
    console.log(data);
    this.sport = data.SportsId;
    this.event = data.EventId;
    this.sharedService.setEventData(data);
    this.router.navigate([`/set-bet/${this.sport}/${this.event}`]);
    this.keyword = "";
    this.eventlist = [];
    document.getElementById("clsSrch").click();
    document.getElementById("cloBtnMenuTab").click();
  }

  GetAllPendingBets() {
    this.uISERVICE.backUpBets = [];
    this.accountService.GetAllPendingBets().then((response) => {
      if (response.Status) {
        this.pendingBets = response.Result;
      } else {
        this.pendingBets = [];
      }
    });
  }

  GetAllBets() {
    this.uISERVICE.backUpBets = [];
    this.accountService
      .getPendingBets(
        "Null",
        this.sportsId,
        this.marketName,
        this.BetType,
        0,
        0
      )
      .then((response) => {
        if (response.Status) {
          this.uISERVICE.backUpBets = response.Result;
        } else {
          this.uISERVICE.backUpBets = [];
        }
      });
  }

  exportexcel(): void {
    let element = document.getElementById("excel-table");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "AllBets.xlsx");
  }
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem("darkMode", this.isDarkMode.toString());
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, "dark-theme");
    } else {
      this.renderer.removeClass(document.body, "dark-theme");
    }
  }
  ngAfterViewInit() {
    $(".account_drop button").click(function (e) {
      $(".account_drop ul").toggleClass("open");
      e.stopPropagation();
    });
    $("header .sign_upBtn .SignUpform_open").click(function () {
      $("header .sign_upBtn .signUp_form").toggleClass("formOpen");
    });
    $(document).on("click", function (e) {
      if ($(e.target).is(".account_drop ul") == false) {
        $(".account_drop ul").removeClass("open");
      }
    });
    $("header .login_btns button.form_open").click(function () {
      $("header .login_btns .login_form").toggleClass("open");
      $(".login_fix").toggleClass("login_visible");
    });
    $(".login_fix, header .main_nav a").click(function () {
      $("header .login_btns .login_form").removeClass("open");
      $(".login_fix").removeClass("login_visible");
    });
    $(".sidebar_toggle_btn").click(function () {
      $(".m_left_sidebar").toggleClass("open");
      $(".overlay_drop").toggleClass("visible");
    });
    $(".user_btn_m").click(function () {
      $(".m_right_sidebar").addClass("open");
      $(".overlay_drop").addClass("visible");
    });
    $(".overlay_drop").click(function () {
      $(".m_left_sidebar").removeClass("open");
      $(".m_right_sidebar").removeClass("open");
      $(".overlay_drop").removeClass("visible");
    });
    // $('.m_left_sidebar a,.m_left_sidebar button').click(function () {
    //   $('.m_left_sidebar').removeClass('open');
    //   $('.overlay_drop').removeClass('visible');
    // });
    $(".m_right_sidebar li,.m_right_sidebar button").click(function () {
      $(".m_right_sidebar").removeClass("open");
      $(".overlay_drop").removeClass("visible");
    });
    // $('.sidebar_toggle_btn').click(function () {
    //   $('.m_left_sidebar').toggleClass('open');

    // });

    $(".liveTv").click(function () {
      $(".livetvSec").toggleClass("d-block");
    });

    // $("ul.list a.main_drop").click(function () {
    //   var $step1 = $(this).parent().find("ul.step_1");
    //   $("ul.list ul.step_1").not($step1).slideUp();
    //   $("ul.list a.main_drop").removeClass("drop_open");

    //   $(this).toggleClass("drop_open");
    //   $step1.slideToggle();

    // });

    // $("ul.list a.main_drop").click(function (e) {
    //   e.preventDefault();
    //   var $step1 = $(this).parent().find("ul.step_1");
    //   $("ul.list ul.step_1").not($step1).slideUp();
    //   $("ul.list a.main_drop").removeClass("drop_open");
    //   $(this).toggleClass("drop_open").next("ul.step_1").slideToggle();
    // });
  }
}
