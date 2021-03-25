const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const jsforce = require('jsforce');
const {getToken} = require('sf-jwt-token');

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const app = express();
app.use(helmet());
app.use(compression());

const conn = new jsforce.Connection();

app.get('/', async (req, res) => {
    try {
        const jwttokenresponse = await getToken({
            iss: process.env.CLIENT_ID,
            sub: process.env.USERNAME,
            aud: process.env.LOGIN_URL,
            privateKey: process.env.PRIVATE_KEY
        });
        conn.initialize({
            instanceUrl: jwttokenresponse.instance_url,
            accessToken: jwttokenresponse.access_token
        });

        const accounts = await conn.query("Select Id, Name From Account LIMIT 20");
        res.json(accounts);
    } catch(e){
        console.log(e);
        res.json(JSON.stringify(e));
    }
});
app.listen(PORT, ()=> {
    console.log('Server Started on ' + HOST + 'on port ' + PORT);
});