const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId=require('mongodb').ObjectId

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6azwl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);



async function run() {
    try {
        await client.connect();
        // console.log('database connected');

        const database = client.db("HakkaniTravels");
        const servicesCollection = database.collection("Travelservices");
        const orderCollection=database.collection("order")

        app.get('/services',async (req,res)=>{
            const cursor=servicesCollection.find({})
            const services=await cursor.toArray()
            res.send(services)
        })
        // get single details
        app.get('/services/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const result= await servicesCollection.findOne(query)
            console.log(result);
            res.send(result)
        })
        // post order 
        app.post('/order',async (req,res)=>{
            const order=req.body
            const cursor= await orderCollection.insertOne(order)
            res.json(cursor)
        })
        // get order
        app.get('/orders',async(req,res)=>{
            const cursor=orderCollection.find({})
            const result=await cursor.toArray()
            res.send(result)
        })
   


        app.post('/addservices', async (req, res) => {
            const service=req.body
            const result= await servicesCollection.insertOne(service)
            res.json(result)
        });


        // order delete
        app.delete('/orders/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const result=await orderCollection.deleteOne(query)
            res.json(result)
        })

        // status update
        app.put('/orders/:id',async(req,res)=>{
            const id=req.params.id
            const filter={_id:ObjectId(id)}
            const updateStatus = {
                $set: {
                  status:"Approved"
                }
              };
              const result=await orderCollection.updateOne(filter,updateStatus)
              res.send(result)
        })


    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})