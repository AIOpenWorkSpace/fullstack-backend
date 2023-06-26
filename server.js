'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const Movie = require('./models/movie');
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API,
});
const openai = new OpenAIApi(configuration);

//MIDDLEWARE
app.use(cors());
app.use(express.json());


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

app.post('/ask', async (req, res) => {
  const { prompt } = req.body;

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

    res.status(200).json({
      data: completion.data.choices[0].message.content
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('*', (request, response) => {
  response.status(404).send('Sorry, page not found');
  console.log('404 - Page not found');
});


app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});


