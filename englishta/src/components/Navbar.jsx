const navbarHtml = `<header class="td_site_header td_style_1 td_type_3 td_sticky_header td_medium td_heading_color">
      <div class="td_main_header">
        <div class="container-fluid">
          <div class="td_main_header_in">
            <div class="td_main_header_left">
              <a class="td_site_branding" href="index.html">
                <img src="https://picsum.photos/seed/englishta-100/900/600" alt="Logo">
              </a>
              <div class="td_header_social_btns">
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
            <div class="td_main_header_center">
              <nav class="td_nav">
                <div class="td_nav_list_wrap">
                  <div class="td_nav_list_wrap_in">
                    <ul class="td_nav_list">
                      <li><a href="/">Home</a></li>
                      <li><a href="/about-us">About Us</a></li>
                    </ul>
                    <a class="td_site_branding" href="/">
                      <img src="/assets/images/logo/logoenglishta.png" class="logomain" alt="Logo">
                    </a>
                    <ul class="td_nav_list">
                      <li><a href="/courses">Courses</a></li>
                      <li><a href="/webinar">Webinar</a></li>
                      <li><a href="/contact-us">Contact Us</a></li>
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
            <div class="td_main_header_right">
             
              <div class="position-relative">
                <button class="td_circle_btn td_center td_search_tobble_btn" type="button">
                                                
                </button>
                <div class="td_header_search_wrap">
                  <form action="#" class="td_header_search">
                    <input type="text" class="td_header_search_input" placeholder="Search For Anything">
                    <button class="td_header_search_btn td_center">
                      <img src="https://picsum.photos/seed/englishta-103/900/600" alt="">
                    </button>
                  </form>
                </div>
              </div>
              <button class="td_hamburger_btn"></button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="td_side_header">
      <button class="td_close"></button>
      <div class="td_side_header_overlay"></div>
      <div class="td_side_header_in">
        <div class="td_side_header_shape"></div>
        <a class="td_site_branding" href="index.html">
          <img src="https://picsum.photos/seed/englishta-104/900/600" alt="Logo">
        </a>
        <div class="td_side_header_box">
          <h2 class="td_side_header_heading">Want to improve your English? <br> Join our online speaking classes.</h2>
        </div>
        <div class="td_side_header_box">
          <h3 class="td_side_header_title td_heading_color">Contact Us</h3>
          <ul class="td_side_header_contact_info td_mp_0">
            <li>
              <i class="fa-solid fa-phone"></i>
              <span><a href="tel:+444547800112">+91 98765 43210</a></span>
            </li>
            <li>
              <i class="fa-solid fa-envelope"></i>             
              <span><a href="mailto:hello@englishta.com">hello@englishta.com</a></span>
            </li>
            <li>
              <i class="fa-solid fa-location-dot"></i>            
              <span>Nashik, Maharashtra <br>Online English Training</span>
            </li>
          </ul>
        </div>
        <div class="td_side_header_box">
          <h3 class="td_side_header_title td_heading_color">Get Updates</h3>
          <div class="td_newsletter td_style_1">
            <form action="#" class="td_newsletter_form">
              <input type="email" class="td_newsletter_input" placeholder="Your email address">
              <button type="submit" class="td_btn td_style_1 td_radius_30 td_medium">
                <span class="td_btn_in td_white_color td_accent_bg">
                  <span>Get Updates Now</span>
                </span>             
              </button>
            </form>
          </div>
        </div>
        <div class="td_side_header_box">
          <h3 class="td_side_header_title td_heading_color">Follow Us</h3>
          <div class="td_social_btns td_style_1 td_heading_color">
            <a href="#" class="td_center">
              <i class="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="#" class="td_center">
              <i class="fa-brands fa-twitter"></i>
            </a>
            <a href="#" class="td_center">
              <i class="fa-brands fa-youtube"></i>
            </a>
            <a href="#" class="td_center">
              <i class="fa-brands fa-facebook-f"></i>
            </a>
          </div>
        </div>
      </div>`;

export default function Navbar() {
  return <div dangerouslySetInnerHTML={{ __html: navbarHtml }} />;
}
