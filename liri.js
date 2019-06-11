require('dotenv').config();

var keys = require('./keys.js');

//Axios
var axios = require('axios');

//Request
var request = require("request");

//Moment JS
var moment = require('moment');
moment().format();

//Spotify Keys 
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var fs = require('fs');

//Assigning command and input
var command = process.argv[2];
var input = process.argv[3];

//Function used to find concerts from queried artist and the date and venue they are playing at.
function whenConcert() {
    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
        .then(function (response) {
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

//Function: spotify-this-song; Searches Spotify API for whatever is entered into process.arg[3]
function spotifySong(spotifyQuery) {

    //If there is nothing entered into process.argv[3] or input, then search Spotify for "I Want It That Way"
    if (spotifyQuery === undefined) {
        spotifyQuery = "I Want It That Way";
    }

    spotify.search({
        type: 'track',
        query: spotifyQuery
    }, function (err, data) {

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

//Function: movie-this; Looks up movie from OMDB and gives Title, Year, Ratings from IMDB and Rotten Tomatoes, Country, Plot and Actors
var omdbMovie = function (movie) {
    var URL = `http://www.omdbapi.com/?apikey=${keys.omdb.apikey}&t=${movie ? movie : "Mr. Nobody"}`;

    request(URL, function (err, res, body) {
        if (err) throw err;

        var data = JSON.parse(body);

        if (data && !data.Error) {
            var output = [
                "Title: " + data.Title,
                "Year: " + data.Year,
                "Ratings:",
                "IMDB: " + (data.Ratings.length && data.Ratings[0]) ? data.Ratings[0].Value : "N/A",
                "Rotten Tomatoes: " + (data.Ratings.length && data.Ratings[1]) ? data.Ratings[1].Value : "N/A",
                "Country: " + data.Country,
                "Language: " + data.Language,
                "Plot: " + data.Plot,
                "Actors: " + data.Actors,
                "\n-----------------------------------"
            ].join("\n");

            console.log(output);
            fs.appendFile("log.txt", output + "\n", (err) => {
                if (err) throw err;
            });
        } else {
            console.log(`Error: ${data.Error}`);
            fs.appendFile("log.txt", `Error: ${data.Error}\n`, (err) => {
                if (err) throw err;
            });
        }
    });
}

//Switch cases for commands
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
            omdbMovie(returnData);
            break;

        case 'do-what-it-says':
            doWhatItSays();
            break;

        default:
            console.log("Invalid command. Use notionation 'node liri.js [argument] [song/movie name]'. Please try again and use the following commands:" +
                "\nconcert-this"
                +
                "\nspotify-this-song" 
                +
                "\nmovie-this" + 
                "\ndo-what-it-says" + 
                "\n---------------------------------");
    }
};

var doWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) throw err;

        var cmd = data.split(",")[0];
        var term = data.split(",")[1];

        ask(cmd, term);
    });
};

doWhatItSays();

ask(command, input);