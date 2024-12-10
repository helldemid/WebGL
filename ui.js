$(document).ready(function () {
    $('#p').on('change', function () {
        const newP = parseFloat($(this).val());

        newP <= 0 ? $(this).val(1) : surface.setP(newP);

        surface.initBuffer(gl);
        draw();

    });

    $('#h').on('change', function () {
        const newH = parseFloat($(this).val());
        console.log(surface)
        newH <= 0 ? $(this).val(1) : surface.setH(newH);

        surface.initBuffer(gl);
        draw();
    });

    /* rate slider */
    const range = { min: 10, max: 140 }; // Пример: диапазон от 10 до 140

    $('.slider__box').each(function () {
        const $container = $(this);
        const $btn = $container.find('.slider__btn');
        const $color = $container.find('.slider__color');
        const $tooltip = $container.find('.slider__tooltip');
        const segments = $container.attr('segments')

        const dragElement = function ($target, $btn, range) {
            $target.on('mousedown', function (e) {
                onMouseMove(e);
                $(window).on('mousemove', onMouseMove);
                $(window).on('mouseup', onMouseUp);
            });

            const onMouseMove = function (e) {
                e.preventDefault();
                const targetOffset = $target.offset();
                const targetWidth = $target.width();
                let x = e.pageX - targetOffset.left + 10;

                if (x > targetWidth) x = targetWidth;
                if (x < 0) x = 0;

                const btnPosition = x - 10;
                $btn.css('left', btnPosition + 'px');

                // Позиция кнопки внутри контейнера в процентах
                const percentPosition = (btnPosition + 10) / targetWidth;

                // Вычисляем значение из диапазона
                const currentValue = Math.round(
                    range.min + percentPosition * (range.max - range.min)
                );

                // Обновляем ширину цветного фона
                $color.css('width', percentPosition * 100 + '%');

                // Перемещаем и показываем tooltip с текущим значением
                $tooltip.css({ left: btnPosition - 5 + 'px', opacity: 1 }).text(currentValue);

                if(segments == 'v') {
                    surface.setVSegmentsNumber(currentValue);
                } else if(segments == 'u') {
                    surface.setUSegmentsNumber(currentValue);
                } else {
                    return;
                }
                surface.initBuffer(gl);
                draw();


            };

            const onMouseUp = function () {
                $(window).off('mousemove', onMouseMove);
                $tooltip.css('opacity', 0);

                $btn.on('mouseover', function () {
                    $tooltip.css('opacity', 1);
                });

                $btn.on('mouseout', function () {
                    $tooltip.css('opacity', 0);
                });
            };
        };

        dragElement($container, $btn, range);
    });


});