var response = {};
$(document).ready(() => {

    var apiKey = 'r08ndRHnzaWxUcnwlJ81Z2PfQ8gyYbhtsZ2buQZY';
    var set = '';


    $('.data-buttons').on('click', '.search-btn', function () {
        var choice = $(this).attr('data-chosen');

        var div = $('<div>');
        var p = $('<p>');

        switch (choice) {
            case 'apod':
                setAPOD(choice, div, p);
                break;

            case 'asteroids':
                setAsteroids(choice, div, p);

                break;

            case 'search':
                startSearch();

                break;

            default:
                break;
        }
    })






    function setAPOD(choice, div, p) {

        $('.specific-search').empty();

        var input = $('<input class="date" type="text" class="form-control" placeholder="Date (YYYY-MM-DD)" aria-label="date">');
        var btn = $('<button type="button" data-chosen="search" class="btn btn-success d-block w-100 search-btn">Search</button>');

        p.text('Retrieve Astronomy Picture of the Day with its information, depending on date specified. (Default: today)');

        div.append(p, input, btn);

        $('.specific-search').append(div);


        set = choice;

    }

    function setAsteroids(choice, div, p) {

        $('.specific-search').empty();

        var inputStart = $('<input class="start-date" type="text" class="form-control" placeholder="Start date (YYYY-MM-DD)" aria-label="date">');
        var inputEnd = $('<input class="end-date" type="text" class="form-control" placeholder="End date (YYYY-MM-DD)" aria-label="date">');
        var btn = $('<button type="button" data-chosen="search" class="btn btn-success d-block w-100 search-btn">Search</button>');

        p.text('Retrieve a list of Asteroids based on their closest approach date to Earth. (Default end date: a week after start date.)');

        div.append(p, inputStart, inputEnd, btn);

        $('.specific-search').append(div);

        set = choice;
    }

    function getNASA(u) {
        $.ajax({
            method: "GET",
            url: u
        }).then(function (r) {
            response = { ...r };

            endSearch();
        })
    }

    function startSearch() {

        switch (set) {
            case 'apod':

                var date = $('.date').val();
                var u = 'https://api.nasa.gov/planetary/' + set + '?api_key=' + apiKey + '&date=' + date;
                getNASA(u);
                break;

            case 'asteroids':

                var start = $('.start-date').val();
                var end = $('.end-date').val();
                var u = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=' + start + '&end_date=' + end + '&api_key=' + apiKey;
                getNASA(u);
                break;
        }

        $('input').val('');
    }

    function endSearch() {
        $('.tabs-content, .tabs').empty();
        switch (set) {
            case 'apod':
                console.log(response);

                var div = $('<div>');
                var title = $('<h3>')
                var date = $('<h5>');
                var explanation = $('<p>');

                if (response.media_type === 'image') {
                    var media = $('<img>');
                }
                else {
                    var media = $('<iframe>');
                }


                title.text(response.title);
                date.text(response.date);
                explanation.text(response.explanation);
                media.attr('src', response.url);

                div.append(title, date, explanation, media);

                $('.info').append(div);
                break;

            case 'asteroids':

                var a = response.near_earth_objects;
                var o = Object.keys(a);
                console.log(o);
                console.log(a);



                var divPills = $('<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">')
                var divTabs = $('<div class="tab-content" id="v-pills-tabContent">');
                for (var i = 0; i < o.length; i++) {
                    var divPill = $('<a class="nav-link" id="v-pills-' + i + '-tab" data-toggle="pill" href="#v-pills-' + i + '" role="tab" aria-controls="v-pills-' + i + '" aria-selected="true">');
                    divPill.text(o[i]);
                    var divTab = $('<div class="tab-pane fade show" id="v-pills-' + i + '" role="tabpanel" aria-labelledby="v-pills-' + i + '-tab">')
                    var date = $('<h4>');
                    date.text(o[i]);
                    divTab.append(date);

                    for (var j = 0; j < a[o[i]].length; j++) {
                        var name = $('<h5>');
                        var diameter = $('<p>');
                        var hazardous = $('<p>');
                        var url = $('<a>');
                        var miss = $('<p>');
                        var orbiting = $('<p>');
                        var vel = $('<p>');

                        var s = a[o[i]][j];
                        name.text('Name: ' + s.name);
                        diameter.text('Estimated diameter: ' + s.estimated_diameter.kilometers.estimated_diameter_max + ' kilometers');
                        hazardous.text('Potentially Hazardous: ' + ((s.is_potentially_hazardous_asteroid) ? 'Yes' : 'No'));
                        url.text('Nasa JPL: ' + s.nasa_jpl_url);
                        miss.text('Miss distance: ' + s.close_approach_data[0].miss_distance.kilometers + ' kilometers')
                        orbiting.text('Orbiting body: ' + s.close_approach_data[0].orbiting_body);
                        vel.text('Relative velocity: ' + s.close_approach_data[0].relative_velocity.kilometers_per_hour + 'km/h');

                        divTab.append(name, diameter, hazardous, url, miss, orbiting, vel);
                    }

                    $(divPills).append(divPill);
                    $(divTabs).append(divTab);

                }

                $('.col-3').append(divPills);
                $('.col-9').append(divTabs);
                break;
        }
    }

})

