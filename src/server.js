// server.js

// Copyright ® GetMyBookmark 2017
//
const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
// For Cassandra, refer to http://express-cassandra.readthedocs.io/en/stable/usage/
// const CassClient = require('express-cassandra');

const bodyParser     = require('body-parser');

const app            = express();

const port	    	 = 8000;
require('./app/routes')(app, {});

// Body Parser
app.use(bodyParser.urlencoded({extended: true}))

// Tell the server to read JSON data
// as the content type is set to 'application/json' in the Fetch API
app.use(bodyParser.json())

// Use embedded JS
app.set('view engine', 'ejs')

// MongoDB mlab.com database URL
// mongodb://<dbuser>:<dbpassword>@ds029725.mlab.com:29725/bm
MongoClient.connect('mongodb://tso:helucas30@ds029725.mlab.com:29725/bm', (err, database) => {
  // ... do something here
  if (err) return console.log(err)
  db = database
  app.listen(port, () => {
    console.log('MongoDB is alive on port ' + port)
  })

})

// Grab the data from the HTML app FORM fields and
// construct a collection instance and store it in mlab.com/bm database
// 11/9/2017
app.post('/USER_DB', (req, res) => {
  console.log('req.body = '+req.body)
  db.collection('USER_DB').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})


// Now read it out from the database 'bm' and show
app.get('/', (req, res) => {
  //var cursor = db.collection('USER_DB').find()
  // cursor is a Mongo objects 
  //console.log('Retrieve from mlab/bm');
  //console.log(cursor);

  //res.send('hello world')
  //res.sendFile(__dirname + '/index.html')
  //console.log('Finishing updating HTML app')

  console.log('Retrieving data from MongoDB....')
  db.collection('USER_DB').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {USER_DB: result})
    //db.collection('USER_DB').find().toArray(function(err, results) {
	//console.log(results)
  })
  console.log('Retrieving DONE....')
})