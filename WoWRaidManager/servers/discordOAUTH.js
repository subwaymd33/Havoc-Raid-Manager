const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3002;
const cors = require('cors');
const { default: axios } = require('axios');

app.use(cors({
    origin: 'https://localhost:3001',
    origin: 'https://localhost:4200',
    origin: 'http://localhost:4200',

}));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/api/auth/discord/redirect/:code', async (request, response) => {
    console.log('***********************')
    console.log(request.params.code)
    console.log('***********************')
    
    const code = request.params.code;

    try {
        const formData = new URLSearchParams({
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code.toString(),
            redirect_uri: DISCORD_CLIENT_REDIRECT
        });
        const resp = await axios.post('https://discord.com/api/v8/oauth2/token',
            formData.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        response.send(resp.data);
    } catch (error) {
        console.log(error);
        response.send(400);
    }

});

app.get('/api/auth/discord/refresh/:token', async (request, response) => {
    const refresh_token = request.params.token;
    try {
        const formData = new URLSearchParams({
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        });
        const resp = await axios.post('https://discord.com/api/v8/oauth2/token',
            formData.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        response.send(resp.data);
    } catch (error) {
        console.log(error);
        response.send(400);
    }

});


app.get('/api/auth/user/:code', async (request, response) => {
    try {
        var access_token = request.params.code
        console.log(access_token)
        const resp = await axios.get(
            'https://discord.com/api/v8/users/@me',
            {
                headers: {
                    Authorization: `Bearer ${access_token.toString()}`
                }
            });
        response.send(resp.data)
    } catch (error) {
        console.log(error);
        response.send(400);
    }
});

app.get('/api/auth/check/:code', async (request, response) => {
    try {
        var access_token = request.params.code
        console.log(access_token)
        const resp = await axios.get(
            'https://discord.com/api/v8/oauth2/@me',
            {
                headers: {
                    Authorization: `Bearer ${access_token.toString()}`
                }
            });
        response.send(resp.data)
    } catch (error) {
        console.log(error);
        response.send(400);
    }
});


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});