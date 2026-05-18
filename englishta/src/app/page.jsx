"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const rawPageHtml = `
    <section className="td_hero td_style_1 td_heading_bg td_center td_bg_filed" data-src="https://picsum.photos/seed/englishta-98/1600/900">
      <div className="container">
        <div className="td_hero_text wow fadeInRight" data-wow-duration="0.9s" data-wow-delay="0.35s">
          <p className="td_hero_subtitle_up td_fs_18 td_white_color td_spacing_1 td_semibold text-uppercase td_mb_10 td_opacity_9">Speak English With Confidence</p>
          <h1 className="td_hero_title td_fs_64 td_white_color td_mb_12"><span>Englishta</span> - Online English Speaking Academy From Nashik </h1>
          <p className="td_hero_subtitle td_fs_18 td_white_color td_opacity_7 td_mb_30">Learn spoken English online with practical conversation practice, pronunciation correction, grammar support, and confidence-building sessions led from Nashik.</p>
          <a href="courses-grid-view.html" className="td_btn td_style_1 td_radius_10 td_medium">
            <span className="td_btn_in td_white_color td_accent_bg">
              <span>Explore Courses</span>
              <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.1575 4.34302L3.84375 15.6567" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.157 11.4142C15.157 11.4142 16.0887 5.2748 15.157 4.34311C14.2253 3.41142 8.08594 4.34314 8.08594 4.34314" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg> 
            </span>             
          </a>
        </div>
      </div>
      <div className="td_lines">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </section>
    <div className="container">
      <div className="td_hero_btn_group">
        <a href="courses-grid-view.html" className="td_btn td_style_1 td_radius_10 td_medium td_fs_20 wow fadeInUp" data-wow-duration="0.9s" data-wow-delay="0.35s">
          <span className="td_btn_in td_white_color branddarkenglishta">
            <span>Join Online Batch</span>
            <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.1575 4.34302L3.84375 15.6567" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.157 11.4142C15.157 11.4142 16.0887 5.2748 15.157 4.34311C14.2253 3.41142 8.08594 4.34314 8.08594 4.34314" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg> 
          </span>             
        </a>
        <a href="signup.html" className="td_btn td_style_1 td_radius_10 td_medium td_fs_20 wow fadeInUp" data-wow-duration="0.9s" data-wow-delay="0.35s">
          <span className="td_btn_in td_white_color branddarkenglishta">
            <span>Book Free Demo</span>
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7945 12.2734H8.95703C8.74129 12.2734 8.56641 12.4484 8.56641 12.6641V14.768C8.56641 14.9837 8.74129 15.1587 8.95703 15.1587H10.7945C11.0102 15.1587 11.1851 14.9837 11.1851 14.768V12.6641C11.1851 12.4483 11.0102 12.2734 10.7945 12.2734ZM10.4038 14.3774H9.34766V13.0547H10.4038V14.3774Z" fill="currentColor"/>
              <path d="M13.0728 5.01978C12.7536 4.76443 12.3872 4.57568 11.9835 4.45861C10.202 3.94346 8.23896 4.61154 7.50396 6.33584C7.43154 6.5058 7.48806 6.7033 7.63951 6.80916L9.08424 7.81908C9.26111 7.94267 9.50451 7.89955 9.62814 7.72279C9.69381 7.62896 9.76912 7.5208 9.85353 7.39881C9.99142 7.19982 10.1816 7.0499 10.397 6.94576C10.489 6.90123 10.5962 6.87959 10.7247 6.87959C10.9277 6.87959 11.1021 6.93791 11.2577 7.05779C11.3854 7.15627 11.4423 7.28365 11.4423 7.47084C11.4423 7.60982 11.4012 7.72803 11.3129 7.84279C10.9575 8.30463 10.4116 8.55889 9.86623 8.85221C9.58689 9.00271 9.35529 9.17463 9.17787 9.36326C8.99771 9.55474 8.85728 9.76459 8.76064 9.9867C8.66752 10.2002 8.60357 10.4253 8.57072 10.6556C8.54017 10.8694 8.52466 11.0956 8.52466 11.3281C8.52466 11.5438 8.69955 11.7187 8.91529 11.7187H10.7668C10.9825 11.7187 11.1574 11.5438 11.1574 11.3281C11.1574 11.2158 11.1831 11.1262 11.2361 11.054C11.3113 10.9515 11.415 10.8558 11.5446 10.7694C11.971 10.485 12.1675 10.4474 12.6908 10.0988C13.1681 9.79709 13.5367 9.43678 13.7863 9.02787C14.043 8.60728 14.1732 8.0881 14.1732 7.48482C14.1732 6.92166 14.0697 6.42881 13.8654 6.01959C13.6629 5.61494 13.3962 5.27853 13.0728 5.01978ZM13.1195 8.62096C12.9324 8.92744 12.6465 9.2033 12.2698 9.44084C12.2104 9.47803 12.018 9.61357 11.7039 9.77424C11.4899 9.88385 11.2904 10 11.1112 10.1195C10.9053 10.2567 10.7354 10.4158 10.6062 10.592C10.5289 10.6973 10.471 10.8128 10.4325 10.9376H9.32384C9.38525 10.2872 9.62193 9.87127 10.2365 9.54021C10.8783 9.19498 11.4781 8.9092 11.9322 8.3192C12.1255 8.06775 12.2235 7.78236 12.2235 7.47092C12.2235 7.0426 12.0545 6.68584 11.7346 6.43908C11.4411 6.21303 11.1014 6.09842 10.7247 6.09842C10.479 6.09842 10.2543 6.14693 10.0567 6.24256C9.47986 6.52142 9.24478 6.91709 9.21091 6.95451L8.36205 6.36111C8.56916 5.99974 8.85256 5.71349 9.22185 5.49123C9.98404 5.03264 10.9217 4.9649 11.7661 5.20908C12.0706 5.29736 12.3461 5.43892 12.5847 5.62986C12.8193 5.81756 13.0152 6.06631 13.1666 6.36892C13.3161 6.66849 13.392 7.04396 13.392 7.4849C13.392 7.94252 13.3003 8.32474 13.1195 8.62096Z" fill="currentColor"/>
              <path d="M10.5 1.32812C5.75047 1.32812 1.90625 5.17172 1.90625 9.92188C1.90625 11.5843 2.37914 13.1897 3.27582 14.5779L2.08254 18.1577C1.98266 18.4573 2.26367 18.7482 2.56801 18.6546L6.39953 17.4756C7.65207 18.1565 9.06594 18.5156 10.5 18.5156C15.2495 18.5156 19.0938 14.672 19.0938 9.92184C19.0938 5.17238 15.2502 1.32812 10.5 1.32812ZM10.5 17.7343C9.14422 17.7343 7.80855 17.3815 6.63734 16.7139C6.54387 16.6606 6.4323 16.6481 6.32902 16.6799L3.06375 17.6846L4.07715 14.6444C4.11562 14.529 4.09812 14.4023 4.02984 14.3016C3.15168 13.007 2.6875 11.4925 2.6875 9.92188C2.6875 5.61406 6.19219 2.10938 10.5 2.10938C14.8078 2.10938 18.3125 5.61406 18.3125 9.92188C18.3125 14.2296 14.8078 17.7343 10.5 17.7343Z" fill="currentColor"/>
            </svg> 
          </span>             
        </a>
        <a href="#" className="td_btn td_style_1 td_radius_10 td_medium td_fs_20 wow fadeInUp" data-wow-duration="0.9s" data-wow-delay="0.35s">
          <span className="td_btn_in td_white_color branddarkenglishta">
            <span>WhatsApp Us</span>
          <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_34_1694)">
            <path d="M2.80635 15.5992C2.13805 15.5992 1.48514 15.4286 0.893423 15.0964C0.588974 14.9396 0.471056 14.5473 0.652933 14.2522C1.25723 13.2866 1.47544 12.1062 1.19876 10.9962C0.911987 9.84535 0.497046 8.87611 0.500016 7.65782C0.510313 3.38361 4.06791 -0.0814611 8.33776 0.0014578C12.4619 0.0845253 15.8608 3.55138 15.8609 7.67663C15.8609 13.0643 10.2146 16.8469 5.22991 14.7664C4.54285 15.3057 3.67925 15.5992 2.80635 15.5992ZM1.99429 14.2838C2.93328 14.5754 3.98934 14.3424 4.71344 13.6424C4.89185 13.4699 5.15872 13.4265 5.38258 13.5335C9.65016 15.5739 14.6728 12.3758 14.6727 7.67663C14.6727 4.17008 11.8201 1.2599 8.31385 1.1893C4.70047 1.11752 1.69682 4.04399 1.68811 7.66069C1.68529 8.81785 2.13676 9.74263 2.38349 10.8388C2.64343 11.994 2.50651 13.2155 1.99429 14.2838Z" fill="currentColor"/>
            <path d="M18.193 20.0027C17.3201 20.0027 16.4565 19.7092 15.7695 19.17C13.1186 20.2763 9.96528 19.7725 7.79172 17.8954C7.5434 17.6809 7.51598 17.3059 7.73038 17.0575C7.94483 16.8092 8.31992 16.7817 8.56823 16.9962C10.496 18.661 13.3193 19.0355 15.6168 17.9371C15.8406 17.83 16.1074 17.8735 16.2859 18.046C17.01 18.746 18.0661 18.9791 19.0051 18.6873C18.4008 17.427 18.3171 15.9831 18.7854 14.6464C18.7896 14.6344 18.7942 14.6225 18.7991 14.6108C19.1411 13.8046 19.3134 12.9478 19.3113 12.0642C19.3075 10.5065 18.7893 9.06544 17.8126 7.89691C17.6022 7.64513 17.6358 7.27053 17.8875 7.06014C18.1392 6.8497 18.5139 6.88326 18.7242 7.13499C19.8646 8.49937 20.495 10.2489 20.4994 12.0614C20.5019 13.0995 20.3005 14.107 19.9008 15.0563C19.4809 16.2718 19.674 17.5732 20.3464 18.6557C20.5284 18.9508 20.4104 19.3431 20.1058 19.5C19.5142 19.8321 18.8612 20.0027 18.193 20.0027Z" fill="currentColor"/>
            <path d="M8.18217 8.64459C8.7013 8.64459 9.12215 8.22397 9.12215 7.70511C9.12215 7.18625 8.7013 6.76562 8.18217 6.76562C7.66303 6.76562 7.24219 7.18625 7.24219 7.70511C7.24219 8.22397 7.66303 8.64459 8.18217 8.64459Z" fill="currentColor"/>
            <path d="M4.71732 8.64459C5.23646 8.64459 5.6573 8.22397 5.6573 7.70511C5.6573 7.18625 5.23646 6.76562 4.71732 6.76562C4.19819 6.76562 3.77734 7.18625 3.77734 7.70511C3.77734 8.22397 4.19819 8.64459 4.71732 8.64459Z" fill="currentColor"/>
            <path d="M11.6431 8.64459C12.1622 8.64459 12.5831 8.22397 12.5831 7.70511C12.5831 7.18625 12.1622 6.76562 11.6431 6.76562C11.124 6.76562 10.7031 7.18625 10.7031 7.70511C10.7031 8.22397 11.124 8.64459 11.6431 8.64459Z" fill="currentColor"/>
            </g>
            <defs>
            <clipPath id="clip0_34_1694">
            <rect width="20" height="20" fill="currentColor" transform="translate(0.5)"/>
            </clipPath>
            </defs>
          </svg>
          </span>             
        </a>
      </div>
    </div>
    
    
    <section>
      <div className="td_height_120 td_height_lg_80"></div>
      <div className="td_about td_style_1">
        <div className="container">
          <div className="row align-items-center td_gap_y_40">
            <div className="col-lg-6 wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.25s">
              <div className="td_about_thumb_wrap">
                <div className="td_about_year text-uppercase td_fs_64 td_bold">ONLINE</div>
                <div className="td_about_thumb_1">
                  <img src="/assets/images/aboutenglishta.png" alt="Best English teaching academy in Nashik">
                </div>
              
                <a href="https://www.youtube.com/embed/rRid6GCJtgc" className="td_circle_text td_center td_video_open">
                  <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.086 8.63792C14.6603 9.03557 14.6603 9.88459 14.086 10.2822L2.54766 18.2711C1.88444 18.7303 0.978418 18.2557 0.978418 17.449L0.978418 1.47118C0.978418 0.664496 1.88444 0.189811 2.54767 0.649016L14.086 8.63792Z" fill="white"/>
                  </svg>   
                  <img src="https://picsum.photos/seed/englishta-3/900/600" alt="" className="">                 
                </a>
                <div className="td_circle_shape"></div>
              </div>
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
              <div className="td_section_heading td_style_1 td_mb_30">
                <p className="td_section_subtitle_up td_fs_18 td_semibold td_spacing_1 td_mb_10 text-uppercase td_accent_color">About us</p>
                <h2 className="td_section_title td_fs_48 mb-0">Best English Teaching Academy in Nashik for Spoken English and Confidence</h2>
                <p className="td_section_subtitle td_fs_18 mb-0">Englishta is a trusted English speaking academy in Nashik helping students, job seekers, and working professionals improve spoken English, interview communication, pronunciation, vocabulary, and daily fluency through practical online and guided learning sessions.</p>
              </div>
              <div className="td_mb_40">
                <ul className="td_list td_style_5 td_mp_0">
                  <li>
                    <h3 className="td_fs_24 td_mb_8">Spoken English Classes in Nashik</h3>
                    <p className="td_fs_18 mb-0">Build fluency, confidence, grammar accuracy, and real conversation skills with expert guidance.</p>
                  </li>
                  <li>
                    <h3 className="td_fs_24 td_mb_8">Interview and Professional English</h3>
                    <p className="td_fs_18 mb-0">Prepare for interviews, presentations, workplace communication, and public speaking with structured practice.</p>
                  </li>
                </ul>
              </div>
              <a href="/about-us" className="td_btn td_style_1 td_radius_10 td_medium">
                <span className="td_btn_in td_white_color td_accent_bg">
                  <span>Know More</span>
                  <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.1575 4.34302L3.84375 15.6567" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M15.157 11.4142C15.157 11.4142 16.0887 5.2748 15.157 4.34311C14.2253 3.41142 8.08594 4.34314 8.08594 4.34314" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg> 
                </span>             
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="td_height_120 td_height_lg_80"></div>
    </section>
    
    
    <section className="td_gray_bg_3">
      <div className="td_height_112 td_height_lg_75"></div>
      <div className="container">
        <div className="td_section_heading td_style_1 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.15s">
          <p className="td_section_subtitle_up td_fs_18 td_semibold td_spacing_1 td_mb_10 text-uppercase td_accent_color">Popular Courses</p>
          <h2 className="td_section_title td_fs_48 mb-0">English Speaking Courses</h2>
        </div>
        <div className="td_height_30 td_height_lg_30"></div>
        <div className="td_tabs">
          <ul className="td_tab_links td_style_1 td_mp_0 td_fs_20 td_medium td_heading_color wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
            <li className="active"><a href="#tab_1">Speaking</a></li>
            <li><a href="#tab_2">Interview</a></li>
            <li><a href="#tab_3">Online</a></li>
            <li><a href="#tab_4">Weekend Batch</a></li>
          </ul>
          <div className="td_height_50 td_height_lg_50"></div>
          <div className="td_tab_body">
            <div className="td_tab active" id="tab_1">
              <div className="row td_gap_y_24">
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-4/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-5/900/600" alt="">
                            <span className="td_opacity_7">Live Batch</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-6/900/600" alt="">
                            <span className="td_opacity_7">8 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Data Analytics</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Starting Reputed Education & Build your Skills</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Build fluency with practical online speaking practice, trainer feedback, and simple daily exercises.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="4.5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/5 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.25s">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-7/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-8/900/600" alt="">
                            <span className="td_opacity_7">Small Group</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-9/900/600" alt="">
                            <span className="td_opacity_7">10 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Software Engeneer</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Master Technology & Elevate Your Career</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Unlock the power of technology to drive your career forward.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/10 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-10/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-11/900/600" alt="">
                            <span className="td_opacity_7">Online Mode</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-12/900/600" alt="">
                            <span className="td_opacity_7">6 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Bachelor Of Arts</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Boost Creativity & Expand Your Horizons</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Discover innovative techniques to enhance your creative thinking.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/12 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-13/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-14/900/600" alt="">
                            <span className="td_opacity_7">Practice Led</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-15/900/600" alt="">
                            <span className="td_opacity_7">8 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Business Administrator</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Hone Leadership & Achieve Success</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Develop essential leadership skills to excel in any industry.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="4">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/30 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.25s">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-16/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-17/900/600" alt="">
                            <span className="td_opacity_7">1:1 Option</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-18/900/600" alt="">
                            <span className="td_opacity_7">8 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Fine of Arts</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Learn Coding & Advance Your Skills Up</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Practice useful English for daily conversations, interviews, meetings, and public speaking.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="4.5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/5 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-19/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-20/900/600" alt="">
                            <span className="td_opacity_7">Weekend Batch</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-21/900/600" alt="">
                            <span className="td_opacity_7">8 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Computer Science</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Explore Marketing & Build Your Brand</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Master marketing strategies to grow your personal or business brand.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="4.5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/15 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="td_tab" id="tab_2">
              <div className="row td_gap_y_24">
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-22/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-23/900/600" alt="">
                            <span className="td_opacity_7">Online Mode</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-24/900/600" alt="">
                            <span className="td_opacity_7">6 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Bachelor Of Arts</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Boost Creativity & Expand Your Horizons</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Discover innovative techniques to enhance your creative thinking.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/12 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-25/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-26/900/600" alt="">
                            <span className="td_opacity_7">Practice Led</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-27/900/600" alt="">
                            <span className="td_opacity_7">8 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Business Administrator</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Hone Leadership & Achieve Success</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Develop essential leadership skills to excel in any industry.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="4">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/30 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-28/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-29/900/600" alt="">
                            <span className="td_opacity_7">Live Batch</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-30/900/600" alt="">
                            <span className="td_opacity_7">8 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Data Analytics</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Starting Reputed Education & Build your Skills</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Build fluency with practical online speaking practice, trainer feedback, and simple daily exercises.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="4.5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/5 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-31/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-32/900/600" alt="">
                            <span className="td_opacity_7">Small Group</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-33/900/600" alt="">
                            <span className="td_opacity_7">10 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Software Engeneer</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Master Technology & Elevate Your Career</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Unlock the power of technology to drive your career forward.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/10 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-34/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-35/900/600" alt="">
                            <span className="td_opacity_7">1:1 Option</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-36/900/600" alt="">
                            <span className="td_opacity_7">8 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Fine of Arts</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Learn Coding & Advance Your Skills Up</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Practice useful English for daily conversations, interviews, meetings, and public speaking.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="4.5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/5 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-37/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-38/900/600" alt="">
                            <span className="td_opacity_7">Weekend Batch</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-39/900/600" alt="">
                            <span className="td_opacity_7">8 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Computer Science</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Explore Marketing & Build Your Brand</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Master marketing strategies to grow your personal or business brand.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="4.5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/15 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="td_tab" id="tab_3">
              <div className="row td_gap_y_24">
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-40/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-41/900/600" alt="">
                            <span className="td_opacity_7">Practice Led</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-42/900/600" alt="">
                            <span className="td_opacity_7">8 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Business Administrator</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Hone Leadership & Achieve Success</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Develop essential leadership skills to excel in any industry.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="4">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/30 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-43/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-44/900/600" alt="">
                            <span className="td_opacity_7">1:1 Option</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-45/900/600" alt="">
                            <span className="td_opacity_7">8 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Fine of Arts</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Learn Coding & Advance Your Skills Up</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Practice useful English for daily conversations, interviews, meetings, and public speaking.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="4.5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/5 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-46/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-47/900/600" alt="">
                            <span className="td_opacity_7">Weekend Batch</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-48/900/600" alt="">
                            <span className="td_opacity_7">8 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Computer Science</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Explore Marketing & Build Your Brand</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Master marketing strategies to grow your personal or business brand.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="4.5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/15 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-49/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-50/900/600" alt="">
                            <span className="td_opacity_7">Live Batch</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-51/900/600" alt="">
                            <span className="td_opacity_7">8 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Data Analytics</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Starting Reputed Education & Build your Skills</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Build fluency with practical online speaking practice, trainer feedback, and simple daily exercises.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="4.5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/5 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-52/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-53/900/600" alt="">
                            <span className="td_opacity_7">Small Group</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-54/900/600" alt="">
                            <span className="td_opacity_7">10 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Software Engeneer</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Master Technology & Elevate Your Career</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Unlock the power of technology to drive your career forward.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/10 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-55/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-56/900/600" alt="">
                            <span className="td_opacity_7">Online Mode</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-57/900/600" alt="">
                            <span className="td_opacity_7">6 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Bachelor Of Arts</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Boost Creativity & Expand Your Horizons</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Discover innovative techniques to enhance your creative thinking.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/12 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="td_tab" id="tab_4">
              <div className="row td_gap_y_24">
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-58/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-59/900/600" alt="">
                            <span className="td_opacity_7">Weekend Batch</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-60/900/600" alt="">
                            <span className="td_opacity_7">8 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Computer Science</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Explore Marketing & Build Your Brand</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Master marketing strategies to grow your personal or business brand.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="4.5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/15 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-61/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-62/900/600" alt="">
                            <span className="td_opacity_7">Practice Led</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-63/900/600" alt="">
                            <span className="td_opacity_7">8 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Business Administrator</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Hone Leadership & Achieve Success</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Develop essential leadership skills to excel in any industry.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="4">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/30 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-64/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-65/900/600" alt="">
                            <span className="td_opacity_7">Live Batch</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-66/900/600" alt="">
                            <span className="td_opacity_7">8 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Data Analytics</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Starting Reputed Education & Build your Skills</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Build fluency with practical online speaking practice, trainer feedback, and simple daily exercises.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="4.5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/5 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-67/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-68/900/600" alt="">
                            <span className="td_opacity_7">Small Group</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-69/900/600" alt="">
                            <span className="td_opacity_7">10 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Software Engeneer</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Master Technology & Elevate Your Career</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Unlock the power of technology to drive your career forward.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/10 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-70/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-71/900/600" alt="">
                            <span className="td_opacity_7">Online Mode</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-72/900/600" alt="">
                            <span className="td_opacity_7">6 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Bachelor Of Arts</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Boost Creativity & Expand Your Horizons</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Discover innovative techniques to enhance your creative thinking.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/12 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="td_card td_style_3 d-block td_radius_10">
                    <a href="course-details.html" className="td_card_thumb">
                      <img src="https://picsum.photos/seed/englishta-73/900/600" alt="">
                    </a>
                    <div className="td_card_info td_white_bg">
                      <div className="td_card_info_in">
                        <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                          <li>
                            <img src="https://picsum.photos/seed/englishta-74/900/600" alt="">
                            <span className="td_opacity_7">1:1 Option</span>
                          </li>
                          <li>
                            <img src="https://picsum.photos/seed/englishta-75/900/600" alt="">
                            <span className="td_opacity_7">8 Weeks</span>
                          </li>
                        </ul>
                        <a href="courses-grid-with-sidebar.html" className="td_card_category td_fs_14 td_bold td_heading_color td_mb_14"><span>Fine of Arts</span></a>
                        <h2 className="td_card_title td_fs_24 td_mb_16"><a href="course-details.html">Learn Coding & Advance Your Skills Up</a></h2>
                        <p className="td_card_subtitle td_heading_color td_opacity_7 td_mb_20">Practice useful English for daily conversations, interviews, meetings, and public speaking.</p>
                        <div className="td_card_review">
                          <div className="td_rating" data-rating="4.5">
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <div className="td_rating_percentage">
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                              <i className="fa-solid fa-star fa-fw"></i>
                            </div>
                          </div>
                          <span className="td_heading_color td_opacity_5 td_medium">(5.0/5 Ratings)</span>
                        </div>
                        <div className="td_card_btn">
                          <a href="cart.html" className="td_btn td_style_1 td_radius_10 td_medium">
                            <span className="td_btn_in td_white_color td_accent_bg">
                              <span>Enroll Now</span>
                            </span>             
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="td_height_120 td_height_lg_80"></div>
    </section>
    
    
    <section>
      <div className="td_height_120 td_height_lg_80"></div>
      <div className="container">
        <div className="td_features td_style_1 td_hobble">
          <div className="td_features_thumb">
            <img src="https://picsum.photos/seed/englishta-76/900/600" alt="" className="td_radius_10 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
          </div>
          <div className="td_features_content td_white_bg td_radius_10 wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.25s">
            <div className="td_section_heading td_style_1">
              <p className="td_section_subtitle_up td_fs_18 td_semibold td_spacing_1 td_mb_10 text-uppercase td_accent_color">CAMPUS</p>
              <h2 className="td_section_title td_fs_48 mb-0">Learn English From Anywhere</h2>
            </div>
            <div className="td_height_50 td_height_lg_50"></div>
            <ul className="td_feature_list td_mp_0">
              <li>
                <div className="td_feature_icon td_center">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.0428 10.319C24.1549 8.21279 27.016 7.03003 29.9988 7.03003C32.9816 7.03003 35.8427 8.21279 37.9548 10.319C38.2209 10.5706 38.5746 10.7084 38.9408 10.7032C39.3069 10.6981 39.6566 10.5503 39.9155 10.2913C40.1744 10.0323 40.322 9.68251 40.327 9.31635C40.332 8.9502 40.194 8.59653 39.9423 8.33056C37.3026 5.69746 33.7263 4.21875 29.9979 4.21875C26.2694 4.21875 22.6932 5.69746 20.0534 8.33056C19.9169 8.45969 19.8075 8.61489 19.732 8.78699C19.6564 8.95909 19.6161 9.14459 19.6134 9.33254C19.6108 9.52048 19.6458 9.70705 19.7165 9.88122C19.7872 10.0554 19.892 10.2136 20.0249 10.3466C20.1578 10.4795 20.316 10.5844 20.4901 10.6552C20.6643 10.726 20.8508 10.7611 21.0388 10.7585C21.2267 10.756 21.4122 10.7157 21.5844 10.6403C21.7565 10.5648 21.9136 10.4555 22.0428 10.319Z" fill="#890C25"/>
                    <path d="M34.9708 14.7094C35.2487 14.7092 35.5204 14.6266 35.7514 14.472C35.9824 14.3175 36.1625 14.098 36.2688 13.8412C36.3752 13.5844 36.403 13.3018 36.3488 13.0292C36.2947 12.7565 36.161 12.5061 35.9645 12.3094C35.1835 11.5252 34.2549 10.9036 33.2322 10.4804C32.2095 10.0572 31.1131 9.8408 30.0063 9.8438H29.9975C28.8898 9.83989 27.7923 10.0558 26.7687 10.479C25.745 10.9023 24.8154 11.5244 24.0339 12.3094C23.8973 12.4386 23.788 12.5938 23.7124 12.7659C23.6369 12.938 23.5965 13.1235 23.5939 13.3114C23.5912 13.4993 23.6263 13.6859 23.697 13.8601C23.7676 14.0343 23.8725 14.1925 24.0054 14.3254C24.1383 14.4584 24.2965 14.5633 24.4706 14.6341C24.6447 14.7048 24.8313 14.74 25.0192 14.7374C25.2072 14.7348 25.3927 14.6946 25.5648 14.6191C25.737 14.5436 25.8922 14.4344 26.0214 14.2979C26.5426 13.775 27.1622 13.3608 27.8445 13.079C28.5268 12.7972 29.2582 12.6536 29.9964 12.6563H30.002C30.7399 12.654 31.4709 12.7979 32.1529 13.0797C32.8348 13.3614 33.4543 13.7754 33.9753 14.2979C34.1059 14.4288 34.261 14.5326 34.4319 14.6032C34.6028 14.6738 34.7859 14.7099 34.9708 14.7094Z" fill="#890C25"/>
                    <path d="M32.4 39.3175C32.1698 39.0876 31.867 38.9446 31.5432 38.9129C31.2194 38.8813 30.8946 38.9628 30.6242 39.1438C30.3538 39.3247 30.1545 39.5938 30.0603 39.9053C29.966 40.2167 29.9827 40.5511 30.1074 40.8516C30.2322 41.1521 30.4573 41.4001 30.7443 41.5532C31.0314 41.7064 31.3627 41.7552 31.6817 41.6915C32.0008 41.6278 32.2879 41.4554 32.4941 41.2037C32.7002 40.952 32.8128 40.6366 32.8125 40.3113C32.8125 40.1266 32.7761 39.9438 32.7053 39.7733C32.6345 39.6028 32.5308 39.4479 32.4 39.3175Z" fill="#890C25"/>
                    <path d="M52.5 24.8438H44.5312V55.7812H52.5C53.369 55.7771 54.2012 55.4301 54.8156 54.8156C55.4301 54.2012 55.7771 53.369 55.7812 52.5V28.125C55.7771 27.256 55.4301 26.4238 54.8156 25.8094C54.2012 25.1949 53.369 24.8479 52.5 24.8438ZM4.21875 28.125V52.5C4.22289 53.369 4.56992 54.2012 5.18438 54.8156C5.79884 55.4301 6.63103 55.7771 7.5 55.7812H41.7188V24.8438H7.5C6.63103 24.8479 5.79884 25.1949 5.18438 25.8094C4.56992 26.4238 4.22289 27.256 4.21875 28.125ZM13.125 37.5C13.125 37.127 13.2732 36.7694 13.5369 36.5056C13.8006 36.2419 14.1583 36.0938 14.5312 36.0938C14.9042 36.0938 15.2619 36.2419 15.5256 36.5056C15.7893 36.7694 15.9375 37.127 15.9375 37.5V38.9062H18.75V37.5C18.75 37.127 18.8982 36.7694 19.1619 36.5056C19.4256 36.2419 19.7833 36.0938 20.1562 36.0938C20.5292 36.0938 20.8869 36.2419 21.1506 36.5056C21.4143 36.7694 21.5625 37.127 21.5625 37.5V38.9062H27.45C27.6816 38.2324 28.0816 37.6289 28.6118 37.1529C29.1421 36.6769 29.7852 36.3443 30.4801 36.1865C31.175 36.0288 31.8986 36.0511 32.5825 36.2515C33.2663 36.4518 33.8876 36.8235 34.3875 37.3312C34.7798 37.7223 35.091 38.187 35.3034 38.6986C35.5157 39.2101 35.625 39.7586 35.625 40.3125C35.625 40.8664 35.5157 41.4149 35.3034 41.9264C35.091 42.438 34.7798 42.9027 34.3875 43.2938C33.8876 43.8015 33.2663 44.1732 32.5825 44.3735C31.8986 44.5739 31.175 44.5962 30.4801 44.4385C29.7852 44.2807 29.1421 43.9481 28.6118 43.4721C28.0816 42.9961 27.6816 42.3926 27.45 41.7188H14.5312C14.1591 41.7161 13.803 41.567 13.5399 41.3039C13.2767 41.0407 13.1277 40.6846 13.125 40.3125V37.5Z" fill="#890C25"/>
                    <path d="M30.0078 21.1094C31.5611 21.1094 32.8203 19.8502 32.8203 18.2969C32.8203 16.7436 31.5611 15.4844 30.0078 15.4844C28.4545 15.4844 27.1953 16.7436 27.1953 18.2969C27.1953 19.8502 28.4545 21.1094 30.0078 21.1094Z" fill="#890C25"/>
                  </svg>                    
                </div>
                <div className="td_feature_info">
                  <h3 className="td_fs_32 td_semibold td_mb_15">Live Online Classes</h3>
                  <p className="td_fs_14 td_heading_color td_opacity_7 mb-0">Learn from home with live guidance, speaking tasks, and clear correction.</p>
                </div>
              </li>
              <li>
                <div className="td_feature_icon td_center">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_34_2108)">
                    <path d="M23.6914 57.3692C23.6914 58.8245 24.8712 60.0043 26.3265 60.0043C27.7814 60.0043 28.9617 58.8245 28.9617 57.3692V43H23.6914V57.3692Z" fill="#890C25"/>
                    <path d="M29.8398 57.3692C29.8398 58.8245 31.0193 60.0043 32.475 60.0043C33.9293 60.0043 35.1101 58.8245 35.1101 57.3692V43H29.8398V57.3692Z" fill="#890C25"/>
                    <path d="M34.9213 6.95278C35.6315 3.90571 33.7371 0.8599 30.6902 0.149783C27.6433 -0.560334 24.5976 1.33415 23.8874 4.38122C23.1773 7.4283 25.0716 10.4741 28.1185 11.1842C31.1655 11.8943 34.2112 9.99986 34.9213 6.95278Z" fill="#890C25"/>
                    <path d="M40.8184 42.4745L38.7032 31.5866L31.8671 34.6176L30.509 31.5545L27.9579 32.6857L25.0521 26.1316C23.5757 26.0009 22.3411 25.7569 21.2997 25.3906L17.9805 42.4745H40.8184Z" fill="#890C25"/>
                    <path d="M33.0859 21.0816L35.4399 26.3904C36.1643 25.8502 36.7525 25.2992 37.1902 24.7545L35.155 20.1641L33.0859 21.0816Z" fill="#890C25"/>
                    <path d="M32.1366 33.9175L39.7574 30.5385L39.1414 29.1484C38.2409 29.9387 37.1721 30.6908 35.9059 31.4149C35.5671 31.6078 35.1839 31.7098 34.7963 31.7098C33.9933 31.7098 33.2471 31.276 32.8497 30.5785C32.8397 30.5609 32.832 30.5422 32.8223 30.5245L30.9922 31.3361L32.1366 33.9175Z" fill="#890C25"/>
                    <path d="M32.6289 30.0346C32.5306 29.6599 32.529 29.2641 32.6339 28.8802C32.792 28.3028 33.1654 27.8208 33.6856 27.5247C34.1588 27.2551 34.596 26.9781 35.0024 26.6975L31.2465 18.2266L23.9453 21.4638C24.4887 21.569 25.138 21.6544 25.8937 21.7015C26.4919 21.7403 27.0382 22.0104 27.4327 22.4599C27.8274 22.91 28.0229 23.4863 27.9834 24.0837C27.9059 25.2571 26.9249 26.1757 25.7501 26.1757C25.7172 26.1757 25.6837 26.1744 25.6502 26.1731L28.2277 31.9859L32.6289 30.0346Z" fill="#890C25"/>
                    <path d="M20.0655 16.1482C19.4881 16.7482 18.9716 17.4096 18.5748 18.1461C18.1813 18.8816 17.8944 19.7069 17.8907 20.6295C17.8872 21.3078 18.0672 22.0345 18.4525 22.6678C19.0341 23.6288 19.9877 24.3121 21.1611 24.7751C22.3454 25.2407 23.7981 25.5224 25.6348 25.6449C25.673 25.6476 25.711 25.6489 25.7489 25.6489C26.6435 25.6489 27.3967 24.9537 27.4565 24.0486C27.5187 23.1044 26.8032 22.2891 25.8596 22.2272C23.7286 22.0938 22.4292 21.6775 21.8505 21.312C21.5562 21.131 21.4402 20.9871 21.387 20.8993C21.3359 20.8087 21.32 20.757 21.3171 20.6297C21.3135 20.4643 21.3828 20.1528 21.592 19.7681C21.7957 19.3865 22.1251 18.9469 22.5272 18.5306C22.5285 18.529 22.5301 18.528 22.5314 18.5264C22.8289 18.217 23.166 17.9206 23.5133 17.6552C23.4477 18.119 23.2413 18.5496 22.9101 18.8929C22.7451 19.0632 22.5957 19.2376 22.4613 19.4099L22.1738 20.8904C22.3807 21.0124 22.6893 21.1412 23.0998 21.2614L31.5133 17.5303L32.8717 20.5939L35.4225 19.4626L37.0713 23.1814L36.0834 18.0958C36.3034 18.2695 36.5198 18.4571 36.7288 18.6537C36.9891 18.8987 37.236 19.1593 37.4595 19.4308C37.7393 19.771 37.9833 20.1267 38.167 20.4898L38.1675 20.4903C38.503 21.1288 38.6803 21.7644 38.6803 22.3998C38.6748 23.1347 38.4635 23.9155 37.772 24.8639C37.0795 25.8044 35.8734 26.8832 33.9458 27.982C33.1239 28.4508 32.8377 29.4967 33.3068 30.3181C33.6227 30.8725 34.2011 31.1827 34.7959 31.1827C35.0839 31.1827 35.3756 31.1102 35.6436 30.9574C37.8642 29.6888 39.4577 28.3444 40.5276 26.898C41.5982 25.4589 42.1121 23.8878 42.106 22.3998C42.106 21.1201 41.7453 19.9362 41.2048 18.9079C41.2019 18.9024 41.1998 18.8969 41.1974 18.8916C40.9426 18.4128 40.6488 17.9675 40.3307 17.549C39.5159 16.4755 38.5286 15.5951 37.5341 14.9089C36.9585 14.5149 36.3801 14.1897 35.8112 13.931C35.6937 13.8775 35.5756 13.8227 35.4591 13.7752C35.0539 13.6147 34.6618 13.4848 34.258 13.4026C33.3178 13.1225 31.7043 12.7812 29.3999 12.7812C27.9411 12.7812 26.7571 12.9183 25.8459 13.0898C25.8338 13.0896 25.8219 13.088 25.8098 13.088V13.0875C24.7781 13.1059 23.888 13.4524 22.9897 13.9278C22.9201 13.9647 22.8508 14.0005 22.781 14.0387C22.2479 14.341 21.7219 14.6996 21.2183 15.1023C20.8165 15.424 20.4288 15.7729 20.066 16.1487V16.1482H20.0655Z" fill="#890C25"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_34_2108">
                    <rect width="60" height="60" fill="white"/>
                    </clipPath>
                    </defs>
                  </svg>                                      
                </div>
                <div className="td_feature_info">
                  <h3 className="td_fs_32 td_semibold td_mb_15">Daily Speaking Practice</h3>
                  <p className="td_fs_14 td_heading_color td_opacity_7 mb-0">Learn from home with live guidance, speaking tasks, and clear correction.</p>
                </div>
              </li>
              <li>
                <div className="td_feature_icon td_center">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M57.4219 23.625C57.0163 22.7274 56.5648 21.8513 56.0694 21L49.6869 38.3375C49.4435 38.9853 49.0895 39.5858 48.6406 40.1125C50.3538 39.9429 52.0048 39.3799 53.4646 38.4674C54.9245 37.5549 56.1539 36.3175 57.0569 34.8518C57.96 33.386 58.5123 31.7315 58.6707 30.0172C58.8292 28.3029 58.5896 26.5752 57.9706 24.9688C57.8006 24.5113 57.6181 24.0663 57.4219 23.625Z" fill="#890C25"/>
                    <path d="M20.7886 7.99641C17.0644 9.32208 13.6459 11.3856 10.7379 14.0633C7.82987 16.7411 5.49203 19.9781 3.86434 23.5806C2.23665 27.1831 1.35257 31.0769 1.26502 35.0291C1.17747 38.9812 1.88826 42.9104 3.35483 46.5814C3.39358 46.6602 3.41983 46.7377 3.45858 46.8164C4.23772 48.6771 5.50623 50.292 7.1294 51.4896C8.75258 52.6873 10.6698 53.423 12.6775 53.6186C14.6852 53.8142 16.7084 53.4624 18.5322 52.6006C20.356 51.7388 21.9124 50.3992 23.0361 48.7239C25.3862 45.1838 28.76 42.4445 32.7073 40.8714C32.8323 40.8214 32.9573 40.7839 33.0823 40.7377C33.5267 39.7124 34.1881 38.7956 35.0208 38.0505C35.8536 37.3054 36.8379 36.7496 37.9061 36.4214C37.8801 35.48 38.0731 34.5455 38.4698 33.6914L48.3448 12.3077C44.4659 9.36724 39.9185 7.43436 35.1096 6.68199C30.3007 5.92961 25.3802 6.38123 20.7886 7.99641ZM13.1261 40.6214C12.1372 40.6214 11.1705 40.3282 10.3482 39.7788C9.52598 39.2294 8.88512 38.4485 8.50668 37.5348C8.12824 36.6212 8.02923 35.6159 8.22215 34.646C8.41508 33.6761 8.89128 32.7851 9.59055 32.0859C10.2898 31.3866 11.1807 30.9104 12.1506 30.7175C13.1205 30.5246 14.1259 30.6236 15.0395 31.002C15.9531 31.3805 16.734 32.0213 17.2834 32.8436C17.8328 33.6658 18.1261 34.6325 18.1261 35.6214C18.1261 36.9475 17.5993 38.2193 16.6616 39.1569C15.7239 40.0946 14.4522 40.6214 13.1261 40.6214ZM19.3761 26.2464C18.3872 26.2464 17.4205 25.9532 16.5982 25.4038C15.776 24.8544 15.1351 24.0735 14.7567 23.1598C14.3782 22.2462 14.2792 21.2409 14.4722 20.271C14.6651 19.3011 15.1413 18.4101 15.8405 17.7109C16.5398 17.0116 17.4307 16.5354 18.4006 16.3425C19.3705 16.1496 20.3759 16.2486 21.2895 16.627C22.2031 17.0054 22.984 17.6463 23.5334 18.4686C24.0828 19.2908 24.3761 20.2575 24.3761 21.2464C24.3761 22.5725 23.8493 23.8443 22.9116 24.7819C21.9739 25.7196 20.7022 26.2464 19.3761 26.2464ZM34.3761 21.8714C33.3872 21.8714 32.4205 21.5782 31.5982 21.0288C30.776 20.4794 30.1351 19.6985 29.7567 18.7848C29.3782 17.8712 29.2792 16.8659 29.4722 15.896C29.6651 14.9261 30.1413 14.0351 30.8405 13.3359C31.5398 12.6366 32.4307 12.1604 33.4006 11.9675C34.3705 11.7746 35.3759 11.8736 36.2895 12.252C37.2031 12.6304 37.984 13.2713 38.5334 14.0936C39.0828 14.9158 39.3761 15.8825 39.3761 16.8714C39.3761 18.1975 38.8493 19.4693 37.9116 20.4069C36.9739 21.3446 35.7022 21.8714 34.3761 21.8714Z" fill="#890C25"/>
                    <path d="M56.8494 5.18546C56.2948 4.9551 55.6725 4.94854 55.1131 5.16716C54.5537 5.38577 54.1008 5.81256 53.8494 6.35796L40.7444 34.7392C40.4426 35.3921 40.345 36.1208 40.4643 36.8301C40.5837 37.5393 40.9144 38.196 41.4131 38.7142C40.1949 38.4285 38.9148 38.5847 37.801 39.1549C36.6872 39.7252 35.8122 40.6725 35.3319 41.828C33.3081 46.7155 36.5094 48.8592 34.4844 53.7467C36.7929 53.4888 38.992 52.6243 40.8582 51.2412C42.7244 49.858 44.1911 48.0054 45.1094 45.8717C45.5417 44.821 45.6232 43.6588 45.3416 42.5581C45.0601 41.4574 44.4306 40.477 43.5469 39.763C44.3461 39.866 45.1566 39.695 45.8461 39.2779C46.5356 38.8609 47.0633 38.2224 47.3431 37.4667L58.1431 8.12796C58.3482 7.56529 58.3281 6.94516 58.0871 6.39693C57.846 5.8487 57.4026 5.4147 56.8494 5.18546Z" fill="#890C25"/>
                  </svg>              
                </div>
                <div className="td_feature_info">
                  <h3 className="td_fs_32 td_semibold td_mb_15">Personal Feedback</h3>
                  <p className="td_fs_14 td_heading_color td_opacity_7 mb-0">Learn from home with live guidance, speaking tasks, and clear correction.</p>
                </div>
              </li>
              <li>
                <div className="td_feature_icon td_center">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.32422 50.5922C8.31795 52.4224 10.8098 53.62 13.4844 54.0336C13.7762 52.5659 13.7222 51.0504 13.3268 49.6072C12.9313 48.164 12.2053 46.8327 11.2061 45.7188L6.32422 50.5922Z" fill="#890C25"/>
                    <path d="M31.5345 48.5391C30.7481 48.5391 29.9794 48.7723 29.3256 49.2092C28.6717 49.6461 28.1621 50.2671 27.8612 50.9936C27.5603 51.7202 27.4816 52.5196 27.635 53.2909C27.7884 54.0621 28.1671 54.7706 28.7232 55.3267C29.2793 55.8827 29.9877 56.2614 30.759 56.4148C31.5303 56.5682 32.3297 56.4894 33.0562 56.1885C33.7828 55.8876 34.4037 55.3779 34.8406 54.7241C35.2775 54.0702 35.5107 53.3015 35.5107 52.5151C35.5095 51.4609 35.0902 50.4503 34.3448 49.7049C33.5994 48.9595 32.5887 48.5402 31.5345 48.5391Z" fill="#890C25"/>
                    <path d="M29.3315 39.506C28.6684 39.6288 27.9955 39.6908 27.3211 39.6911C24.6344 39.6913 22.0436 38.6932 20.0514 36.8906L16.4492 40.4865L25.7451 49.766C28.0815 47.2418 29.3753 43.9263 29.3662 40.4868C29.3663 40.1579 29.3547 39.831 29.3315 39.506Z" fill="#890C25"/>
                    <path d="M12.0352 44.8899C13.1482 46.135 13.9624 47.6176 14.4157 49.2249C14.8691 50.8323 14.9497 52.5219 14.6514 54.165C16.5151 54.2987 18.3865 54.0507 20.1511 53.4363C21.9157 52.8219 23.5364 51.8539 24.9141 50.5916L15.6183 41.3125L12.0352 44.8899Z" fill="#890C25"/>
                    <path d="M40.3103 54.5497C40.2757 54.5734 40.2462 54.6038 40.2233 54.639C40.2005 54.6742 40.1848 54.7135 40.1772 54.7547C40.1696 54.796 40.1702 54.8383 40.1789 54.8794C40.1877 54.9204 40.2044 54.9593 40.2283 54.9938C40.5291 55.428 40.9897 55.7253 41.5093 55.8208C42.0288 55.9163 42.565 55.8021 43.0006 55.5032L44.8497 54.2318C45.1011 54.058 45.3093 53.8287 45.458 53.5617L43.3825 52.4375L40.3103 54.5497Z" fill="#890C25"/>
                    <path d="M42.2249 51.8087L38.8711 49.9922L40.8005 52.7882L42.2249 51.8087Z" fill="#890C25"/>
                    <path d="M51.5844 36.9049L38.1839 37.7702L37.5781 40.5944L50.9766 41.5781C51.3339 41.6031 51.6898 41.5134 51.9925 41.322L55.4751 39.1021L53.098 37.3417C52.6623 37.0191 52.125 36.864 51.5844 36.9049Z" fill="#890C25"/>
                    <path d="M54.2335 10.1043C53.6556 9.0033 52.7822 8.08522 51.7115 7.45312L50.8516 9.31523L53.9413 10.7367L54.2335 10.1043Z" fill="#890C25"/>
                    <path d="M49.4009 49.1082L36.7344 44.5156L36.1602 47.1932L47.9315 53.5692C48.4402 53.8456 49.0359 53.9154 49.5948 53.7641L52.4995 52.9823L50.1917 49.7116C49.9964 49.434 49.7203 49.2233 49.4009 49.1082Z" fill="#890C25"/>
                    <path d="M51.0935 42.7535C51.0254 42.7535 50.9574 42.751 50.8895 42.7461L37.3287 41.75L36.9844 43.3555L49.8025 48.0029C49.9272 48.0485 50.0486 48.1028 50.1657 48.1653L55.0011 46.1221L51.5186 42.7203C51.3779 42.742 51.2358 42.7531 51.0935 42.7535Z" fill="#890C25"/>
                    <path d="M33.3359 46.4297L35.2889 37.2907L37.0059 37.6577L35.0529 46.7966L33.3359 46.4297Z" fill="#890C25"/>
                    <path d="M38.8763 36.549L41.2046 31.5062C40.8458 31.3904 40.4942 31.2534 40.1516 31.0961C39.8089 30.9376 39.4757 30.7594 39.1536 30.5625L36.4805 36.3516L37.7461 36.622L38.8763 36.549Z" fill="#890C25"/>
                    <path d="M32.5166 35.9886L32.3603 35.7619C31.7642 34.8994 31.5088 33.8468 31.6431 32.807C31.7405 32.0541 31.5555 31.2918 31.1237 30.6673L15.6655 8.2675C15.1809 7.56833 14.4391 7.08952 13.6024 6.9358C12.7657 6.78207 11.9022 6.96594 11.2007 7.44719C10.8539 7.68536 10.5574 7.98959 10.3283 8.34249C10.0992 8.69538 9.94202 9.08999 9.86565 9.50373C9.78928 9.91747 9.79526 10.3422 9.88327 10.7536C9.97127 11.1651 10.1396 11.5551 10.3785 11.9014L20.3629 26.3686C22.7838 27.1777 24.9566 28.5947 26.673 30.484C28.3894 32.3733 29.5921 34.6716 30.1658 37.1589C30.8202 36.5502 31.6366 36.1438 32.5166 35.9886ZM12.4192 10.8712C12.3552 10.9138 12.2833 10.9434 12.2078 10.9583C12.1323 10.9732 12.0547 10.9731 11.9792 10.9579C11.9038 10.9428 11.832 10.913 11.7681 10.8701C11.7042 10.8272 11.6494 10.7722 11.6067 10.7082L11.4734 10.507C11.4307 10.4429 11.4011 10.3711 11.3862 10.2956C11.3714 10.2201 11.3715 10.1424 11.3866 10.067C11.4018 9.99152 11.4316 9.91979 11.4745 9.85589C11.5173 9.79198 11.5723 9.73714 11.6364 9.69449C11.7004 9.65185 11.7723 9.62224 11.8478 9.60735C11.9233 9.59246 12.0009 9.59259 12.0764 9.60773C12.1518 9.62287 12.2236 9.65271 12.2875 9.69557C12.3514 9.73843 12.4062 9.79345 12.4489 9.8575L12.5827 10.0587C12.6253 10.1228 12.6549 10.1946 12.6697 10.2701C12.6846 10.3457 12.6844 10.4234 12.6692 10.4988C12.6541 10.5743 12.6242 10.646 12.5813 10.7099C12.5384 10.7738 12.4833 10.8286 12.4192 10.8712ZM18.6184 20.1843C18.5544 20.2269 18.4826 20.2566 18.4071 20.2714C18.3316 20.2863 18.2539 20.2862 18.1784 20.2711C18.103 20.2559 18.0313 20.2261 17.9674 20.1832C17.9034 20.1404 17.8486 20.0853 17.806 20.0213L12.7944 12.4926C12.7505 12.4286 12.7198 12.3564 12.704 12.2804C12.6882 12.2044 12.6876 12.126 12.7024 12.0498C12.7171 11.9736 12.7469 11.9011 12.7899 11.8365C12.8329 11.7718 12.8884 11.7164 12.953 11.6734C13.0176 11.6304 13.0902 11.6006 13.1664 11.5859C13.2426 11.5712 13.321 11.5717 13.397 11.5875C13.473 11.6033 13.5451 11.6341 13.6091 11.678C13.6732 11.7219 13.7278 11.7781 13.7699 11.8434L18.7815 19.372C18.8676 19.5013 18.8989 19.6595 18.8683 19.8119C18.8378 19.9642 18.748 20.0982 18.6187 20.1843H18.6184Z" fill="#890C25"/>
                    <path d="M32.1745 46.2392L34.139 37.0806C32.4243 36.904 30.8262 37.6452 30.4476 38.843C30.5075 39.3883 30.5376 39.9364 30.5378 40.485C30.5397 42.0672 30.2896 43.6396 29.7969 45.1431C30.4508 46.0097 31.5302 46.1753 32.1745 46.2392Z" fill="#890C25"/>
                    <path d="M45.9456 17.1482L42.8559 15.7266L41.6719 18.291L44.7615 19.7126L45.9456 17.1482Z" fill="#890C25"/>
                    <path d="M11.2044 44.0601L14.7882 40.4829L5.49224 31.2031C3.15584 33.7274 1.86205 37.0429 1.87114 40.4825C1.87114 40.8065 1.88243 41.1286 1.90501 41.4488C3.5516 41.1494 5.24478 41.2289 6.85606 41.6813C8.46735 42.1338 9.95441 42.9473 11.2044 44.0601Z" fill="#890C25"/>
                    <path d="M2.03516 42.6242C2.45048 45.2967 3.65385 47.7845 5.49125 49.7692L10.3736 44.8954C9.25462 43.8969 7.91892 43.172 6.47187 42.7778C5.02482 42.3837 3.506 42.3311 2.03516 42.6242Z" fill="#890C25"/>
                    <path d="M19.2228 36.064C18.1007 34.8285 17.2802 33.3499 16.8256 31.7441C16.371 30.1382 16.2947 28.4489 16.6026 26.8086C16.2756 26.7852 15.948 26.7735 15.62 26.7735C12.1786 26.7675 8.86067 28.0552 6.32422 30.3811L15.62 39.6601L19.2228 36.064Z" fill="#890C25"/>
                    <path d="M24.9155 30.3766C22.9256 28.5498 20.4393 27.3532 17.7702 26.9375C17.4829 28.4022 17.5395 29.9136 17.9356 31.3527C18.3317 32.7918 19.0564 34.1193 20.0528 35.2306L24.9155 30.3766Z" fill="#890C25"/>
                    <path d="M29.1958 38.3335C28.7784 35.6664 27.5761 33.1841 25.7422 31.2031L20.8789 36.0574C21.9953 37.0533 23.3272 37.777 24.7701 38.1719C26.2131 38.5668 27.7279 38.6221 29.1958 38.3335Z" fill="#890C25"/>
                    <path d="M38.3151 22.7648L38.4403 22.4937L38.1992 22.3828C38.2353 22.5112 38.2739 22.6386 38.3151 22.7648Z" fill="#890C25"/>
                    <path d="M47.6875 27.0801C47.8116 27.0287 47.9353 26.9744 48.0587 26.9171L47.8146 26.8047L47.6875 27.0801Z" fill="#890C25"/>
                    <path d="M37.9139 17.8516C37.7761 18.882 37.7735 19.926 37.9063 20.957L38.9305 21.4282L40.1141 18.8638L37.9139 17.8516Z" fill="#890C25"/>
                    <path d="M42.5195 27.3573C43.6978 27.757 44.9635 27.8233 46.1771 27.549L46.7482 26.3121L43.6586 24.8906L42.5195 27.3573Z" fill="#890C25"/>
                    <path d="M39.5073 22.9844L38.9375 24.2184C39.5148 25.32 40.3877 26.2388 41.4583 26.8717L42.5969 24.4059L39.5073 22.9844Z" fill="#890C25"/>
                    <path d="M48.3047 25.7363L49.3274 26.2069C50.1975 25.6364 50.9907 24.9563 51.6875 24.1836L49.4889 23.1719L48.3047 25.7363Z" fill="#890C25"/>
                    <path d="M45.3364 21.2656L44.1523 23.83L47.242 25.2516L48.4262 22.6872L45.3364 21.2656Z" fill="#890C25"/>
                    <path d="M52.5299 4.28907C51.3929 3.76879 50.1563 3.50223 48.9059 3.5079C44.2477 3.5079 39.2826 7.0138 36.697 12.6134C34.8361 16.6433 34.5301 21.017 35.8568 24.6134C36.7935 27.1514 38.4475 29.0262 40.6403 30.0351C46.0933 32.5442 53.1956 28.8094 56.4733 21.7109C58.3341 17.6808 58.6402 13.3072 57.3134 9.71087C56.3769 7.17271 54.7227 5.29782 52.5299 4.28907ZM55.1138 21.0867C52.899 25.8825 48.6359 28.8825 44.6275 28.8825C43.5439 28.8874 42.4722 28.6563 41.4869 28.2053C39.5791 27.3275 38.1431 25.7046 37.3341 23.5123C36.1987 20.4354 36.4619 16.6902 38.0566 13.2369C40.8679 7.14845 46.9816 3.95497 51.6835 6.11837C53.5913 6.9961 55.0273 8.61892 55.8364 10.8113C56.9717 13.8881 56.7084 17.6333 55.1138 21.0866V21.0867Z" fill="#890C25"/>
                    <path d="M54.5156 12.2891L53.332 14.8536L55.329 15.7723C55.4136 14.701 55.346 13.6231 55.1283 12.5708L54.5156 12.2891Z" fill="#890C25"/>
                    <path d="M51.6562 18.4863L54.4102 19.7532C54.7588 18.863 55.0163 17.9398 55.1789 16.9977L52.8405 15.9219L51.6562 18.4863Z" fill="#890C25"/>
                    <path d="M49.9805 22.1107L52.4617 23.2522C53.034 22.4937 53.5299 21.6804 53.942 20.8242L51.1646 19.5469L49.9805 22.1107Z" fill="#890C25"/>
                    <path d="M47.6215 13.5154L44.5317 12.0938L43.3477 14.6582L46.4373 16.0798L47.6215 13.5154Z" fill="#890C25"/>
                    <path d="M53.4495 11.8043L50.3598 10.3828L49.1758 12.9472L52.2654 14.3687L53.4495 11.8043Z" fill="#890C25"/>
                    <path d="M39.9961 21.916L43.0857 23.3375L44.2698 20.773L41.1802 19.3516L39.9961 21.916Z" fill="#890C25"/>
                    <path d="M41.7907 15.2372L39.0168 13.9609C38.6319 14.8292 38.3332 15.7332 38.125 16.6599L40.6067 17.8016L41.7907 15.2372Z" fill="#890C25"/>
                    <path d="M51.7737 15.4293L48.6841 14.0078L47.5 16.5722L50.5895 17.9937L51.7737 15.4293Z" fill="#890C25"/>
                    <path d="M50.6483 6.96588C49.965 6.72809 49.2463 6.60756 48.5228 6.6094C48.0074 6.61131 47.4936 6.6672 46.9898 6.77615L46.6992 7.40557L49.7889 8.82705L50.6483 6.96588Z" fill="#890C25"/>
                    <path d="M50.1018 19.0543L47.0122 17.6328L45.8281 20.1972L48.9178 21.6187L50.1018 19.0543Z" fill="#890C25"/>
                    <path d="M43.4656 11.6026L41.1361 10.5312C40.5223 11.2652 39.9846 12.0595 39.5312 12.9021L42.2815 14.1677L43.4656 11.6026Z" fill="#890C25"/>
                    <path d="M45.1432 7.9741L44.5366 7.69531C43.5965 8.21629 42.7335 8.86574 41.9727 9.62492L43.959 10.539L45.1432 7.9741Z" fill="#890C25"/>
                    <path d="M48.1131 12.4546L49.2971 9.89023L46.2075 8.46875L45.0234 11.0332L48.1131 12.4546Z" fill="#890C25"/>
                  </svg>                                       
                </div>
                <div className="td_feature_info">
                  <h3 className="td_fs_32 td_semibold td_mb_15">Daily Speaking Practice</h3>
                  <p className="td_fs_14 td_heading_color td_opacity_7 mb-0">Learn from home with live guidance, speaking tasks, and clear correction.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="td_features_shape_1 position-absolute td_accent_color td_hover_layer_3">
            <svg width="482" height="769" viewBox="0 0 482 769" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M95.5257 63.6079C95.5257 63.6079 440.442 -122.4 331.028 144.941C186.89 497.038 374.069 383.766 443.343 372.701C533.011 358.466 432.66 620.605 432.66 620.605M89.566 67.8652C89.566 67.8652 425.38 -107.274 318.228 154.436C178.626 495.525 359.245 392.597 435.947 380.589C531.877 365.485 417.864 629.948 417.864 629.948M83.6064 72.1225C83.6064 72.1225 410.212 -91.9622 305.428 163.93C170.242 493.943 344.301 401.36 428.657 388.29C530.744 372.504 403.055 639.034 403.055 639.034M77.7534 76.1935C77.7534 76.1935 395.15 -76.8363 292.734 173.239C162.086 492.243 329.585 410.005 421.489 396.06C529.717 379.336 388.366 648.19 388.366 648.19M71.6731 80.3817C71.6731 80.3817 379.968 -61.7794 279.813 182.664C153.702 490.661 314.641 418.767 414.078 403.692C528.69 386.169 373.678 657.346 373.678 657.346M65.7135 84.639C65.7135 84.639 364.799 -46.4671 267.013 192.158C145.332 489.334 299.817 427.599 406.682 411.579C527.571 393.443 358.762 666.62 358.762 666.62M59.7538 88.8963C59.7538 88.8963 349.51 -31.2238 254.106 201.839C136.948 487.752 284.767 436.548 399.286 419.467C526.437 400.462 343.966 675.962 343.966 675.962M53.7942 93.1536C53.7942 93.1536 334.449 -16.0979 241.305 211.334C128.684 486.239 269.943 445.379 391.89 427.354C525.304 407.481 329.171 685.304 329.171 685.304M47.8345 97.4109C47.8345 97.4109 319.28 -0.785629 228.505 220.828C120.3 484.657 255.12 454.211 384.614 435.31C524.184 414.755 314.376 694.646 314.376 694.646M41.9815 101.482C41.9815 101.482 304.219 14.3403 215.811 230.136C112.143 482.958 240.403 462.856 377.431 442.825C523.385 421.471 299.794 703.616 299.794 703.616M36.0219 105.739C36.0219 105.739 289.157 29.4662 203.011 239.631C103.88 481.445 225.459 471.619 370.035 450.712C522.131 428.42 284.984 712.703 284.984 712.703M30.0622 109.997C30.0622 109.997 273.988 44.7786 190.09 249.056C95.4961 479.863 210.515 480.381 362.625 458.345C520.997 435.439 270.068 721.976 270.068 721.976M24.1026 114.254C24.1026 114.254 258.82 60.0909 177.29 258.551C87.112 478.281 195.692 489.213 355.229 466.232C519.864 442.458 255.273 731.319 255.273 731.319M18.1429 118.511C18.1429 118.511 243.638 75.1478 164.489 268.045C78.8487 476.768 180.868 498.044 348.06 474.002C518.958 449.36 240.705 740.544 240.705 740.544M12.1833 122.768C12.1833 122.768 228.469 90.46 151.689 277.54C70.5853 475.255 166.045 506.876 340.663 481.889C517.838 456.634 225.91 749.886 225.91 749.886M6.3303 126.839C6.3303 126.839 213.514 105.4 138.995 286.848C62.3079 473.486 151.208 515.452 333.481 489.404C516.705 463.653 211.101 758.973 211.101 758.973M0.25 131.028C0.25 131.028 198.225 120.643 125.968 296.46C53.8173 472.09 136.157 524.401 325.857 497.409C515.678 470.486 196.412 768.129 196.412 768.129" stroke="currentColor" stroke-miterlimit="10"/>
            </svg>              
          </div>
          <div className="td_features_shape_2 position-absolute td_accent_color td_hover_layer_5">
            <svg width="576" height="726" viewBox="0 0 576 726" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M492.179 645.603C492.179 645.603 177.451 855.296 228.555 594.921C295.898 251.997 127.985 377.265 58.6234 394.914C-31.1778 417.678 11.7299 163.105 11.7299 163.105M497.373 641.009C497.373 641.009 189.556 839.623 239.628 584.728C304.835 252.527 141.316 367.473 64.4603 386.789C-31.6424 411.026 24.9113 152.842 24.9113 152.842M502.567 636.415C502.567 636.415 201.729 823.765 250.702 574.535C313.912 253.109 154.787 357.734 70.23 378.85C-32.107 404.375 38.1671 142.815 38.1671 142.815M507.694 632.006C507.694 632.006 213.834 808.091 261.709 564.526C322.782 253.825 168.05 348.127 75.8582 370.859C-32.6388 397.908 51.2814 132.736 51.2814 132.736M513.029 627.464C513.029 627.464 226.081 792.469 272.924 554.384C331.86 254.407 181.522 338.387 81.7694 362.97C-33.1705 391.442 64.3956 122.657 64.3956 122.657M518.223 622.87C518.223 622.87 238.253 776.611 283.998 544.191C340.863 254.753 194.852 328.596 87.6063 354.846C-33.7095 384.554 77.7186 112.445 77.7186 112.445M523.417 618.276C523.417 618.276 250.567 760.804 295.139 533.813C349.941 255.335 208.39 318.672 93.4432 346.722C-34.1741 377.903 90.9 102.182 90.9 102.182M528.611 613.681C528.611 613.681 262.672 745.131 306.213 523.619C358.878 255.866 221.72 308.88 99.28 338.598C-34.6387 371.251 104.081 91.9181 104.081 91.9181M533.805 609.087C533.805 609.087 274.845 729.273 317.286 513.426C367.956 256.448 235.05 299.089 104.975 330.422C-35.1777 364.364 117.263 81.6546 117.263 81.6546M538.932 604.678C538.932 604.678 286.95 713.599 328.293 503.417C376.825 257.163 248.313 289.483 110.678 322.667C-35.9181 358.03 130.31 71.7605 130.31 71.7605M544.126 600.084C544.126 600.084 299.055 697.926 339.367 493.224C385.762 257.694 261.785 279.743 116.515 314.543C-36.2412 351.43 143.566 61.7332 143.566 61.7332M549.32 595.49C549.32 595.49 311.228 682.068 350.582 483.082C394.84 258.276 275.256 270.003 122.426 306.655C-36.7059 344.779 156.889 51.5211 156.889 51.5211M554.514 590.896C554.514 590.896 323.4 666.21 361.656 472.889C403.918 258.858 288.587 260.212 128.263 298.53C-37.1705 338.127 170.07 41.2576 170.07 41.2576M559.708 586.302C559.708 586.302 335.647 650.588 372.73 462.695C412.854 259.389 301.917 250.421 133.891 290.539C-37.8437 331.609 183.043 31.1274 183.043 31.1274M564.902 581.708C564.902 581.708 347.819 634.729 383.803 452.502C421.791 259.92 315.247 240.629 139.728 282.415C-38.3826 324.722 196.224 20.8639 196.224 20.8639M570.029 577.299C570.029 577.299 359.857 619.241 394.81 442.493C430.801 260.687 328.651 231.074 145.431 274.66C-38.8473 318.07 209.48 10.8366 209.48 10.8366M575.364 572.756C575.364 572.756 372.171 603.434 406.092 432.167C439.946 261.084 342.19 221.15 151.476 266.402C-39.3791 311.604 222.594 0.757812 222.594 0.757812" stroke="currentColor" stroke-miterlimit="10"/>
            </svg>                      
          </div>
        </div>
      </div>
      <div className="td_height_120 td_height_lg_80"></div>
    </section>
    
    
    <section className="branddarkenglishta td_shape_section_1 td_video_showcase">
      <div className="td_shape_position_4 td_accent_color position-absolute">
        <svg width="37" height="40" viewBox="0 0 37 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.4">
          <rect y="12.3906" width="23.6182" height="31.0709" rx="1" transform="rotate(-30.4551 0 12.3906)" fill="white"/>
          <rect x="4" y="14.8125" width="18.5361" height="2.62207" rx="1.31104" transform="rotate(-30.4551 4 14.8125)" fill="currentColor"/>
          <rect x="7" y="19.8125" width="18.5361" height="2.62207" rx="1.31104" transform="rotate(-30.4551 7 19.8125)" fill="currentColor"/>
          </g>
        </svg>          
      </div>
      <div className="td_height_120 td_height_lg_80"></div>
      <div className="container">
        <div className="row td_gap_y_40">
          <div className="col-lg-4 wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.2s">
            <div className="td_height_57 td_height_lg_0"></div>
            <div className="td_section_heading td_style_1">
              <h2 className="td_section_title td_fs_48 mb-0 td_white_color">Watch Real English Training Sessions</h2>
              <p className="td_section_subtitle td_fs_18 mb-0 td_white_color td_opacity_7">Watch practical Englishta lessons, demo classes, pronunciation tips, and speaking practice videos designed for online English learners.</p>
            </div>
         <div class="td_btn_box">
            <svg width="299" height="315" viewBox="0 0 299 315" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.75" clip-path="url(#clip0_34_2222)">
                <path d="M242.757 275.771C242.505 275.771 242.253 275.75 242.005 275.707C32.3684 239.98 0.342741 8.13005 0.0437414 5.79468C-0.108609 4.51176 0.22739 3.21754 0.9787 2.19335C1.73001 1.16916 2.8359 0.497795 4.05598 0.32519C5.27606 0.152585 6.5117 0.492693 7.4943 1.27158C8.4769 2.05047 9.12704 3.20518 9.3034 4.48471C9.59772 6.7514 40.7872 231.477 243.5 266.022C244.658 266.22 245.702 266.868 246.426 267.838C247.15 268.808 247.5 270.028 247.406 271.256C247.312 272.484 246.782 273.63 245.921 274.467C245.06 275.303 243.93 275.769 242.757 275.771Z" fill="white"></path>
                <path d="M299.002 275.455C271.709 283.305 237.446 297.872 215.562 314.617L235.465 269.602L223.318 221.648C242.099 242.137 273.428 262.728 299.002 275.455Z" fill="white"></path>
                </g>
                <defs>
                <clipPath id="clip0_34_2222">
                <rect width="299" height="314" fill="white" transform="translate(0 0.421875)"></rect>
                </clipPath>
                </defs>
              </svg>
              <div class="td_btn_box_in">
                <a href="courses-grid-view.html" class="td_btn td_style_1 td_radius_10 td_medium td_fs_18">
                  <span class="td_btn_in td_heading_color td_white_bg">
                    <span>View All Program</span>
                  </span>             
                </a> 
              </div>             
            </div>
          </div>
          <div className="col-lg-6 offset-lg-1">
            <div className="row">
              <div className="col-sm-6">
                <div className="td_card td_style_2 td_tilt_left wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
                  <div className="td_card_thumb td_video_thumb d-block">
                    <iframe src="https://www.youtube.com/embed/Bbn5or47ItM?si=gArVS5iU5QRmbNBF" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                  <div className="td_card_info">
                    <h2 className="td_card_title mb-0 td_fs_18 td_semibold td_white_color">
                      <a href="course-details.html">Free English Speaking Demo</a>
                    </h2>
                    <a href="course-details.html" className="td_card_btn">
                      <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.564 4.70161L4.42188 18.8438" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5654 13.5341C18.5654 13.5341 19.7299 5.85989 18.5654 4.69528C17.4008 3.53067 9.72656 4.69531 9.72656 4.69531" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.564 4.70161L4.42188 18.8438" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5654 13.5341C18.5654 13.5341 19.7299 5.85989 18.5654 4.69528C17.4008 3.53067 9.72656 4.69531 9.72656 4.69531" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="td_height_40 td_height_lg_30"></div>
                <div className="td_card td_style_2 td_tilt_right wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
                  <a href="course-details.html" className="td_card_thumb d-block">
                    <img src="https://picsum.photos/seed/englishta-78/900/600" alt="" className="w-100">
                  </a>
                  <div className="td_card_info">
                    <h2 className="td_card_title mb-0 td_fs_18 td_semibold td_white_color">
                      <a href="course-details.html">Pronunciation Practice Tips</a>
                    </h2>
                    <a href="course-details.html" className="td_card_btn">
                      <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.564 4.70161L4.42188 18.8438" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5654 13.5341C18.5654 13.5341 19.7299 5.85989 18.5654 4.69528C17.4008 3.53067 9.72656 4.69531 9.72656 4.69531" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.564 4.70161L4.42188 18.8438" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5654 13.5341C18.5654 13.5341 19.7299 5.85989 18.5654 4.69528C17.4008 3.53067 9.72656 4.69531 9.72656 4.69531" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="td_height_50 td_height_lg_30"></div>
                <div className="td_card td_style_2 td_tilt_soft_right wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.25s">
                  <a href="course-details.html" className="td_card_thumb d-block">
                    <img src="https://picsum.photos/seed/englishta-79/900/600" alt="" className="w-100">
                  </a>
                  <div className="td_card_info">
                    <h2 className="td_card_title mb-0 td_fs_18 td_semibold td_white_color">
                      <a href="course-details.html">Interview English Lessons</a>
                    </h2>
                    <a href="course-details.html" className="td_card_btn">
                      <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.564 4.70161L4.42188 18.8438" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5654 13.5341C18.5654 13.5341 19.7299 5.85989 18.5654 4.69528C17.4008 3.53067 9.72656 4.69531 9.72656 4.69531" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.564 4.70161L4.42188 18.8438" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5654 13.5341C18.5654 13.5341 19.7299 5.85989 18.5654 4.69528C17.4008 3.53067 9.72656 4.69531 9.72656 4.69531" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="td_height_40 td_height_lg_30"></div>
                <div className="td_card td_style_2 td_tilt_soft_left wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
                  <a href="course-details.html" className="td_card_thumb d-block">
                    <img src="https://picsum.photos/seed/englishta-80/900/600" alt="" className="w-100">
                  </a>
                  <div className="td_card_info">
                    <h2 className="td_card_title mb-0 td_fs_18 td_semibold td_white_color">
                      <a href="course-details.html">Flexible Batches</a>
                    </h2>
                    <a href="course-details.html" className="td_card_btn">
                      <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.564 4.70161L4.42188 18.8438" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5654 13.5341C18.5654 13.5341 19.7299 5.85989 18.5654 4.69528C17.4008 3.53067 9.72656 4.69531 9.72656 4.69531" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.564 4.70161L4.42188 18.8438" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5654 13.5341C18.5654 13.5341 19.7299 5.85989 18.5654 4.69528C17.4008 3.53067 9.72656 4.69531 9.72656 4.69531" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="td_height_112 td_height_lg_75"></div>
    </section>
    
    
    <section>
      <div className="td_height_112 td_height_lg_75"></div>
      <div className="container">
        <div className="td_section_heading td_style_1 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
          <p className="td_section_subtitle_up td_fs_18 td_semibold td_spacing_1 td_mb_10 text-uppercase td_accent_color">Departments</p>
          <h2 className="td_section_title td_fs_48 mb-0">Popular Training Areas</h2>
          <p className="td_section_subtitle td_fs_18 mb-0">Improve spoken English online with structured lessons, live practice, vocabulary building, <br>pronunciation correction, and confidence-focused coaching.</p>
        </div>
        <div className="td_height_50 td_height_lg_50"></div>
        <div className="td_iconbox_1_wrap">
          <div className="td_iconbox td_style_1 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
            <div className="td_iconbox_icon td_accent_color td_mb_10">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_34_2239)">
                <path d="M86.126 63.5156H46.4883L74.5107 91.5381C75.7496 92.777 77.8014 92.666 78.8801 91.2854C84.4443 84.1625 87.9336 75.7453 89.0367 66.7844C89.2508 65.0453 87.8783 63.5156 86.126 63.5156Z" fill="#890C25"/>
                <path d="M37.3424 62.6603C36.793 62.1109 36.4842 61.3656 36.4842 60.5887V24.5742C36.4842 22.7795 34.8828 21.3922 33.1109 21.6781C14.3254 24.7105 -0.0588036 41.0676 0.00018075 60.709C0.0650245 82.3125 17.708 99.9478 39.3113 100.003C47.7394 100.024 55.7699 97.414 62.4678 92.5601C63.9219 91.5062 64.0768 89.3945 62.8068 88.1248L37.3424 62.6603Z" fill="#890C25"/>
                <path d="M99.985 54.4305C97.0867 25.7699 74.2301 2.9135 45.5695 0.0150621C43.841 -0.159743 42.3438 1.20959 42.3438 2.9469V57.6563H97.0531C98.7904 57.6563 100.16 56.159 99.985 54.4305Z" fill="#890C25"/>
                </g>
                <defs>
                <clipPath id="clip0_34_2239">
                <rect width="100" height="100" fill="white"/>
                </clipPath>
                </defs>
              </svg>                          
            </div>
            <h3 className="td_iconbox_title mb-0 td_medium td_fs_36">Conversation Practice</h3>
          </div>
          <div className="td_iconbox td_style_1 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
            <div className="td_iconbox_icon td_accent_color td_mb_10">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_34_2246)">
                <path d="M50 26.5625C53.4518 26.5625 56.25 23.7643 56.25 20.3125C56.25 16.8607 53.4518 14.0625 50 14.0625C46.5482 14.0625 43.75 16.8607 43.75 20.3125C43.75 23.7643 46.5482 26.5625 50 26.5625Z" fill="#890C25"/>
                <path d="M84.375 34.375C86.9638 34.375 89.0625 32.2763 89.0625 29.6875C89.0625 27.0987 86.9638 25 84.375 25C81.7862 25 79.6875 27.0987 79.6875 29.6875C79.6875 32.2763 81.7862 34.375 84.375 34.375Z" fill="#890C25"/>
                <path d="M43.75 6.25H46.875V11.4844C48.8945 10.7552 51.1055 10.7552 53.125 11.4844V6.25H56.25C57.0788 6.25 57.8737 5.92076 58.4597 5.33471C59.0458 4.74866 59.375 3.9538 59.375 3.125C59.375 2.2962 59.0458 1.50134 58.4597 0.915291C57.8737 0.32924 57.0788 0 56.25 0L43.75 0C42.9212 0 42.1263 0.32924 41.5403 0.915291C40.9542 1.50134 40.625 2.2962 40.625 3.125C40.625 3.9538 40.9542 4.74866 41.5403 5.33471C42.1263 5.92076 42.9212 6.25 43.75 6.25Z" fill="#890C25"/>
                <path d="M32.8125 89.0625V90.625H67.1875V89.0625C67.1875 87.8193 66.6936 86.627 65.8146 85.7479C64.9355 84.8689 63.7432 84.375 62.5 84.375H37.5C36.2568 84.375 35.0645 84.8689 34.1854 85.7479C33.3064 86.627 32.8125 87.8193 32.8125 89.0625Z" fill="#890C25"/>
                <path d="M70.3125 93.75H29.6875C28.8587 93.75 28.0638 94.0792 27.4778 94.6653C26.8917 95.2513 26.5625 96.0462 26.5625 96.875V98.4375C26.5625 98.8519 26.7271 99.2493 27.0201 99.5424C27.3132 99.8354 27.7106 100 28.125 100H71.875C72.2894 100 72.6868 99.8354 72.9799 99.5424C73.2729 99.2493 73.4375 98.8519 73.4375 98.4375V96.875C73.4375 96.0462 73.1083 95.2513 72.5222 94.6653C71.9362 94.0792 71.1413 93.75 70.3125 93.75Z" fill="#890C25"/>
                <path d="M56.1133 27.4094L64.1352 31.9937C65.0799 32.533 66.1489 32.8168 67.2367 32.8172H77.2258C76.789 31.8333 76.5633 30.7687 76.5633 29.6922C76.5633 28.6157 76.789 27.5511 77.2258 26.5672H67.2367L59.2195 21.9844C58.8371 24.0955 57.7404 26.0109 56.1133 27.4094Z" fill="#890C25"/>
                <path d="M99.8438 58.7047L89.05 35.9062C88.2135 36.5409 87.2566 36.9986 86.2375 37.2516L96.7078 59.3734H72.0422L82.5203 37.2516C81.5012 36.9986 80.5443 36.5409 79.7078 35.9062L68.9062 58.7047C68.8048 58.9131 68.7514 59.1416 68.75 59.3734C68.75 63.5174 70.3962 67.4917 73.3265 70.422C76.2567 73.3522 80.231 74.9984 84.375 74.9984C88.519 74.9984 92.4933 73.3522 95.4235 70.422C98.3538 67.4917 100 63.5174 100 59.3734C99.9986 59.1416 99.9452 58.9131 99.8438 58.7047Z" fill="#890C25"/>
                <path d="M15.625 34.375C18.2138 34.375 20.3125 32.2763 20.3125 29.6875C20.3125 27.0987 18.2138 25 15.625 25C13.0362 25 10.9375 27.0987 10.9375 29.6875C10.9375 32.2763 13.0362 34.375 15.625 34.375Z" fill="#890C25"/>
                <path d="M31.25 59.3734C31.2486 59.1416 31.1952 58.9131 31.0938 58.7047L20.3 35.9062C19.4612 36.5419 18.5015 36.9996 17.4797 37.2516L27.9578 59.3734H3.29219L13.7703 37.2516C12.7485 36.9996 11.7888 36.5419 10.95 35.9062L0.15625 58.7047C0.0548166 58.9131 0.00142284 59.1416 0 59.3734C0 63.5174 1.6462 67.4917 4.57646 70.422C7.50671 73.3522 11.481 74.9984 15.625 74.9984C19.769 74.9984 23.7433 73.3522 26.6735 70.422C29.6038 67.4917 31.25 63.5174 31.25 59.3734Z" fill="#890C25"/>
                <path d="M32.7625 32.8172C33.8503 32.8168 34.9193 32.533 35.8641 31.9937L43.8859 27.4094C42.2589 26.0109 41.1621 24.0955 40.7797 21.9844L32.7625 26.5672H22.7734C23.2102 27.5511 23.4359 28.6157 23.4359 29.6922C23.4359 30.7687 23.2102 31.8333 22.7734 32.8172H32.7625Z" fill="#890C25"/>
                <path d="M46.875 29.1406V81.25H53.125V29.1406C51.1055 29.8698 48.8945 29.8698 46.875 29.1406Z" fill="#890C25"/>
                </g>
                <defs>
                <clipPath id="clip0_34_2246">
                <rect width="100" height="100" fill="white"/>
                </clipPath>
                </defs>
              </svg>                               
            </div>
            <h3 className="td_iconbox_title mb-0 td_medium td_fs_36">Interview Preparation</h3>
          </div>
          <div className="td_iconbox td_style_1 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.4s">
            <div className="td_iconbox_icon td_accent_color td_mb_10">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_34_2260)">
                <path d="M5.48785 47.2141C5.57737 47.3052 5.7193 47.4286 5.90882 47.5794C7.61285 43.6278 10.187 38.6697 14.0782 33.4915C17.629 28.7665 21.2798 25.1826 24.3483 22.5665C22.0604 25.6036 19.3395 29.835 17.0838 35.2697C14.4927 41.5133 13.4266 47.1487 12.9693 51.2673C18.4435 53.1278 25.9903 53.5834 32.6137 46.8036C44.0548 35.0923 30.8709 20.0044 50.9693 6.50035C50.9693 6.50035 25.1346 -0.710944 8.64995 16.1616C-7.83634 33.0358 4.04753 45.7657 5.48785 47.2141Z" fill="#890C25"/>
                <path d="M87.7621 60.4129C87.7621 60.4129 105.67 40.1975 98.1581 17.6983C90.6476 -4.80005 74.1065 0.292695 72.1863 0.949953C72.0661 0.991082 71.8911 1.06528 71.6758 1.1685C74.5742 3.29834 79.9734 7.90076 83.4653 15.7096C85.5186 20.3008 86.2436 24.5072 86.5032 27.5016C84.3379 24.0201 81.2694 19.7741 77.0258 15.4701C72.8218 11.2064 68.6758 8.11447 65.2686 5.92495C61.1806 10.0604 57.404 16.704 60.4242 25.7443C65.6379 41.3604 84.8371 36.1419 87.7621 60.4129Z" fill="#890C25"/>
                <path d="M78.6168 75.7887C77.0144 70.1645 73.0934 63.6073 63.8281 61.9347C47.8241 59.0452 43.0814 78.6234 20.7031 69.529C20.7031 69.529 29.5394 95.1855 52.5967 99.35C75.6539 103.515 79.2249 86.3597 79.5805 84.3363C79.6023 84.2081 79.6233 84.0202 79.6378 83.7774C75.7031 85.0371 69.9459 86.3855 62.9241 86.3419C57.1023 86.3057 52.2249 85.3234 48.6459 84.3097C52.9322 84.1234 58.4757 83.4726 64.7039 81.6403C70.4007 79.9645 75.0684 77.7726 78.6168 75.7887Z" fill="#890C25"/>
                </g>
                <defs>
                <clipPath id="clip0_34_2260">
                <rect width="100" height="100" fill="white"/>
                </clipPath>
                </defs>
              </svg>                            
            </div>
            <h3 className="td_iconbox_title mb-0 td_medium td_fs_36">Pronunciation Training</h3>
          </div>
          <div className="td_iconbox td_style_1 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.4s">
            <div className="td_iconbox_icon td_accent_color td_mb_10">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.5625 21.875V57.8125H43.75V51.7812L60.9375 44.0781V37.4844L26.5625 21.875ZM40.625 42.1875H34.375V35.9375H40.625V42.1875Z" fill="#890C25"/>
                <path d="M6.25 60.9375V85.9375H43.75V60.9375H6.25ZM21.875 76.5625H15.625V70.3125H21.875V76.5625Z" fill="#890C25"/>
                <path d="M46.875 53.8125V85.9375H76.5625V70.3125H85.9375V85.9375H93.75V32.8125L46.875 53.8125ZM65.625 76.5625H59.375V70.3125H65.625V76.5625Z" fill="#890C25"/>
              </svg>                               
            </div>
            <h3 className="td_iconbox_title mb-0 td_medium td_fs_36">Corporate Communication</h3>
          </div>
        </div>
      </div>
      <div className="td_height_120 td_height_lg_80"></div>
    </section>
    
    
    <section>
      <div className="td_video_block td_style_1 td_accent_bg td_bg_filed td_center text-center" data-src="https://picsum.photos/seed/englishta-99/1600/900">
        <div className="container">
          <a href="https://www.youtube.com/embed/rRid6GCJtgc" className="td_player_btn_wrap_2 td_video_open wow zoomIn" data-wow-duration="1s" data-wow-delay="0.2s">
            <span className="td_player_btn td_center">
              <span></span>
            </span>
          </a>
          <div className="td_height_70 td_height_lg_50"></div>
          <h2 className="td_fs_48 td_white_color mb-0 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">Watch How Englishta Helps You <br>Speak Better English</h2>
        </div>
      </div>
      <div className="container wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.25s">
        <div className="td_contact_box td_style_1 td_accent_bg td_radius_10">
          <div className="td_contact_box_left">
            <p className="td_fs_18 td_light td_white_color td_mb_4">Get In Touch:</p>
            <h3 className="td_fs_36 mb-0 td_white_color"><a href="mailto:hello@englishta.com">hello@englishta.com</a></h3>
          </div>
          <div className="td_contact_box_or td_fs_24 td_medium td_white_bg td_white_bg td_center rounded-circle td_accent_color">
            or
          </div>
          <div className="td_contact_box_right">
            <p className="td_fs_18 td_light td_white_color td_mb_4">Get In Touch:</p>
            <h3 className="td_fs_36 mb-0 td_white_color"><a href="tel:+019987698870">+91 98765 43210</a></h3>
          </div>
        </div>
      </div>
    </section>
    
    
    <section>
      <div className="td_height_112 td_height_lg_75"></div>
      <div className="container">
        <div className="td_section_heading td_style_1 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
          <p className="td_section_subtitle_up td_fs_18 td_semibold td_spacing_1 td_mb_10 text-uppercase td_accent_color">Event schedule</p>
          <h2 className="td_section_title td_fs_48 mb-0">Upcoming Free English Webinar <br>Hosted by Englishta</h2>
        </div>
        <div className="td_height_50 td_height_lg_50"></div>
        <div className="row td_gap_y_30">
          <div className="col-lg-6 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
            <div className="td_card td_style_1 td_radius_5">
              <a href="event-details.html" className="td_card_thumb td_mb_30 d-block">
                <img src="https://picsum.photos/seed/englishta-81/900/600" alt="">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                <span className="td_card_location td_medium td_white_color td_fs_18">
                  <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.0004 0.5C3.86669 0.5 0.554996 3.86526 0.500458 7.98242C0.48345 9.42271 0.942105 10.7046 1.56397 11.8232C2.76977 13.9928 4.04435 16.8182 5.32856 19.4639C5.9286 20.7002 6.89863 21.5052 8.0004 21.5C9.10217 21.4948 10.0665 20.6836 10.6575 19.4404C11.9197 16.7856 13.1685 13.9496 14.4223 11.835C15.1136 10.6691 15.4653 9.3606 15.4974 8.01758C15.5966 3.86772 12.1342 0.5 8.0004 0.5ZM8.0004 2.00586C11.3235 2.00586 14.0821 4.6775 14.0033 7.97363C13.9749 9.08002 13.6796 10.1416 13.1273 11.0732C11.7992 13.3133 10.5449 16.1706 9.2954 18.7988C8.85773 19.7191 8.35538 19.9924 7.98864 19.9941C7.62183 19.9959 7.12572 19.7246 6.68204 18.8105C5.41121 16.1923 4.12648 13.3534 2.87056 11.0938C2.32971 10.121 1.9798 9.11653 1.9946 8.00586C2.03995 4.67555 4.67723 2.00586 8.0004 2.00586ZM8.0004 4.25C5.94024 4.25 4.25034 5.94266 4.25034 8.00586C4.25034 10.0691 5.94024 11.75 8.0004 11.75C10.0605 11.75 11.7503 10.0691 11.7503 8.00586C11.7503 5.94266 10.0605 4.25 8.0004 4.25ZM8.0004 5.74414C9.25065 5.74414 10.2446 6.75372 10.2446 8.00586C10.2446 9.258 9.25065 10.2559 8.0004 10.2559C6.7501 10.2559 5.75331 9.258 5.75331 8.00586C5.75331 6.75372 6.7501 5.74414 8.0004 5.74414Z" fill="currentColor"/>
                  </svg>                    
                  Tsc Center, Northern Asia 
                </span>
              </a>
              <div className="td_card_info">
                <div className="td_card_info_in">
                  <div className="td_mb_30">
                    <ul className="td_card_meta td_mp_0 td_fs_18 td_medium td_heading_color">
                      <li>
                        <svg className="td_accent_color" width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.3308 11.7869H19.0049C19.3833 11.7869 19.6913 11.479 19.6913 11.1005V9.42642C19.6913 9.04795 19.3833 8.74003 19.0049 8.74003H17.3308C16.9523 8.74003 16.6444 9.04795 16.6444 9.42642V11.1005C16.6444 11.479 16.9523 11.7869 17.3308 11.7869ZM17.3475 9.44316H18.9881V11.0838H17.3475V9.44316ZM17.3308 16.24H19.0049C19.3833 16.24 19.6913 15.9321 19.6913 15.5536V13.8795C19.6913 13.5011 19.3833 13.1932 19.0049 13.1932H17.3308C16.9523 13.1932 16.6444 13.5011 16.6444 13.8795V15.5536C16.6444 15.9321 16.9523 16.24 17.3308 16.24ZM17.3475 13.8963H18.9881V15.5369H17.3475V13.8963ZM12.5535 11.7869H14.2276C14.606 11.7869 14.914 11.479 14.914 11.1005V9.42642C14.914 9.04795 14.606 8.74003 14.2276 8.74003H12.5535C12.175 8.74003 11.8671 9.04795 11.8671 9.42642V11.1005C11.8671 11.479 12.175 11.7869 12.5535 11.7869ZM12.5702 9.44316H14.2108V11.0838H12.5702V9.44316ZM4.67294 17.4375H2.99884C2.62037 17.4375 2.31245 17.7454 2.31245 18.1239V19.798C2.31245 20.1765 2.62037 20.4844 2.99884 20.4844H4.67294C5.05141 20.4844 5.35933 20.1765 5.35933 19.798V18.1239C5.35933 17.7454 5.05141 17.4375 4.67294 17.4375ZM4.6562 19.7812H3.01558V18.1406H4.6562V19.7812ZM4.67294 8.74003H2.99884C2.62037 8.74003 2.31245 9.04795 2.31245 9.42642V11.1005C2.31245 11.479 2.62037 11.7869 2.99884 11.7869H4.67294C5.05141 11.7869 5.35933 11.479 5.35933 11.1005V9.42642C5.35933 9.04791 5.05141 8.74003 4.67294 8.74003ZM4.6562 11.0838H3.01558V9.44316H4.6562V11.0838ZM12.5535 16.1356H14.2276C14.606 16.1356 14.914 15.8277 14.914 15.4493V13.7752C14.914 13.3967 14.606 13.0888 14.2276 13.0888H12.5535C12.175 13.0888 11.8671 13.3967 11.8671 13.7752V15.4493C11.8671 15.8277 12.175 16.1356 12.5535 16.1356ZM12.5702 13.7919H14.2108V15.4325H12.5702V13.7919ZM20.0404 1.60659H18.5373V1.06908C18.5373 0.479578 18.0578 0 17.4683 0H17.3068C16.7174 0 16.2378 0.479578 16.2378 1.06908V1.60659H5.76592V1.06908C5.76592 0.479578 5.28634 0 4.69684 0H4.53541C3.94591 0 3.46633 0.479578 3.46633 1.06908V1.60659H1.96328C0.992734 1.60659 0.203125 2.3962 0.203125 3.36675V22.2422C0.203125 23.2115 0.991656 24 1.96094 24H20.0429C21.0122 24 21.8007 23.2115 21.8007 22.2422V3.36675C21.8006 2.3962 21.011 1.60659 20.0404 1.60659ZM16.9409 1.06908C16.9409 0.867281 17.1051 0.703125 17.3069 0.703125H17.4683C17.6701 0.703125 17.8343 0.867281 17.8343 1.06908V1.60659H16.9409V1.06908ZM4.1695 1.06908C4.1695 0.867281 4.33366 0.703125 4.53545 0.703125H4.69689C4.89869 0.703125 5.06284 0.867281 5.06284 1.06908V1.60659H4.16955V1.06908H4.1695ZM21.0975 22.2422C21.0975 22.8238 20.6244 23.2969 20.0428 23.2969H1.96089C1.37931 23.2969 0.906203 22.8238 0.906203 22.2422V22.24C1.20077 22.4619 1.56691 22.5938 1.96328 22.5938H16.2172C16.6873 22.5938 17.1294 22.4107 17.4618 22.0782L21.0975 18.4425V22.2422ZM17.1031 21.4425C17.1306 21.3288 17.1456 21.2101 17.1456 21.088V18.7413C17.1456 18.2988 17.5057 17.9387 17.9482 17.9387H20.2949C20.417 17.9387 20.5357 17.9237 20.6494 17.8962L17.1031 21.4425ZM21.0975 6.63066H6.11748C5.92333 6.63066 5.76592 6.78806 5.76592 6.98222C5.76592 7.17637 5.92333 7.33378 6.11748 7.33378H21.0975V16.4331C21.0975 16.8756 20.7375 17.2357 20.2949 17.2357H17.9482C17.118 17.2357 16.4425 17.9111 16.4425 18.7413V21.0881C16.4425 21.5306 16.0825 21.8907 15.64 21.8907H1.96328C1.38044 21.8907 0.90625 21.4165 0.90625 20.8336V7.33378H4.71123C4.90539 7.33378 5.0628 7.17637 5.0628 6.98222C5.0628 6.78806 4.90539 6.63066 4.71123 6.63066H0.906203V3.36675C0.906203 2.78391 1.38039 2.30972 1.96323 2.30972H3.46633V3.34341C3.46633 3.93291 3.94591 4.41248 4.53541 4.41248C4.72956 4.41248 4.88697 4.25508 4.88697 4.06092C4.88697 3.86677 4.72956 3.70936 4.53541 3.70936C4.33361 3.70936 4.16945 3.5452 4.16945 3.34341V2.30972H16.2378V3.34341C16.2378 3.93291 16.7174 4.41248 17.3069 4.41248C17.501 4.41248 17.6584 4.25508 17.6584 4.06092C17.6584 3.86677 17.501 3.70936 17.3069 3.70936C17.1051 3.70936 16.9409 3.5452 16.9409 3.34341V2.30972H20.0405C20.6233 2.30972 21.0975 2.78391 21.0975 3.36675V6.63066ZM4.67294 13.0888H2.99884C2.62037 13.0888 2.31245 13.3967 2.31245 13.7752V15.4493C2.31245 15.8277 2.62037 16.1356 2.99884 16.1356H4.67294C5.05141 16.1356 5.35933 15.8277 5.35933 15.4493V13.7752C5.35933 13.3966 5.05141 13.0888 4.67294 13.0888ZM4.6562 15.4325H3.01558V13.7919H4.6562V15.4325ZM7.77616 11.7869H9.45025C9.82872 11.7869 10.1366 11.479 10.1366 11.1005V9.42642C10.1366 9.04795 9.82872 8.74003 9.45025 8.74003H7.77616C7.39769 8.74003 7.08977 9.04795 7.08977 9.42642V11.1005C7.08977 11.479 7.39769 11.7869 7.77616 11.7869ZM7.79289 9.44316H9.43352V11.0838H7.79289V9.44316ZM12.5698 19.7812C12.5611 19.5948 12.4072 19.4464 12.2186 19.4464C12.0244 19.4464 11.867 19.6038 11.867 19.798C11.867 20.1765 12.175 20.4844 12.5534 20.4844H14.2275C14.606 20.4844 14.9139 20.1765 14.9139 19.798V18.1239C14.9139 17.7454 14.606 17.4375 14.2275 17.4375H12.5534C12.175 17.4375 11.867 17.7454 11.867 18.1239V18.6067C11.867 18.8009 12.0244 18.9583 12.2186 18.9583C12.4127 18.9583 12.5702 18.8009 12.5702 18.6067V18.1406H14.2108V19.7812H12.5698ZM7.77616 16.1356H9.45025C9.82872 16.1356 10.1366 15.8277 10.1366 15.4493V13.7752C10.1366 13.3967 9.82872 13.0888 9.45025 13.0888H7.77616C7.39769 13.0888 7.08977 13.3967 7.08977 13.7752V15.4493C7.08977 15.8277 7.39769 16.1356 7.77616 16.1356ZM7.79289 13.7919H9.43352V15.4325H7.79289V13.7919ZM7.77616 20.4844H9.45025C9.82872 20.4844 10.1366 20.1765 10.1366 19.798V18.1239C10.1366 17.7454 9.82872 17.4375 9.45025 17.4375H7.77616C7.39769 17.4375 7.08977 17.7454 7.08977 18.1239V19.798C7.08977 20.1765 7.39769 20.4844 7.77616 20.4844ZM7.79289 18.1406H9.43352V19.7812H7.79289V18.1406Z" fill="currentColor"/>
                        </svg>
                        <span>Jan 23 , 2024</span>
                      </li>
                      <li>
                        <svg className="td_accent_color" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g >
                          <path d="M12 24C18.616 24 24 18.616 24 12C24 5.38401 18.6161 0 12 0C5.38394 0 0 5.38401 0 12C0 18.616 5.38401 24 12 24ZM12 1.59997C17.736 1.59997 22.4 6.26396 22.4 12C22.4 17.736 17.736 22.4 12 22.4C6.26396 22.4 1.59997 17.736 1.59997 12C1.59997 6.26396 6.26402 1.59997 12 1.59997Z" fill="currentColor"/>
                          <path d="M15.4992 15.8209C15.6472 15.9408 15.8232 15.9969 15.9992 15.9969C16.2352 15.9969 16.4672 15.8929 16.6232 15.6969C16.8992 15.3529 16.8431 14.8489 16.4992 14.5729L12.7992 11.6129V5.59686C12.7992 5.15686 12.4392 4.79688 11.9992 4.79688C11.5592 4.79688 11.1992 5.15686 11.1992 5.59686V11.9969C11.1992 12.2409 11.3112 12.4689 11.4992 12.6209L15.4992 15.8209Z" fill="currentColor"/>
                          </g>
                          <defs>
                           <clipPath>
                          <rect width="24" height="24" fill="white"/>
                          </clipPath>
                          </defs>
                        </svg>                      
                        <span>10.00 am - 11.30 am</span>
                      </li>
                    </ul>
                  </div>
                  <h2 className="td_card_title td_fs_32 td_semibold td_mb_20">
                    <a href="event-details.html">Free Webinar: Speak English Without Fear</a>
                  </h2>
                  <p className="td_mb_30 td_fs_18">Join our online English session to learn simple techniques for speaking confidently in real conversations. While there are significant challenges, </p>
                  <a href="event-details.html" className="td_btn td_style_1 td_radius_10 td_medium">
                    <span className="td_btn_in td_white_color td_accent_bg">
                      <span>Learn More</span>
                      <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.1575 4.34302L3.84375 15.6567" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M15.157 11.4142C15.157 11.4142 16.0887 5.2748 15.157 4.34311C14.2253 3.41142 8.08594 4.34314 8.08594 4.34314" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg> 
                    </span>             
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 td_gap_y_30 flex-wrap d-flex wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.3s">
            <div className="td_card td_style_1 td_type_1">
              <a href="event-details.html" className="td_card_thumb d-block">
                <img src="https://picsum.photos/seed/englishta-82/900/600" alt="">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
              <div className="td_card_info">
                <div className="td_card_info_in">
                  <div className="td_mb_20">
                    <ul className="td_card_meta td_mp_0 td_medium td_heading_color">
                      <li>
                        <svg className="td_accent_color" width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.3308 11.7869H19.0049C19.3833 11.7869 19.6913 11.479 19.6913 11.1005V9.42642C19.6913 9.04795 19.3833 8.74003 19.0049 8.74003H17.3308C16.9523 8.74003 16.6444 9.04795 16.6444 9.42642V11.1005C16.6444 11.479 16.9523 11.7869 17.3308 11.7869ZM17.3475 9.44316H18.9881V11.0838H17.3475V9.44316ZM17.3308 16.24H19.0049C19.3833 16.24 19.6913 15.9321 19.6913 15.5536V13.8795C19.6913 13.5011 19.3833 13.1932 19.0049 13.1932H17.3308C16.9523 13.1932 16.6444 13.5011 16.6444 13.8795V15.5536C16.6444 15.9321 16.9523 16.24 17.3308 16.24ZM17.3475 13.8963H18.9881V15.5369H17.3475V13.8963ZM12.5535 11.7869H14.2276C14.606 11.7869 14.914 11.479 14.914 11.1005V9.42642C14.914 9.04795 14.606 8.74003 14.2276 8.74003H12.5535C12.175 8.74003 11.8671 9.04795 11.8671 9.42642V11.1005C11.8671 11.479 12.175 11.7869 12.5535 11.7869ZM12.5702 9.44316H14.2108V11.0838H12.5702V9.44316ZM4.67294 17.4375H2.99884C2.62037 17.4375 2.31245 17.7454 2.31245 18.1239V19.798C2.31245 20.1765 2.62037 20.4844 2.99884 20.4844H4.67294C5.05141 20.4844 5.35933 20.1765 5.35933 19.798V18.1239C5.35933 17.7454 5.05141 17.4375 4.67294 17.4375ZM4.6562 19.7812H3.01558V18.1406H4.6562V19.7812ZM4.67294 8.74003H2.99884C2.62037 8.74003 2.31245 9.04795 2.31245 9.42642V11.1005C2.31245 11.479 2.62037 11.7869 2.99884 11.7869H4.67294C5.05141 11.7869 5.35933 11.479 5.35933 11.1005V9.42642C5.35933 9.04791 5.05141 8.74003 4.67294 8.74003ZM4.6562 11.0838H3.01558V9.44316H4.6562V11.0838ZM12.5535 16.1356H14.2276C14.606 16.1356 14.914 15.8277 14.914 15.4493V13.7752C14.914 13.3967 14.606 13.0888 14.2276 13.0888H12.5535C12.175 13.0888 11.8671 13.3967 11.8671 13.7752V15.4493C11.8671 15.8277 12.175 16.1356 12.5535 16.1356ZM12.5702 13.7919H14.2108V15.4325H12.5702V13.7919ZM20.0404 1.60659H18.5373V1.06908C18.5373 0.479578 18.0578 0 17.4683 0H17.3068C16.7174 0 16.2378 0.479578 16.2378 1.06908V1.60659H5.76592V1.06908C5.76592 0.479578 5.28634 0 4.69684 0H4.53541C3.94591 0 3.46633 0.479578 3.46633 1.06908V1.60659H1.96328C0.992734 1.60659 0.203125 2.3962 0.203125 3.36675V22.2422C0.203125 23.2115 0.991656 24 1.96094 24H20.0429C21.0122 24 21.8007 23.2115 21.8007 22.2422V3.36675C21.8006 2.3962 21.011 1.60659 20.0404 1.60659ZM16.9409 1.06908C16.9409 0.867281 17.1051 0.703125 17.3069 0.703125H17.4683C17.6701 0.703125 17.8343 0.867281 17.8343 1.06908V1.60659H16.9409V1.06908ZM4.1695 1.06908C4.1695 0.867281 4.33366 0.703125 4.53545 0.703125H4.69689C4.89869 0.703125 5.06284 0.867281 5.06284 1.06908V1.60659H4.16955V1.06908H4.1695ZM21.0975 22.2422C21.0975 22.8238 20.6244 23.2969 20.0428 23.2969H1.96089C1.37931 23.2969 0.906203 22.8238 0.906203 22.2422V22.24C1.20077 22.4619 1.56691 22.5938 1.96328 22.5938H16.2172C16.6873 22.5938 17.1294 22.4107 17.4618 22.0782L21.0975 18.4425V22.2422ZM17.1031 21.4425C17.1306 21.3288 17.1456 21.2101 17.1456 21.088V18.7413C17.1456 18.2988 17.5057 17.9387 17.9482 17.9387H20.2949C20.417 17.9387 20.5357 17.9237 20.6494 17.8962L17.1031 21.4425ZM21.0975 6.63066H6.11748C5.92333 6.63066 5.76592 6.78806 5.76592 6.98222C5.76592 7.17637 5.92333 7.33378 6.11748 7.33378H21.0975V16.4331C21.0975 16.8756 20.7375 17.2357 20.2949 17.2357H17.9482C17.118 17.2357 16.4425 17.9111 16.4425 18.7413V21.0881C16.4425 21.5306 16.0825 21.8907 15.64 21.8907H1.96328C1.38044 21.8907 0.90625 21.4165 0.90625 20.8336V7.33378H4.71123C4.90539 7.33378 5.0628 7.17637 5.0628 6.98222C5.0628 6.78806 4.90539 6.63066 4.71123 6.63066H0.906203V3.36675C0.906203 2.78391 1.38039 2.30972 1.96323 2.30972H3.46633V3.34341C3.46633 3.93291 3.94591 4.41248 4.53541 4.41248C4.72956 4.41248 4.88697 4.25508 4.88697 4.06092C4.88697 3.86677 4.72956 3.70936 4.53541 3.70936C4.33361 3.70936 4.16945 3.5452 4.16945 3.34341V2.30972H16.2378V3.34341C16.2378 3.93291 16.7174 4.41248 17.3069 4.41248C17.501 4.41248 17.6584 4.25508 17.6584 4.06092C17.6584 3.86677 17.501 3.70936 17.3069 3.70936C17.1051 3.70936 16.9409 3.5452 16.9409 3.34341V2.30972H20.0405C20.6233 2.30972 21.0975 2.78391 21.0975 3.36675V6.63066ZM4.67294 13.0888H2.99884C2.62037 13.0888 2.31245 13.3967 2.31245 13.7752V15.4493C2.31245 15.8277 2.62037 16.1356 2.99884 16.1356H4.67294C5.05141 16.1356 5.35933 15.8277 5.35933 15.4493V13.7752C5.35933 13.3966 5.05141 13.0888 4.67294 13.0888ZM4.6562 15.4325H3.01558V13.7919H4.6562V15.4325ZM7.77616 11.7869H9.45025C9.82872 11.7869 10.1366 11.479 10.1366 11.1005V9.42642C10.1366 9.04795 9.82872 8.74003 9.45025 8.74003H7.77616C7.39769 8.74003 7.08977 9.04795 7.08977 9.42642V11.1005C7.08977 11.479 7.39769 11.7869 7.77616 11.7869ZM7.79289 9.44316H9.43352V11.0838H7.79289V9.44316ZM12.5698 19.7812C12.5611 19.5948 12.4072 19.4464 12.2186 19.4464C12.0244 19.4464 11.867 19.6038 11.867 19.798C11.867 20.1765 12.175 20.4844 12.5534 20.4844H14.2275C14.606 20.4844 14.9139 20.1765 14.9139 19.798V18.1239C14.9139 17.7454 14.606 17.4375 14.2275 17.4375H12.5534C12.175 17.4375 11.867 17.7454 11.867 18.1239V18.6067C11.867 18.8009 12.0244 18.9583 12.2186 18.9583C12.4127 18.9583 12.5702 18.8009 12.5702 18.6067V18.1406H14.2108V19.7812H12.5698ZM7.77616 16.1356H9.45025C9.82872 16.1356 10.1366 15.8277 10.1366 15.4493V13.7752C10.1366 13.3967 9.82872 13.0888 9.45025 13.0888H7.77616C7.39769 13.0888 7.08977 13.3967 7.08977 13.7752V15.4493C7.08977 15.8277 7.39769 16.1356 7.77616 16.1356ZM7.79289 13.7919H9.43352V15.4325H7.79289V13.7919ZM7.77616 20.4844H9.45025C9.82872 20.4844 10.1366 20.1765 10.1366 19.798V18.1239C10.1366 17.7454 9.82872 17.4375 9.45025 17.4375H7.77616C7.39769 17.4375 7.08977 17.7454 7.08977 18.1239V19.798C7.08977 20.1765 7.39769 20.4844 7.77616 20.4844ZM7.79289 18.1406H9.43352V19.7812H7.79289V18.1406Z" fill="currentColor"/>
                        </svg>
                        <span>Jan 23 , 2024</span>
                      </li>
                      <li>
                        <svg className="td_accent_color" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g >
                          <path d="M12 24C18.616 24 24 18.616 24 12C24 5.38401 18.6161 0 12 0C5.38394 0 0 5.38401 0 12C0 18.616 5.38401 24 12 24ZM12 1.59997C17.736 1.59997 22.4 6.26396 22.4 12C22.4 17.736 17.736 22.4 12 22.4C6.26396 22.4 1.59997 17.736 1.59997 12C1.59997 6.26396 6.26402 1.59997 12 1.59997Z" fill="currentColor"/>
                          <path d="M15.4992 15.8209C15.6472 15.9408 15.8232 15.9969 15.9992 15.9969C16.2352 15.9969 16.4672 15.8929 16.6232 15.6969C16.8992 15.3529 16.8431 14.8489 16.4992 14.5729L12.7992 11.6129V5.59686C12.7992 5.15686 12.4392 4.79688 11.9992 4.79688C11.5592 4.79688 11.1992 5.15686 11.1992 5.59686V11.9969C11.1992 12.2409 11.3112 12.4689 11.4992 12.6209L15.4992 15.8209Z" fill="currentColor"/>
                          </g>
                          <defs>
                           <clipPath>
                          <rect width="24" height="24" fill="white"/>
                          </clipPath>
                          </defs>
                        </svg>                      
                        <span>10.00 am</span>
                      </li>
                    </ul>
                  </div>
                  <h2 className="td_card_title td_fs_20 td_semibold td_mb_20">
                    <a href="event-details.html">Online Demo Class for Spoken English</a>
                  </h2>
                  <span className="td_card_location td_medium td_heading_color">
                    <svg className="td_accent_color" width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.0004 0.5C3.86669 0.5 0.554996 3.86526 0.500458 7.98242C0.48345 9.42271 0.942105 10.7046 1.56397 11.8232C2.76977 13.9928 4.04435 16.8182 5.32856 19.4639C5.9286 20.7002 6.89863 21.5052 8.0004 21.5C9.10217 21.4948 10.0665 20.6836 10.6575 19.4404C11.9197 16.7856 13.1685 13.9496 14.4223 11.835C15.1136 10.6691 15.4653 9.3606 15.4974 8.01758C15.5966 3.86772 12.1342 0.5 8.0004 0.5ZM8.0004 2.00586C11.3235 2.00586 14.0821 4.6775 14.0033 7.97363C13.9749 9.08002 13.6796 10.1416 13.1273 11.0732C11.7992 13.3133 10.5449 16.1706 9.2954 18.7988C8.85773 19.7191 8.35538 19.9924 7.98864 19.9941C7.62183 19.9959 7.12572 19.7246 6.68204 18.8105C5.41121 16.1923 4.12648 13.3534 2.87056 11.0938C2.32971 10.121 1.9798 9.11653 1.9946 8.00586C2.03995 4.67555 4.67723 2.00586 8.0004 2.00586ZM8.0004 4.25C5.94024 4.25 4.25034 5.94266 4.25034 8.00586C4.25034 10.0691 5.94024 11.75 8.0004 11.75C10.0605 11.75 11.7503 10.0691 11.7503 8.00586C11.7503 5.94266 10.0605 4.25 8.0004 4.25ZM8.0004 5.74414C9.25065 5.74414 10.2446 6.75372 10.2446 8.00586C10.2446 9.258 9.25065 10.2559 8.0004 10.2559C6.7501 10.2559 5.75331 9.258 5.75331 8.00586C5.75331 6.75372 6.7501 5.74414 8.0004 5.74414Z" fill="currentColor"/>
                    </svg>                    
                    Tsc Center, Northern Asia 
                  </span>
                </div>
              </div>
            </div>
            <div className="td_card td_style_1 td_type_1">
              <a href="event-details.html" className="td_card_thumb d-block">
                <img src="https://picsum.photos/seed/englishta-83/900/600" alt="">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
              <div className="td_card_info">
                <div className="td_card_info_in">
                  <div className="td_mb_20">
                    <ul className="td_card_meta td_mp_0 td_medium td_heading_color">
                      <li>
                        <svg className="td_accent_color" width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.3308 11.7869H19.0049C19.3833 11.7869 19.6913 11.479 19.6913 11.1005V9.42642C19.6913 9.04795 19.3833 8.74003 19.0049 8.74003H17.3308C16.9523 8.74003 16.6444 9.04795 16.6444 9.42642V11.1005C16.6444 11.479 16.9523 11.7869 17.3308 11.7869ZM17.3475 9.44316H18.9881V11.0838H17.3475V9.44316ZM17.3308 16.24H19.0049C19.3833 16.24 19.6913 15.9321 19.6913 15.5536V13.8795C19.6913 13.5011 19.3833 13.1932 19.0049 13.1932H17.3308C16.9523 13.1932 16.6444 13.5011 16.6444 13.8795V15.5536C16.6444 15.9321 16.9523 16.24 17.3308 16.24ZM17.3475 13.8963H18.9881V15.5369H17.3475V13.8963ZM12.5535 11.7869H14.2276C14.606 11.7869 14.914 11.479 14.914 11.1005V9.42642C14.914 9.04795 14.606 8.74003 14.2276 8.74003H12.5535C12.175 8.74003 11.8671 9.04795 11.8671 9.42642V11.1005C11.8671 11.479 12.175 11.7869 12.5535 11.7869ZM12.5702 9.44316H14.2108V11.0838H12.5702V9.44316ZM4.67294 17.4375H2.99884C2.62037 17.4375 2.31245 17.7454 2.31245 18.1239V19.798C2.31245 20.1765 2.62037 20.4844 2.99884 20.4844H4.67294C5.05141 20.4844 5.35933 20.1765 5.35933 19.798V18.1239C5.35933 17.7454 5.05141 17.4375 4.67294 17.4375ZM4.6562 19.7812H3.01558V18.1406H4.6562V19.7812ZM4.67294 8.74003H2.99884C2.62037 8.74003 2.31245 9.04795 2.31245 9.42642V11.1005C2.31245 11.479 2.62037 11.7869 2.99884 11.7869H4.67294C5.05141 11.7869 5.35933 11.479 5.35933 11.1005V9.42642C5.35933 9.04791 5.05141 8.74003 4.67294 8.74003ZM4.6562 11.0838H3.01558V9.44316H4.6562V11.0838ZM12.5535 16.1356H14.2276C14.606 16.1356 14.914 15.8277 14.914 15.4493V13.7752C14.914 13.3967 14.606 13.0888 14.2276 13.0888H12.5535C12.175 13.0888 11.8671 13.3967 11.8671 13.7752V15.4493C11.8671 15.8277 12.175 16.1356 12.5535 16.1356ZM12.5702 13.7919H14.2108V15.4325H12.5702V13.7919ZM20.0404 1.60659H18.5373V1.06908C18.5373 0.479578 18.0578 0 17.4683 0H17.3068C16.7174 0 16.2378 0.479578 16.2378 1.06908V1.60659H5.76592V1.06908C5.76592 0.479578 5.28634 0 4.69684 0H4.53541C3.94591 0 3.46633 0.479578 3.46633 1.06908V1.60659H1.96328C0.992734 1.60659 0.203125 2.3962 0.203125 3.36675V22.2422C0.203125 23.2115 0.991656 24 1.96094 24H20.0429C21.0122 24 21.8007 23.2115 21.8007 22.2422V3.36675C21.8006 2.3962 21.011 1.60659 20.0404 1.60659ZM16.9409 1.06908C16.9409 0.867281 17.1051 0.703125 17.3069 0.703125H17.4683C17.6701 0.703125 17.8343 0.867281 17.8343 1.06908V1.60659H16.9409V1.06908ZM4.1695 1.06908C4.1695 0.867281 4.33366 0.703125 4.53545 0.703125H4.69689C4.89869 0.703125 5.06284 0.867281 5.06284 1.06908V1.60659H4.16955V1.06908H4.1695ZM21.0975 22.2422C21.0975 22.8238 20.6244 23.2969 20.0428 23.2969H1.96089C1.37931 23.2969 0.906203 22.8238 0.906203 22.2422V22.24C1.20077 22.4619 1.56691 22.5938 1.96328 22.5938H16.2172C16.6873 22.5938 17.1294 22.4107 17.4618 22.0782L21.0975 18.4425V22.2422ZM17.1031 21.4425C17.1306 21.3288 17.1456 21.2101 17.1456 21.088V18.7413C17.1456 18.2988 17.5057 17.9387 17.9482 17.9387H20.2949C20.417 17.9387 20.5357 17.9237 20.6494 17.8962L17.1031 21.4425ZM21.0975 6.63066H6.11748C5.92333 6.63066 5.76592 6.78806 5.76592 6.98222C5.76592 7.17637 5.92333 7.33378 6.11748 7.33378H21.0975V16.4331C21.0975 16.8756 20.7375 17.2357 20.2949 17.2357H17.9482C17.118 17.2357 16.4425 17.9111 16.4425 18.7413V21.0881C16.4425 21.5306 16.0825 21.8907 15.64 21.8907H1.96328C1.38044 21.8907 0.90625 21.4165 0.90625 20.8336V7.33378H4.71123C4.90539 7.33378 5.0628 7.17637 5.0628 6.98222C5.0628 6.78806 4.90539 6.63066 4.71123 6.63066H0.906203V3.36675C0.906203 2.78391 1.38039 2.30972 1.96323 2.30972H3.46633V3.34341C3.46633 3.93291 3.94591 4.41248 4.53541 4.41248C4.72956 4.41248 4.88697 4.25508 4.88697 4.06092C4.88697 3.86677 4.72956 3.70936 4.53541 3.70936C4.33361 3.70936 4.16945 3.5452 4.16945 3.34341V2.30972H16.2378V3.34341C16.2378 3.93291 16.7174 4.41248 17.3069 4.41248C17.501 4.41248 17.6584 4.25508 17.6584 4.06092C17.6584 3.86677 17.501 3.70936 17.3069 3.70936C17.1051 3.70936 16.9409 3.5452 16.9409 3.34341V2.30972H20.0405C20.6233 2.30972 21.0975 2.78391 21.0975 3.36675V6.63066ZM4.67294 13.0888H2.99884C2.62037 13.0888 2.31245 13.3967 2.31245 13.7752V15.4493C2.31245 15.8277 2.62037 16.1356 2.99884 16.1356H4.67294C5.05141 16.1356 5.35933 15.8277 5.35933 15.4493V13.7752C5.35933 13.3966 5.05141 13.0888 4.67294 13.0888ZM4.6562 15.4325H3.01558V13.7919H4.6562V15.4325ZM7.77616 11.7869H9.45025C9.82872 11.7869 10.1366 11.479 10.1366 11.1005V9.42642C10.1366 9.04795 9.82872 8.74003 9.45025 8.74003H7.77616C7.39769 8.74003 7.08977 9.04795 7.08977 9.42642V11.1005C7.08977 11.479 7.39769 11.7869 7.77616 11.7869ZM7.79289 9.44316H9.43352V11.0838H7.79289V9.44316ZM12.5698 19.7812C12.5611 19.5948 12.4072 19.4464 12.2186 19.4464C12.0244 19.4464 11.867 19.6038 11.867 19.798C11.867 20.1765 12.175 20.4844 12.5534 20.4844H14.2275C14.606 20.4844 14.9139 20.1765 14.9139 19.798V18.1239C14.9139 17.7454 14.606 17.4375 14.2275 17.4375H12.5534C12.175 17.4375 11.867 17.7454 11.867 18.1239V18.6067C11.867 18.8009 12.0244 18.9583 12.2186 18.9583C12.4127 18.9583 12.5702 18.8009 12.5702 18.6067V18.1406H14.2108V19.7812H12.5698ZM7.77616 16.1356H9.45025C9.82872 16.1356 10.1366 15.8277 10.1366 15.4493V13.7752C10.1366 13.3967 9.82872 13.0888 9.45025 13.0888H7.77616C7.39769 13.0888 7.08977 13.3967 7.08977 13.7752V15.4493C7.08977 15.8277 7.39769 16.1356 7.77616 16.1356ZM7.79289 13.7919H9.43352V15.4325H7.79289V13.7919ZM7.77616 20.4844H9.45025C9.82872 20.4844 10.1366 20.1765 10.1366 19.798V18.1239C10.1366 17.7454 9.82872 17.4375 9.45025 17.4375H7.77616C7.39769 17.4375 7.08977 17.7454 7.08977 18.1239V19.798C7.08977 20.1765 7.39769 20.4844 7.77616 20.4844ZM7.79289 18.1406H9.43352V19.7812H7.79289V18.1406Z" fill="currentColor"/>
                        </svg>
                        <span>Jan 23 , 2024</span>
                      </li>
                      <li>
                        <svg className="td_accent_color" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g >
                          <path d="M12 24C18.616 24 24 18.616 24 12C24 5.38401 18.6161 0 12 0C5.38394 0 0 5.38401 0 12C0 18.616 5.38401 24 12 24ZM12 1.59997C17.736 1.59997 22.4 6.26396 22.4 12C22.4 17.736 17.736 22.4 12 22.4C6.26396 22.4 1.59997 17.736 1.59997 12C1.59997 6.26396 6.26402 1.59997 12 1.59997Z" fill="currentColor"/>
                          <path d="M15.4992 15.8209C15.6472 15.9408 15.8232 15.9969 15.9992 15.9969C16.2352 15.9969 16.4672 15.8929 16.6232 15.6969C16.8992 15.3529 16.8431 14.8489 16.4992 14.5729L12.7992 11.6129V5.59686C12.7992 5.15686 12.4392 4.79688 11.9992 4.79688C11.5592 4.79688 11.1992 5.15686 11.1992 5.59686V11.9969C11.1992 12.2409 11.3112 12.4689 11.4992 12.6209L15.4992 15.8209Z" fill="currentColor"/>
                          </g>
                          <defs>
                           <clipPath>
                          <rect width="24" height="24" fill="white"/>
                          </clipPath>
                          </defs>
                        </svg>                      
                        <span>10.00 am</span>
                      </li>
                    </ul>
                  </div>
                  <h2 className="td_card_title td_fs_20 td_semibold td_mb_20">
                    <a href="event-details.html">Interview English Practice Session</a>
                  </h2>
                  <span className="td_card_location td_medium td_heading_color">
                    <svg className="td_accent_color" width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.0004 0.5C3.86669 0.5 0.554996 3.86526 0.500458 7.98242C0.48345 9.42271 0.942105 10.7046 1.56397 11.8232C2.76977 13.9928 4.04435 16.8182 5.32856 19.4639C5.9286 20.7002 6.89863 21.5052 8.0004 21.5C9.10217 21.4948 10.0665 20.6836 10.6575 19.4404C11.9197 16.7856 13.1685 13.9496 14.4223 11.835C15.1136 10.6691 15.4653 9.3606 15.4974 8.01758C15.5966 3.86772 12.1342 0.5 8.0004 0.5ZM8.0004 2.00586C11.3235 2.00586 14.0821 4.6775 14.0033 7.97363C13.9749 9.08002 13.6796 10.1416 13.1273 11.0732C11.7992 13.3133 10.5449 16.1706 9.2954 18.7988C8.85773 19.7191 8.35538 19.9924 7.98864 19.9941C7.62183 19.9959 7.12572 19.7246 6.68204 18.8105C5.41121 16.1923 4.12648 13.3534 2.87056 11.0938C2.32971 10.121 1.9798 9.11653 1.9946 8.00586C2.03995 4.67555 4.67723 2.00586 8.0004 2.00586ZM8.0004 4.25C5.94024 4.25 4.25034 5.94266 4.25034 8.00586C4.25034 10.0691 5.94024 11.75 8.0004 11.75C10.0605 11.75 11.7503 10.0691 11.7503 8.00586C11.7503 5.94266 10.0605 4.25 8.0004 4.25ZM8.0004 5.74414C9.25065 5.74414 10.2446 6.75372 10.2446 8.00586C10.2446 9.258 9.25065 10.2559 8.0004 10.2559C6.7501 10.2559 5.75331 9.258 5.75331 8.00586C5.75331 6.75372 6.7501 5.74414 8.0004 5.74414Z" fill="currentColor"/>
                    </svg>                    
                    Tsc Center, Northern Asia 
                  </span>
                </div>
              </div>
            </div>
            <div className="td_card td_style_1 td_type_1">
              <a href="event-details.html" className="td_card_thumb d-block">
                <img src="https://picsum.photos/seed/englishta-84/900/600" alt="">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
              <div className="td_card_info">
                <div className="td_card_info_in">
                  <div className="td_mb_20">
                    <ul className="td_card_meta td_mp_0 td_medium td_heading_color">
                      <li>
                        <svg className="td_accent_color" width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.3308 11.7869H19.0049C19.3833 11.7869 19.6913 11.479 19.6913 11.1005V9.42642C19.6913 9.04795 19.3833 8.74003 19.0049 8.74003H17.3308C16.9523 8.74003 16.6444 9.04795 16.6444 9.42642V11.1005C16.6444 11.479 16.9523 11.7869 17.3308 11.7869ZM17.3475 9.44316H18.9881V11.0838H17.3475V9.44316ZM17.3308 16.24H19.0049C19.3833 16.24 19.6913 15.9321 19.6913 15.5536V13.8795C19.6913 13.5011 19.3833 13.1932 19.0049 13.1932H17.3308C16.9523 13.1932 16.6444 13.5011 16.6444 13.8795V15.5536C16.6444 15.9321 16.9523 16.24 17.3308 16.24ZM17.3475 13.8963H18.9881V15.5369H17.3475V13.8963ZM12.5535 11.7869H14.2276C14.606 11.7869 14.914 11.479 14.914 11.1005V9.42642C14.914 9.04795 14.606 8.74003 14.2276 8.74003H12.5535C12.175 8.74003 11.8671 9.04795 11.8671 9.42642V11.1005C11.8671 11.479 12.175 11.7869 12.5535 11.7869ZM12.5702 9.44316H14.2108V11.0838H12.5702V9.44316ZM4.67294 17.4375H2.99884C2.62037 17.4375 2.31245 17.7454 2.31245 18.1239V19.798C2.31245 20.1765 2.62037 20.4844 2.99884 20.4844H4.67294C5.05141 20.4844 5.35933 20.1765 5.35933 19.798V18.1239C5.35933 17.7454 5.05141 17.4375 4.67294 17.4375ZM4.6562 19.7812H3.01558V18.1406H4.6562V19.7812ZM4.67294 8.74003H2.99884C2.62037 8.74003 2.31245 9.04795 2.31245 9.42642V11.1005C2.31245 11.479 2.62037 11.7869 2.99884 11.7869H4.67294C5.05141 11.7869 5.35933 11.479 5.35933 11.1005V9.42642C5.35933 9.04791 5.05141 8.74003 4.67294 8.74003ZM4.6562 11.0838H3.01558V9.44316H4.6562V11.0838ZM12.5535 16.1356H14.2276C14.606 16.1356 14.914 15.8277 14.914 15.4493V13.7752C14.914 13.3967 14.606 13.0888 14.2276 13.0888H12.5535C12.175 13.0888 11.8671 13.3967 11.8671 13.7752V15.4493C11.8671 15.8277 12.175 16.1356 12.5535 16.1356ZM12.5702 13.7919H14.2108V15.4325H12.5702V13.7919ZM20.0404 1.60659H18.5373V1.06908C18.5373 0.479578 18.0578 0 17.4683 0H17.3068C16.7174 0 16.2378 0.479578 16.2378 1.06908V1.60659H5.76592V1.06908C5.76592 0.479578 5.28634 0 4.69684 0H4.53541C3.94591 0 3.46633 0.479578 3.46633 1.06908V1.60659H1.96328C0.992734 1.60659 0.203125 2.3962 0.203125 3.36675V22.2422C0.203125 23.2115 0.991656 24 1.96094 24H20.0429C21.0122 24 21.8007 23.2115 21.8007 22.2422V3.36675C21.8006 2.3962 21.011 1.60659 20.0404 1.60659ZM16.9409 1.06908C16.9409 0.867281 17.1051 0.703125 17.3069 0.703125H17.4683C17.6701 0.703125 17.8343 0.867281 17.8343 1.06908V1.60659H16.9409V1.06908ZM4.1695 1.06908C4.1695 0.867281 4.33366 0.703125 4.53545 0.703125H4.69689C4.89869 0.703125 5.06284 0.867281 5.06284 1.06908V1.60659H4.16955V1.06908H4.1695ZM21.0975 22.2422C21.0975 22.8238 20.6244 23.2969 20.0428 23.2969H1.96089C1.37931 23.2969 0.906203 22.8238 0.906203 22.2422V22.24C1.20077 22.4619 1.56691 22.5938 1.96328 22.5938H16.2172C16.6873 22.5938 17.1294 22.4107 17.4618 22.0782L21.0975 18.4425V22.2422ZM17.1031 21.4425C17.1306 21.3288 17.1456 21.2101 17.1456 21.088V18.7413C17.1456 18.2988 17.5057 17.9387 17.9482 17.9387H20.2949C20.417 17.9387 20.5357 17.9237 20.6494 17.8962L17.1031 21.4425ZM21.0975 6.63066H6.11748C5.92333 6.63066 5.76592 6.78806 5.76592 6.98222C5.76592 7.17637 5.92333 7.33378 6.11748 7.33378H21.0975V16.4331C21.0975 16.8756 20.7375 17.2357 20.2949 17.2357H17.9482C17.118 17.2357 16.4425 17.9111 16.4425 18.7413V21.0881C16.4425 21.5306 16.0825 21.8907 15.64 21.8907H1.96328C1.38044 21.8907 0.90625 21.4165 0.90625 20.8336V7.33378H4.71123C4.90539 7.33378 5.0628 7.17637 5.0628 6.98222C5.0628 6.78806 4.90539 6.63066 4.71123 6.63066H0.906203V3.36675C0.906203 2.78391 1.38039 2.30972 1.96323 2.30972H3.46633V3.34341C3.46633 3.93291 3.94591 4.41248 4.53541 4.41248C4.72956 4.41248 4.88697 4.25508 4.88697 4.06092C4.88697 3.86677 4.72956 3.70936 4.53541 3.70936C4.33361 3.70936 4.16945 3.5452 4.16945 3.34341V2.30972H16.2378V3.34341C16.2378 3.93291 16.7174 4.41248 17.3069 4.41248C17.501 4.41248 17.6584 4.25508 17.6584 4.06092C17.6584 3.86677 17.501 3.70936 17.3069 3.70936C17.1051 3.70936 16.9409 3.5452 16.9409 3.34341V2.30972H20.0405C20.6233 2.30972 21.0975 2.78391 21.0975 3.36675V6.63066ZM4.67294 13.0888H2.99884C2.62037 13.0888 2.31245 13.3967 2.31245 13.7752V15.4493C2.31245 15.8277 2.62037 16.1356 2.99884 16.1356H4.67294C5.05141 16.1356 5.35933 15.8277 5.35933 15.4493V13.7752C5.35933 13.3966 5.05141 13.0888 4.67294 13.0888ZM4.6562 15.4325H3.01558V13.7919H4.6562V15.4325ZM7.77616 11.7869H9.45025C9.82872 11.7869 10.1366 11.479 10.1366 11.1005V9.42642C10.1366 9.04795 9.82872 8.74003 9.45025 8.74003H7.77616C7.39769 8.74003 7.08977 9.04795 7.08977 9.42642V11.1005C7.08977 11.479 7.39769 11.7869 7.77616 11.7869ZM7.79289 9.44316H9.43352V11.0838H7.79289V9.44316ZM12.5698 19.7812C12.5611 19.5948 12.4072 19.4464 12.2186 19.4464C12.0244 19.4464 11.867 19.6038 11.867 19.798C11.867 20.1765 12.175 20.4844 12.5534 20.4844H14.2275C14.606 20.4844 14.9139 20.1765 14.9139 19.798V18.1239C14.9139 17.7454 14.606 17.4375 14.2275 17.4375H12.5534C12.175 17.4375 11.867 17.7454 11.867 18.1239V18.6067C11.867 18.8009 12.0244 18.9583 12.2186 18.9583C12.4127 18.9583 12.5702 18.8009 12.5702 18.6067V18.1406H14.2108V19.7812H12.5698ZM7.77616 16.1356H9.45025C9.82872 16.1356 10.1366 15.8277 10.1366 15.4493V13.7752C10.1366 13.3967 9.82872 13.0888 9.45025 13.0888H7.77616C7.39769 13.0888 7.08977 13.3967 7.08977 13.7752V15.4493C7.08977 15.8277 7.39769 16.1356 7.77616 16.1356ZM7.79289 13.7919H9.43352V15.4325H7.79289V13.7919ZM7.77616 20.4844H9.45025C9.82872 20.4844 10.1366 20.1765 10.1366 19.798V18.1239C10.1366 17.7454 9.82872 17.4375 9.45025 17.4375H7.77616C7.39769 17.4375 7.08977 17.7454 7.08977 18.1239V19.798C7.08977 20.1765 7.39769 20.4844 7.77616 20.4844ZM7.79289 18.1406H9.43352V19.7812H7.79289V18.1406Z" fill="currentColor"/>
                        </svg>
                        <span>Jan 23 , 2024</span>
                      </li>
                      <li>
                        <svg className="td_accent_color" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g >
                          <path d="M12 24C18.616 24 24 18.616 24 12C24 5.38401 18.6161 0 12 0C5.38394 0 0 5.38401 0 12C0 18.616 5.38401 24 12 24ZM12 1.59997C17.736 1.59997 22.4 6.26396 22.4 12C22.4 17.736 17.736 22.4 12 22.4C6.26396 22.4 1.59997 17.736 1.59997 12C1.59997 6.26396 6.26402 1.59997 12 1.59997Z" fill="currentColor"/>
                          <path d="M15.4992 15.8209C15.6472 15.9408 15.8232 15.9969 15.9992 15.9969C16.2352 15.9969 16.4672 15.8929 16.6232 15.6969C16.8992 15.3529 16.8431 14.8489 16.4992 14.5729L12.7992 11.6129V5.59686C12.7992 5.15686 12.4392 4.79688 11.9992 4.79688C11.5592 4.79688 11.1992 5.15686 11.1992 5.59686V11.9969C11.1992 12.2409 11.3112 12.4689 11.4992 12.6209L15.4992 15.8209Z" fill="currentColor"/>
                          </g>
                          <defs>
                           <clipPath>
                          <rect width="24" height="24" fill="white"/>
                          </clipPath>
                          </defs>
                        </svg>                      
                        <span>10.00 am</span>
                      </li>
                    </ul>
                  </div>
                  <h2 className="td_card_title td_fs_20 td_semibold td_mb_20">
                    <a href="event-details.html">Pronunciation and Fluency Workshop</a>
                  </h2>
                  <span className="td_card_location td_medium td_heading_color">
                    <svg className="td_accent_color" width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.0004 0.5C3.86669 0.5 0.554996 3.86526 0.500458 7.98242C0.48345 9.42271 0.942105 10.7046 1.56397 11.8232C2.76977 13.9928 4.04435 16.8182 5.32856 19.4639C5.9286 20.7002 6.89863 21.5052 8.0004 21.5C9.10217 21.4948 10.0665 20.6836 10.6575 19.4404C11.9197 16.7856 13.1685 13.9496 14.4223 11.835C15.1136 10.6691 15.4653 9.3606 15.4974 8.01758C15.5966 3.86772 12.1342 0.5 8.0004 0.5ZM8.0004 2.00586C11.3235 2.00586 14.0821 4.6775 14.0033 7.97363C13.9749 9.08002 13.6796 10.1416 13.1273 11.0732C11.7992 13.3133 10.5449 16.1706 9.2954 18.7988C8.85773 19.7191 8.35538 19.9924 7.98864 19.9941C7.62183 19.9959 7.12572 19.7246 6.68204 18.8105C5.41121 16.1923 4.12648 13.3534 2.87056 11.0938C2.32971 10.121 1.9798 9.11653 1.9946 8.00586C2.03995 4.67555 4.67723 2.00586 8.0004 2.00586ZM8.0004 4.25C5.94024 4.25 4.25034 5.94266 4.25034 8.00586C4.25034 10.0691 5.94024 11.75 8.0004 11.75C10.0605 11.75 11.7503 10.0691 11.7503 8.00586C11.7503 5.94266 10.0605 4.25 8.0004 4.25ZM8.0004 5.74414C9.25065 5.74414 10.2446 6.75372 10.2446 8.00586C10.2446 9.258 9.25065 10.2559 8.0004 10.2559C6.7501 10.2559 5.75331 9.258 5.75331 8.00586C5.75331 6.75372 6.7501 5.74414 8.0004 5.74414Z" fill="currentColor"/>
                    </svg>                    
                    Tsc Center, Northern Asia 
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="td_height_120 td_height_lg_80"></div>
    </section>
    
    
    <section className="td_heading_bg td_hobble">
      <div className="td_height_112 td_height_lg_75"></div>
      <div className="container">
        <div className="td_section_heading td_style_1 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
          <h2 className="td_section_title td_fs_48 mb-0 td_white_color">Start Speaking English With Us</h2>
          <p className="td_section_subtitle td_fs_18 mb-0 td_white_color td_opacity_7">Join Englishta online classes from Nashik and build fluency through <br>conversation practice, grammar correction, and confidence coaching. </p>
        </div>
        <div className="td_height_50 td_height_lg_50"></div>
        <div className="row align-items-center td_gap_y_40">
          <div className="col-lg-6 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
            <div className="td_testimonial_img_wrap">
              <img src="/assets/images/testimonial.png" alt="" className="td_testimonial_img">
              <span className="td_testimonial_img_shape_1"><span></span></span>
              <span className="td_testimonial_img_shape_2 td_accent_color td_hover_layer_3">
                <svg width="145" height="165" viewBox="0 0 145 165" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M145.003 25.9077L139.516 27.7024L143.814 31.5573L145.003 25.9077ZM69.5244 11.4999L69.2176 11.1051L69.5244 11.4999ZM69.5244 53.0379L69.3973 53.5215L69.5244 53.0379ZM141.65 28.8989C135.031 35.2997 125.943 38.4375 116.315 39.2654C106.688 40.0931 96.561 38.607 87.9207 35.8021C79.2649 32.9923 72.1739 28.8832 68.5572 24.5234C66.753 22.3484 65.8508 20.1579 65.9824 18.0635C66.1133 15.9807 67.2739 13.8818 69.8312 11.8948L69.2176 11.1051C66.5057 13.2123 65.1383 15.552 64.9844 18.0007C64.8313 20.4378 65.8877 22.8715 67.7876 25.1618C71.5792 29.7325 78.8783 33.9182 87.6119 36.7533C96.361 39.5934 106.622 41.1025 116.4 40.2617C126.177 39.4211 135.511 36.2268 142.346 29.6178L141.65 28.8989ZM69.8312 11.8948C76.1217 7.00714 81.1226 4.09865 85.0169 2.71442C88.9178 1.32781 91.6197 1.49918 93.4091 2.61867C95.1994 3.73872 96.231 5.90455 96.5629 8.8701C96.894 11.8276 96.5159 15.4895 95.5803 19.4474C93.7094 27.3612 89.6393 36.3356 84.7843 42.9886C82.3565 46.3156 79.7503 49.0371 77.1481 50.7594C74.545 52.4823 72.001 53.1717 69.6515 52.5543L69.3973 53.5215C72.1238 54.238 74.964 53.4042 77.7 51.5933C80.437 49.7818 83.1248 46.9592 85.5921 43.578C90.5275 36.8148 94.6527 27.7176 96.5534 19.6775C97.5035 15.6584 97.9053 11.8728 97.5567 8.75886C97.2091 5.65298 96.1014 3.12347 93.9395 1.77091C91.7766 0.417783 88.7131 0.33927 84.6819 1.77217C80.6441 3.20744 75.5463 6.18784 69.2176 11.1051L69.8312 11.8948ZM69.6515 52.5543C56.6241 49.1307 47.457 52.0938 41.14 58.6639C34.8623 65.1932 31.4678 75.2154 29.7777 85.7878C28.0854 96.3743 28.0905 107.589 28.673 116.58C28.9644 121.078 29.4007 125.024 29.843 128.065C30.2827 131.086 30.7341 133.255 31.0666 134.168L32.0062 133.825C31.7138 133.023 31.2736 130.952 30.8326 127.921C30.3942 124.908 29.9607 120.988 29.6709 116.516C29.0912 107.568 29.0886 96.4337 30.7652 85.9456C32.444 75.4434 35.7949 65.6661 41.8608 59.357C47.8875 53.0888 56.6625 50.1748 69.3973 53.5215L69.6515 52.5543Z" fill="white"/>
                  <circle cx="34" cy="150" r="15" fill="currentColor"/>
                  <circle cx="15" cy="137" r="15" fill="currentColor"/>
                  <circle cx="24" cy="144" r="15" fill="white"/>
                </svg>                  
              </span>
            </div>
          </div>
          <div className="col-lg-6 wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.2s">
            <div className="td_slider td_style_1">
              <div className="td_slider_container" data-autoplay="0" data-loop="1" data-speed="800" data-center="0" data-variable-width="0" data-slides-per-view="1">
                <div className="td_slider_wrapper">
                  <div className="td_slide">
                    <div className="td_testimonial td_style_1 td_white_bg td_radius_5">
                      <span className="td_quote_icon td_accent_color">
                        <svg width="65" height="46" viewBox="0 0 65 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path opacity="0.05" d="M13.9286 26.6H1V1H26.8571V27.362L17.956 45H6.26764L14.8213 28.0505L15.5534 26.6H13.9286ZM51.0714 26.6H38.1429V1H64V27.362L55.0988 45H43.4105L51.9642 28.0505L52.6962 26.6H51.0714Z" fill="currentColor" stroke="currentColor" stroke-width="2"/>
                        </svg>
                      </span>              
                      <div className="td_testimonial_meta td_mb_24">
                        <img src="https://picsum.photos/seed/englishta-86/900/600" alt="">
                        <div className="td_testimonial_meta_right">
                          <h3 className="td_fs_24 td_semibold td_mb_2">Rohit Patil</h3>
                          <p className="td_fs_14 mb-0 td_heading_color td_opacity_7">Online Spoken English Learner</p>
                        </div>
                      </div>
                      <blockquote className="td_testimonial_text td_fs_20 td_medium td_heading_color td_mb_24 td_opacity_9">Englishta helped me speak without fear. The online sessions are practical, friendly, and focused on real conversations.</blockquote>
                      <div className="td_rating" data-rating="5">
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <div className="td_rating_percentage">
                          <i className="fa-solid fa-star fa-fw"></i>
                          <i className="fa-solid fa-star fa-fw"></i>
                          <i className="fa-solid fa-star fa-fw"></i>
                          <i className="fa-solid fa-star fa-fw"></i>
                          <i className="fa-solid fa-star fa-fw"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="td_slide">
                    <div className="td_testimonial td_style_1 td_white_bg td_radius_5">
                      <span className="td_quote_icon td_accent_color">
                        <svg width="65" height="46" viewBox="0 0 65 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path opacity="0.05" d="M13.9286 26.6H1V1H26.8571V27.362L17.956 45H6.26764L14.8213 28.0505L15.5534 26.6H13.9286ZM51.0714 26.6H38.1429V1H64V27.362L55.0988 45H43.4105L51.9642 28.0505L52.6962 26.6H51.0714Z" fill="currentColor" stroke="currentColor" stroke-width="2"/>
                        </svg>
                      </span>              
                      <div className="td_testimonial_meta td_mb_24">
                        <img src="https://picsum.photos/seed/englishta-87/900/600" alt="">
                        <div className="td_testimonial_meta_right">
                          <h3 className="td_fs_24 td_semibold td_mb_2">Sneha Kulkarni</h3>
                          <p className="td_fs_14 mb-0 td_heading_color td_opacity_7">Interview English Learner</p>
                        </div>
                      </div>
                      <blockquote className="td_testimonial_text td_fs_20 td_medium td_heading_color td_mb_24 td_opacity_9">Englishta helped me speak without fear. The online sessions are practical, friendly, and focused on real conversations.</blockquote>
                      <div className="td_rating" data-rating="4.5">
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <div className="td_rating_percentage">
                          <i className="fa-solid fa-star fa-fw"></i>
                          <i className="fa-solid fa-star fa-fw"></i>
                          <i className="fa-solid fa-star fa-fw"></i>
                          <i className="fa-solid fa-star fa-fw"></i>
                          <i className="fa-solid fa-star fa-fw"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="td_height_120 td_height_lg_80"></div>
    </section>
    
    
    <section>
      <div className="td_height_112 td_height_lg_75"></div>
      <div className="container">
        <div className="td_section_heading td_style_1 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
          <p className="td_section_subtitle_up td_fs_18 td_semibold td_spacing_1 td_mb_10 text-uppercase td_accent_color">BLOG & TIPS</p>
          <h2 className="td_section_title td_fs_48 mb-0">English Speaking Tips <br>From Englishta</h2>
        </div>
        <div className="td_height_50 td_height_lg_50"></div>
        <div className="row td_gap_y_30">
          <div className="col-lg-4 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
            <div className="td_post td_style_1">
              <a href="blog-details.html" className="td_post_thumb d-block">
                <img src="https://picsum.photos/seed/englishta-88/900/600" alt="">
                <i className="fa-solid fa-link"></i>
              </a>
              <div className="td_post_info">
                <div className="td_post_meta td_fs_14 td_medium td_mb_20">
                  <span><img src="https://picsum.photos/seed/englishta-89/900/600" alt="">Jan 23 , 2024</span>
                  <span><img src="https://picsum.photos/seed/englishta-90/900/600" alt="">Englishta Team</span>
                </div>
                <h2 className="td_post_title td_fs_24 td_medium td_mb_16">
                  <a href="blog-details.html">How to Start Speaking English Every Day</a>
                </h2>
                <p className="td_post_subtitle td_mb_24 td_heading_color td_opacity_7">Simple tips to improve fluency, clarity, and confidence in daily English.</p>
                <a href="blog-details.html" className="td_btn td_style_1 td_type_3 td_radius_30 td_medium">
                  <span className="td_btn_in td_accent_color">
                    <span>Read More</span>
                  </span>             
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
            <div className="td_post td_style_1">
              <a href="blog-details.html" className="td_post_thumb d-block">
                <img src="https://picsum.photos/seed/englishta-91/900/600" alt="">
                <i className="fa-solid fa-link"></i>
              </a>
              <div className="td_post_info">
                <div className="td_post_meta td_fs_14 td_medium td_mb_20">
                  <span><img src="https://picsum.photos/seed/englishta-92/900/600" alt="">Jan 20 , 2024</span>
                  <span><img src="https://picsum.photos/seed/englishta-93/900/600" alt="">Englishta Team</span>
                </div>
                <h2 className="td_post_title td_fs_24 td_medium td_mb_16">
                  <a href="blog-details.html">Common Grammar Mistakes While Speaking</a>
                </h2>
                <p className="td_post_subtitle td_mb_24 td_heading_color td_opacity_7">Simple tips to improve fluency, clarity, and confidence in daily English.</p>
                <a href="blog-details.html" className="td_btn td_style_1 td_type_3 td_radius_30 td_medium">
                  <span className="td_btn_in td_accent_color">
                    <span>Read More</span>
                  </span>             
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.4s">
            <div className="td_post td_style_1">
              <a href="blog-details.html" className="td_post_thumb d-block">
                <img src="https://picsum.photos/seed/englishta-94/900/600" alt="">
                <i className="fa-solid fa-link"></i>
              </a>
              <div className="td_post_info">
                <div className="td_post_meta td_fs_14 td_medium td_mb_20">
                  <span><img src="https://picsum.photos/seed/englishta-95/900/600" alt="">Jan 18 , 2024</span>
                  <span><img src="https://picsum.photos/seed/englishta-96/900/600" alt="">Englishta Team</span>
                </div>
                <h2 className="td_post_title td_fs_24 td_medium td_mb_16">
                  <a href="blog-details.html">How to Prepare for an English Interview</a>
                </h2>
                <p className="td_post_subtitle td_mb_24 td_heading_color td_opacity_7">Simple tips to improve fluency, clarity, and confidence in daily English.</p>
                <a href="blog-details.html" className="td_btn td_style_1 td_type_3 td_radius_30 td_medium">
                  <span className="td_btn_in td_accent_color">
                    <span>Read More</span>
                  </span>             
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="td_height_120 td_height_lg_80"></div>
    </section>

    
    
    <div className="td_scrollup">
      <i className="fa-solid fa-arrow-up"></i>
    </div>
    `;

const normalizeInjectedHtml = (html) =>
  html
    .replaceAll("className=", "class=")
    .replaceAll("clipPath=", "clip-path=")
    .replaceAll("strokeWidth=", "stroke-width=")
    .replaceAll("strokeLinecap=", "stroke-linecap=")
    .replaceAll("strokeLinejoin=", "stroke-linejoin=");

const pageHtml = normalizeInjectedHtml(rawPageHtml)
  .replace(
    /<section>\s*<div class="td_height_120 td_height_lg_80"><\/div>\s*<div class="container">\s*<div class="td_features td_style_1 td_hobble">[\s\S]*?<\/section>/,
    "__ENGLISHTA_ANYWHERE_SECTION__",
  )
  .replace(
    /<section class="branddarkenglishta td_shape_section_1 td_video_showcase">[\s\S]*?<\/section>/,
    "__ENGLISHTA_VIDEO_SECTION__",
  )
  .replace(
    /<section>\s*<div class="td_height_112 td_height_lg_75"><\/div>\s*<div class="container">\s*<div class="td_section_heading td_style_1 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">\s*<p class="td_section_subtitle_up td_fs_18 td_semibold td_spacing_1 td_mb_10 text-uppercase td_accent_color">Departments<\/p>\s*<h2 class="td_section_title td_fs_48 mb-0">Popular Training Areas<\/h2>[\s\S]*?<\/section>/,
    "__ENGLISHTA_TRAINING_AREAS__",
  )
  .replace(
    /<section class="td_heading_bg td_hobble">[\s\S]*?<\/section>/,
    "__ENGLISHTA_TESTIMONIALS__",
  );

const Preloader = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="td_preloader">
      <div className="td_preloader_in">
        <span />
        <span />
      </div>
    </div>
  );
};

const HomeBanner = ({ isReady = false }) => {
  return (
    <section
      className={isReady ? "englishtaHeroShade englishtaHeroShade--ready" : "englishtaHeroShade"}
      aria-label="Online English speaking course"
    >
      <div className="englishtaHeroShade__content wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.15s">
        <p className="englishtaHeroShade__proof">Trusted by 10,000+ learners</p>
        <h1 className="englishtaHeroShade__headline">
          Speak English Confidently.
          <span>Anytime. Anywhere.</span>
        </h1>
        <div className="englishtaHeroShade__actions">
          <a href="/contact-us" className="englishtaHeroShade__cta englishtaHeroShade__cta--primary">
            Join Free Demo Class
          </a>
          <a href="/courses" className="englishtaHeroShade__cta englishtaHeroShade__cta--secondary">
            Explore Courses
          </a>
        </div>
      </div>

      <div className="englishtaHeroShade__features wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.25s" aria-label="Course highlights">
        <div className="englishtaHeroShade__feature">
          <i className="fa-solid fa-chart-simple" />
          <span>Live online speaking practice</span>
        </div>
        <div className="englishtaHeroShade__feature">
          <i className="fa-solid fa-user-group" />
          <span>Personal feedback from expert tutor</span>
        </div>
        <div className="englishtaHeroShade__feature">
          <i className="fa-solid fa-location-dot" />
          <span>Fluency for interviews and daily life</span>
        </div>
      </div>
    </section>
  );
};

const videoCards = [
  {
    title: "Free English Speaking Demo",
    label: "Live",
    channel: "Live One-to-One English Community",
    image:
      "https://images.unsplash.com/photo-1573496773905-f5b17e717f05?auto=format&fit=crop&w=1400&q=80",
    className: "englishtaVideoShowcase__card--featured englishtaVideoShowcase__card--tiltLeft",
  },
  {
    title: "Interview English Lessons",
    channel: "Englishta Videos",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    className: "englishtaVideoShowcase__card--tiltRight",
  },
  {
    title: "Pronunciation Practice Tips",
    channel: "Englishta Videos",
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1400&q=80",
    className: "englishtaVideoShowcase__card--tiltSoftLeft",
  },
  {
    title: "Flexible Batches",
    channel: "Englishta Videos",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80",
    className: "englishtaVideoShowcase__card--tiltSoftRight",
  },
];

const trainingAreas = [
  {
    title: "Conversation Practice",
    description:
      "Build fluency and confidence through real-life conversations and interactive speaking sessions.",
    highlight: "Speak Naturally",
    detail: "in Everyday Situations",
    logo: "/assets/images/logo/conversation.png",
    tone: "gold",
  },
  {
    title: "Interview Preparation",
    description:
      "Master interview skills with expert guidance, mock interviews, and personalized feedback.",
    highlight: "Crack Interviews",
    detail: "with Confidence",
    logo: "/assets/images/logo/interviewpre.png",
    tone: "orange",
  },
  {
    title: "Pronunciation Training",
    description:
      "Improve your pronunciation, clarity, and accent with focused practice and expert correction.",
    highlight: "Speak Clearly",
    detail: "and Confidently",
    logo: "/assets/images/logo/pronounce.png",
    tone: "violet",
  },
  {
    title: "Corporate Communication",
    description:
      "Enhance professional communication skills for meetings, presentations, emails, and more.",
    highlight: "Communicate Professionally",
    detail: "in the Workplace",
    logo: "/assets/images/logo/corporate.png",
    tone: "blue",
  },
];

const videoCardClasses = [
  "englishtaVideoShowcase__card--featured englishtaVideoShowcase__card--tiltLeft",
  "englishtaVideoShowcase__card--tiltRight",
  "englishtaVideoShowcase__card--tiltSoftLeft",
  "englishtaVideoShowcase__card--tiltSoftRight",
];

const defaultTestimonials = [
  {
    studentName: "Rohit Patil",
    course: "Online Spoken English Learner",
    rating: "5",
    review: "Englishta helped me speak without fear. The online sessions are practical, friendly, and focused on real conversations.",
  },
  {
    studentName: "Sneha Kulkarni",
    course: "Interview English Learner",
    rating: "5",
    review: "I became much more confident in interviews. The trainer corrected my mistakes clearly and kept the practice very real.",
  },
];

const learningAnywhereFeatures = [
  {
    icon: "fa-solid fa-video",
    title: "Live Online Classes",
    text: "Join guided English sessions from home with real speaking practice and live correction.",
  },
  {
    icon: "fa-solid fa-comments",
    title: "Daily Speaking Practice",
    text: "Build fluency step by step through conversation tasks, confidence drills, and repetition.",
  },
  {
    icon: "fa-solid fa-user-check",
    title: "Personal Feedback",
    text: "Get direct support on pronunciation, grammar usage, clarity, and interview communication.",
  },
  {
    icon: "fa-solid fa-briefcase",
    title: "Career-Focused English",
    text: "Prepare for interviews, workplace communication, public speaking, and professional growth.",
  },
];

const renderStars = (ratingValue) => {
  const rating = Math.max(0, Math.min(5, Number.parseInt(ratingValue || "5", 10) || 0));

  return Array.from({ length: 5 }).map((_, index) => (
    <i
      className={index < rating ? "fa-solid fa-star" : "fa-regular fa-star"}
      key={`star-${rating}-${index}`}
    ></i>
  ));
};

const VideoShowcase = ({ videos = [] }) => {
  const displayVideos = videos.length
    ? videos.slice(0, 4).map((video, index) => ({
      ...video,
      className: videoCardClasses[index] ?? videoCardClasses[videoCardClasses.length - 1],
    }))
    : videoCards;
  const hasBackendVideos = videos.length > 0;

  return (
    <section className="englishtaVideoShowcase">
      <span className="englishtaVideoShowcase__spark englishtaVideoShowcase__spark--one" />
      <span className="englishtaVideoShowcase__spark englishtaVideoShowcase__spark--two" />
      <span className="englishtaVideoShowcase__triangle" />
      <div className="englishtaVideoShowcase__shell">
        <div className="englishtaVideoShowcase__intro wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.15s">
          <h2>
            Watch Real
            <span>English Training</span>
            <span>Sessions</span>
          </h2>
          <p>
            Watch practical Englishta lessons, demo classes, pronunciation tips, and speaking practice videos designed
            for online English learners.
          </p>
          <div className="englishtaVideoShowcase__trail" aria-hidden="true">
            <span className="englishtaVideoShowcase__trailArc" />
            <span className="englishtaVideoShowcase__trailArrow">➜</span>
            <span className="englishtaVideoShowcase__trailTag">Videos</span>
          </div>
        </div>

        <div className="englishtaVideoShowcase__grid">
          {displayVideos.map((video, index) => (
            <div
              className={`englishtaVideoShowcase__card ${video.className} wow fadeInUp`}
              data-wow-duration="1s"
              data-wow-delay={`${0.15 + index * 0.1}s`}
              key={video._id ?? video.title}
            >
              {video.youtubeIframe ? (
                <span
                  className="englishtaVideoShowcase__iframe"
                  dangerouslySetInnerHTML={{ __html: video.youtubeIframe }}
                />
              ) : (
                <img src={video.image} alt={video.title} />
              )}
              {!hasBackendVideos ? <span className="englishtaVideoShowcase__overlay" /> : null}
              {!hasBackendVideos && index === 0 ? (
                <>
                  <span className="englishtaVideoShowcase__cardMeta">
                    <span className="englishtaVideoShowcase__avatar">E</span>
                    <span>
                      <strong>{video.channel}</strong>
                      <span>Prof. Raj Shekle</span>
                    </span>
                  </span>
                  <span className="englishtaVideoShowcase__play">
                    <i className="fa-brands fa-youtube" />
                  </span>
                  <span className="englishtaVideoShowcase__liveTag">{video.label}</span>
                </>
              ) : null}
              {!hasBackendVideos ? <span className="englishtaVideoShowcase__network" /> : null}
              {!hasBackendVideos ? (
                <span className="englishtaVideoShowcase__cardTitle">
                  <h3>{video.title}</h3>
                  <span>↗</span>
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LearningAnywhereSection = () => {
  return (
    <section className="englishtaAnywhereSection">
      <div className="englishtaAnywhereSection__image">
        <img src="/assets/images/whyenglishta.jpg" alt="Learn English from anywhere with Englishta" />
      </div>
      <div className="container">
        <div className="englishtaAnywhereSection__card wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.15s">
          <div className="englishtaAnywhereSection__heading">
          
            <h3>Learn English From Anywhere</h3>
          </div>
          <div className="englishtaAnywhereSection__grid">
            {learningAnywhereFeatures.map((item) => (
              <article className="englishtaAnywhereFeature" key={item.title}>
                <span className="englishtaAnywhereFeature__icon">
                  <i className={item.icon} />
                </span>
                <div>
                  <h5>{item.title}</h5>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const PopularTrainingAreas = () => {
  return (
    <section className="englishtaTrainingAreas">
      <div className="container">
        <div className="englishtaTrainingAreas__header wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.15s">
          <p className="englishtaTrainingAreas__eyebrow">
            <i className="fa-solid fa-graduation-cap" />
            <span>Our Departments</span>
          </p>
          <h2>
            Popular <span>Training Areas</span>
          </h2>
          <p>
            Improve spoken English online with structured lessons, live practice,
            vocabulary building, pronunciation correction, and confidence-focused
            coaching.
          </p>
          <span className="englishtaTrainingAreas__divider" aria-hidden="true" />
        </div>

        <div className="englishtaTrainingAreas__grid">
          {trainingAreas.map((item, index) => (
            <article
              key={item.title}
              className={`englishtaTrainingAreas__card englishtaTrainingAreas__card--${item.tone} wow fadeInUp`}
              data-wow-duration="1s"
              data-wow-delay={`${0.2 + index * 0.1}s`}
            >
              <div className="englishtaTrainingAreas__art" aria-hidden="true">
                <img src={item.logo} alt="" />
              </div>
              <div className="englishtaTrainingAreas__iconWrap">
                <span className="englishtaTrainingAreas__iconGlow" aria-hidden="true" />
                <img src={item.logo} alt={item.title} className="englishtaTrainingAreas__iconImage" />
              </div>
              <h3>{item.title}</h3>
              <span className="englishtaTrainingAreas__line" aria-hidden="true" />
              <p>{item.description}</p>

              <div className="englishtaTrainingAreas__pill d-flex justify-content-center">
               
                <div className="text-center">
                  <strong>{item.highlight}</strong>
                  <span className="mt-1">{item.detail}</span>
                </div>
              </div>

              <a href="/courses" className="englishtaTrainingAreas__arrow">
                <i className="fa-solid fa-arrow-right" />
              </a>
            </article>
          ))}
        </div>

        <div className="englishtaTrainingAreas__footer wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.35s">
          <a href="/courses" className="englishtaTrainingAreas__cta">
            <i className="fa-solid fa-star" />
            <span>Explore All Courses</span>
            <span className="englishtaTrainingAreas__ctaArrow">
              <i className="fa-solid fa-arrow-right" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

const TestimonialsShowcase = ({ testimonials = [] }) => {
  const visibleTestimonials = testimonials.length
    ? testimonials.filter((item) => item.visible !== "No").slice(0, 6)
    : defaultTestimonials;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (visibleTestimonials.length <= 1) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visibleTestimonials.length);
    }, 3500);

    return () => window.clearInterval(timerId);
  }, [visibleTestimonials.length]);

  return (
    <section className="td_heading_bg td_hobble">
      <div className="td_height_112 td_height_lg_75"></div>
      <div className="container">
        <div className="td_section_heading td_style_1 text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
          <h2 className="td_section_title td_fs_48 mb-0 td_white_color">Start Speaking English With Us</h2>
          <p className="td_section_subtitle td_fs_18 mb-0 td_white_color td_opacity_7">
            Join Englishta online classes from Nashik and build fluency through
            <br />
            conversation practice, grammar correction, and confidence coaching.
          </p>
        </div>
        <div className="td_height_50 td_height_lg_50"></div>
        <div className="row align-items-center td_gap_y_40">
          <div className="col-lg-6 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
            <div className="td_testimonial_img_wrap">
              <img src="/assets/images/testimonial.png" alt="" className="td_testimonial_img" />
              <span className="td_testimonial_img_shape_1"><span></span></span>
              <span className="td_testimonial_img_shape_2 td_accent_color td_hover_layer_3">
                <svg width="145" height="165" viewBox="0 0 145 165" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M145.003 25.9077L139.516 27.7024L143.814 31.5573L145.003 25.9077ZM69.5244 11.4999L69.2176 11.1051L69.5244 11.4999ZM69.5244 53.0379L69.3973 53.5215L69.5244 53.0379ZM141.65 28.8989C135.031 35.2997 125.943 38.4375 116.315 39.2654C106.688 40.0931 96.561 38.607 87.9207 35.8021C79.2649 32.9923 72.1739 28.8832 68.5572 24.5234C66.753 22.3484 65.8508 20.1579 65.9824 18.0635C66.1133 15.9807 67.2739 13.8818 69.8312 11.8948L69.2176 11.1051C66.5057 13.2123 65.1383 15.552 64.9844 18.0007C64.8313 20.4378 65.8877 22.8715 67.7876 25.1618C71.5792 29.7325 78.8783 33.9182 87.6119 36.7533C96.361 39.5934 106.622 41.1025 116.4 40.2617C126.177 39.4211 135.511 36.2268 142.346 29.6178L141.65 28.8989Z" fill="white"/>
                  <circle cx="34" cy="150" r="15" fill="currentColor" />
                  <circle cx="15" cy="137" r="15" fill="currentColor" />
                  <circle cx="24" cy="144" r="15" fill="white" />
                </svg>
              </span>
            </div>
          </div>
          <div className="col-lg-6 wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.2s">
            <div className="englishtaTestimonialsSlider">
              <div
                className="englishtaTestimonialsTrack"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
              {visibleTestimonials.map((item, index) => (
                <div className="englishtaTestimonialsSlide" key={item._id ?? `${item.studentName}-${index}`}>
                  <div className="td_testimonial td_style_1 td_white_bg td_radius_5 englishtaTestimonialCard">
                    <span className="td_quote_icon td_accent_color">
                      <svg width="65" height="46" viewBox="0 0 65 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.05" d="M13.9286 26.6H1V1H26.8571V27.362L17.956 45H6.26764L14.8213 28.0505L15.5534 26.6H13.9286ZM51.0714 26.6H38.1429V1H64V27.362L55.0988 45H43.4105L51.9642 28.0505L52.6962 26.6H51.0714Z" fill="currentColor" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </span>
                    <div className="td_testimonial_meta td_mb_24">
                      <span className="englishtaTestimonialAvatar">{item.studentName?.charAt(0) || "E"}</span>
                      <div className="td_testimonial_meta_right">
                        <h3 className="td_fs_24 td_semibold td_mb_2">{item.studentName}</h3>
                        <p className="td_fs_14 mb-0 td_heading_color td_opacity_7">{item.course}</p>
                      </div>
                    </div>
                    <blockquote className="td_testimonial_text td_fs_20 td_medium td_heading_color td_mb_24 td_opacity_9">
                      {item.review}
                    </blockquote>
                    <div className="englishtaTestimonialStars" aria-label={`${item.rating || "5"} out of 5 stars`}>
                      {renderStars(item.rating)}
                    </div>
                  </div>
                </div>
              ))}
              </div>
              {visibleTestimonials.length > 1 ? (
                <div className="englishtaTestimonialsDots">
                  {visibleTestimonials.map((item, index) => (
                    <button
                      type="button"
                      key={item._id ?? `${item.studentName}-dot-${index}`}
                      className={activeIndex === index ? "active" : ""}
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Show testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="td_height_120 td_height_lg_80"></div>
    </section>
  );
};

const Home = () => {
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isHeroReady, setIsHeroReady] = useState(false);
  const handlePreloaderComplete = useCallback(() => {
    setIsHeroReady(true);
  }, []);
  const { beforeAnywhere, betweenAnywhereAndVideos, betweenSections, beforeTestimonials, afterTestimonials } = useMemo(() => {
    const [before = "", afterAnywhere = ""] = pageHtml.split("__ENGLISHTA_ANYWHERE_SECTION__");
    const [afterAnywhereBeforeVideo = "", afterVideo = ""] = afterAnywhere.split("__ENGLISHTA_VIDEO_SECTION__");
    const [between = "", afterTraining = ""] = afterVideo.split("__ENGLISHTA_TRAINING_AREAS__");
    const [beforeCustomTestimonials = "", afterCustomTestimonials = ""] = afterTraining.split("__ENGLISHTA_TESTIMONIALS__");

    return {
      beforeAnywhere: before,
      betweenAnywhereAndVideos: afterAnywhereBeforeVideo,
      betweenSections: between,
      beforeTestimonials: beforeCustomTestimonials,
      afterTestimonials: afterCustomTestimonials,
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/youtube-videos", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (isMounted && payload.success) {
          setYoutubeVideos(payload.data.filter((video) => video.visible !== "No"));
        }
      })
      .catch(() => {
        if (isMounted) {
          setYoutubeVideos([]);
        }
      });

    fetch("/api/testimonials", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (isMounted && payload.success) {
          setTestimonials(payload.data.filter((item) => item.visible !== "No"));
        }
      })
      .catch(() => {
        if (isMounted) {
          setTestimonials([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Preloader onComplete={handlePreloaderComplete} />
      <Navbar />
      <HomeBanner isReady={isHeroReady} />
      <div className="legacyHomeContent" dangerouslySetInnerHTML={{ __html: beforeAnywhere }} />
      <LearningAnywhereSection />
      <div className="legacyHomeContent" dangerouslySetInnerHTML={{ __html: betweenAnywhereAndVideos }} />
      <VideoShowcase videos={youtubeVideos} />
      <div className="legacyHomeContent" dangerouslySetInnerHTML={{ __html: betweenSections }} />
      <PopularTrainingAreas />
      <div className="legacyHomeContent" dangerouslySetInnerHTML={{ __html: beforeTestimonials }} />
      <TestimonialsShowcase testimonials={testimonials} />
      <div className="legacyHomeContent" dangerouslySetInnerHTML={{ __html: afterTestimonials }} />
      <Footer />
    </>
  );
};

export default Home;

