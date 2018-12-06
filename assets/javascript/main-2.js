var selected;

var token = '';
var deviceID = '';
var volume = '';

var room = sessionStorage.getItem('room');
var name = sessionStorage.getItem('name');
var admin = false;


/* DATABASES */

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

var songs = database.ref('/rooms/' + room + '/songs/');
var current_room = database.ref('/rooms/' + room); // reference to user's specified room in database
var connected = database.ref('.info/connected');
var adt = database.ref('rooms/' + room + '/admin-token');

$(document).ready(() => {

    /* GET SESSION STORAGE */

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

    /* If the 'created' flag is 'yes', it means
    the room was created and the user is the admin */
    if (sessionStorage.getItem('created') === 'no') {
        $('#login, .devices, .device-icon, .player-icon, .player').css('display', 'none');
    }
    else {
        admin = true;
    }


    /* DATABASE EVENTS */

    connected.on("value", function (snapshot) {
        if (snapshot.val()) {
            if (admin) {
                current_room.set({
                    admin: name
                });

                adt.update({
                    token: token,
                    device: deviceID
                });

                var con = current_room;
                con.onDisconnect().remove();
            }
            else {
                var con = current_room.push(name);
                con.onDisconnect().remove();

                adt.once('value', function (snapshot) {
                    token = snapshot.val().token;
                })

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

        if ($.type(name) === 'string') {
            var p = $('<p>'); // (2)

            p.text(name); // (2)

            $('.users').append(p); // (3)
        }
    });

    songs.on('value', function (snapshot) {
        $('.queue-list').empty();
        if (snapshot.exists()) {
            var ids = Object.keys(snapshot.val());
    

            var sorted = false;
            while (!sorted) {
                sorted = true;
                for (var i = 0; i < ids.length; i++) {
                    var id1 = snapshot.val()[ids[i]];
                    var id2 = snapshot.val()[ids[i + 1]];
                    if (i < ids.length - 1) {
                        if (id1.votes < id2.votes) {
                            sorted = false;
                            var temp = ids[i];
                            ids[i] = ids[i + 1];
                            ids[i + 1] = temp;
                        }
                    }
                }
            }

            for (var i = 0; i < ids.length; i++) {
                var div = $('<div>');

                var track_name = snapshot.val()[ids[i]].name;
                var track_artists = snapshot.val()[ids[i]].artists;
                var track_votes = snapshot.val()[ids[i]].votes;
                var voters_up = snapshot.val()[ids[i]].upvoters;
                var voters_down = snapshot.val()[ids[i]].downvoters;
                var image = snapshot.val()[ids[i]].image;


                var p = $('<p class="queue-track" data-id="' + ids[i] + '" data-name="' + track_name + '" data-artists="' + track_artists + '">');


                p.text(track_name + ' - ' + track_artists);
                var up = $('<i class="far fa-fw fa-thumbs-up thumbs"></i>');
                var down = $('<i class="far fa-fw fa-thumbs-down thumbs"></i>');

                if (voters_up.indexOf(name) != -1) {
                    up.removeClass('far').addClass('fas');
                }
                else if (voters_down.indexOf(name) != -1) {
                    down.removeClass('far').addClass('fas');
                }
                var v = $('<p class="votes" data-votes="' + track_votes + '">');

                v.text('Votes: ' + track_votes);

                div.append(p, up, down, v);
                $('.queue-list').append(div);
            }
        }

    });

    // Click event handler
    $('#login').click(function () {
        /* Login URL with client ID gotten for API
        and redirect URI from whitelist specified
        for app */

        var scopes = [
            'streaming',
            'user-read-birthdate',
            'user-read-private',
            'user-modify-playback-state',
            'user-read-email',
            'user-library-read',
            'user-top-read',
            'playlist-modify-public',
            'user-read-playback-state',
            'user-follow-read',
            'user-read-recently-played',
            'playlist-read-private',
            'user-library-modify',
            'playlist-read-collaborative',
            'playlist-modify-private',
            'user-follow-modify',
            'user-read-currently-playing'
        ];

        var redirect_uri = 'https://chapaglaura.github.io/Project-1/player.html'

        location.href = 'https://accounts.spotify.com/authorize/?client_id=537b0cdacc7f46de8bd9bf27057c93ca&response_type=token&redirect_uri=' + redirect_uri + '&scope=' + scopes.join('%20');
    });



    /*Gets current URL, as it is needed if the
    access token has been given. The Spotify API
    needs an access token to access its database. 
    (1) Gets current URL
    (2) If current URL has access token, URL is split until token is left*/

    var current_url = $(location).attr('href'); // (1)

    if (current_url.includes('access_token')) { // (2)
        var current_url_array = current_url.split('=');
        current_url_array = current_url_array[1].split('&');
        token = current_url_array[0];

        $('#login').css('display', 'none');

        setTimeout(searchDevices, 1500);

    }

});

function getLyrics() {
    var track_name = $('#current-track-name').text();
    var track_artist = $('#current-track-artists').text();
    track_artist = track_artist.split(',');

    track_artist = track_artist[0].split(' ').join('+');

    $.ajax({
        url: 'https://api.lyrics.ovh/v1/' + track_artist + '/' + track_name,
        method: 'GET'
    }).then(function (response) {

        var lyrics = response.lyrics.replace(/(?:\r\n|\r|\n)/g, '<br>');
        $('.media-info div').html(lyrics);
    })
}

function addToQueue(id) {

    $.ajax({
        url: 'https://api.spotify.com/v1/tracks/' + id + '?access_token=' + token,
        method: 'GET'
    }).then(function (response) {
        var track_name = response.name;
        var track_artists = [];
        for (var i = 0; i < response.artists.length; i++) {
            track_artists.push(response.artists[i].name);
        }
        track_artists = track_artists.join(', ');
        var track_image = response.album.images[0].url;

        songs.update({
            [id]: {
                name: track_name,
                artists: track_artists,
                votes: 0,
                upvoters: [''],
                downvoters: [''],
                image: track_image
            }
        })

    })
}
