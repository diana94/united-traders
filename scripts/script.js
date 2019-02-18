$(document).ready(function() {
    headerFunction();

    $(window).scroll( function(){
        headerFunction();
    });

    $('.header-menu__dropdown-button').each(function(){
        $(this).on('click', function(){
            $('.header-menu__dropdown-button').not(this).closest('.header-menu__item').removeClass('header-menu__item_open');
            $('.header-menu__dropdown-button').not(this).next('.header-submenu').slideUp( 'fast');

            $(this).closest('.header-menu__item').toggleClass('header-menu__item_open');
            $(this).next('.header-submenu').slideToggle( 'fast');
        })
    })

    $('#header-burger').on('click',function(){
        $('#header-burger').toggleClass('burger_open');
        $('.header__toggle-part').toggleClass('header__toggle-part_open');
    })

    $(document).on('click touchend',function(e) {
        if (!$(e.target).closest('.header-menu__item_dropdown').length) {
            $('.header-menu__item_dropdown').removeClass('header-menu__item_open');
            $('.header-menu__dropdown-button').next('.header-submenu').slideUp( 'fast');
        }

        if (!$(e.target).closest('.header__toggle-part').length && !$(e.target).closest('#header-burger').length) {
            $('.header__toggle-part').removeClass('header__toggle-part_open');
            $('#header-burger').removeClass('burger_open');
        }
    });

});

function headerFunction() {
    if ($(window).scrollTop() > 0) {
        $('.header').addClass('header_scrolled');
    } else { $('.header').removeClass('header_scrolled'); }
};
