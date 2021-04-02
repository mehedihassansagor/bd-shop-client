const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 5055;

console.log(process.env.DB_USER)

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('BISMILLAH Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rpvut.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)
client.connect(err => {
    console.log("err hyse vai",err)
  const eventCollection = client.db("bdshop").collection("events");
  const singleProductCollection = client.db("bdshop").collection("singleProduct");
  
  app.post('/singleProduct', (req,res) => {
    const moreItem = req.body;
    singleProductCollection.insertOne(moreItem)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
    console.log(moreItem)
  })

  app.get('/singleProductAdd', (req, res)=>{
    console.log(req.query.email)
    singleProductCollection.find({email:req.query.email})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })
  

  app.get('/events', (req, res)=>{
    eventCollection.find()
    .toArray((err, items)=>{
      res.send(items);
      // console.log('from database',items)
    })
  })
  
  app.post('/adEvent',(req, res) => {
      const newEvent = req.body;
      console.log("new event add ",newEvent)
      eventCollection.insertOne(newEvent)
      .then(result =>{
        console.log('inserted count',result.insertedCount);
        res.send(result.insertedCount > 0);
      })
      
  })
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})