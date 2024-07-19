// import express, { json } from "express";
const dotenv=require("dotenv");
// import { search } from "./search.js";
dotenv.config();

// const app = express();

// app.use(json());

// const PORT = process.env.PORT;

// app.get("/", (req, res) => {
//     res.status(200).json({ message: "I am an Express Server!" });
//   });

// app.get("/another-route", (req, res) => {
//     res.status(200).json({ message: "here is another route" });
//   });

//   app.get("/keyword-search/:q", search, (req, res) => {
//     res.status(200).json(res.locals.result);
//   });

// app.listen(PORT, () => {
// console.log(`Server listening on http://localhost:${PORT}\n-------------------------`);
// });

const { getJson } = require("serpapi");
const { createServer } = require('node:http');

const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;


const server = createServer(async (req, res) => {
  const allowed_domain = 'http://localhost:5173'  // Adjust with your domain or localhost port
  res.setHeader('Access-Control-Allow-Origin', allowed_domain);
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  const url = new URL(req.url, `http://${req.headers.host}`);
  const searchParams = url.searchParams;
  const query = searchParams.get('query');
  
  try {
    const response = await getJson({
        engine: "google_images",
        google_domain: "google.com",
        api_key: API_KEY, // Get your API_KEY first
        q: query, 
        location: "Los Angeles, California",
        tbs: "isz:l,itp:photo"
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
} catch (error) {
    // handle any error
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: error.message }));
}
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});