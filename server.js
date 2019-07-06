const express = require('express');
const app = express();

const port = process.env.PORT || 3000; 

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

const dbConfig = require('./config/dbServer');

const bodyParser = require('body-parser');

const bcrypt = require('bcrypt');

const saltRounds = 10;

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.mongoURL, 
{
	useNewUrlParser: true,
}).then(() => {
	console.log("Connect to database")
}).catch(error => {
	console.log("Connection Failed", error);
	process.exit();
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Welcome to Monggovest'));


require('./app/routes/user.routes')(app);


app.listen(port, () => {
	console.log(`App listening on http://localhost:${port}`)
});

module.exports = app;
