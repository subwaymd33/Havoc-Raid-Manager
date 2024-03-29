
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3003;
const fetch = require('node-fetch');
const cors = require('cors');


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

app.get('/checkSession/:sess_id', (request, response) => {
console.log("Check Session " + request.params.sess_id)
    try {
        fetch(`http://127.0.0.1:3000/session/${request.params.sess_id}`).then(res => res.json()).then(json => {
            response.send(json);
        });
    } catch (error) {
        response.status(400).send("Error")
    }

});

app.get('/checkUser/:id', (request, response) => {

    try {
        fetch(`http://127.0.0.1:3000/user/${request.params.id}`).then(res => res.json()).then(json => {
            response.send(json);
        });
    } catch (error) {
        response.status(400).send("Error")
    }

});

app.post('/insertUser', (request, response) => {
    try {
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
                    role: request.body.role
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
            response.status(400).send("Error during Database Call")
        });
    } catch (error) {
        response.status(400).send("Error")
    }




})

app.post('/insertSession', (request, response) => {
    try {
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
            response.status(400).send("Error during Database Call")
        });
    } catch (error) {
        response.status(400).send("Error")
    }





})

app.patch('/updateSession', (request, response) => {

    try {
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
            response.status(400).send("Error during Database Call")
        });
    } catch (error) {
        response.status(400).send("Error")
    }





})

app.get('/getOfficers', (request, response) => {

    try {
        fetch("http://127.0.0.1:3000/officers").then(res => res.json()).then(json => {
            const strArray = new Array();
            for (let i in json) {
                strArray.push(json[i]['user_id'])
            }
            response.send(strArray);
        });
    } catch (error) {
        response.status(400).send("Error")
    }

});

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});