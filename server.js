 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();
const url = require('url');

//mongodb://fcc:fcc@ds135926.mlab.com:35926/fccimagesearch
const dburl = 'mongodb://fcc:fcc@ds135926.mlab.com:35926/fccimagesearch';
const mongo = require('mongodb').MongoClient;

//g custom search api: AIzaSyASRCH2YLWcpEDLQnuDal5Gean9WMhTGlg
const gSearch = 'https://content.googleapis.com/customsearch/v1?cx=011903740374000541668%3Axiqnhvafoyy&q=cat&searchType=image&key=AIzaSyASRCH2YLWcpEDLQnuDal5Gean9WMhTGlg'
// const gSearch = 'www.google.com';
const https = require('https');

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });

app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

app.route('/new')
  .get((req, res) => {
  let urlRequest = url.parse(req.url, true);
  let pathName = urlRequest.pathname;
  let obj;
  const imageReq = https.request(gSearch, (imageRes) => {

    imageRes.on('data', (d) => {
      obj = Buffer.from(d);
      process.stdout.write(obj);
      res.writeHead(200, {'Content-Type': 'application/json' });
      res.write(JSON.stringify(obj));
      res.end();
    });
  });

  imageReq.on('error', (e) => {
    console.error(e);
  });
  imageReq.end();  
  
});



// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

