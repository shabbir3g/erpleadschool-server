const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// middleware 

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tg4nc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db("erpLeadSchool");
        const studentsCollection = database.collection('students');


        // post students
        app.post('/students', async (req, res) => {
            const student = req.body;
            const result = await studentsCollection.insertOne(student);
            res.json(result);
        });

        // GET students
        app.get('/students', async (req, res) => {
            const cursor = studentsCollection.find({});
            const students = await cursor.toArray();
            res.send(students)
        });

        // Delete student
        app.delete('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await studentsCollection.deleteOne(query);
            console.log('deleting students with id', result);
            res.json(result)
        });

        app.get('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const students = await studentsCollection.findOne(query);
            console.log('load student with id: ', id);
            res.send(students);

        });



    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Erp Lead School Server is Running!')
})

app.listen(port, () => {
    console.log(`Erp Lead School Server listening at http://localhost:${port}`)
})