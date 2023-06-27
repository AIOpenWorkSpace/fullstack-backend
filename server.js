'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const { Movie, parseMovieData, getPoster } = require('./models/movie');
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");
const auth = require('./auth');


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API,
});
const openai = new OpenAIApi(configuration);

//MIDDLEWARE
app.use(cors());
app.use(express.json());
// app.use(auth);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`We are running on ${PORT}!`));

mongoose.connect(process.env.DB_URL);


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


app.post('/ask/:title', async (req, res) => {
  const { prompt } = req.body;
  const { title } = req.params;
  
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });
    
    const parsedMovieData = parseMovieData(title, completion.data.choices[0].message.content);
    parsedMovieData.imageURL = await getPoster(title);
    

    res.status(200).json({
      data: parsedMovieData
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use(auth);

app.post('/movies', addMovie);

async function addMovie(request, response, next){
  console.log(request.body);
  try {
    let createdMovie = await Movie.create({...request.body, user: request.user.email});

    response.status(200).send(createdMovie);
  } catch (error) {
    next(error);
  }
}

app.delete('/movies/:movieID', deleteMovie);

async function deleteMovie(request, response, next){
  try {
    let id=request.params.movieID;
    await Movie.findByIdAndDelete(id);
    response.status(200).send('Movie was deleted from database');
  } catch (error) {
    next(error);
  }
}

app.put('/movies/:movieID', updateMovie);

async function updateMovie(request, response, next){
  try {
    let id = request.params.movieID;
    let data = request.body;

    let updatedMovie = await Movie.findByIdAndUpdate(id, data, { new: true, overwrite: true});
    response.status(200).send(updatedMovie);
  } catch (error) {
    next(error);
  }
}

app.get('*', (request, response) => {
  response.status(404).send('Sorry, page not found');
  console.log('404 - Page not found');
});


app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});


