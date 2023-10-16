const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

app.post('/fillDatabase', (request, response) => {
    const subjects = request.body;
    console.log(`Filling database with ${subjects.length} subjects`);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
