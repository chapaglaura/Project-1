$(document).ready(() => {

    sessionStorage.clear();

    var w = $('.rooms i').innerWidth();

    var w_rooms = $('.rooms div').width();


    $('.rooms input').width(w_rooms - w - w);


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

    var people = database.ref('/people');

    $('#your-name').on('input', function () {
        var name = $(this).val();

        people.once("value", function (snapshot) {
            var a = Object.values(snapshot.val());
            console.log(a.indexOf(name));

            if (a.indexOf(name) === -1) {
                $('#valid-username').css('color', 'lightgreen').text('Valid username.');
                $('#name-button').removeAttr('disabled');
            }
            else {
                $('#valid-username').css('color', 'lightgray').text('That name is already taken. Choose a different one.');
                $('#name-button').attr('disabled', 'true');
            }
        })
    })


    $('#name-button').click(function () {
        var name = $('#your-name').val();
        sessionStorage.setItem('name', name);
        location.href='player.html';

    });



    $('.rooms button').click(function () {
        $('.main-row').css('left', '-100%');
        $('.secondary-row').css('left', '0');
    })



})

