let express = require('express')

let Band = require('../models/bandModel')

let router = () => {

    let bandsRouter = express.Router()

    bandsRouter.use('/', (req, res, next) => {
        let acceptType = req.get("Accept")

        if (acceptType == "application/json") {
            next()
        } else {
            res.status(400).send()
        }
    })

    //get all bands
    bandsRouter.get('/bands', async (req, res) => {
        try {
            let bands = await Band.find()

            let bandCollection = {
                "items" : [],
                "_links" : {
                    "self" : {"href": "http://" + req.headers.host + "/api/bands"},
                    "collection" : {"href": "http://" + req.headers.host + "/api/bands"}
                },
                "pagination" : { "message": "TO-DO"}
            }

            for (let b of bands) {
                console.log(b)
                let bandItem = b.toJSON()

                bandItem._links =
                    {
                        "self" : { "href" : "http://" + req.headers.host + "/api/bands/" + bandItem._id },
                        "collection" : { "href" : "http://" + req.headers.host + "/api/bands" }
                    }

                bandCollection.items.push(bandItem)
            }

            res.json(bandCollection)

        } catch (err) {
            res.status(500).send(err)
        }
    })

    bandsRouter.options('/bands', (req, res) => {
        console.log("requested options")
        res.header("Allow", "POST, GET, OPTIONS").send()
    })

    // get one band
    bandsRouter.get('/bands/:id', getBand, (req, res) => {
        res.json(res.band)
    })

    // add a new band
    bandsRouter.post('/bands', async (req, res) => {
        const band = new Band({
            name: req.body.name,
            rating: req.body.rating,
            mainGenre: req.body.mainGenre
        })
        try {
            const newBand = await band.save()
            res.status(201).json(newBand)
        } catch (err) {
            res.status(400).send({ message: err.message })
        }
    })

    //update band TODO
    bandsRouter.patch('/bands/:id', getBand, async (res, req) => {
        // if (req.body.name != null) {
        //     res.band.name = req.body.name
        // }
        // if (req.body.rating != null) {
        //     res.band.rating = req.body.rating
        // }
        // if (req.body.mainGenre != null) {
        //     res.band.mainGenre = req.body.mainGenre
        // }

        // try {
        //     const updatedBand = await res.band.save()
        //     res.json(updatedBand)
        // } catch(err) {
        //     res.status(400).send({ message: err.message})
        // }
    })

    // delete band
    bandsRouter.delete('/bands/:id', getBand, async (req, res) => {
        try {
            await res.band.remove()
            res.send({ message: 'Band is deleted' })
        } catch (err) {
            res.status(500).send({ message: err.message })
        }
    })

    async function getBand(req, res, next) {
        let band
        try {
            band = await Band.findById(req.params.id)
            if (band == null) {
                return res.status(404).send({ message: 'Can not find band' })
            }
        } catch {
            return res.status(500).send({ message: err.message })
        }

        res.band = band
        next()
    }

    return bandsRouter
    
}

module.exports = router