setInterval(() => {

    $.ajax({
        url: "https://api.spotify.com/v1/me/player/?access_token=" + token,
        method: 'GET'
    }).then(function (response) {
        if (response != undefined) {

            var duration = Math.floor(response.item.duration_ms / 1000) - 1;
            var progress = Math.floor(response.progress_ms / 1000);

            var track_name = response.item.name
            var track_artists = [];
            var track_image = response.item.album.images[0].url

            $('#current-track').attr('src', track_image);
            $('#current-track-name').text(track_name);
            for (var i = 0; i < response.item.artists.length; i++) {
                track_artists.push(response.item.artists[i].name);
            }
            track_artists = track_artists.join(', ');
            $('#current-track-artists').text(track_artists);

            if (progress >= duration && $('.queue-list > *').length != 0) {
                var id = $('.queue-track:first').attr('data-id');
                setSong(id);
            }

            checkRepeat();


            getLyrics();

        }

    });
}, 1000);

setInterval(searchDevices, 2000);

$('.devices').on('click', '.device', function () {
    var ID = $(this).attr('data-source-id');
    volume = $(this).attr('data-source-volume');
    deviceID = ID;

    adt.update({
        device: deviceID
    })
    
    $.ajax({
        url: "https://api.spotify.com/v1/me/player?access_token=" + token,
        type: "PUT",
        data: '{"device_ids": ["' + deviceID + '"]}',
        success: function (data) {
        }
    });
})

function decreaseVol() {
    volume = parseInt(volume) - 10;
    $.ajax({
        url: "https://api.spotify.com/v1/me/player/volume?volume_percent=" + volume + "&access_token=" + token,
        method: 'PUT'
    }).then(function (response) {
    })
}

function increaseVol() {
    volume = parseInt(volume) + 10;
    $.ajax({
        url: "https://api.spotify.com/v1/me/player/volume?volume_percent=" + volume + "&access_token=" + token,
        method: 'PUT'
    }).then(function (response) {
    })
}

function pauseSong() {
    $.ajax({
        url: "https://api.spotify.com/v1/me/player/pause?device_id=" + deviceID + "&access_token=" + token,
        method: 'PUT'
    }).then(function (response) {
    })
}

function playSong() {
    $.ajax({
        url: "https://api.spotify.com/v1/me/player/play?device_id=" + deviceID + "&access_token=" + token,
        method: 'PUT'
    }).then(function (response) {

    })
}

function nextSong() {
    var id = $('.queue-track:first').attr('data-id');

    setSong(id);
}


function setSong(ID) {

    if (admin) {
        songs.update({
            [ID]: null
        });

        $.ajax({
            url: "https://api.spotify.com/v1/me/player/play?device_id=" + deviceID + "&access_token=" + token,
            type: "PUT",
            data: '{"uris": ["spotify:track:' + ID + '"]}',
            success: function (data) {
            }
        });
    }

    setTimeout(getLyrics, 500);
}

function checkRepeat() {
    if ($('.queue-list > *').length === 0) {
        $.ajax({
            url: "https://api.spotify.com/v1/me/player/repeat?state=track&access_token=" + token,
            type: "PUT",
            success: function (data) {

            }
        });
    }
    else {
        $.ajax({
            url: "https://api.spotify.com/v1/me/player/repeat?state=off&access_token=" + token,
            type: "PUT",
            success: function (data) {

            }
        });
    }
}

function searchDevices() {
    $.ajax({
        url: "https://api.spotify.com/v1/me/player/devices?&access_token=" + token,
        method: 'GET'
    }).then(function (response) {
        var div = $('<div class="devices-list">');

        for (var i = 0; i < response.devices.length; i++) {
            var p = $('<p class="device">');
            p.attr('data-source-id', response.devices[i].id);
            p.attr('data-source-volume', response.devices[i].volume_percent);
            p.text(response.devices[i].name);
            div.append(p);
        }

        $('.devices div').empty();
        $('.devices div').append(div);
    })
}