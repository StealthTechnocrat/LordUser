import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import { AccountService } from './service/account-service';
import { BaseHttpService } from './service/base-http-service';
import { AuthGuardService } from './service/auth-guard.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { GamesComponent } from './components/games/games.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UiService } from '../app/service/ui-service';
import { PagerService } from '../app/service/pager.service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgcCookieConsentModule, NgcCookieConsentConfig, WindowService, NgcCookieConsentService} from 'ngx-cookieconsent';
import { config } from 'rxjs';
import { LiveMarketsComponent } from './components/layouts/live-markets/live-markets.component';
import { CasinoSidebarComponent } from './components/layouts/casino-sidebar/casino-sidebar.component';
import { SidebarBetsComponent } from './components/layouts/sidebar-bets/sidebar-bets.component';
import { SetBetComponent } from './components/set-bet/set-bet.component';
import { BetSlipComponent } from './components/bet-slip/bet-slip.component';
import { BetsComponent } from './components/bets/bets.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CashComponent } from './components/cash/cash.component';
import { StatementComponent } from './components/statement/statement.component';
import { ProfitLossComponent } from './components/profit-loss/profit-loss.component';
import { TeenpattiComponent } from './components/teenpatti/teenpatti.component';
import { LiveGamesComponent } from './components/live-games/live-games.component';
import { CasinoComponent } from './components/casino/casino.component';
import { SafePipe } from './safe.pipe';
import { CupRateComponent } from './components/cup-rate/cup-rate.component';
import { GameRulesComponent } from './components/layouts/game-rules/game-rules.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { TimeCountdownComponent } from './components/time-countdown/time-countdown.component';
import { ResultsComponent } from './components/results/results.component';

import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SafePipe,
    SidebarComponent,
    GamesComponent,
    LiveMarketsComponent,
    CasinoSidebarComponent,
    SidebarBetsComponent,
    SetBetComponent,
    BetSlipComponent,
    BetsComponent,
    ProfileComponent,
    CashComponent,
    StatementComponent,
    ProfitLossComponent,
    TeenpattiComponent,
    LiveGamesComponent,
    CasinoComponent,
    CupRateComponent,
    GameRulesComponent,
    FooterComponent,
    TimeCountdownComponent,
    ResultsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    CarouselModule,
    BrowserAnimationsModule,
    NgIdleKeepaliveModule.forRoot(),
    ToastrModule.forRoot(),
    NgbModule,
    DragDropModule,
  ],
  //exports: [SetBetComponent],
  providers: [DatePipe,{ provide: LocationStrategy, useClass: HashLocationStrategy },WindowService, { provide: NgcCookieConsentConfig, useValue: config }, NgcCookieConsentService, AccountService, BaseHttpService, AuthGuardService, UiService, PagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
