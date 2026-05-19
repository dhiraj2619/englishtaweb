const footerHtml = `<footer class="td_footer td_style_1">
      <div class="container">
        <div class="td_footer_row">
          <div class="td_footer_col">
            <div class="td_footer_widget">
              <div class="td_footer_text_widget td_fs_18">
                <img src="/assets/images/logo/logoenglishta.png" alt="Englishta Logo">
                <p>Englishta is an online English speaking academy helping learners speak confidently in study, work, interviews, and daily life.</p>
              </div>
              <ul class="td_footer_address_widget td_medium td_mp_0">
                <li><i class="fa-solid fa-phone-volume"></i><a href="cal:+23(000)68603">+91 98765 43210</a></li>
                <li><i class="fa-solid fa-location-dot"></i>Live Online Classes <br>Learn from anywhere</li>
              </ul>
            </div>
          </div>
          <div class="td_footer_col">
            <div class="td_footer_widget">
              <h2 class="td_footer_widget_title td_fs_32 td_white_color td_medium td_mb_30">Quick Links</h2>
              <ul class="td_footer_widget_menu">
                <li><a href="/">Home</a></li>
                <li><a href="/courses">Courses</a></li>
                <li><a href="/webinar">Webinar</a></li>
                <li><a href="/about-us">About</a></li>
                <li><a href="/contact-us">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div class="td_footer_col">
            <div class="td_footer_widget">
              <h2 class="td_footer_widget_title td_fs_32 td_white_color td_medium td_mb_30">Popular Courses</h2>
              <ul class="td_footer_widget_menu">
                <li><a href="/courses">Spoken English</a></li>
                <li><a href="/courses">Interview English</a></li>
                <li><a href="/courses">Pronunciation Training</a></li>
                <li><a href="/courses">Corporate Communication</a></li>
              </ul>
            </div>
          </div>
          <div class="td_footer_col">
            <div class="td_footer_widget">
              <h2 class="td_footer_widget_title td_fs_32 td_white_color td_medium td_mb_30">Get Started</h2>
              <div class="td_newsletter td_style_1">
                <p class="td_mb_20 td_opacity_7">Join live classes, free webinars, and guided speaking practice with Englishta.</p>
                <ul class="td_footer_widget_menu">
                  <li><a href="/contact-us">Book Free Demo</a></li>
                  <li><a href="/webinar">Register for Webinar</a></li>
                  <li><a href="/about-us">Know More About Us</a></li>
                </ul>
              </div>
              <div class="td_footer_social_btns td_fs_20">
                <a href="#" class="td_center">
                  <i class="fa-brands fa-facebook-f"></i>
                </a>
                <a href="#" class="td_center">
                  <i class="fa-brands fa-x-twitter"></i>
                </a>
                <a href="#" class="td_center">
                  <i class="fa-brands fa-instagram"></i>
                </a>
                <a href="#" class="td_center">
                  <i class="fa-brands fa-pinterest-p"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="td_footer_bottom td_fs_18">
        <div class="container">
          <div class="td_footer_bottom_in">
            <p class="td_copyright mb-0">Copyright &copy; Englishta | All Rights Reserved</p>
            <ul class="td_footer_widget_menu">
              <li><a href="/about-us">About</a></li>
              <li><a href="/contact-us">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>`;

const Footer = () => {
  return <div dangerouslySetInnerHTML={{ __html: footerHtml }} />;
};

export default Footer;
