import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { Subscription } from 'rxjs';
import { UiService } from './service/ui-service';
import * as $ from "jquery";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'app';
  constructor(public uISERVICE: UiService) {

  }
  
  ngOnInit() {

  }
  

  ngAfterViewInit() {
    
    $(document).ready(function() {
      var btn = $('#backToTop');
      var centerSec = $('.center_sec');

      centerSec.on('scroll', function () {
        if (centerSec.scrollTop() > 250) {
          btn.addClass('show');
        } else {
          btn.removeClass('show');
        }
      });

      btn.on('click', function (e) {
        e.preventDefault();
        centerSec.animate({
          scrollTop: 0
        }, 250);
      });


    });

  
  }
}
