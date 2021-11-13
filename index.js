const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8g1rh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("tourisom");
    const servicessCollection = database.collection("services");
    const orderCollection = database.collection("orders");
    const reviewCollection = database.collection("reviews");
    const userCollection = database.collection("users");
    const expolerCollection=database.collection("expoler");
    // Get api
    app.get("/services", async (req, res) => {
      const cursore = servicessCollection.find({});
      const services = await cursore.toArray();
      res.send(services);
    });
    // Get singel Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicessCollection.findOne(query);
      res.json(service);
    });

    // POST API

    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicessCollection.insertOne(service);
      res.json(result);
    });

    // Delete Api

    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicessCollection.deleteOne(query);
      res.json(result);
    });

    // POst Order
app.get("/orders", async (req, res) => {
let query={};
const email=req.query.email;
if(email){
  query={email:email};
}
const cursor = orderCollection.find(query);
const orders = await cursor.toArray();
res.send(orders);
    });
    // Get singel Service
    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const order = await orderCollection.findOne(query);
      res.json(order);
    });


    app.post("/orders", async (req, res) => {
      const orders = req.body;
      // order.createdAt=new Date();
      const result = await orderCollection.insertOne(orders);
      res.json(result);
    });

    app.get("/addSReview", async (req, res) => {
      const cursor = reviewCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
          });
    app.get("/addSReview/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const review = await reviewCollection.findOne(query);
      res.json(review);
    });
app.post("/addSReview",async(req, res)=>{
const result= await reviewCollection.insertOne(req.body)
res.send(result)

})

app.post("/addUserInfo", async (req, res)=>{
const result = await userCollection.insertOne(req.body)
res.send(result)
console.log(result)
})

app.put("/makeAdmin",async (req, res)=>{
  //   const filter = { email: req.body.email };
  //   const result = await userCollection.find(filter).toArray();
  //  console.log(result)
    console.log(req.body);
    const filter = { email: req.body.email };
      const result = await userCollection.find(filter).toArray();
      // console.log(result);
  
      if (result) {
        const documents = await userCollection.updateOne(filter, {
          $set: { role: "admin" },
        });
        console.log(documents);
      }

  });

  // check admin or not
  app.get("/checkAdmin/:email", async (req, res) => {
    const result = await userCollection
      .find({ email: req.params.email })
      .toArray();
    console.log(result);
    res.send(result);
  });

 /// all order
 app.get("/allOrders", async (req, res) => {
  // console.log("hello");
  const result = await orderCollection.find({}).toArray();
  res.send(result);
});

// status update
app.put("/statusUpdate/:id", async (req, res) => {
  const filter = { _id: ObjectId(req.params.id) };
  console.log(req.params.id);
  const result = await orderCollection.updateOne(filter, {
    $set: {
      status: req.body.status,
    },
  });
  res.send(result);
  console.log(result);
});

// Expoler
app.get("/expoler",async (req, res)=>{
const cursor=expolerCollection.find({});
const expoler=await cursor.toArray();
res.send(expoler);
})






  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Ranning Watch Server");
});


app.listen(port, () => {
  console.log("Rannig server is port", port);
});
