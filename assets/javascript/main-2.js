var token = '';
var r;
$(document).ready(() => {
$('.users-menu-icon, .close-menu-icon').click(function () {
$('.users-menu-icon, .close-menu-icon, .users').toggleClass('hidden');
$('.users-menu').toggleClass('menu-opened');

});

var config = {
apiKey: "AIzaSyBx9Tndm3dCv-AKVPS_pslFRAWz3je1_7g",
authDomain: "project-1-ec39b.firebaseapp.com",
databaseURL: "https://project-1-ec39b.firebaseio.com",
projectId: "project-1-ec39b",
storageBucket: "project-1-ec39b.appspot.com",
messagingSenderId: "90657483363"
};
firebase.initializeApp(config);

var database = firebase.database();

var connected = database.ref(".info/connected");
var people = database.ref("/people");

var name = sessionStorage.getItem('name');


var connected = database.ref(".info/connected");
var people = database.ref("/people");

connected.on("value", function (snapshot) {

if (snapshot.val()) {
var con = people.push(name);
con.onDisconnect().remove();

}
});

people.on("child_removed", function (snapshot) {
console.log(snapshot.val());
$('.users p:contains("' + snapshot.val() + '")').remove();
})


people.on("child_added", function (snapshot) {
var name = snapshot.val();

var p = $('<p>');

p.text(name);

$('.users').append(p);

console.log(people);
});

var current_url = $(location).attr('href');
if (current_url.includes('access_token')) {
console.log("HOLA");
current_url_array = current_url.split('=');
current_url_array = current_url_array[1].split('&');
token = current_url_array[0];
console.log(token);

}


$('#login').click(function () {
location.href = 'https://accounts.spotify.com/authorize/?client_id=537b0cdacc7f46de8bd9bf27057c93ca&response_type=token&redirect_uri=https://chapaglaura.github.io/Project-1/player.html';
})

$('.search-btn').click(function () {
var clicked = $(this).text();

$('.search-parameter').attr({ 'id': clicked.toLowerCase(), 'placeholder': clicked });

$('.search-btn').removeClass('active');
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
selected += 's';

switch (selected) {
case 'tracks':
getTracks(response);
break;

case 'artists':
break;


case 'albums':
break;


case 'playlist':
break;
}
});


});

$('.search-results').on('click', '.each-track', function (e) {
e.preventDefault();
console.log("HEY");
var index = $(this).attr('data-number');

switch (selected) {
case 'tracks':
setTracks(index);
break;

case 'artists':
break;


case 'albums':
break;


case 'playlist':
break;
}
});



});

function getTracks(r) {
var items = r.tracks.items;

for (var i = 0; i < items.length; i++) {
var track = items[i].name;
var artist = items[i].artists[0].name;
var album = items[i].album.name;

var button = $('<button class="each-track" data-number="' + i + '">');
var div = $('<div>')
var h4 = $('<h4>');
var h5 = $('<h5>');
var h6 = $('<h6>');
var hr = $('<hr>')

h4.text(track);
h5.text(artist);
h6.text(album);

$(div).append(h4, h5, h6, hr);

$(button).append(div);
$('.search-results').append(button);
}
}

function setTracks(index) {

var trackID = r.tracks.items[index].id;

$.ajax({
url: 'https://api.spotify.com/v1/me/player/play?access_token=' + 'BQB4P4yYhV1lQ8mm8h_P3eciMSqTaliKsqEPclf-lz4dBvcW-2oLJFN0MB_-qvygmDqoK3JwiCLgk0cTD4TRQOlZYgSujVxodRkoAEVgFNNMpNPmFNYv8ufJyav1FzTQACphl6U-H9kmkZQWhLYQvo0Yx5m_UsPrzs9fiLHwMA',
method: 'PUT',
body: {"uris": ["spotify:track:" + trackID]}
}).then(function (response) {
console.log(response);
});
}