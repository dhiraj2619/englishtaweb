"use client";

import { useEffect, useState } from "react";

const navbarHtml = `<header class="td_site_header td_style_1 td_type_3 td_sticky_header td_medium">
      <div class="td_main_header">
        <div class="container-fluid">
          <div class="td_main_header_in">
            <div class="td_main_header_left">
              <a class="td_site_branding" href="index.html">
                <img src="/assets/images/logo/logoenglishta.png" style="height:80px" alt="Logo">
              </a>
              <a class="englishtaNavbar__leftLogo" href="/">
                <img src="/assets/images/logo/logoenglishta.png" alt="Englishta">
              </a>
            </div>
            <div class="td_main_header_center">
              <nav class="td_nav">
                <div class="td_nav_list_wrap">
                  <div class="td_nav_list_wrap_in">
                    <ul class="td_nav_list">
                      <li><a href="/">Home</a></li>
                      <li><a href="/courses">Courses</a></li>
                    </ul>
                 
                    <ul class="td_nav_list">
                      <li><a href="/webinar">Webinar</a></li>
                      <li><a href="/about-us">About</a></li>
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
              <button class="englishtaNavbarLoginButton" type="button" data-auth-modal-trigger>Login / Register</button>
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
              <i class="fa-solid fa-envelope"></i>             
              <span><a href="mailto:hello@englishta.com">hello@englishta.com</a></span>
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
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="#" class="td_center">
              <i class="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" class="td_center">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
            <a href="#" class="td_center">
              <i class="fa-brands fa-youtube"></i>
            </a>
            <a href="#" class="td_center">
              <i class="fa-brands fa-pinterest-p"></i>
            </a>
          </div>
        </div>
      </div>
    </div>`;

export default function Navbar() {
  const [hasScrolledPastThreshold, setHasScrolledPastThreshold] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolledPastThreshold(window.scrollY > 700);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleAuthTriggerClick = (event) => {
      if (event.target.closest("[data-auth-modal-trigger]")) {
        setIsAuthModalOpen(true);
      }
    };

    document.addEventListener("click", handleAuthTriggerClick);

    return () => {
      document.removeEventListener("click", handleAuthTriggerClick);
    };
  }, []);

  useEffect(() => {
    if (!isAuthModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsAuthModalOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAuthModalOpen]);

  return (
    <>
      <div
        className={hasScrolledPastThreshold ? "englishtaNavbar englishtaNavbar--scrolled" : "englishtaNavbar"}
        dangerouslySetInnerHTML={{ __html: navbarHtml }}
      />

      {isAuthModalOpen ? (
        <div className="englishtaAuthModal" role="presentation" onMouseDown={() => setIsAuthModalOpen(false)}>
          <section
            aria-labelledby="englishta-auth-title"
            aria-modal="true"
            className="englishtaAuthModal__card"
            role="dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close login and register popup"
              className="englishtaAuthModal__close"
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
            >
              <span />
              <span />
            </button>

            <div className="englishtaAuthModal__brand">
              <div className="englishtaAuthModal__sparkles" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <img src="/assets/images/tukoauth.png" alt="Englishta mascot" />
            
            
            </div>

            <form
              className="englishtaAuthModal__form"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <h3 className="mt-5">Login / Signup with Mobile</h3>
              <p>We&apos;ll send you a One Time Password (OTP) on your mobile number</p>

              <div className="englishtaAuthModal__phoneRow">
                <button className="englishtaAuthModal__country" type="button" aria-label="India country code">
                  <span className="englishtaAuthModal__flag" aria-hidden="true" />
                  <strong>+91</strong>
                  <i className="fa-solid fa-caret-down" aria-hidden="true" />
                </button>
                <input type="tel" inputMode="numeric" placeholder="Enter your mobile number" aria-label="Mobile number" />
              </div>

              <button className="englishtaAuthModal__submit" type="submit">
                Send OTP
              </button>
            </form>

            <div className="englishtaAuthModal__divider">
              <span />
              <em>OR</em>
              <span />
            </div>

            <div className="englishtaAuthModal__safe">
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />
              <p>
                <strong>Your number is safe with us.</strong>
                We don&apos;t share your details.
              </p>
            </div>

            <p className="englishtaAuthModal__terms">
              By continuing, you agree to our <a href="/terms">Terms of Use</a> &amp; <a href="/privacy">Privacy Policy</a>
            </p>
          </section>
        </div>
      ) : null}
    </>
  );
}


