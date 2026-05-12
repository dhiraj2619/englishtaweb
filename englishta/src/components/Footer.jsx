const footerHtml = `<footer class="td_footer td_style_1">
      <div class="container">
        <div class="td_footer_row">
          <div class="td_footer_col">
            <div class="td_footer_widget">
              <div class="td_footer_text_widget td_fs_18">
                <img src="https://picsum.photos/seed/englishta-97/900/600" alt="Logo">
                <p>Englishta is a Nashik-based online English speaking academy helping learners speak confidently in study, work, interviews, and daily life.</p>
              </div>
              <ul class="td_footer_address_widget td_medium td_mp_0">
                <li><i class="fa-solid fa-phone-volume"></i><a href="cal:+23(000)68603">+91 98765 43210</a></li>
                <li><i class="fa-solid fa-location-dot"></i>Nashik, Maharashtra <br>Online classes available</li>
              </ul>
            </div>
          </div>
          <div class="td_footer_col">
            <div class="td_footer_widget">
              <h2 class="td_footer_widget_title td_fs_32 td_white_color td_medium td_mb_30">Navigate</h2>
              <ul class="td_footer_widget_menu">
                <li><a href="index.html">Home</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact Us</a></li>
                <li><a href="contact.html">Webinar</a></li>
                <li><a href="#">Free Demo</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div class="td_footer_col">
            <div class="td_footer_widget">
              <h2 class="td_footer_widget_title td_fs_32 td_white_color td_medium td_mb_30">Courses</h2>
              <ul class="td_footer_widget_menu">
                <li><a href="course-details.html">Spoken English</a></li>
                <li><a href="course-details.html">Interview English</a></li>
                <li><a href="course-details.html">Public Speaking</a></li>
                <li><a href="course-details.html">Grammar for Speaking</a></li>
                <li><a href="course-details.html">Pronunciation Practice</a></li>
                <li><a href="course-details.html">Corporate English</a></li>
              </ul>
            </div>
          </div>
          <div class="td_footer_col">
            <div class="td_footer_widget">
              <h2 class="td_footer_widget_title td_fs_32 td_white_color td_medium td_mb_30">Join Our Updates</h2>
              <div class="td_newsletter td_style_1">
                <p class="td_mb_20 td_opacity_7">Get updates about online batches, free webinars, and English speaking tips.</p>
                <form action="#" class="td_newsletter_form">
                  <input type="email" class="td_newsletter_input" placeholder="Email address">
                  <button type="submit" class="td_btn td_style_1 td_radius_30 td_medium">
                    <span class="td_btn_in td_white_color td_accent_bg">
                      <span>Join Now</span>
                    </span>             
                  </button>
                </form>
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
              <li><a href="#"> Terms & Conditions</a></li>
              <li><a href="#">Privacy & Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>`;

const Footer = () => {
  return <div dangerouslySetInnerHTML={{ __html: footerHtml }} />;
};

export default Footer;
