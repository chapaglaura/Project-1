var current_room;
var admin = false;

$(document).ready(() => {

    sessionStorage.clear(); // clears session storage


    // Sets inputs width styling, considering icon size
    var w = $('.rooms i').innerWidth();

    var w_rooms = $('.rooms div').width();

    $('.rooms input').width(w_rooms - w - w);

    // Database initialization
    var config = {
        apiKey: "AIzaSyBx9Tndm3dCv-AKVPS_pslFRAWz3je1_7g",
        authDomain: "project-1-ec39b.firebaseapp.com",
        databaseURL: "https://project-1-ec39b.firebaseio.com",
        projectId: "project-1-ec39b",
        storageBucket: "project-1-ec39b.appspot.com",
        messagingSenderId: "90657483363"
    };
    firebase.initializeApp(config);

    var database = firebase.database(); // store firebase database

    var rooms = database.ref('/rooms'); // reference to rooms directory in database

    /* Checks if there are previously created rooms.
    If so, joining is available. */
    rooms.once("value", function (snapshot) {
        if (snapshot.val() === null) {
            $('#join-room-name').attr('disabled', 'true');
        }
        else {
            $('#join-room-name').removeAttr('disabled');
        }
    });

    // Input event handler
    $('#create-room-name').on('input', function () {
        var name = $(this).val(); // stores value in text input in variable

        /* Checks if room name chosen to create already exists,
         so there won't be two rooms with the same name.
         (1) If it is not the first room created, proceed to name check.
         (2) Creates array of the room names stored in rooms directory in database.
         (3) If name is not taken, alert the user so, and viceversa.
         (4) If it is the first room ever created, name check is not necessary.*/

        rooms.once("value", function (snapshot) {

            if (snapshot.val() != null) { // (1)
                var a = Object.keys(snapshot.val()); // (2)

                if (a.indexOf(name) === -1) { // (3)
                    $('#valid-room').css('color', 'lightgreen').text('Valid room.');
                    $('#create-button').removeAttr('disabled');
                }
                else {
                    $('#valid-room').css('color', 'lightgray').text('That room already exists. Choose a different name.');
                    $('#create-button').attr('disabled', 'true');
                }
            }
            else { // (4)
                $('#valid-room').css('color', 'lightgreen').text('Valid room.');
                $('#create-button').removeAttr('disabled');
            }
        });
    });

    // Click event handler
    $('#create-button').click(function () {

        /* (1) Retrieves text from input and stores it in variable.
           (2) Reference to room in rooms directory in database.
           (3) Store room name in session storage for later use. */
        var room_name = $('#create-room-name').val(); // (1)
        current_room = database.ref('/rooms/' + room_name); // (2)
        sessionStorage.setItem('room', room_name); // (3)
        admin = true;
    });

    //Input event handler
    $('#join-room-name').on('input', function () {
        var name = $(this).val(); // stores value in text input in variable

        /* Checks if room name chosen to join does exist.
         A non-existent room cannot be joined (duh).
         (1) If there is at least one room in database, proceed to name check.
         (2) Creates array of the room names stored in rooms directory in database.
         (3) If name matches an existing room name, alert the user so, and viceversa.
         (4) If there are no rooms, name check is not necessary, thus joining is unavailable.*/
        rooms.once("value", function (snapshot) {

            if (snapshot.val() != null) { // (1)
                var a = Object.keys(snapshot.val()); // (2)

                if (a.indexOf(name) === -1) { // (3)
                    $('#existing-room').css('color', 'lightgray').text('Room does not exist. Choose a different name.');
                    $('#join-button').attr('disabled', 'true');
                }
                else { 
                    $('#existing-room').css('color', 'lightgreen').text('Valid room.'); 
                    $('#join-button').removeAttr('disabled');
                }
            }
        });
    });

    // Click event handler
    $('#join-button').click(function () {

        /* (1) Retrieves text from input and stores it in variable.
           (2) Reference to room in rooms directory in database.
           (3) Store room name in session storage for later use. */
        var room_name = $('#join-room-name').val(); // (1)
        current_room = database.ref('/rooms/' + room_name); // (2)
        sessionStorage.setItem('room', room_name); // (3)
    });

    // Click event handler
    $('.rooms button').click(function () {
        // Page transition
        $('.main-row').css('left', '-100%');
        $('.secondary-row').css('left', '0');
    });

    //Input event handler
    $('#your-name').on('input', function () {
        var name = $(this).val(); //store value in text input

        /* Checks if name chosen is already taken in
        room created/joined, so there won't be two names
        repeated. 
        (1) If there are people inside specified room, proceed to name check.
        (2) Creates array of the room names stored in rooms directory in database.
        (3) Stores flag for room admin in session storage for later use
        (4) If name is not taken in room, alert the user so, and viceversa.
        (5) If the room is empty, name check is not necessary.*/

        current_room.once("value", function (snapshot) {
            if (snapshot.val() != null) { // (1)
                var a = Object.values(snapshot.val()); // (2)
                sessionStorage.setItem('created', 'no'); // (3)
                if (a.indexOf(name) === -1) { // (4)
                    $('#valid-username').css('color', 'lightgreen').text('Valid username.');
                    $('#name-button').removeAttr('disabled');
                }
                else {
                    $('#valid-username').css('color', 'lightgray').text('That name is already taken. Choose a different one.');
                    $('#name-button').attr('disabled', 'true');
                }
            }
            else { // (5)
                sessionStorage.setItem('created', 'yes');
                $('#valid-username').css('color', 'lightgreen').text('Valid username.');
                $('#name-button').removeAttr('disabled');
            }

        });

    });

    // Click event handler
    $('#name-button').click(function () {

        /* (1) Retrieves name from input and stores it in variable.
           (2) Stores username in session storage for later use.
           (3) Redirect to player webpage. */
        var name = $('#your-name').val(); // (1)
        
        sessionStorage.setItem('name', name); // (2)
        location.href = 'player.html'; // (3)
    });


})

