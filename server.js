'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const Movie = require('./models/movie');
// const axios = require('axios');


//MIDDLEWARE
app.use(cors());

app.use(express.json());


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`We are running on ${PORT}!`));

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});


app.get('/test', (request, response) => {

  response.send('test request received');

});

app.get('/movies', getMovies);

async function getMovies(request, response, next){
  try {
    // GET ALL movies FROM THE DB
    let allMovies = await Movie.find({});

    // TODO: SEND THOSE movies ON THE RESPONSE
    response.status(200).send(allMovies);
  } catch (error) {
    next(error);
  }
}

app.post('/movies', addMovie);

async function addMovie(request, response, next){
  console.log(request.body);
  try {
    let createdMovie = await Movie.create(request.body);

    response.status(200).send(createdMovie);
  } catch (error) {
    next(error);
  }
}

app.get('*', (request, response) => {
  response.status(404).send('Sorry, page not found');
});


app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});


