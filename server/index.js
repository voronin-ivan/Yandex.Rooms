'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const graphqlRoutes = require('./graphql/routes');
const { sequelize } = require('./models/');

const app = express();
const staticPath = process.env.NODE_ENV === 'prod' ? '../build' : 'public';
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/graphql', graphqlRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => console.log(`Express app listening on port ${PORT}`));
