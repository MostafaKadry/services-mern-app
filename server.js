const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const { ObjectID } = require("mongodb");
const { getDb, connectToDb } = require("./db.js");
app.use(express.json());
app.use(require("cors")());
PORT = process.env.PORT || 8000;

let db;

connectToDb((err) => {
  if (!err) {
    app.listen(PORT, () => console.log(`app is working on port ${PORT}`));
    db = getDb();
  }
});
// [1] countries collection
app.get("/api/countries", (req, res) => {
  let allcountries = [];
  db.collection("allcountries")
    .find()
    .forEach((country) => {
      allcountries.push(country);
    })
    .then(() => res.status(200).json(allcountries))
    .catch((err) => res.status(500).json(err));
});
app.post("/api/countries", (req, res) => {
  const newCountry = req.body;
  db.collection("allcountries")
    .insertOne(newCountry)
    .then((res) => res.status(200).json(res))
    .catch((err) => {
      res.status(500).json(err);
    });
});
// [2] govnerate collection
app.get("/api/goves", async (req, res) => {
  const { countryID } = req.query;

  const allgoverns = await db
    .collection("allgovs")
    .findOne({ countryID: countryID }, { projection: { _id: 0, countryID: 0 } })
    .catch((err) => res.status(500).json(err));
  res.status(200).json(allgoverns);
});
app.post("/api/goves", (req, res) => {
  const goves = req.body;
  db.collection("allgovs")
    .insertOne(goves)
    .then((res) => res.status(200).send("goves added"))
    .catch((err) => {
      res.status(500).json(err);
    });
});
// [3] cities collection
app.get("/api/cities", async (req, res) => {
  const { govID } = req.query;

  const allcities = await db
    .collection("allcities")
    .findOne({ govID: govID }, { projection: { _id: 0, govID: 0 } })
    .catch((err) => res.status(500).json(err));
  res.status(200).json(allcities);
});
app.post("/api/cities", (req, res) => {
  const cities = req.body;
  db.collection("allcities")
    .insertOne(cities)
    .then(() => res.status(200).send("cities added"))
    .catch((err) => {
      res.status(500).json(err);
    });
});
// [4] users collection
app.get("/api/users", (req, res) => {
  db.collection("allusers")
    .find()
    .toArray()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json(err));
});
app.post("/api/users", (req, res) => {
  const user = req.body;
  db.collection("allusers")
    .insertOne(user)
    .then((r) => res.status(200).json({ r }))
    .catch((err) => {
      res.status(500).json(err);
    });
});

// [5] main services collection
app.get("/api/main-services", (req, res) => {
  db.collection("mainservices")
    .find()
    .toArray()
    .then((services) => res.status(200).json(services))
    .catch((err) => res.status(500).json(err));
});
app.post("/api/main-services", (req, res) => {
  const service = req.body;
  db.collection("mainservices")
    .insertMany(service)
    .then((r) => res.status(200).json({ r }))
    .catch((err) => {
      res.status(500).json(err);
    });
});

// [6] sub services collection
app.get("/api/sub-services", (req, res) => {
  db.collection("submainservices")
    .find()
    .toArray()
    .then((services) => res.status(200).json(services))
    .catch((err) => res.status(500).json(err));
});
app.post("/api/sub-services", (req, res) => {
  const service = req.body;
  db.collection("submainservices")
    .insertMany(service)
    .then((r) => res.status(200).json({ r }))
    .catch((err) => {
      res.status(500).json(err);
    });
});
// [7] allusers collection
app.get("/api/allusers", async (req, res) => {
  const { countryID } = req.query;
  const { govID } = req.query;
  const { cityID } = req.query;
  let allcountries = [];
  let allgoves = [];
  let allcities = [];
  let usersData = [];
  if (countryID && govID && cityID) {
    usersData = await db
      .collection("allusers")
      .find(
        { country: countryID, governorate: govID, city: cityID },
        { projection: { mainService: 1, subService: 1 } }
      )
      .toArray()
      .catch((err) => res.status(500).json(err));
  }
  if (countryID && govID && !cityID) {
    usersData = await db
      .collection("allusers")
      .find({ country: countryID, governorate: govID })
      .toArray()
      .catch((err) => res.status(500).json(err));
  }
  if (countryID && !govID && cityID) {
    usersData = await db
      .collection("allusers")
      .find({ country: countryID, city: cityID })
      .toArray()
      .catch((err) => res.status(500).json(err));
  }
  if (countryID && !govID && !cityID) {
    usersData = await db
      .collection("allusers")
      .find({ country: countryID })
      .toArray()
      .catch((err) => res.status(500).json(err));
  }
  if (!countryID && !govID && !cityID) {
    //  const usersData = await db
    //    .collection("allusers")
    //    .find({ country: countryID, governorate: govID, city: cityID })
    //    .toArray()
    //    .catch((err) => res.status(500).json(err));
    return res.status(400).json("usersData is not here");
  }
  const Maincounts = {};
  const Subcounts = {};
  usersData.forEach((x) => {
    Maincounts[x.mainService] = (Maincounts[x.mainService] || 0) + 1;
  });
  usersData.forEach((x) => {
    Subcounts[x.subService] = (Subcounts[x.subService] || 0) + 1;
  });
  const MainServicesID = Object.keys(Maincounts);
  const SubcountsID = Object.keys(Subcounts);
  let mainservicesData = [];
  let submainservicesData = [];
  for (const m of MainServicesID) {
    const msd = await db
      .collection("mainservices")
      .findOne({ _id: ObjectID(m) })
      .catch((err) => res.status(500).json(err));
    mainservicesData.push(msd);
  }
  for (const s of SubcountsID) {
    const ssd = await db
      .collection("submainservices")
      .findOne({ _id: ObjectID(s) })
      .catch((err) => res.status(500).json(err));
    submainservicesData.push(ssd);
  }

  return res
    .status(200)
    .json({ mainservicesData, submainservicesData, Maincounts, Subcounts });
});

app.delete("/del_users", (req, res) => {
  db.collection("allusers").remove({});
  res.status(200).send("all is done");
});
app.use(express.static("client/build"));
app.get("*", (req, res) => {
  res.sendFile(`${__dirname}/client/build/index.html`);
});
