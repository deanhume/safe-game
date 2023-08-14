const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const { lookup } = require('geoip-lite');
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    // res.send('Hello World!');
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.post('/title', (req, res) => {
    let data = req.body;
    console.log( JSON.stringify(data));

    // Get the location from the IP address
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // If the IP address is localhost, use my IP address
    if (ip = "::1"){
        ip = "81.152.36.114";
    }

    const location = lookup(ip).country;
    console.log(location);

    res.sendFile(path.join(__dirname, '/index.html'));
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})