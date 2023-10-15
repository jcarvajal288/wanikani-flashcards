const express = require('express');

const PORT = process.env.PORT || 3001;

const app = express();

app.get('/fillDatabase', (request, response) => {
    response.json({ message: 'Hello from node' });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
