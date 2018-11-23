var token = ''; // token stored in global variable as it is needed for Playback SDK
var r; // temporary for response in AJAX call

$(document).ready(() => {

    /*If room was previously closed (admin left),
    room gets deleted from database, so it has to be
    created all over again. Class is added to add
    effect and 'Room is closed' notification is
    displayed. */
    if (sessionStorage.getItem('closed') === 'yes') {
        var div = $('.room-closed');
        div.empty();
        div.addClass('over');
        var h3 = $('<h4>');
        var p = $('<p>');
        h3.text('Room is closed.');
        p.text('Administrator left.');
        div.append(h3, p);
    }
    /* Menu with list of users. Toggles hiding class to alternate
    between open and closed menu. */
    $('.users-menu-icon, .close-menu-icon').click(function () {
        $('.users-menu-icon, .close-menu-icon, .users').toggleClass('hidden');
        $('.users-menu').toggleClass('menu-opened');

    });

    //Database initialization
    var config = {
        apiKey: "AIzaSyBx9Tndm3dCv-AKVPS_pslFRAWz3je1_7g",
        authDomain: "project-1-ec39b.firebaseapp.com",
        databaseURL: "https://project-1-ec39b.firebaseio.com",
        projectId: "project-1-ec39b",
        storageBucket: "project-1-ec39b.appspot.com",
        messagingSenderId: "90657483363"
    };

    firebase.initializeApp(config);

    var database = firebase.database(); // stores firebase database

    var connected = database.ref(".info/connected"); // reference to directory in firebase database with online connections

    var name = sessionStorage.getItem('name'); // get name value stored in previous page from session storage
    var room = sessionStorage.getItem('room'); // get room value stored in previous page from session storage
    var admin = false; // administrator flag


    /* If the 'created' flag is 'yes', it means
    the room was created and the user is the admin */
    if (sessionStorage.getItem('created') === 'yes') {
        admin = true;
    }

    var current_room = database.ref('/rooms/' + room); // reference to user's specified room in database

    /* Any change in the online connections reference,
    triggers an addition or deletion of the user to
    the specified room.
    (1) If the user is the admin, it is added with the admin key.
    (2) If the admin gets disconnected, it is removed from user list and room is closed.
    */
    connected.on("value", function (snapshot) {
        if (snapshot.val() && sessionStorage.getItem('closed') != 'yes') {
            if (admin) {
                current_room.set({
                    'admin': name
                });
                var con = current_room;
                con.onDisconnect().remove();

            }
            else {
                var con = current_room.push(name);
                con.onDisconnect().remove();
            }

        }
    });

    /* If any child from this room removed, in other words,
    a user leaves the room, the function is triggered.
    (1) If the user that left is the admin, the room gets closed.
    (2) A 'closed' flag is stored in session storage.
    (3) Name of user is found in users list and removed. */

    current_room.on("child_removed", function (snapshot) {
        if (snapshot.ref_.path.pieces_[2] === 'admin') {  // (1)
            var div = $('.room-closed');
            div.empty();
            div.addClass('over');
            var h3 = $('<h4>');
            var p = $('<p>');
            h3.text('Room is closed.');
            p.text('Administrator left.');
            div.append(h3, p);

            sessionStorage.setItem('closed', 'yes'); // (2)
        }

        $('.users p:contains("' + snapshot.val() + '")').remove(); // (3)

    })

    /* If any child is added to this room, in other words,
        a user enters the room, the function is triggered.
        (1) Name previously stored is stored in variable.
        (2) Create and add text to element to display variable.
        (3) Name of user is appended to users list. */
    current_room.on("child_added", function (snapshot) {
        var name = snapshot.val(); // (1)

        var p = $('<p>'); // (2)

        p.text(name); // (2)

        $('.users').append(p); // (3)
    });

    // Click event handler
    $('#login').click(function () {
        /* Login URL with client ID gotten for API
        and redirect URI from whitelist specified
        for app */
        location.href = 'https://accounts.spotify.com/authorize/?client_id=537b0cdacc7f46de8bd9bf27057c93ca&response_type=token&redirect_uri=https://chapaglaura.github.io/Project-1/player.html';
    })

    /*Gets current URL, as it is needed if the
    access token has been given. The Spotify API
    needs an access token to access its database. 
    (1) Gets current URL
    (2) If current URL has access token, URL is split until token is left*/

    var current_url = $(location).attr('href'); // (1)

    if (current_url.includes('access_token')) { // (2)
        current_url_array = current_url.split('=');
        current_url_array = current_url_array[1].split('&');
        token = current_url_array[0];

    }

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

    var selected;
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
            r = { ...response };
            console.log(r);
            selected += 's';

            getSelected(selected, response);
        });


    });

    $('.search-results').on('click', '.each-search', function (e) {
        e.preventDefault();
        console.log("HEY");
        var index = $(this).attr('data-number');
    });



});

function getSelected (s, r) {
    var items = r[s].items;

    for (var i = 0; i < items.length; i++) {

        switch (s) {
            case 'tracks':
            var a = items[i].name;
            var b = items[i].artists[0].name;
            var c = items[i].album.name;
                break;
    
            case 'artists':
            var a = items[i].name;
            var b = items[i].genres.join(', ');
            var c = items[i].followers.total;
                break;
    
    
            case 'albums':
            var a = items[i].name;
            var b = items[i].artists[0].name;
            var c = items[i].total_tracks;
                break;
    
    
            case 'playlists':
            var a = items[i].name;
            var b = items[i].owner.display_name;
            var c = items[i].tracks.total;
                break;
        }

        var button = $('<button class="each-search" data-number="' + i + '">');
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