require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const BNET_ID = process.env.BNET_OAUTH_CLIENT_ID;
const BNET_SECRET = process.env.BNET_OAUTH_CLIENT_SECRET;

const app = express();
app.use(cors());

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
  res.send(
    JSON.stringify({
      success: "true",
      token: token,
    })
  );
});

app.listen(port, () => console.log(`Listening on port: ${port}`));
