import { Component, OnInit, Renderer2 } from '@angular/core';
import * as $ from "jquery";
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isDarkMode = false;
  constructor(private renderer: Renderer2) {
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
