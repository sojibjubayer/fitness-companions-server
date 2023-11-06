const express = require('express');
const cors = require('cors');
require('dotenv').config()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000


//Middleware
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
}))
// app.use(cookieParser())
// const verify = async (req, res, next) => {
//     //cookie ache kina check koro
//     const token = req.cookies?.token
//     if (!token) {
//         res.status(401).send({ status: 'unAuthoriezed' })
//         return;
//     }
//     jwt.verify(token, process.env.SECRETE, (error, decode) => {
//         if (error) {
//             res.status(401).send({ status: 'forBidden' })
//         }
//         else {
//             console.log(decode);
//         }

//     })
// }




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j998cjx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const FitnessServiceCollection = client.db('FitnessPartner').collection('services')
        const FitnessBookedCollection = client.db('FitnessPartner').collection('bookedServices')



        // post to mongoDb
        app.post('/services', async (req, res) => {
            const newservices = req.body;
            console.log(newservices);
            const result = await FitnessServiceCollection.insertOne(newservices)
            res.send(result)
        })
        // get from mongoDb
        app.get('/services', async (req, res) => {
            const cursor = FitnessServiceCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

         // get from mongodb for details by id
         app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await FitnessServiceCollection.findOne(query)
            res.send(result)
          })
           // post booked services
        app.post('/bookedServices', async (req, res) => {
            const newBookedServices = req.body;
            console.log(newBookedServices);
            const result = await FitnessBookedCollection.insertOne(newBookedServices)
            res.send(result)
        })

        
        //Delete from services by email
        
    app.delete('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await FitnessServiceCollection.deleteOne(query)
        res.send(result)
      })

       //Update data
    app.put('/services/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true }
        const updateService = req.body;
        const newUpdateService = {
          $set: {
            pName: updateService.pName,
            pEmail: updateService.pEmail,
            pImage: updateService.pImage,
            serviceName: updateService.serviceName,
            serviceImage: updateService.serviceImage,
            shortD: updateService.shortD,
            serviceArea: updateService.serviceArea,
            price: updateService.price,
            
          }
        }
        const result = await FitnessServiceCollection.updateOne(filter, newUpdateService, options)
        res.send(result)
      })
























        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);










app.get('/', (req, res) => {
    res.send('fitness server is running')
})
app.listen(port, () => {
    console.log('server is running at:', port);
})