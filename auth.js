const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3002;
const cors = require('cors');
const res = require('express/lib/response');
const clientID = '985911105857658950'
const sec = 'P_sPa1leA4or8y30ES3bJ-pezRcYgLGv'
const axios = require('axios');
const { URLSearchParams } = require('url');


app.use(cors({
    origin: 'https://localhost:4200',
    origin: 'http://localhost:4200',
}));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/auth/redirect', async (request, response) => {
    console.log(request.query);
    const { code } = request.query;
    if (code) {
        try {
            const formData = new URLSearchParams({
                client_id: clientID,
                client_secret: sec,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'http://localhost:3002/auth/redirect',
            });
            const resp = await axios.post(
                'https://discord.com/api/v8/oauth2/token',
                formData.toString(),
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                    }
                });
            const { access_token } = resp.data;
            const userResp = await axios.get(
                'https://discord.com/api/v8/users/@me',
                {
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                    }
                });
            console.log(userResp)
            response.send(userResp);
        } catch (error) {
            console.log(error)
            response.sendStatus(400)
        }
    }
});


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});