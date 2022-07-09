const PORT = 9000;

const axios = require("axios").default;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.post("/test", (req, res) => {
  res.send("'POST request to the homepage'");
});



app.get("/languages", async (req, res) => {
  const options = {
    method: "GET",

    headers: {
      "Accept-Encoding": "application/gzip",
      "X-RapidAPI-Host": process.env.RAPID_API_HOST,
      "X-RapidAPI-Key": process.env.RAPID_API_KEY
    },
  };
  try {
    const response = await axios(
      "https://google-translate1.p.rapidapi.com/language/translate/v2/languages",
      options
    );
    let arr = [];
    const fetchedLanguages = response.data.data.languages.forEach((item) => {
      arr.push(item.language);
    });
    res.status(200).json(arr);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.post("/translation", async (req, res) => {
  // получиа переменные с фронт

  console.log(req.body);

  //return res.send("'POST request to the homepage'");

  const { textToTranslate, outputLanguage, inputLanguage } = req.body;

  //полодила переменные в закодированные парметры
  const encodedParams = new URLSearchParams();
  encodedParams.append("q", textToTranslate);
  encodedParams.append("target", outputLanguage);
  encodedParams.append("source", inputLanguage);

  const options = {
    method: "POST",

    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "application/gzip",
      "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      "X-RapidAPI-Key": "62551679c7msh4b31fba32558bafp138596jsn26620c3eb3ee",
    },
    data: encodedParams,
  };
  try {
    const response = await axios(
      "https://google-translate1.p.rapidapi.com/language/translate/v2",
      options
    );
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.listen(PORT, () => console.log(`server is running on ${PORT} `));
