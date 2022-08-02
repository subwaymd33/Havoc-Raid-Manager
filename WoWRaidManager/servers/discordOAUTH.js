const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3002;
const cors = require('cors');
const { default: axios } = require('axios');
require('dotenv').config();

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


    try {
            const code = request.params.code;
        const formData = new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code.toString(),
            redirect_uri: process.env.DISCORD_CLIENT_REDIRECT
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
        console.error(error);
        response.send(400);
    }

});

app.get('/api/auth/discord/refresh/:token', async (request, response) => {
    
    try {
        const refresh_token = request.params.token;
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
        console.error(error);
        response.send(400);
    }

});


app.get('/api/auth/user/:code', async (request, response) => {
    try {
        var access_token = request.params.code
        const resp = await axios.get(
            'https://discord.com/api/v8/users/@me',
            {
                headers: {
                    Authorization: `Bearer ${access_token.toString()}`
                }
            });
        response.send(resp.data)
    } catch (error) {
        console.error(error);
        response.send(400);
    }
});

app.get('/api/auth/user/guild/:code', async (request, response) => {
    try {
        var access_token = request.params.code
        const resp = await axios.get(
            'https://discord.com/api/v8/users/@me/guilds',
            {
                headers: {
                    Authorization: `Bearer ${access_token.toString()}`
                }
            });
        response.send(resp.data)
    } catch (error) {
        console.error(error);
        response.send(400);
    }
});

app.get('/api/auth/guilds/:code/:guild_id', async (request, response) => {
    try {
        var access_token = request.params.code
        var guildID = request.params.guild_id
        const resp = await axios.get(
            `https://discord.com/api/v8/users/@me/guilds/${guildID}/member`,
            {
                headers: {
                    Authorization: `Bearer ${access_token.toString()}`
                }
            });
        response.send(resp.data)
    } catch (error) {
        console.error(error);
        response.send(400);
    }
});
app.get('/api/auth/guilds/roles/:guild_id', async (request, response) => {
    try {
        var guildID = request.params.guild_id
        const resp = await axios.get(
            `https://discord.com/api/v8/guilds/${guildID}/roles`,
            {
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN.toString()}`
                }
            });
        response.send(resp.data)
    } catch (error) {
        console.error(error);
        response.send(400);
    }
});

app.get('/api/auth/check/:code', async (request, response) => {
    try {
        var access_token = request.params.code
        const resp = await axios.get(
            'https://discord.com/api/v8/oauth2/@me',
            {
                headers: {
                    Authorization: `Bearer ${access_token.toString()}`
                }
            });
        response.send(resp.data)
    } catch (error) {
        console.error(error);
        response.send(400);
    }
});


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});