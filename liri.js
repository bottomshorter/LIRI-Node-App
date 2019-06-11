require('dotenv').config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var axios = require('axios');

//Moment JS
var moment = require('moment');

//Spotify Keys 
var spotify = new Spotify(keys.spotify);

var fs = require('fs');


moment().format();

var command = process.argv[2];
var input = process.argv[3];

//Function: spotify-this-song; Searches Spotify API for whatever is entered into process.arg[3]
function spotifySong(spotifyQuery) {

    //If there is nothing entered into process.argv[3] or input, then search Spotify for "I Want It That Way"
    if (spotifyQuery === undefined) {
        spotifyQuery = "I Want It That Way";
    }

    spotify.search({ type: 'track', query: spotifyQuery }, function (err, data) {

        //If there is an error, log error that has happen.
        if (err) {
            return console.log('Error: ' + err);
        }

        //If there isn't an error, run loop that grabs the item returned from Spoify and console log the results.
        else {
            for (i = 0; i < data.tracks.items.length && i < 5; i++) {

                //Set musicQuery to data retrieved from Spotify API
                var musicQuery = data.tracks.items[i];
                // Artist(s)
                console.log("Artist: " + musicQuery.artists[0].name +

                    // Song Name
                    "\nSong Name: " + musicQuery.name +

                    // A preview link of the song from Spotify
                    "\nLink to Song: " + musicQuery.preview_url +

                    // Album Name which song belongs to
                    "\nAlbum Name: " + musicQuery.album.name +
                    "\n-----------------------------------");
            }
        };
    });
}

function whenConcert(){
    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
    .then(function(response) {    
        for (var i = 0; i < response.data.length; i++) {

            var datetime = response.data[i].datetime; //Saves datetime response into a variable
            var dateArr = datetime.split('T'); //Attempting to split the date and time in the response

            var concertResults = 
                
                    "\nVenue Name: " + response.data[i].venue.name + 
                    "\nVenue Location: " + response.data[i].venue.city +
                    "\nDate of the Event: " + moment(dateArr.datetime).format("MM/DD/YYYY") +
                    "\n--------------------------------------------------------------------";
            console.log(concertResults);
        }
    })
    .catch(function (error) {
        console.log(error);
    });



}

//
var ask = function (commands, returnData) {
    switch (commands) {
        //Case to match
        case "concert-this":
            //Run function according to case
            whenConcert(returnData);
            break;

        case 'spotify-this-song':
            spotifySong(returnData);
            break;

        case "movie-this":
            movieData(returnData);
            break;

        case 'do-what-it-says':
            doWhatItSays();
            break;

        default:
            console.log("Invalid command. Please try again and use the following commands:"
            + "\nconcert-this" //done
            + "\nspotify-this-song" //done
            + "\nmovie-this"
            + "\ndo-what-it-says"
            + "\n---------------------------------");
    }
};

ask(command, input);
