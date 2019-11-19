const Rental = require('./models/rental');
const express = require('express');  //node js express framework import
const mongoose  = require('mongoose');
//mongodb+srv://Test:<password>@cluster0-4wj8h.mongodb.net/test?retryWrites=true&w=majority
const config = require('./config/dev');
const rentalRoutes = require('./routes/rentals');
// var ffakeDb = require('./fake-db');
// //import FakeDb from './fake-db';
// import { FakeDb } from './fake-db';

const app = express();


class FakeDb {
  constructor() {
    this.rentals = [{
      title: "Nice view on ocean",
      city: "San Francisco",
      street: "Main street",
      category: "condo",
      image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
      bedrooms: 4,
      shared: true,
      description: "Very nice apartment in center of the city.",
      dailyRate: 43
    },
      {
        title: "Modern apartment in center",
        city: "New York",
        street: "Time Square",
        category: "apartment",
        image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
        bedrooms: 1,
        shared: false,
        description: "Very nice apartment in center of the city.",
        dailyRate: 11
      },
      {
        title: "Old house in nature",
        city: "Spisska Nova Ves",
        street: "Banicka 1",
        category: "house",
        image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
        bedrooms: 5,
        shared: true,
        description: "Very nice apartment in center of the city.",
        dailyRate: 23
      }]
  }

  pushRentalsToDb(){
    this.rentals.forEach((rental) => {
      const newRental = new Rental(rental);
      newRental.save();
      console.log("saved");
    })

  }
  async cleanDb(){
    await Rental.deleteMany();
    console.log("deleted");
  }
  seedDb(){
    this.cleanDb();
    this.pushRentalsToDb();

  }
}

const fakedb = new FakeDb();
const then = mongoose.connect(config.DB_URI).then(() => {
  //fakedb.seedDb();
  console.log("PUSHED");
});

// app.get('/rentals', function (rwq, res) {
//   res.json({'succccess':true})
// });
app.use('/api/v1/rentals', rentalRoutes);
var PORT = process.env.PORT || 3002;
app.listen(PORT, function(){
  console.log("Running......")
})


