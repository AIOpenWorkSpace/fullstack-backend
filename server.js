'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
// const axios = require('axios');


//MIDDLEWARE
app.use(cors());


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`We are running on ${PORT}!`));




app.get('*', (request, response) => {
  response.status(404).send('Sorry, page not found');
});

app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});


