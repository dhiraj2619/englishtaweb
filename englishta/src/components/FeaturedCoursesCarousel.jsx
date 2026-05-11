"use client";

import { useEffect, useRef } from "react";

export default function FeaturedCoursesCarousel({ courses }) {
  const carouselRef = useRef(null);

  useEffect(() => {
    let attempts = 0;
    let timerId;

    const initCarousel = () => {
      const $ = window.jQuery;
      const node = carouselRef.current;

      if (!$ || !node || !$.fn?.owlCarousel) {
        attempts += 1;
        if (attempts < 40) {
          timerId = window.setTimeout(initCarousel, 250);
        }
        return;
      }

      const $carousel = $(node);

      if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded owl-hidden");
        $carousel.find(".owl-stage-outer").children().unwrap();
      }

      $carousel.owlCarousel({
        loop: true,
        margin: 24,
        autoplay: true,
        autoplayTimeout: 2800,
        autoplayHoverPause: true,
        smartSpeed: 900,
        nav: false,
        dots: true,
        responsive: {
          0: { items: 1.1, margin: 16 },
          640: { items: 2 },
          992: { items: 3 },
        },
      });
    };

    initCarousel();

    return () => {
      if (timerId) {
        window.clearTimeout(timerId);
      }

      const $ = window.jQuery;
      if ($ && carouselRef.current) {
        const $carousel = $(carouselRef.current);
        if ($carousel.hasClass("owl-loaded")) {
          $carousel.trigger("destroy.owl.carousel");
        }
      }
    };
  }, []);

  return (
    <div ref={carouselRef} className="owl-carousel englishta-owl-carousel">
      {courses.map((course) => (
        <div key={course.title} className="englishta-course-slide">
          <a href="/courses" className="englishta-course-card">
            <div className="englishta-course-thumb">
              <img src={course.thumbnail} alt={course.title} />
              <span className="englishta-course-tag">{course.meta}</span>
            </div>
            <div className="englishta-course-body">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <span className="englishta-course-link">
                Enroll Now
                <i className="fa-solid fa-arrow-right"></i>
              </span>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}
