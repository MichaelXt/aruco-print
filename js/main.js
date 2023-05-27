/* global ArucoMarker, $ */

'use strict';

(function() {

    var $marker_count = $('#marker-count');
    var $marker_starting_num = $('#marker-starting-num');
    var $marker_random = $('#marker-random:checkbox');
    var $marker_ids = $('#marker-ids');
    var $ids = $('#ids');
    var $markers = $('#markers');
    var $marker_width = $('#marker-width');
    var $marker_spacing = $('#marker-spacing');

    var MAX_CODES = 1024;

    var rand_num = function(max) {
        var r = Math.random();
        return Math.floor(r * max);
    };

    var parse = function(text) {

        var values = text.replace(' ', '')
            .split(',')
            .filter(function(d) {
                return d.length !== 0;
            })
            .map(function(d) {
                return Number(d, 10);
            })
            .filter(function(d) {
                return d === 0 || d;
            });

        return values;
    };

    var create_and_append_markers = function(ids) {
        $markers.html('');
        const width = `${$marker_width.val()}cm`;
        const spacing = `${$marker_spacing.val()/2}cm`;
        ids.forEach(function(id) {
            var svg = ""
            if (id >= 0) {
                var marker = new ArucoMarker(id);
                svg = marker.toSVG(null, 'black');
            }
            var $marker = $('<div></div>')
                .addClass('marker');
            $marker.html(svg);
            $marker.children()[0].classList.add(`aruco${id}`);
            $markers.append($marker);
        });
    };

    var marker_count_callback = function() {
        var num = Number($marker_count.val());
        var random = $marker_random.is(':checked');

        var startingNum = Number($marker_starting_num.val());

        var ids = [];
        if (num) {
            for (var i = 0; i < num; i++) {
                if (random) {
                    ids.push(rand_num(MAX_CODES));
                } else {
                    ids.push(i+startingNum);
                }
            }
        }
        $marker_ids.val(ids.join(','));
        create_and_append_markers(ids);
        marker_width_spacing_callback();
    };

    var marker_ids_callback = function() {
        // try to parse the input
        var text = $marker_ids.val();

        var values = parse(text);
        $ids.html(values.join(', '));
        create_and_append_markers(values);
        marker_width_spacing_callback();
    };

    var marker_width_spacing_callback = function() {
        var width_num = Number($marker_width.val())
        if (width_num) {
            var width =  `${width_num}cm`;
            $('.marker').css('width', width).css('height', width);
        }

        var spacing_num = Number($marker_spacing.val())
        if (spacing_num) {
            var padding = `${spacing_num/2}cm`
            $('.marker').css('padding', padding)
        }
    };

    $marker_count.on('keyup', marker_count_callback);
    $marker_starting_num.on('keyup', marker_count_callback);
    $marker_random.change(marker_count_callback);
    $marker_ids.on('keyup', marker_ids_callback);
    $marker_width.on('keyup', marker_width_spacing_callback);
    $marker_spacing.on('keyup', marker_width_spacing_callback);

    // when the page loads
    marker_count_callback();
    marker_width_spacing_callback();

})();
