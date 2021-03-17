const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

require("dotenv").config();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public")); //public folder to contain our css and images

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  var firstname = req.body.firstname;
  var secondname = req.body.secondname;
  var email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: secondname,
        },
      },
    ],
  };

  var jsondata = JSON.stringify(data);

  var option = {
    url: "https://us1.api.mailchimp.com/3.0/lists/d992b3037a",
    method: "POST",
    headers: {
      Authorization: process.env.DB_USER + " " + process.env.DB_APIKEY,
    },

    body: jsondata,
  };

  request(option, function (error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200)
        res.sendFile(__dirname + "/success.html");
      else res.sendFile(__dirname + "/failure.html");
    }
  });
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000");
});
