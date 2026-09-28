// One-time setup: creates the Video Game custom object (associated with contacts)
// and three sample records. Run with `node setup.js` after adding PRIVATE_APP_ACCESS to .env.
require('dotenv').config();
const axios = require('axios');

const headers = {
    Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

const schema = {
    name: 'video_game',
    labels: { singular: 'Video Game', plural: 'Video Games' },
    primaryDisplayProperty: 'name',
    requiredProperties: ['name'],
    searchableProperties: ['name', 'platform'],
    associatedObjects: ['CONTACT'],
    properties: [
        { name: 'name', label: 'Name', type: 'string', fieldType: 'text' },
        { name: 'platform', label: 'Platform', type: 'string', fieldType: 'text' },
        { name: 'release_year', label: 'Release Year', type: 'number', fieldType: 'number' }
    ]
};

const records = [
    { name: 'The Legend of Zelda: Breath of the Wild', platform: 'Nintendo Switch', release_year: 2017 },
    { name: 'Hades', platform: 'PC', release_year: 2020 },
    { name: 'Elden Ring', platform: 'PlayStation 5', release_year: 2022 }
];

(async () => {
    try {
        const { data } = await axios.post('https://api.hubapi.com/crm/v3/schemas', schema, { headers });
        console.log(`Created custom object ${data.objectTypeId}`);

        await axios.post(
            `https://api.hubapi.com/crm/v3/objects/${data.objectTypeId}/batch/create`,
            { inputs: records.map(properties => ({ properties })) },
            { headers }
        );
        console.log(`Created ${records.length} records`);
        console.log(`Add CUSTOM_OBJECT_TYPE=${data.objectTypeId} to your .env file`);
    } catch (error) {
        console.error(error.response?.data || error.message);
        process.exit(1);
    }
})();
