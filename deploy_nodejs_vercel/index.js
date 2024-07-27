// index.js
const dotenv=require("dotenv");
dotenv.config();

const { getJson } = require("serpapi");
import http from 'http';

const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;
 
// Create a server object
const server = http.createServer(async (req, res) => {
    const allowed_domain = 'https://breadbox-beta.vercel.app/'  // Adjust with your domain or localhost port
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

 
// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});