let express = require('express')

let Band = require('../models/bandModel')

let routes = function() {
    
    let bandsRouter = express.Router()

    //add a new band
    bandsRouter.route('/bands')
    .post(function (req, res) {
        let band = new Band(req.body)

        band.save(function(err) {
            res.status(201).send(band)
        })
    })

    //get all bands
    bandsRouter.route('/bands')
    .get(function(req, res) {
        Band.find({}, function(err, bands) {
            if(err) {
                res.status(500).send(err)
            } else {
                res.json(bands)
            }
        })
    })

    //get details of band
    bandsRouter.route('/bands/:id')
    .get(function(req, res) {

        //get the id
        let id = req.params.id

        Band.findById(id, function(err, bands) {
            if (err) {
                res.status(404).send(err)
            } else {
                res.json(bands)
            }
        })
    })

    //delete band
    // bandsRouter.route('/bands/:id/delete')
    // .delete(function(req, res) {
        
    //     //get the id
    //     let id = req.params.id

    //     let band = Band.findById(id)


    // })
    

    return bandsRouter
}

module.exports = routes