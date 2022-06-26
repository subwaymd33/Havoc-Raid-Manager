
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3005;
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


app.get('/getItems', (request, response) => {
    const charArray = new Array();

    var resp = fetch("http://127.0.0.1:3000/items").then(res => res.json()).then(json => {

        response.send(json);
    });
});

app.get('/getSpecData', (request, response) => {
    const charArray = new Array();

    var resp = fetch("http://127.0.0.1:3000/specData").then(res => res.json()).then(json => {
        response.send(json);
    });
});

app.get('/getSpectoItems', (request, response) => {
    const charArray = new Array();

    var resp = fetch("http://127.0.0.1:3000/specToItem").then(res => res.json()).then(json => {
        response.send(json);
    });
});

app.get('/getMasterLootsheet', (request, response) => {
    const charArray = new Array();

    var resp = fetch("http://127.0.0.1:3000/masterLootsheet").then(res => res.json()).then(json => {
        response.send(json);
    });
});

app.post('/insertItemtoSpec', (request, response) => {
    var arr = request.body;
    InsertSQLString = `DELETE FROM spectoitem WHERE item_id = '${arr[0].item_id}';`
    if(arr[0].specUID==0){

    }else{
        for (let i = 0; i < arr.length; i++) {
            str = `INSERT INTO spectoitem (item_id, \"specUID\") VALUES( '${arr[i].item_id}','${arr[i].specUID}');`
            InsertSQLString = InsertSQLString + str
        }
    }

    fetch("http://127.0.0.1:3000/specToItem",
        {
            headers: {
                'Content-Type': 'application/json',
                'responseType': 'text'
            },
            method: 'POST',
            body: JSON.stringify({
                sql: InsertSQLString,
            })
        }
    ).then((resp) => {
        if (resp.status != 200) {
            throw Error("Cannot insert the requested spectoItem object");
        } else {
            response.status(200).send({ status: 200, message: `spectoItem object inserted`})
        }
    }).catch((err) => {
        console.error(err); // handle error
    });
})

app.patch('/updateSheetLimitandRanking', (request, response) => {

    fetch("http://127.0.0.1:3000/updateSheetLimitandRanking",
        {
            headers: {
                'Content-Type': 'application/json',
                'responseType': 'text'
            },
            method: 'PATCH',
            body: JSON.stringify({
                item_id: request.body.item_id,
                item_ranking: request.body.item_ranking,
                sheet_limit: request.body.sheet_limit,
            })
        }
    ).then((resp) => {
        if (resp.status != 200) {
            throw Error("Cannot Update the Requested Item");
        } else {
            response.status(200).send({ status: 200, message: `Item updated with id : ${request.body.item_id}` })
        }
    }).catch((err) => {
        console.error(err); // handle error
    });
})

app.get('/getLootSheet/:charName', (request, response) => {
    var resp = fetch(`http://127.0.0.1:3000/lootSheet/${request.params.charName}`).then(res => res.json()).then(json => {
        response.send(json);
    });
});

app.post('/insertLootSheet', (request, response) => {
    var arr = request.body;
    InsertSQLString = `DELETE FROM lootsheet WHERE \"charUID\" = ${arr[0].charUID};`
    if(arr[0].specUID==0){

    }else{
        for (let i = 0; i < arr.length; i++) {
            str = `INSERT INTO lootsheet (\"charUID\", phase, item_id, slot, aquired) VALUES( ${arr[i].charUID},${arr[i].phase},${arr[i].item_id},'${arr[i].slot}','${arr[i].aquired}');`
            InsertSQLString = InsertSQLString + str
        }
    }

    fetch("http://127.0.0.1:3000/lootsheet",
        {
            headers: {
                'Content-Type': 'application/json',
                'responseType': 'text'
            },
            method: 'POST',
            body: JSON.stringify({
                sql: InsertSQLString,
            })
        }
    ).then((resp) => {
        if (resp.status != 200) {
            throw Error("Cannot insert the requested lootsheet object");
        } else {
            response.status(200).send({ status: 200, message: `lootsheet object inserted`})
        }
    }).catch((err) => {
        console.error(err); // handle error
    });
})
app.get('/getSheetLock/:charUID', (request, response) => {
    var resp = fetch(`http://127.0.0.1:3000/sheetLock/${request.params.charUID}`).then(res => res.json()).then(json => {
        response.send(json);
    });
});

app.post('/insertSheetLock', (request, response) => {
    var arr = request.body;
    InsertSQLString = `DELETE FROM sheetlock WHERE \"charUID\" = ${arr[0].charUID};`
    if(arr[0].specUID==0){

    }else{
        for (let i = 0; i < arr.length; i++) {
            str = `INSERT INTO sheetlock (\"charUID\", phase, locked,mainspec, offspec) VALUES( ${arr[i].charUID},${arr[i].phase},'${arr[i].locked}',${arr[i].mainspec},${arr[i].offspec});`
            InsertSQLString = InsertSQLString + str
        }
    }

    fetch("http://127.0.0.1:3000/sheetLock",
        {
            headers: {
                'Content-Type': 'application/json',
                'responseType': 'text'
            },
            method: 'POST',
            body: JSON.stringify({
                sql: InsertSQLString,
            })
        }
    ).then((resp) => {
        if (resp.status != 200) {
            throw Error("Cannot insert the requested lootsheet object");
        } else {
            response.status(200).send({ status: 200, message: `lootsheet object inserted`})
        }
    }).catch((err) => {
        console.error(err); // handle error
    });
})
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});