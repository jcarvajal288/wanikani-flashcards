import express from 'express';
import { MongoClient } from 'mongodb';

import bodyParser from 'body-parser';

import cors from 'cors';

const PORT = process.env.PORT || 3001;

const app = express();
const jsonParser = bodyParser.json({ limit: '2mb' });

const databaseUri = 'mongodb://root:example@localhost:27017/?authMechanism=DEFAULT';
const databaseClient = new MongoClient(databaseUri);

app.use(cors());

app.post('/fillDatabase', jsonParser, async (request, response) => {
    const subjects = request.body;
    console.log(`Filling database with ${subjects.length} subjects`);
    const database = databaseClient.db('insertDB');
    const subjectsTable = database.collection('subjects');
    const result = await subjectsTable.insertOne(subjects[0]);
    console.log('inserted id ' + result.insertedId);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
