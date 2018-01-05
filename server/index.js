const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const graphqlRoutes = require('./graphql/routes');
const { sequelize } = require('./models/');

const app = express();

app.use(bodyParser.json());
app.use('/graphql', graphqlRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/events', (req, res) => {
    sequelize.query('SELECT * FROM Events')
        .then(data => res.send(data[0]));
});

app.listen(3000, () => console.log('Express app listening on localhost:3000'));
