exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

console.log("Spotify ID and Secret linked.");
console.log("-----------------------------------");

exports.omdb = {
  apikey: process.env.OMDB_APIKEY
}

console.log("OMDB API connected.");
console.log("-----------------------------------");