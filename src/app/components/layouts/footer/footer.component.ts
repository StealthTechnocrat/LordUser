import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
  






    $(document).ready(function(){
      $("a.Btnall").click(function(){
         $(".big").toggleClass("all-items");
      });
  });
  }

  
}
