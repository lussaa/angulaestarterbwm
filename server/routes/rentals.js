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
    if (err) {
      res.res.status("422").send({errors: [{title: "Wrong code ID error"}]});
    }
    res.res.json(foundRental);
  });
})
module.exports = router;
