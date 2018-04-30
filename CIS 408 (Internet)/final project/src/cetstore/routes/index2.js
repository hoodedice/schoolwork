var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


// Connection URL
var url = 'mongodb://localhost:27017/cetinvdb';

global.user = "";
//TODO: Add express session with mongodb store

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


/**
 * GET
 */
router.all('/cet/:linkto', function (req, res) {
  console.log("outside: " + global.user);
  if (global.user === "") {
    res.redirect('/');
    res.end();
    return;
  } else {
    console.log("inside: " + global.user);
    res.render(req.params.linkto);
    return;
  }
});

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/loan', function (req, res, next) {
  res.render('loan');
});

router.get('/cet/dashboard', function (req, res, next) {
  res.render('dashboard');
});

router.get('/register', function (req, res, next) {
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
router.get('/liststudents/:stu', function (req, res) {
  student = req.params.stu;
  //console.log(student);
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    //find by name
    db.collection('employee').find({ 
      $or: 
        [ { fname: student },
        { lname: student }, 
        { e_csuid: student } ] 
      }).toArray(function (err, docs) {
      
      if (docs.length === 0) {
        res.json("");
      }
      else {
        res.json(docs[0]);
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

/** TODO: should be /cet/ */

//add in check to see if the person with csu id already exists
router.post('/register', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection('client').insertOne({
      s_csuid: req.body.csuid,
      fname: req.body.fname,
      lname: req.body.lname,
      phone: req.body.phone,
      email: req.body.email,
      status: req.body.status
    });
    db.close();
  });
});

//add sanity checks
//was the equipment in stock?
router.post('/loan-in', function (req, res, next) {
  var overdue = false;

  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection('inventory').insertOne({
      name: req.body.itmname,
      inStock: 1,
      wasOverdue: overdue,
      s_csuid: req.body.csuid,
      e_csuid: 2615624
    });

    db.close();
  });
});

//TODO: add sanity checks
//is the equipment already loaned out?
router.post('/loan-out', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection('inventory').insertOne({
      name: req.body.itmname,
      inStock: 0,
      wasOverdue: 0,
      s_csuid: req.body.csuid,
      e_csuid: 2615624,
      dueDate: req.body.dueDate
    });

    db.close();
  });
});

//TODO: add sanity checks
router.post('/updateloan', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);

    db.close();
  });
});


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
    db.collection('employee').find({ e_csuid: username }).toArray(function (err, docs) {
      assert.equal(err, null);
      console.log(docs);
      //is the username in the db
      if (docs.length === 0) {
        console.log("user not found!");
        //return false;
        res.redirect('/');
        db.close();
        return;
      }
      //is it the correct password
      //TODO: replace with bcrypt
      //TODO: add ajax
      else if (req.body.password != docs[0].password) {
        console.log(docs[0].password);
        //return req.body.csuid;
        res.redirect('/');
        db.close();
        return;
      }
      else if (req.body.password == docs[0].password) {
        global.user = docs[0].e_csuid;
        db.close();
        res.redirect('/login');
        return;
      }
      //return req.body.csuid;
      console.log("Something Happened");
      db.close();
      res.redirect('/');
    });
  });
});

router.post('/setupdb', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    db.collection('employee').deleteMany({}, function (err, r) {
      assert.equal(null, err);
      db.collection('client').deleteMany({}, function (err, r) {
        assert.equal(null, err)
        db.collection('item').deleteMany({}, function (err, r) {
          MongoClient.connect(url, function (err, db) {
            db.collection('employee').createIndex({ e_csuid: "text" }, { unique: true });
            db.collection('employee').insertOne({ e_csuid: "1234567", fname: "John", lname: "Doe", email: "email@domain.com", password: "1234" })
            db.collection('client').createIndex({ c_csuid: "text" }, { unique: true });
            db.collection('item').createIndex({ name: "text" }, { unique: true });

            db.close();
            res.redirect('/login');
          });
        });
      });
    });

  });
});

module.exports = router;