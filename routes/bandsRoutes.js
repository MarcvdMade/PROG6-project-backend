let express = require('express')
const { where } = require('../models/bandModel')


let Band = require('../models/bandModel')

let router = () => {

    let bandsRouter = express.Router()

    bandsRouter.use('/bands', (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        next()
    })

    bandsRouter.use('/bands', (req, res, next) => {
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
            // pagination
            const page = parseInt(req.query.start) 
            const limit = parseInt(req.query.limit)


            let bands = await Band.find()
            .limit(limit * 1)
            .skip((page -1) * limit)
            .exec()

            const count = await Band.countDocuments()

            let bandCollection = {
                "items": [],
                "_links": {
                    "self": { "href": "http://" + req.headers.host + "/api/bands" },
                    "collection": { "href": "http://" + req.headers.host + "/api/bands" }
                }
            }

            for (let b of bands) {
                console.log(b)
                let bandItem = b.toJSON()

                bandItem._links =
                {
                    "self": { "href": "http://" + req.headers.host + "/api/bands/" + bandItem._id },
                    "collection": { "href": "http://" + req.headers.host + "/api/bands" }
                }

                bandCollection.items.push(bandItem)
            }

            bandCollection.pagination = {
                "currentPage": page,
                "currentItems": bandCollection.items.length, 
                "totalPages": Math.ceil(count / limit),
                "totalItems": count
            }

            // Bad code probably a better way of doing this but idk
            let startUrl = "http://" + req.headers.host + "/api/bands"
            let limitUrl = "&limit=" + limit
            let firstUrl
            let lastUrl
            let previousUrl
            let nextUrl

            if (req.query.start) {
                console.log(page)
                firstUrl = startUrl + "?start=1&limit=" + limit
                lastUrl = startUrl + "?start=" + Math.ceil(count / limit) + limitUrl

                if(page == 1) {
                    previousUrl = firstUrl
                } else {
                    previousUrl = startUrl + "?start=" + parseInt(page - 1) + limitUrl
                }

                if (page == Math.ceil(count / limit)) {
                    nextUrl = lastUrl
                } else {
                    nextUrl = startUrl + "?start=" + parseInt(page + 1) + limitUrl
                }

            } else {
                firstUrl = startUrl
                lastUrl = startUrl
                previousUrl = startUrl
                nextUrl = startUrl
            }


            bandCollection.pagination._links =
            {
                "first": {
                    "page": 1,
                    "href": firstUrl, 
                },
                "last": {
                    "page": Math.ceil(count / limit),
                    "href": lastUrl
                },
                "previous": {
                    "page": page - 1,
                    "href": previousUrl
                },
                "next": {
                    "page": page + 1,
                    "href": nextUrl
                }
            }

            res.json(bandCollection)

        } catch (err) {
            res.status(500).send(err)
        }
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

    // options for collection
    bandsRouter.options('/bands', (req, res) => {
        console.log("requested options")
        res.header("Allow", "POST, GET, OPTIONS")
        res.header("Access-Control-Allow-Methods", 'POST, GET, OPTIONS').send()
        
    })

    // get one band
    bandsRouter.get('/bands/:id', getBand, (req, res) => {
        let band = res.band.toJSON()

        band._links = {
            "self": {"href": "http://" + req.headers.host + "/api/bands/" + band._id},
            "collection": {"href": "http://" + req.headers.host + "/api/bands"}
        }

        res.json(band)

    })

    //update band
    bandsRouter.put('/bands/:id', getBand, async (req, res) => {
        console.log("trying to update")

        if (req.body.name != null) {
            res.band.name = req.body.name
        }
        if (req.body.rating != null) {
            res.band.rating = req.body.rating
        }
        if (req.body.mainGenre != null) {
            res.band.mainGenre = req.body.mainGenre
        }

        try {
            const updatedBand = await res.band.save()
            res.json(updatedBand)
        } catch (err) {
            res.status(400).send({ message: err.message })
        }
    })

    // delete band
    bandsRouter.delete('/bands/:id', getBand, async (req, res) => {
        try {
            await res.band.remove()
            res.status(204).send({ message: 'Band is deleted' })
        } catch (err) {
            res.status(500).send({ message: err.message })
        }
    })

    // options for single band
    bandsRouter.options('/bands/:id', (req, res) => {
        console.log("requested options")
        res.header("Allow", "DELETE, GET, PUT, OPTIONS")
        res.header("Access-Control-Allow-Methods", 'DELETE, GET, PUT, OPTIONS').send()
    })

    //function to find the band by id
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