'use strict';

const axios = require('axios');
const mongoose =require('mongoose');
const { Schema } = mongoose;

function parseMovieData(title, data) {
  const startIndex = data.indexOf('Language Usage');
  const stripped = data.substring(startIndex);
  console.log(stripped);
  const sections = stripped.split ('\n\n');

  return {
    title: title,
    languageDescription: sections[0],
    drugDescription: sections[1],
    sexDescription: sections[2],
    roleModelDescription: sections[3],
    messageDescription: sections[4],
    representationDescription: sections[5],
    violenceDescription: sections[6],
    productDescription: sections[7],
  };
}

async function getPoster(title) {
  try {
    let movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${title}`;
    console.log(movieURL);
    let movieDataFromAxios = await axios.get(movieURL);
    console.log(movieDataFromAxios.data.results[0].poster_path);
    if (movieDataFromAxios.data.results){
      return movieDataFromAxios.data.results[0].poster_path;
    } else {
      return;
    }
    
  } catch (error) {
    console.error('No Movie Found');
  }


}



const movieSchema = new Schema ({
  title: { type: String, required: true },
  languageRating: {type: Number},
  languageDescription: { type: String, required: true },
  drugRating: {type: Number},
  drugDescription: { type: String, required: true },
  sexRating: {type: Number},
  sexDescription: { type: String, required: true },
  roleModelRating: {type: Number},
  roleModelDescription: { type: String, required: true },
  messageRating: {type: Number},
  messageDescription: { type: String, required: true },
  representationRating: {type: Number},
  representationDescription: { type: String, required: true },
  violenceRating: {type: Number},
  violenceDescription: { type: String, required: true },
  productRating: {type: Number},
  productDescription: { type: String, required: true },
  user: { type: String},
  imageUrl: { type: String}
});

const Movie = mongoose.model('movie', movieSchema);

module.exports = {Movie, parseMovieData, getPoster};
