$('.search > button').click(function () {
    $('.search-results').empty();
});

// Click event handler
$('.search-btn').click(function () {

    /* When choosing categories for search query:
    (1) Selected category is stored in variable
    (2) Input element has attributes id and placeholder set to category chosen
    (3) Change active class from previous category selected to current one */

    var clicked = $(this).text(); // (1)

    $('.search-parameter').attr({ 'id': clicked.toLowerCase(), 'placeholder': clicked }); // (2)

    $('.search-btn').removeClass('active'); // (3)
    $(this).addClass('active');
});

$('.final-search-btn').click(function () {
    selected = $('.search-btn.active').text().toLowerCase();
    var query = $('.search-parameter').val();
    $('.search-parameter').val('');
    query = query.split(' ').join('+');

    $('.search-results').empty();

    $.ajax({
        url: 'https://api.spotify.com/v1/search?q=' + query + '&type=' + selected + '&access_token=' + token,
        method: 'GET'
    }).then(function (response) {
        var s = selected + 's';

        getSelected(s, response);
    });


});

$('.search-results').on('click', '.each-search', function (e) {
    e.preventDefault();
    var s = $(this).attr('data-type') + 's';

    var ID = $(this).attr('data-id');

    if (s === 'tracks') {
        addToQueue(ID);

    }
    else {
        var queryURL = 'https://api.spotify.com/v1/' + s + '/' + ID;

        if (s === 'artists') {
            queryURL += '/top-tracks'
        }

        queryURL += '?access_token=' + token + '&market=from_token';

        getInfo(queryURL, s);
    }


});


function getInfo(q, s) {
    $.ajax({
        url: q,
        method: 'GET'
    }).then(function (response) {
        (response);
        r = { ...response };

        switch (s) {

            case 'artists':

                $('.search-results').empty();
                

                for (var i = 0; i < response.tracks.length; i++) {
                    
                    var a = response.tracks[i].name;
                    var b = response.tracks[i].artists[0].name;
                    var c = response.tracks[i].album.name;
                    var d = response.tracks[i].id;
                    var e = response.tracks[i].type;

                    var button = $('<button class="each-search" data-number="' + i + '" data-id="' + d + '" data-type="' + e + '">');
                    var h4 = $('<h4>');
                    var h5 = $('<h5>');
                    var h6 = $('<h6>');

                    h4.text(a);
                    h5.text(b);
                    h6.text(c);

                    button.append(h4, h5, h6);

                    $('.search-results').append(button);
                }


                break;


            case 'albums':
                $('.search-results').empty();

                for (var i = 0; i < response.tracks.items.length; i++) {
                    var a = response.tracks.items[i].name;
                    var b = response.tracks.items[i].artists[0].name;
                    var c = response.name;
                    var d = response.tracks.items[i].id;
                    var e = response.tracks.items[i].type;

                    var button = $('<button class="each-search" data-number="' + i + '" data-id="' + d + '" data-type="' + e + '">');
                    var h4 = $('<h4>');
                    var h5 = $('<h5>');
                    var h6 = $('<h6>');

                    h4.text(a);
                    h5.text(b);
                    h6.text(c);

                    $(button).append(h4, h5, h6);

                    $('.search-results').append(button);
                }
                break;


            case 'playlists':
                $('.search-results').empty();
                

                for (var i = 0; i < response.tracks.items.length; i++) {
                    var a = response.tracks.items[i].track.name;
                    var b = response.tracks.items[i].track.artists[0].name;
                    var c = response.tracks.items[i].track.album.name;
                    var d = response.tracks.items[i].track.id;
                    var e = response.tracks.items[i].track.type;

                    var button = $('<button class="each-search" data-number="' + i + '" data-id="' + d + '" data-type="' + e + '">');
                    var h4 = $('<h4>');
                    var h5 = $('<h5>');
                    var h6 = $('<h6>');

                    h4.text(a);
                    h5.text(b);
                    h6.text(c);

                    $(button).append(h4, h5, h6);

                    $('.search-results').append(button);
                }

                break;
        }


    })

}

function getSelected(s, r) {
    var items = r[s].items;

    for (var i = 0; i < items.length; i++) {
        var a = items[i].name;
        var d = items[i].id;
        var e = items[i].type;
        switch (s) {
            case 'tracks':

                var b = items[i].artists[0].name;
                var c = items[i].album.name;

                break;

            case 'artists':
                var b = items[i].genres.join(', ');
                var c = items[i].followers.total;
                break;


            case 'albums':
                var b = items[i].artists[0].name;
                var c = items[i].total_tracks;
                break;


            case 'playlists':
                var b = items[i].owner.display_name;
                var c = items[i].tracks.total;
                break;
        }

        var button = $('<button class="each-search" data-number="' + i + '" data-id="' + d + '" data-type="' + e + '">');
        var h4 = $('<h4>');
        var h5 = $('<h5>');
        var h6 = $('<h6>');

        h4.text(a);
        h5.text(b);
        h6.text(c);

        $(button).append(h4, h5, h6);

        $('.search-results').append(button);
    }
}

