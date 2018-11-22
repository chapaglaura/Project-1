$(document).ready(() => {
    /*
    window.onSpotifyWebPlaybackSDKReady = () => {
        var player = new Spotify.Player({
            name: 'Partify Player',
            getOAuthToken: callback => {
              
          
              callback('access token here');
            },
            volume: 0.5
          });

          $.ajax({
   url: 'https://api.spotify.com/v1/me',
   headers: {
       'Authorization': 'Bearer ' + accessToken
   },
   success: function(response) {
       ...
   }
      };*/


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
    });



    $('#login').click(function() {
        location.href = 'https://accounts.spotify.com/authorize/?client_id=537b0cdacc7f46de8bd9bf27057c93ca&response_type=token&redirect_uri=https://chapaglaura.github.io/Project-1/player.html';
    })



});

var x = 'https://accounts.spotify.com/authorize/?client_id=537b0cdacc7f46de8bd9bf27057c93ca&response_type=token&redirect_uri=file:///Users/laurachapa/Desktop/AfterTEC/Bootcamp/Projects/Project-1/player.html'


