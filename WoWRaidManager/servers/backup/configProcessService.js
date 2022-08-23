
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3006;
const fetch = require('node-fetch');
const cors = require('cors');

specMapping = new Array();
buffMapping = new Array();
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

app.get('/config', (request, response) => {
  try {
    fetch("http://127.0.0.1:3000/config").then(res => res.json()).then(json => {
      response.send(json);

    });
  } catch (error) {
    response.status(400).send("Error")
  }


});

app.patch('/config', (request, response) => {
  try {
    fetch("http://127.0.0.1:3000/config",
      {
        headers: {
          'Content-Type': 'application/json',
          'responseType': 'text'
        },
        method: 'PATCH',
        body: JSON.stringify({
          name: request.body.name,
          value: request.body.value,

        })
      }
    ).then((resp) => {
      if (resp.status != 200) {

        throw Error("Cannot update the requested configuration setting");
      } else {
        response.status(200).send({ status: 200, message: `configration chnaged updated with name : ${request.body.charName}` })
      }
    }).catch((err) => {
      console.error(err); // handle error
      response.status(400).send("Error during Database Call")
    });
  } catch (error) {
    response.status(400).send("Error")
  }

})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});