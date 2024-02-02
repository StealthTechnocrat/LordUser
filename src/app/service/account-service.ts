import { Injectable } from "@angular/core";
import { BaseHttpService } from "./base-http-service";
import { environment } from "../../environments/environment";
import { SignInModel } from "../Model/signin-model";
import { PlaceBetModel } from "../Model/placebet_model";
import { CardDetails } from "../Model/CardsModel";
import { SignUpModel } from "../Model/Sign_Up_Model";
import { promise } from "protractor";
import { promises } from "dns";
import { domain } from "process";

@Injectable()
export class AccountService {
  constructor(private baseHttpService: BaseHttpService) {}
  private signInUrl = environment.apiBaseUrl + "Admin/Login";
  private LogoutUrl = environment.apiBaseUrl + "Admin/Logout";
  private usrPWDchkUrl = environment.apiBaseUrl + "Admin/CheckPwdSts";
  private SetNewPasswordUrl = environment.apiBaseUrl + "Admin/SetNewPassword";

  private getSrsListUrl = environment.apiBaseUrl + "Event/GetSeriesList";
  private getUsrDtlUrl = environment.apiBaseUrl + "SignUp/GetUserDetails";
  private getDetailLstUrl = environment.apiBaseUrl + "Event/GetDetail";
  private getEvntDtlUrl = environment.apiBaseUrl + "Event/GetEventDetail";
  private placeBetUrl = environment.apiBaseUrl + "Bets/CreateBet";
  private placeFancyBetUrl = environment.apiBaseUrl + "Bets/CreateFancyBet";
  private getBetHistoryUrl = environment.apiBaseUrl + "Bets/GetBetsHistory";
  private GetUserBetsHistoryUrl =
    environment.apiBaseUrl + "Bets/GetUserBetsHistory";
  private getTransactionHistoryUrl =
    environment.apiBaseUrl + "Transaction/TranHistory";
  private updateUserUrl = environment.apiBaseUrl + "SignUp/Update_User";
  private updateRecValUrl = environment.apiBaseUrl + "Chip/Update_TakeRecord";
  private getCsnoDtlUrl = environment.apiBaseUrl + "Event/getCasinoDetail";
  private getProfitLossUrl = environment.apiBaseUrl + "Transaction/ProfitLoss";
  private getEventBetsUrl = environment.apiBaseUrl + "Bets/GetEventBets";
  private getMarketBetsUrl = environment.apiBaseUrl + "Bets/GetMarketBets";
  private getCasinoBetsUrl = environment.apiBaseUrl + "Bets/GetCasinoBets";

  private getChipsUrl = environment.apiBaseUrl + "Chip/GetChips";
  private DeleteChipsUrl = environment.apiBaseUrl + "Chip/DeleteChips";
  private fancyBookUrl = environment.apiBaseUrl + "Bets/getFancyBook";
  private pendingBetUrl = environment.apiBaseUrl + "Bets/GetPendingBets";
  private updateChipUrl = environment.apiBaseUrl + "Chip/AddChips";
  private saveCardsUrl = environment.apiBaseUrl + "Market/saveGameCards";
  private chkLogIdUrl = environment.apiBaseUrl + "SignUp/CheckLoginId";
  private addUserUrl = environment.apiBaseUrl + "SignUp/Create_User";
  private getLobbyUrl = environment.apiBaseUrl + "balance/getLobby";
  private GetBannerUrl = environment.apiBaseUrl + "Chip/GetBanners";
  private GetCasinoProviderUrl =
    environment.apiBaseUrl + "CasinoSettings/GetCasinoProviders";
  private GetCasinoGamesUrl =
    environment.apiBaseUrl + "CasinoSettings/GetCasinoGames";
  private GetCasinoDetailsUrl =
    environment.apiBaseUrl + "CasinoSettings/GetCasinoSettings";
  private GetTableGamesUrl =
    environment.apiBaseUrl + "CasinoSettings/GetTableGames";
  private GetLogoUrl = environment.apiBaseUrl + "Chip/GetLogo";
  private GetApiUrlsUrl = environment.apiBaseUrl + "Event/GetApiUrls";
  private changePwdUrl = environment.apiBaseUrl + "SignUp/changePassword";
  private getCompListUrl = environment.apiBaseUrl + "Event/GetCompetitionList";
  private getEventListUrl =
    environment.apiBaseUrl + "Event/GetEventListBySportsId";
  private getAllInplayUrl = environment.apiBaseUrl + "Event/GetInplayEvents";
  private getUpcomingEventsUrl =
    environment.apiBaseUrl + "Event/GetUpcomingEvents";
  private GetAllEventsBySportsIdUrl =
    environment.apiBaseUrl + "Event/GetAllEventsBySportsId";
  private GetInplayEventsBySportsIdUrl =
    environment.apiBaseUrl + "Event/GetInplayEventsBySportsId";
  private GetAllMarketsUrl = environment.apiBaseUrl + "Event/GetAllMarkets";
  private GetAllResultsUrl = environment.apiBaseUrl + "Event/GetAllResultList";
  private GetResultListUrl = environment.apiBaseUrl + "Event/GetResultList";
  private filteredResultUrl =
    environment.apiBaseUrl + "Event/GetFilteredResultList";
  private GetAllPendingBetsCountUrl =
    environment.apiBaseUrl + "Admin/GetAllPendingBetsCount";
  private GetAllPendingBetsUrl =
    environment.apiBaseUrl + "Admin/GetAllPendingBets";
  private usrDtlUrl = environment.apiBaseUrl + "SignUp/UsersDetails";
  private SearchEventUrl = environment.apiBaseUrl + "Admin/SearchEvent";
  private GetBetSeriesUrl = environment.apiBaseUrl + "Admin/GetBetSeries";
  private GetBetEventUrl = environment.apiBaseUrl + "Admin/GetBetEvent";

  GetBetSeries(sportsId): Promise<any> {
    return this.baseHttpService
      .Get(this.GetBetSeriesUrl + "?sportsId=" + sportsId)
      .then(function (response) {
        return response.json();
      });
  }

  GetBetEvent(sportsId,seriesId): Promise<any> {
    return this.baseHttpService
      .Get(this.GetBetEventUrl + "?sportsId=" + sportsId + "&seriesId=" + seriesId)
      .then(function (response) {
        return response.json();
      });
  }

  GetAllPendingBets(): Promise<any> {
    return this.baseHttpService
      .Get(this.GetAllPendingBetsUrl)
      .then(function (response) {
        return response.json();
      });
  }

  SearchEvent(keyword): Promise<any> {
    return this.baseHttpService
      .Get(this.SearchEventUrl + "?keyword=" + keyword)
      .then(function (response) {
        return response.json();
      });
  }

  SetNewPassword(userId, oldpwd, newpwd): Promise<any> {
    return this.baseHttpService
      .Get(
        this.SetNewPasswordUrl +
          "?userId=" +
          userId +
          "&oldPwd=" +
          oldpwd +
          "&newPwd=" +
          newpwd
      )
      .then(function (response) {
        return response.json();
      });
  }

  GetAllPendingBetsCount(): Promise<any> {
    return this.baseHttpService
      .Get(this.GetAllPendingBetsCountUrl)
      .then(function (response) {
        return response.json();
      });
  }

  usrPWDchk(signInModel: SignInModel): Promise<any> {
    return this.baseHttpService
      .Post(this.usrPWDchkUrl, signInModel)
      .then(function (response) {
        return response.json();
      });
  }

  userDetails(): Promise<any> {
    return this.baseHttpService.Get(this.usrDtlUrl).then(function (response) {
      return response.json();
    });
  }

  logout(): Promise<any> {
    return this.baseHttpService.Get(this.LogoutUrl).then(function (response) {
      return response.json();
    });
  }

  filteredResult(marketName, skip, takeRec, sDate, eDate): Promise<any> {
    return this.baseHttpService
      .Get(
        this.filteredResultUrl +
          "?marketName=" +
          marketName +
          "&skip=" +
          skip +
          "&takeRec=" +
          takeRec +
          "&sDate=" +
          sDate +
          "&eDate=" +
          eDate
      )
      .then(function (response) {
        return response.json();
      });
  }

  GetResults(eventId, marketName, skip, takeRec, sDate, eDate): Promise<any> {
    return this.baseHttpService
      .Get(
        this.GetResultListUrl +
          "?eventId=" +
          eventId +
          "&marketName=" +
          marketName +
          "&skip=" +
          skip +
          "&takeRec=" +
          takeRec +
          "&sDate=" +
          sDate +
          "&eDate=" +
          eDate
      )
      .then(function (response) {
        return response.json();
      });
  }

  GetAllResults(eventId,marktName,seriesId,sportsId, skip, takeRec, sDate, eDate): Promise<any> {
    return this.baseHttpService
      .Get(
        this.GetAllResultsUrl +
        "?eventId="+
        eventId + 
        "&marktName=" +
        marktName +  "&seriesId=" +
        seriesId +  "&sportsId=" +
        sportsId +
          "&skip=" +
          skip +
          "&takeRec=" +
          takeRec +
          "&sDate=" +
          sDate +
          "&eDate=" +
          eDate
      )
      .then(function (response) {
        return response.json();
      });
  }

  GetAllMarkets(eventId): Promise<any> {
    return this.baseHttpService
      .Get(this.GetAllMarketsUrl + "?eventId=" + eventId)
      .then(function (response) {
        return response.json();
      });
  }

  GetInplayEventsBySportsId(sportsId): Promise<any> {
    return this.baseHttpService
      .Get(this.GetInplayEventsBySportsIdUrl + "?sportsId=" + sportsId)
      .then(function (response) {
        return response.json();
      });
  }

  GetAllEventsBySportsId(sportsId): Promise<any> {
    return this.baseHttpService
      .Get(this.GetAllEventsBySportsIdUrl + "?sportsId=" + sportsId)
      .then(function (response) {
        return response.json();
      });
  }

  getAllInplay(): Promise<any> {
    return this.baseHttpService
      .Get(this.getAllInplayUrl)
      .then(function (response) {
        return response.json();
      });
  }

  getAllUpcoming(): Promise<any> {
    return this.baseHttpService
      .Get(this.getUpcomingEventsUrl)
      .then(function (response) {
        return response.json();
      });
  }

  getCompList(sportsId): Promise<any> {
    return this.baseHttpService
      .Get(this.getCompListUrl + "?sportsId=" + sportsId)
      .then(function (response) {
        return response.json();
      });
  }

  getEventList(sportsId, seriesId): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getEventListUrl + "?sportsId=" + sportsId + "&seriesId=" + seriesId
      )
      .then(function (response) {
        return response.json();
      });
  }

  SignIn(signInModel: SignInModel): Promise<any> {
    return this.baseHttpService
      .Post(this.signInUrl, signInModel)
      .then(function (response) {
        return response.json();
      });
  }

  GetLogo(): Promise<any> {
    return this.baseHttpService
      .Get(this.GetLogoUrl + "?doamin=" + window.location.origin)
      .then(function (response) {
        return response.json();
      });
  }

  getSrsList(sportsId): Promise<any> {
    return this.baseHttpService
      .Get(this.getSrsListUrl + "?sportsId=" + sportsId)
      .then(function (response) {
        return response.json();
      });
  }

  getUsrDtl(id, role, token): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getUsrDtlUrl + "?id=" + id + "&role=" + role + "&token=" + token
      )
      .then(function (response) {
        return response.json();
      });
  }

  getDetailLst(sportsId, reqType, chckCnd): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getDetailLstUrl +
          "?sportsId=" +
          sportsId +
          "&reqType=" +
          reqType +
          "&chckCnd=" +
          chckCnd
      )
      .then(function (response) {
        return response.json();
      });
  }

  getEvntDetail(eventId, type): Promise<any> {
    return this.baseHttpService
      .Get(this.getEvntDtlUrl + "?eventId=" + eventId + "&type=" + type)
      .then(function (response) {
        return response.json();
      });
  }

  getCasinoDetail(marketId, type): Promise<any> {
    return this.baseHttpService
      .Get(this.getCsnoDtlUrl + "?marketId=" + marketId + "&type=" + type)
      .then(function (response) {
        return response.json();
      });
  }

  placeBet(placeBetModel: PlaceBetModel): Promise<any> {
    if (placeBetModel.MarketName == "Fancy") {
      return this.baseHttpService
        .Post(this.placeFancyBetUrl, placeBetModel)
        .then(function (response) {
          return response.json();
        });
    } else {
      return this.baseHttpService
        .Post(this.placeBetUrl, placeBetModel)
        .then(function (response) {
          return response.json();
        });
    }
  }
  GetUserBetsHistory(
    skipRec,
    takeRec,
    sportsId,
    betType,
    mrktName,
    startDate,
    endDate
  ): Promise<any> {
    return this.baseHttpService
      .Get(
        this.GetUserBetsHistoryUrl +
          "?skipRec=" +
          skipRec +
          "&takeRecord=" +
          takeRec +
          "&sportsId=" +
          sportsId +
          "&betType=" +
          betType +
          "&marketName=" +
          mrktName +
          "&startDate=" +
          startDate +
          "&endDate=" +
          endDate
      )
      .then(function (response) {
        return response.json();
      });
  }
  GetBetHistory(
    skipRec,
    takeRec,
    eventId,
    sportsId,
    mrktName,
    betType,
    role,
    usrName,
    startDate,
    endDate
  ): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getBetHistoryUrl +
          "?skipRec=" +
          skipRec +
          "&takeRecord=" +
          takeRec +
          "&eventId=" +
          eventId +
          "&sportsId=" +
          sportsId +
          "&marketName=" +
          mrktName +
          "&betStatus=" +
          betType +
          "&role=" +
          role +
          "&userId=" +
          usrName +
          "&startDate=" +
          startDate +
          "&endDate=" +
          endDate
      )
      .then(function (response) {
        return response.json();
      });
  }

  GetTransactionHistory(
    role,
    userId,
    skipRec,
    take,
    type,
    sportsId,
    marketName,
    sDate,
    eDate
  ): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getTransactionHistoryUrl +
          "?role=" +
          role +
          "&userId=" +
          userId +
          "&skipRec=" +
          skipRec +
          "&take=" +
          take +
          "&type=" +
          type +
          "&sportsId=" +
          sportsId +
          "&marketName=" +
          marketName +
          "&sDate=" +
          sDate +
          "&eDate=" +
          eDate
      )
      .then(function (response) {
        return response.json();
      });
  }

  GetApiUrls(sportId): Promise<any> {
    return this.baseHttpService
      .Get(this.GetApiUrlsUrl + "?sportsId=" + sportId + "&role=" + true)
      .then(function (response) {
        return response.json();
      });
  }

  UpdateUser(type, value, userId): Promise<any> {
    return this.baseHttpService
      .Get(
        this.updateUserUrl +
          "?type=" +
          type +
          "&Value=" +
          value +
          "&userId=" +
          userId
      )
      .then(function (response) {
        return response.json();
      });
  }

  UpdateRecVal(value): Promise<any> {
    return this.baseHttpService
      .Get(this.updateRecValUrl + "?value=" + value)
      .then(function (response) {
        return response.json();
      });
  }

  GetProfitLoss(role, userId, sportsId, sDate, eDate): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getProfitLossUrl +
          "?role=" +
          role +
          "&userId=" +
          userId +
          "&sportsId=" +
          sportsId +
          "&sDate=" +
          sDate +
          "&eDate=" +
          eDate
      )
      .then(function (response) {
        return response.json();
      });
  }

  GetEventBets(userName, role, userId, marketName, eventId) {
    return this.baseHttpService
      .Get(
        this.getEventBetsUrl +
          "?userName=" +
          userName +
          "&role=" +
          role +
          "&userId=" +
          userId +
          "&marketName=" +
          marketName +
          "&eventId=" +
          eventId +
          "&skipRec=0&take=0"
      )
      .then(function (response) {
        return response.json();
      });
  }

  GetMarketBets(
    userName,
    role,
    userId,
    marketName,
    eventId,
    runId,
    marketId
  ): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getMarketBetsUrl +
          "?userName=" +
          userName +
          "&role=" +
          role +
          "&userId=" +
          userId +
          "&marketName=" +
          marketName +
          "&eventId=" +
          eventId +
          "&runId=" +
          runId +
          "&skipRec=0&take=0" +
          "&marketId=" +
          marketId
      )
      .then(function (response) {
        return response.json();
      });
  }

  GetCasinoBets(role, userId, marketId, systemId, sDate, eDate): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getCasinoBetsUrl +
          "?role=" +
          role +
          "&userId=" +
          userId +
          "&marketId=" +
          marketId +
          "&systemId=" +
          systemId +
          "&sDate=" +
          sDate +
          "&eDate=" +
          eDate
      )
      .then(function (response) {
        return response.json();
      });
  }

  getChips(): Promise<any> {
    return this.baseHttpService.Get(this.getChipsUrl).then(function (response) {
      return response.json();
    });
  }

  DeleteChips(chipId, value): Promise<any> {
    return this.baseHttpService
      .Get(this.DeleteChipsUrl + "?chipId=" + chipId + "&value=" + value)
      .then(function (response) {
        return response.json();
      });
  }

  getFancyBook(selId, mrktId): Promise<any> {
    return this.baseHttpService
      .Get(this.fancyBookUrl + "?RunnerId=" + selId + "&marketId=" + mrktId)
      .then(function (response) {
        return response.json();
      });
  }

  getPendingBets(
    usrName,
    sportId,
    marketName,
    betType,
    skip,
    take
  ): Promise<any> {
    return this.baseHttpService
      .Get(
        this.pendingBetUrl +
          "?usrName=" +
          usrName +
          "&sportsId=" +
          sportId +
          "&mrktName=" +
          marketName +
          "&betType=" +
          betType +
          "&skipRec=" +
          skip +
          "&takeRec=" +
          take
      )
      .then(function (response) {
        return response.json();
      });
  }

  updateChip(chipData): Promise<any> {
    return this.baseHttpService
      .Post(this.updateChipUrl, chipData)
      .then(function (response) {
        return response.json();
      });
  }

  saveCard(cardModel: CardDetails): Promise<any> {
    return this.baseHttpService
      .Post(this.saveCardsUrl, cardModel)
      .then(function (response) {
        return response.json();
      });
  }

  chkLogId(LogId): Promise<any> {
    return this.baseHttpService
      .Get(this.chkLogIdUrl + "?userId=" + LogId)
      .then(function (response) {
        return response.json();
      });
  }

  changePwd(oldpwd, newpwd): Promise<any> {
    return this.baseHttpService
      .Get(this.changePwdUrl + "?oldPwd=" + oldpwd + "&newPwd=" + newpwd)
      .then(function (response) {
        return response.json();
      });
  }

  addUser(sign_Up_Model: SignUpModel): Promise<any> {
    return this.baseHttpService
      .Post(this.addUserUrl, sign_Up_Model)
      .then(function (response) {
        return response.json();
      });
  }

  getLobby(gameCode): Promise<any> {
    return this.baseHttpService
      .Get(this.getLobbyUrl + "?gameCode=" + gameCode)
      .then(function (response) {
        return response.json();
      });
  }

  GetBanner(type: string): Promise<any> {
    return this.baseHttpService
      .Get(
        this.GetBannerUrl +
          "?type=" +
          type +
          "&domain=" +
          window.location.origin
      )
      .then(function (response) {
        return response.json();
      });
  }

  GetCasinoProviders(): Promise<any> {
    return this.baseHttpService
      .Get(this.GetCasinoProviderUrl + "?role=" + "Client")
      .then(function (response) {
        return response.json();
      });
  }

  GetCasinoGames(systemId: string): Promise<any> {
    return this.baseHttpService
      .Get(
        this.GetCasinoGamesUrl + "?systemId=" + systemId + "&role=" + "Client"
      )
      .then(function (response) {
        return response.json();
      });
  }

  GetCasinoDetails(): Promise<any> {
    return this.baseHttpService
      .Get(this.GetCasinoDetailsUrl)
      .then(function (response) {
        return response.json();
      });
  }

  GetTableGames(): Promise<any> {
    return this.baseHttpService
      .Get(this.GetTableGamesUrl + "?role=" + "Client")
      .then(function (response) {
        return response.json();
      });
  }
}
