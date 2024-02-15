import express from 'express';
import { MongoClient } from 'mongodb';

import bodyParser from 'body-parser';

import cors from 'cors';

const PORT = process.env.PORT || 3001;
const DB_HOST = process.env.DB_HOST || 'localhost';

const app = express();
const jsonParser = bodyParser.json({ limit: '4mb' });

const databaseUri = `mongodb://root:example@${DB_HOST}:27017/?authMechanism=DEFAULT`;
const databaseClient = new MongoClient(databaseUri);

app.use(cors());

app.post('/dropDatabase', async (request, response) => {
    const database = databaseClient.db('wanikani_db');
    const subjectsTable = database.collection('subjects');
    await subjectsTable.drop();
    response.sendStatus(200);
})

app.post('/fillDatabase', jsonParser, async (request, response) => {
    const subjects = request.body;
    console.log(`Filling database with ${subjects.length} subjects`);
    const database = databaseClient.db('wanikani_db');
    const subjectsTable = database.collection('subjects');
    await subjectsTable.insertMany(subjects);
    response.sendStatus(201);
});

app.get('/loadFromDatabase', async (request, response) => {
    const subjectIds = request.query.subject_ids.split(',').map(Number);
    const database = databaseClient.db('wanikani_db');
    const subjectsTable = database.collection('subjects');
    const subjects = await subjectsTable.find({ id: { $in: subjectIds } }).toArray();
    response.json(subjects);
});

app.get('/allSubjects', jsonParser, async (request, response) => {
    console.log('allSubjects')
    const database = databaseClient.db('wanikani_db');
    const subjectsTable = database.collection('subjects');
    const subjects = await subjectsTable.find({}).toArray();
    response.json(subjects);
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
