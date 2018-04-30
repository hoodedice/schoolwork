var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


// Connection URL
var url = 'mongodb://localhost:27017/cetinvdb';

global.user = "";
global.indexerr = "";


// Use connect method to connect to the server
// MongoClient.connect(url, function (err, db) {
//   assert.equal(null, err);
//   console.log("MONGODB: Connected successfully to server");

//   db.close();
// });

/** Application logic */

/**
 * Application must require authentication before any tasks can be performed 
 */
var requireAuth = function (req, res) {
  //check if user is logged in already

  //if not, redirect to index page
  return false;
  //res.redirect('/login');
};


/** Can be placed anywhere
 * @typedef {ClassName}
 * @property {function} method1
 * @param {test} kore wa tesuto desu
 */

/* @returns {ClassName} */
function constructorish() {
}

function two(){

}

var methods = {
/**
 * @property {function}
 * @memberof constructorish
 * @param {number} a
 **/
  method1: function (a)  {}
};

var x = new constructorish();
x.methods.method1(a);

two()

/**
 * GET
 */
router.all('/cet/:linkto', function (req, res, next) {
  if (global.user === "") {
    global.indexerr = "Sign in first";
    res.redirect('/');
    res.end();
    return;
  } else {
    console.log("inside: " + global.user);
    //res.render(req.params.linkto);
    return next();
  }
});

router.get('/', function (req, res, next) {
  res.render('index', { err: global.indexerr });
});

router.get('/cet/loan', function (req, res, next) {
  res.render('loan');
});

router.get('/cet/dashboard', function (req, res, next) {
  res.render('dashboard');
});

router.get('/cet/register', function (req, res, next) {
  res.render('register');
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.get('/setupdb', function (req, res) {
  res.render('setupdb');
});

/**
 * AJAX GETs
 */

//Dash: get student details on typing
router.get('/cet/liststudents/:query', function (req, res) {
  query = req.params.query;
  console.log(query);
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    //find by name
    //use precise values for phone/email
    db.collection('client').find({
      $or:
      [{ fname: { $regex: query } },
      { lname: { $regex: query } },
      { csuid: { $regex: query } },
      { phone: query },
      { email: query },]
    }).toArray(function (err, docs) {
      if (docs.length === 0) {
        res.json("");
      }
      else {
        res.json(docs);
      }
      db.close();
    });
  });
});

//Dash: Get item that student has currently loaned out (or not)
router.get('/cet/listitems/:query', function (req, res) {
  query = req.params.query;
  console.log(query);
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection('inventory').find({
      student: query,
      returned: "false"
    }).toArray(function (err, docs) {
      if (docs.length === 0) {
        res.json("");
      }
      else {
        res.json(docs);
      }
      db.close();
    });
  });
});

//Dash: Get items in inventory
router.get('/cet/listinv/', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection('item').find({
      returned: "true"
    }).toArray(function (err, docs) {
      if (docs.length === 0) {
        res.json("");
      }
      else {
        res.json(docs);
      }
      db.close();
    });
  });
});

//Registration: Find if a user is already registered
router.get('/cet/register/:csuid', function (req, res, next) {
  query = req.params.csuid;
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection('client').find({
      csuid: { $regex: query }
    }).toArray(function (err, docs) {
      if (docs.length === 0) {
        res.json("");
      }
      else {
        res.json(docs);
      }
      db.close();
    });
  });
});

/**
* POST
*/

// MongoDB : SQL
// ---------------------
// database : database
// collection : table
// document : row
// field : -
// {key:value} : -

router.post('/dashboard', function (req, res) {
  //do nothing
  return;
});

router.post('/cet/register', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection('client').insertOne({
      csuid: req.body.csuid,
      fname: req.body.fname,
      lname: req.body.lname,
      phone: req.body.phone,
      email: req.body.email,
      status: req.body.status
    });
    db.close();
  });
  res.redirect('/cet/register');
});

//add sanity checks
//was the equipment in stock?
router.post('/cet/loan-in', function (req, res, next) {
  var overdue = false;

  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection('inventory').insertOne({
      name: req.body.itmname,
      returned: "true",
      //wasOverdue: overdue,
      student: req.body.csuid,
      employee: global.user
    });

    db.close();
  });
});

//is the equipment already loaned out?
router.post('/cet/loan-out', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection('inventory').insertOne({
      name: req.body.itmname,
      returned: "false",
      student: req.body.csuid,
      employee: global.user,
      //dueDate: req.body.dueDate
    });

    db.close();
  });
});

// router.post('/updateloan', function (req, res, next) {
//   MongoClient.connect(url, function (err, db) {
//     assert.equal(null, err);

//     db.close();
//   });
// });


//handles logins
router.post('/login', function (req, res, next) {
  var username = req.body.username;
  console.log(username);
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    //find the csuid in the database
    db.collection('employee').find().toArray(function (err, docs) {
      assert.equal(err, null);
      console.log("MONGODB: " + docs);

    });
    db.collection('employee').find({ csuid: username }).toArray(function (err, docs) {
      //assert.equal(err, null);
      //console.log(docs);
      //is the username in the db
      if (docs.length === 0) {
        console.log("user not found!");
        global.indexerr = "user not found!";
        //return false;
        res.redirect('/');
        db.close();
        return;
      }
      //is it the correct password
      //TODO: replace with bcrypt
      //TODO: add ajax
      else if (req.body.password != docs[0].password) {
        // console.log(docs[0].password);
        global.indexerr = "wrong password!";
        //return req.body.csuid;
        res.redirect('/');
        db.close();
        return;
      }
      else if (req.body.password == docs[0].password) {
        global.user = docs[0].csuid;
        db.close();
        res.redirect('/login');
        return;
      }
      //return req.body.csuid;
      console.log("Something Happened");
      global.indexerr = "uncaught exception!";
      db.close();
      res.redirect('/');

    });
  });
});

module.exports = router;