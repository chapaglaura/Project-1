/* Menu with list of users. Toggles hiding class to alternate
    between open and closed menu. */

    $('.main').click(function () {
        $('.users-icon').addClass('fa-users').removeClass('fa-times');
        $('.player-icon').addClass('fa-play-circle').removeClass('fa-times');
        $('.device-icon').addClass('fa-connectdevelop fab').removeClass('fa-times fas');
        $('.queue-icon').addClass('fa-music').removeClass('fa-times');
        $('.info-icon').addClass('fa-info-circle').removeClass('fa-times');

        $('.users, .player, .devices, .queue, .info').removeClass('menu-item-opened').addClass('hidden');
        $('.menu-icons').removeClass('menu-opened');
    });
    $('.menu-icons-left').on('click', '.menu-icon', function () {
        var icon = $(this);

        if (icon.hasClass('fa-times')) {
            if (icon.hasClass('users-icon')) {
                icon.addClass('fa-users');
                icon.removeClass('fa-times');
                $('.users').removeClass('menu-item-opened');
                $('.users').addClass('hidden');
                $('.menu-icons').removeClass('menu-opened');

            }
            else if (icon.hasClass('player-icon')) {
                icon.addClass('fa-play-circle');
                icon.removeClass('fa-times');
                $('.player').removeClass('menu-item-opened');
                $('.player').addClass('hidden');
                $('.menu-icons').removeClass('menu-opened');
                $('#login').addClass('hidden');
            }
            else if (icon.hasClass('device-icon')) {
                icon.addClass('fa-connectdevelop fab');
                icon.removeClass('fa-times fas');
                $('.devices').removeClass('menu-item-opened');
                $('.devices').addClass('hidden');
                $('.menu-icons').removeClass('menu-opened');
                $('#login').addClass('hidden');
            }
            else if (icon.hasClass('queue-icon')) {
                icon.addClass('fa-music');
                icon.removeClass('fa-times');
                $('.queue').removeClass('menu-item-opened');
                $('.queue').addClass('hidden');
                $('.menu-icons').removeClass('menu-opened');
                $('#login').addClass('hidden');
            }
            else if (icon.hasClass('info-icon')) {
                icon.addClass('fa-info-circle');
                icon.removeClass('fa-times');
                $('.info').removeClass('menu-item-opened');
                $('.info').addClass('hidden');
                $('.menu-icons').removeClass('menu-opened');
                $('#info').addClass('hidden');
            }
        }
        else if (!($('.menu-icons').hasClass('menu-opened'))) {
            if (icon.hasClass('users-icon')) {
                icon.removeClass('fa-users');
                icon.addClass('fa-times');
                $('.users').addClass('menu-item-opened');
                $('.users').removeClass('hidden');
                $('.menu-icons').addClass('menu-opened');

            }
            else if (icon.hasClass('player-icon')) {
                icon.removeClass('fa-play-circle');
                icon.addClass('fa-times');
                $('.player').addClass('menu-item-opened');
                $('.player').removeClass('hidden');
                $('.menu-icons').addClass('menu-opened');
                $('#login').removeClass('hidden');
            }
            else if (icon.hasClass('device-icon')) {
                icon.removeClass('fa-connectdevelop fab');
                icon.addClass('fa-times fas');
                $('.devices').addClass('menu-item-opened');
                $('.devices').removeClass('hidden');
                $('.menu-icons').addClass('menu-opened');
                $('#login').removeClass('hidden');
            }
            else if (icon.hasClass('queue-icon')) {
                icon.removeClass('fa-music');
                icon.addClass('fa-times');
                $('.queue').addClass('menu-item-opened');
                $('.queue').removeClass('hidden');
                $('.menu-icons').addClass('menu-opened');
                $('#login').removeClass('hidden');
            }
            else if (icon.hasClass('info-icon')) {
                icon.removeClass('fa-info-circle');
                icon.addClass('fa-times');
                $('.info').addClass('menu-item-opened');
                $('.info').removeClass('hidden');
                $('.menu-icons').addClass('menu-opened');
                $('#login').removeClass('hidden');
            }
        }
        else if ($('.menu-icons').hasClass('menu-opened') && (!(icon.hasClass('fa-times')))) {

            $('.users-icon').addClass('fa-users').removeClass('fa-times');
            $('.player-icon').addClass('fa-play-circle').removeClass('fa-times');
            $('.device-icon').addClass('fa-connectdevelop fab').removeClass('fa-times fas');
            $('.queue-icon').addClass('fa-music').removeClass('fa-times');
            $('.info-icon').addClass('fa-info-circle').removeClass('fa-times');

            $('.users, .player, .devices, .queue, .info').removeClass('menu-item-opened').addClass('hidden');

            if (icon.hasClass('users-icon')) {
                icon.removeClass('fa-users');
                icon.addClass('fa-times');
                $('.users').addClass('menu-item-opened');
                $('.users').removeClass('hidden');
                $('.menu-icons').addClass('menu-opened');

            }
            else if (icon.hasClass('player-icon')) {
                icon.removeClass('fa-play-circle');
                icon.addClass('fa-times');
                $('.player').addClass('menu-item-opened');
                $('.player').removeClass('hidden');
                $('.menu-icons').addClass('menu-opened');
                $('#login').removeClass('hidden');
            }
            else if (icon.hasClass('device-icon')) {
                icon.removeClass('fa-connectdevelop fab');
                icon.addClass('fa-times fas');
                $('.devices').addClass('menu-item-opened');
                $('.devices').removeClass('hidden');
                $('.menu-icons').addClass('menu-opened');
                $('#login').removeClass('hidden');
            }
            else if (icon.hasClass('queue-icon')) {
                icon.removeClass('fa-music');
                icon.addClass('fa-times');
                $('.queue').addClass('menu-item-opened');
                $('.queue').removeClass('hidden');
                $('.menu-icons').addClass('menu-opened');
                $('#login').removeClass('hidden');
            }
            else if (icon.hasClass('info-icon')) {
                icon.removeClass('fa-info-circle');
                icon.addClass('fa-times');
                $('.info').addClass('menu-item-opened');
                $('.info').removeClass('hidden');
                $('.menu-icons').addClass('menu-opened');
                $('#login').removeClass('hidden');
            }


        }
    });


    $('.menu-items h3').css('margin-top', $('.menu-icons-left').height());