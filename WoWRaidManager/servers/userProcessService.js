
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3003;
const fetch = require('node-fetch');
const cors = require('cors');
const lodash = require('lodash')


app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(cors({
    origin: 'https://localhost:4200',
    origin: 'http://localhost:4200',

}));



app.post('/insertUser', (request, response) => {

    console.log(request.body.user_id)
    console.log(request.body.user_name)

    fetch("http://127.0.0.1:3000/user",
        {
            headers: {
                'Content-Type': 'application/json',
                'responseType': 'text'
            },
            method: 'POST',
            body: JSON.stringify({
                user_id: request.body.user_id,
                user_name: request.body.user_name,
            })
        }
    ).then((resp) => {
        if (resp.status != 200) {
            throw Error("Cannot insert the requested user");
        } else {
            response.status(200).send({ status: 200, message: `User inserted with name : ${request.body.user_name}` })
        }
    }).catch((err) => {
        console.error(err); // handle error
    });



})

app.post('/insertSession', (request, response) => {

    console.log(request.body.user_id)
    console.log(request.body.access_token)
    console.log(request.body.refresh_token)
    console.log(request.body.expiry_time)
    fetch("http://127.0.0.1:3000/session",
        {
            headers: {
                'Content-Type': 'application/json',
                'responseType': 'text'
            },
            method: 'POST',
            body: JSON.stringify({
                user_id: request.body.user_id,
                access_token: request.body.access_token,
                refresh_token: request.body.refresh_token,
                expiry_time: request.body.expiry_time,
            })
        }
    ).then((resp) => {
        if (resp.status != 200) {
            throw Error("Cannot insert the requested session object");
        } else {
            response.status(200).send({ status: 200, message: `Session obnject inserted with id : ${request.body.user_id}` })
        }
    }).catch((err) => {
        console.error(err); // handle error
    });



})

app.patch('/updateSession', (request, response) => {

    console.log(request.body.user_id)
    console.log(request.body.access_token)
    console.log(request.body.refresh_token)
    console.log(request.body.expiry_time)
    fetch("http://127.0.0.1:3000/session",
        {
            headers: {
                'Content-Type': 'application/json',
                'responseType': 'text'
            },
            method: 'PATCH',
            body: JSON.stringify({
                user_id: request.body.user_id,
                access_token: request.body.access_token,
                refresh_token: request.body.refresh_token,
                expiry_time: request.body.expiry_time,
            })
        }
    ).then((resp) => {
        if (resp.status != 200) {
            throw Error("Cannot insert the requested session object");
        } else {
            response.status(200).send({ status: 200, message: `Session obnject inserted with id : ${request.body.user_id}` })
        }
    }).catch((err) => {
        console.error(err); // handle error
    });



})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});