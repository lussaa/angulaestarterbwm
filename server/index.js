const express = require('express');  //node js express framework import
const mongoose  = require('mongoose');
//mongodb+srv://Test:<password>@cluster0-4wj8h.mongodb.net/test?retryWrites=true&w=majority
const config = require('./config/dev');
const Rental = require('./models/rental');
const Fakedb = require('./fakedb').Fakedb;
//import Fakedb from './fakedb';


const then = mongoose.connect(config.DB_URI).then(() => {
  const fakedb = new Fakedb();
  fakedb.seedDb();
});
var app = express();
app.get('/rentals', function (rwq, res) {
  res.json({'succccess':true})
});
var PORT = process.env.PORT || 3002;
app.listen(PORT, function(){
  console.log("Running......")
})
