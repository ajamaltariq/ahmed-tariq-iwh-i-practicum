require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;
const PROPERTIES = ['name', 'platform', 'release_year'];

const objectsUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// ROUTE 1 - Homepage: list all video game records in a table
app.get('/', async (req, res) => {
    try {
        const resp = await axios.get(objectsUrl, {
            headers,
            params: { properties: PROPERTIES.join(','), limit: 100 }
        });
        const data = resp.data.results;
        res.render('homepage', { title: 'Video Games | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Could not load video games from HubSpot.');
    }
});

// ROUTE 2 - Render the form for creating a new video game record
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3 - Create a new video game record from the form data, then return to the homepage
app.post('/update-cobj', async (req, res) => {
    const newRecord = {
        properties: {
            name: req.body.name,
            platform: req.body.platform,
            release_year: req.body.release_year
        }
    };

    try {
        await axios.post(objectsUrl, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Could not create the video game in HubSpot.');
    }
});

// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
