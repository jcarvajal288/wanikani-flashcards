const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 3001;

const app = express();
const jsonParser = bodyParser.json({ limit: '2mb' });

app.use(cors());

app.post('/fillDatabase', jsonParser, (request, response) => {
    const subjects = request.body;
    console.log(`Filling database with ${subjects.length} subjects`);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
