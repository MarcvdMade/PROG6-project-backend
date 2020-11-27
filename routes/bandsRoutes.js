let express = require('express')

let Band = require('../models/bandModel')

let router = () => {
    
    let bandsRouter = express.Router()

        //get all bands
        bandsRouter.get('/bands', async (req, res) => {
            try {
                let bands = await Band.find()
                res.json(bands)
            } catch (err) {
                res.status(500).json(err)
            }
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
                res.status(400).json({message: err.message})
            }
        })

    //update band
    bandsRouter.patch('/bands/:id', getBand, async (res, req)=>{
        
    })

    // delete band
    bandsRouter.delete('/bands/:id', getBand, async (req, res) => {
        try {
            await res.band.remove()
            res.json({ message: 'Deleted band'})
        } catch (err) {
            res.status(500).json({message: err.message})
        }
    })

    async function getBand(req, res, next) {
        let band
        try {
            band = await Band.findById(req.params.id)
            if(band == null) {
                return res.status(404).json({ message: 'Can not find band'})
            }
        } catch {
            return res.status(500).json({message: err.message})
        }

        res.band = band
        next()
    }
    
    return bandsRouter
}

module.exports = router