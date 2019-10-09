var express = require('express');
var path = require('path');

// express app

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log("running");

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/html/index.html'))
  console.log('running index.html');
});

app.get("/tables", function (req, res) {
  res.sendFile(path.join(__dirname, "/html/tables.html"));
});

app.get("/reserve", function (req, res) {
  res.sendFile(path.join(__dirname, "/html/reserve.html"));
});

app.get("/api/tables", function (req, res) {
  res.json(data.reservations);
});

app.get("/api/waitlist", function (req, res) {
  res.json(data.waitlist);
});

// Returns both the tables array and the waitlist array
app.get("/api/", function (req, res) {
  res.json(data);
});

app.get("/api/clear", function (req, res) {
  data.reservations.length = 0;
  data.waitlist.length = 0;
  res.json(data);
});

app.get("/api/visitors", function (req, res) {
  res.json(visitorCount);
});

app.post("/api/new", function (req, res) {
  var tableData = req.body;
  console.log(tableData);
  if (tableData && tableData.name) {
    tableData.routeName = tableData.name.replace(/\s+/g, "").toLowerCase();
  }
  console.log(tableData);

  if (data.reservations.length < 5) {
    data.reservations.push(tableData);
  } else {
    data.waitlist.push(tableData);
  }


  res.json(tableData);
});

app.get("/api/remove/:id?", function (req, res) {
  var tableId = req.params.id;

  if (tableId) {
    console.log(tableId);
    for (var i = 0; i < data.reservations.length; i++) {
      if (tableId === data.reservations[i].id) {
        data.reservations.splice(i, 1);
        if (data.waitlist.length > 0) {
          var tempTable = data.waitlist.splice(0, 1)[0];
          data.reservations.push(tempTable);
        }

        return res.json(true);
      }
    }
    for (var i = 0; i < data.waitlist.length; i++) {
      if (tableId === data.waitlist[i].id) {
        data.waitlist.splice(i, 1);

        return res.json(true);
      }
    }
    return res.json(false);
  }
  return res.json(false);
});


app.listen(PORT, function () {
  console.log('App listening on PORT ' + PORT);
});
