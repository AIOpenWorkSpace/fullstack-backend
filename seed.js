'use strict';

const mongoose = require('mongoose');

require('dotenv').config();
mongoose.connect(process.env.DB_URL);

const Movie = require('./models/movie.js');

async function seed() {
  let createdMovie;

  try {
    createdMovie = await Movie.create({
      title: "Test Movie",
      languageRating: 7,
      languageDescription: "Some Description",
      drugRating: 5,
      drugDescription: "Some Description",
      sexRating: 9,
      sexDescription: "Some Description",
      roleModelRating: 4,
      roleModelDescription: "Some Description",
      messageRating: 3,
      messageDescription: "Some Description",
      representationRating: 8,
      representationDescription: "Some Description",
      violenceRating: 2,
      violenceDescription: "Some Description",
      productRating: 3,
      productDescription: "Some Description",
      user: "testuser@gmail.com",
      imageUrl: "testurl.com"
    });

    console.log('Test movie created:', createdMovie);
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    mongoose.disconnect(); // Always disconnect from the database
  }
}

seed();