$('.queue-list').on('click', '.thumbs', function () {

    if ($(this).hasClass('fa-thumbs-up')) {

        var id = $(this).siblings('.queue-track').attr('data-id');

        songs.once('value', function (snapshot) {

            var track = snapshot.val()[id];
            var track_name = track.name;
            var track_artists = track.artists;
            var track_votes = track.votes;
            var voters_up = track.upvoters;
            var voters_down = track.downvoters;
            var image = track.image;

            if (voters_up.indexOf(name) === -1) {
                track_votes++;
                voters_up.push(name);
            }

            if (voters_down.indexOf(name) != -1) {
                track_votes++;
                voters_down.splice(voters_down.indexOf(name), 1);
            }


            songs.update({
                [id]: {
                    name: track_name,
                    artists: track_artists,
                    votes: track_votes,
                    upvoters: voters_up,
                    downvoters: voters_down,
                    image: image
                }
            })
        });
    }
    else if ($(this).hasClass('fa-thumbs-down')) {
        var id = $(this).siblings('.queue-track').attr('data-id');

        songs.once('value', function (snapshot) {

            var track = snapshot.val()[id];
            var track_name = track.name;
            var track_artists = track.artists;
            var track_votes = track.votes;
            var voters_up = track.upvoters;
            var voters_down = track.downvoters;
            var image = track.image;

            if (voters_down.indexOf(name) === -1) {
                track_votes--;
                voters_down.push(name);
            }

            if (voters_up.indexOf(name) != -1) {
                track_votes--;
                voters_up.splice(voters_up.indexOf(name), 1);
            }


            songs.update({
                [id]: {
                    name: track_name,
                    artists: track_artists,
                    votes: track_votes,
                    upvoters: voters_up,
                    downvoters: voters_down,
                    image: image
                }
            })
        });

    }
})

 