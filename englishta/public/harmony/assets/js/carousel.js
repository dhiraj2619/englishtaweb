// Home Page 1 

$(document).ready(function () {
    var owl = $('.testimonial-con .owl-carousel');
    owl.owlCarousel({
        margin: 30,
        nav: true,
        loop: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 4500,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 2
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    })
})

// Home Page 2 

$(document).ready(function () {
    var owl = $('.explore-con .owl-carousel');
    owl.owlCarousel({
        margin: 30,
        nav: true,
        loop: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 4500,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 2
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    })
})

// Home Page 3 

$('.recentwork-carousel').owlCarousel({
    loop:true,
    margin:60,
    nav:false,
    items:1,
    lazyLoad: true,
    dots: true,
    autoplay: true,
    responsive:{
        0:{
            items:1,
            stagePadding: 0
        },
        391:{
            items:1,
            stagePadding: 0
        },
        576:{
            items:1,
            stagePadding: 100
        },
        600:{
            items:1,
            stagePadding: 150
        },
        791:{
            items:1,
            stagePadding: 200
        },
        992:{
            items:1,
            stagePadding: 220
        },
        1100:{
            items:1,
            stagePadding: 280
        },
        1200:{
            items:1,
            stagePadding: 380
        },
        1441:{
            items:1,
            stagePadding: 480
        },
        1650:{
            items:1,
            stagePadding: 560
        }
    }
})

// Pricing Page

$(document).ready(function () {
    var owl = $('.pricingpage-testimonial .owl-carousel');
    owl.owlCarousel({
        margin: 30,
        nav: true,
        loop: true,
        dots: false,
        autoplay: false,
        autoplayTimeout: 4500,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 1
            }
        }
    })
})