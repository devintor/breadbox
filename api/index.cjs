
const dotenv=require("dotenv");
dotenv.config();

const { getJson } = require("serpapi");
const { createServer } = require('node:http');

const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;


const server = createServer(async (req, res) => {
  const allowed_domain = 'http://localhost:5173' 
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
        api_key: API_KEY,
        q: query, 
        location: "Los Angeles, California",
        tbs: "isz:l,itp:photo"
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
} catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: error.message }));
}
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});