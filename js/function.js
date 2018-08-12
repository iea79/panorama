/*!
 *
 * Evgeniy Ivanov - 2018
 * busforward@gmail.com
 * Skype: ivanov_ea
 *
 */

var TempApp = {
    lgWidth: 1200,
    mdWidth: 992,
    smWidth: 768,
    resized: false,
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    touchDevice: function() { return navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i); }
};

function isLgWidth() { return $(window).width() >= TempApp.lgWidth; } // >= 1200
function isMdWidth() { return $(window).width() >= TempApp.mdWidth && $(window).width() < TempApp.lgWidth; } //  >= 992 && < 1200
function isSmWidth() { return $(window).width() >= TempApp.smWidth && $(window).width() < TempApp.mdWidth; } // >= 768 && < 992
function isXsWidth() { return $(window).width() < TempApp.smWidth; } // < 768
function isIOS() { return TempApp.iOS(); } // for iPhone iPad iPod
function isTouch() { return TempApp.touchDevice(); } // for touch device

$(document).ready(function() {

    if (isIOS()) {
        $(function(){$(document).on('touchend', 'a', $.noop)});
    }

    $('[href*="#"]').click(function(event) {
        event.preventDefault();
    });

    $('[name=tel]').inputmask("+7(999)999 99 99",{ showMaskOnHover: false });

    fontResize();
    formSubmit();
    checkOnResize();

    $('[data-switch]').on('click', function(event) {
        event.preventDefault();
        var elId = $(this).data('switch');
        $('[data-step]').removeClass('active');
        $('[data-step='+elId+']').addClass('active');
    });

    setTimeout(function() {
        $('.content,.footer,.header').addClass('show');
    }, 500);

});

$(window).resize(function(event) {
    var windowWidth = $(window).width();
    if (TempApp.resized == windowWidth) { return; }
    TempApp.resized = windowWidth;

    checkOnResize();
});

function checkOnResize() {
    fontResize();
    if (isLgWidth()) {
        $('.content__right').insertAfter('.content__left');
    } else {
        $('.content__right').insertBefore('.content__left');
    }

}

function gridMatch() {
   	// $('[data-grid-match] .grid__item').matchHeight({
   	// 	byRow: true,
   	// });
}

function fontResize() {
    var windowWidth = $(window).width();
    if (isLgWidth()) {
        var fontSize = windowWidth/19.05;
    } else if (isMdWidth()) {
        var fontSize = windowWidth/12.15;
    } else if (isSmWidth()) {
    	var fontSize = windowWidth/12.15;
    } else if (isXsWidth()) {
        var fontSize = windowWidth/4.15;
    }
	$('body').css('fontSize', fontSize + '%');
}

// Видео youtube для страницы
$(function () {
    if ($(".js_youtube")) {
        $(".js_youtube").each(function () {
            // Зная идентификатор видео на YouTube, легко можно найти его миниатюру
            $(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');

            // Добавляем иконку Play поверх миниатюры, чтобы было похоже на видеоплеер
            $(this).append($('<img src="img/play.svg" alt="Play" class="video__play">'));

        });

        $('.video__play, .video__prev').on('click', function () {
            // создаем iframe со включенной опцией autoplay
            var videoId = $(this).closest('.js_youtube').attr('id');
            var iframe_url = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&autohide=1";
            if ($(this).data('params')) iframe_url += '&' + $(this).data('params');

            // Высота и ширина iframe должны быть такими же, как и у родительского блока
            var iframe = $('<iframe/>', {
                'frameborder': '0',
                'src': iframe_url,
                'width': $(this).width(),
                'height': $(this).innerHeight()
            })

            // Заменяем миниатюру HTML5 плеером с YouTube
            $(this).closest('.video__wrapper').append(iframe);

        });
    }
});


// Деление чисел на разряды Например из строки 10000 получаем 10 000
// Использование: thousandSeparator(1000) или используем переменную.
// function thousandSeparator(str) {
//     var parts = (str + '').split('.'),
//         main = parts[0],
//         len = main.length,
//         output = '',
//         i = len - 1;
    
//     while(i >= 0) {
//         output = main.charAt(i) + output;
//         if ((len - i) % 3 === 0 && i > 0) {
//             output = ' ' + output;
//         }
//         --i;
//     }

//     if (parts.length > 1) {
//         output += '.' + parts[1];
//     }
//     return output;
// };


// Хак для яндекс карт втавленных через iframe
// Страуктура:
//<div class="map__wrap" id="map-wrap">
//  <iframe style="pointer-events: none;" src="https://yandex.ru/map-widget/v1/-/CBqXzGXSOB" width="1083" height="707" frameborder="0" allowfullscreen="true"></iframe>
//</div>
// Обязательное свойство в style которое и переключет скрипт
// document.addEventListener('click', function(e) {
//     var map = document.querySelector('#map-wrap iframe')
//     if(e.target.id === 'map-wrap') {
//         map.style.pointerEvents = 'all'
//     } else {
//         map.style.pointerEvents = 'none'
//     }
// })

// Простая проверка форм на заполненность и отправка аяксом
function formSubmit() {
    $("[type=submit]").on('click', function (e){ 
        e.preventDefault();
        var form = $(this).closest('.form');
        var url = form.attr('action');
        var form_data = form.serialize();
        var field = form.find('[required]');
        // console.log(form_data);

        empty = 0;

        field.each(function() {
            if ($(this).val() == "") {
                $(this).addClass('invalid');
                // return false;
                empty++;
            } else {
                $(this).removeClass('invalid');
                $(this).addClass('valid');
            }  
        });

        // console.log(empty);

        if (empty > 0) {
            return false;
        } else {        
            $.ajax({
                url: url,
                type: "POST",
                dataType: "html",
                data: form_data,
                success: function (response) {
                    $('[data-step]').removeClass('active');
                    $('[data-step="3"]').addClass('active');
                    setTimeout(function() {
                        $('[data-step]').removeClass('active');
                        $('[data-step="1"]').addClass('active');
                    }, 3000);
                },
                error: function (response) {
                    // $('#success').modal('show');
                    // console.log('error');
                    // console.log(response);
                }
            });
        }

    });

    $('[required]').on('blur', function() {
        if ($(this).val() != '') {
            $(this).removeClass('invalid');
        }
    });

    $('.form__privacy input').on('change', function(event) {
        event.preventDefault();
        var btn = $(this).closest('.form').find('.btn');
        if ($(this).prop('checked')) {
            btn.removeAttr('disabled');
            // console.log('checked');
        } else {
            btn.attr('disabled', true);
        }
    });
}


