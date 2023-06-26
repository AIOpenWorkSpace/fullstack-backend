'use strict';

const mongoose =require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema ({
  title: { type: String, required: true },
  languageRating: {type: Number, required: true},
  languageDescription: { type: String, required: true },
  drugRating: {type: Number, required: true},
  drugDescription: { type: String, required: true },
  sexRating: {type: Number, required: true},
  sexDescription: { type: String, required: true },
  roleModelRating: {type: Number, required: true},
  roleModelDescription: { type: String, required: true },
  messageRating: {type: Number, required: true},
  messageDescription: { type: String, required: true },
  representationRating: {type: Number, required: true},
  representationDescription: { type: String, required: true },
  violenceRating: {type: Number, required: true},
  violenceDescription: { type: String, required: true },
  productRating: {type: Number, required: true},
  productDescription: { type: String, required: true },
  user: { type: String},
  imageUrl: { type: String}
});

const Movie = mongoose.model('movie', movieSchema);

module.exports = Movie;
