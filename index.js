require("dotenv").config();
const express = require("express");
const axios = require("axios");

const BNET_ID = process.env.BNET_OAUTH_CLIENT_ID;
const BNET_SECRET = process.env.BNET_OAUTH_CLIENT_SECRET;

const app = express();
const port = 5000;

let token;

const getAuth = async () =>
  await axios
    .post(
      `https://oauth.battle.net/token?grant_type=client_credentials&client_id=${BNET_ID}&client_secret=${BNET_SECRET}`
    )
    .then((data) => {
      token = data.data.access_token;
      return token;
    })
    .catch((e) => console.log(e));

//App gets auth token
app.get("/auth", async (req, res) => {
  getAuth();
  res.send(JSON.stringify({ success: "true" }));
});

//Get guild basic data
app.get(`/guild/:region/:realm/:name/:namespace/:locale`, async (req, res) => {
  await getAuth();
  await axios
    .get(
      `https://${req.params.region}.api.blizzard.com/data/wow/guild/${req.params.realm}/${req.params.name}?namespace=${req.params.namespace}&locale=${req.params.locale}&access_token=${token}`
    )
    .then((data) => res.send(data.data));
});

//Get guild roster data
app.get(
  `/guild/roster/:region/:realm/:name/:namespace/:locale`,
  async (req, res) => {
    await getAuth();
    await axios
      .get(
        `https://${req.params.region}.api.blizzard.com/data/wow/guild/${req.params.realm}/${req.params.name}/roster?namespace=${req.params.namespace}&locale=${req.params.locale}&access_token=${token}`
      )
      .then((data) => res.send(data.data));
  }
);

app.listen(port, () => console.log(`Listening on port: ${port}`));
