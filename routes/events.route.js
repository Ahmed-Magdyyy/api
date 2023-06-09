const app = require("express").Router();
const clientModel = require("../model/client.model");
const eventsModel = require("../model/events.model");

app.get('/allEvents', async (req, res) => {
    console.log("testing from back");
  let data = await eventsModel.find().populate('clientID');
  if (data.length != 0) {
    res.json(data);
  } else {
  }
});

app.post("/addEvents", async (req, res, next) => {
  let client = await clientModel.findOne({ name: req.body.clientName });

  if (client) {
    let id = client._id;
    let eventsExist = await eventsModel.find({
      name: req.body.clientName,
    });

    if (eventsExist.length > 0) {
      res.json({
        message: "events already exist for this client name",
      });
    } else {
      let eventProject = await eventsModel.insertMany({
        name: req.body.clientName,
        clientID: id,
        videosLinks: req.body.eventUrl,
      });
      res.json({ message: "success", data: eventProject[0] });
    }
    next();
  } else {
    res.json({ message: "No client found" });
  }
});

app.delete("/deleteEvents", async (req, res) => {
  if (
    req.body.clientName == undefined ||
    req.body.clientName == "undefined" ||
    req.body.clientName == ""
  ) {
    res.json({ message: "Choose a client!" });
  } else {
    await eventsModel.deleteOne({ name: req.body.clientName });

    res.json({
      message: `media production project for client ${req.body.clientName} deleted successfully`,
    });
  }
});

module.exports = app;
