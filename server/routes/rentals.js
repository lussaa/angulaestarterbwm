const Rental = require("../models/rental");

const express =  require('express');
const router = express.Router();

router.get('', function(req, res){
  Rental.find({}, function(err, foundRentals){
    res.json(foundRentals);
  })
});

router.get('/:_id', function(res, req) {

  const rentalId = res.params._id;
  Rental.findById(rentalId, function (err, foundRental) {
    res.res.json(foundRental);
  });
})
module.exports = router;
