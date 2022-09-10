const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3100;
const fetch = require('node-fetch');
const cors = require('cors');
const { Worker } = require("worker_threads");
const { default: axios } = require('axios');
require('dotenv').config();


specMapping = new Array();
buffMapping = new Array();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(cors({
    origin: process.env.FRONTEND_ADDRESS
}));
//CHARACTER
app.get('/processRoster', (request, response) => {

    try {
        const charArray = new Array();

        fetch(process.env.DATABASE_SERVER_ADDRESS + "/roster").then(res => res.json()).then(json => {


            for (let i in json) {
                var obj = new Object();
                obj.charName = json[i]['charName'];

                obj.rank = json[i]['rank']

                if (json[i]['mainsName']) {
                    obj.mainsCharacterName = json[i]['mainsName']
                } else {
                    obj.mainsCharacterName = ""
                }

                specMapping.forEach(element => {
                    if (element.specUID == json[i]['specUID']) {
                        var primarySpecObj = new Object();
                        primarySpecObj.specName = element.name;
                        primarySpecObj.role = checkRole(element.role)
                        primarySpecObj.buffs = buffMapping.find(element => { return element.specUID == json[i]['specUID'] }).buffs
                        obj.primarySpec = primarySpecObj;

                    }
                    if (element.specUID == json[i]['offSpecUID']) {
                        var offSpecObj = new Object();
                        offSpecObj.specName = element.name;
                        offSpecObj.role = checkRole(element.role)
                        offSpecObj.buffs = buffMapping.find(element => { return element.specUID == json[i]['offSpecUID'] }).buffs
                        obj.offSpec = offSpecObj;
                    }
                });

                if (!obj.offSpec) {
                    var offSpecObj = new Object();
                    offSpecObj.specName = null
                    offSpecObj.role = null
                    obj.offSpec = offSpecObj;
                }
                charArray.push(obj)
            }
            response.status(200).json(charArray);
        });
    } catch (error) {
        response.status(400).send("Error")
    }

});

app.get('/getCharUID/:charName', (request, response) => {
    try {
        fetch(`http://127.0.0.1:3000/character/${request.params.charName}`).then(res => res.json()).then(json => {
            response.send(json);
        });
    } catch (error) {
        response.status(400).send("Error")
    }

});

app.get('/processRoster/:user_id', (request, response) => {
    try {
        const charArray = new Array();

        fetch(process.env.DATABASE_SERVER_ADDRESS + `/roster/user/${request.params.user_id}`).then(res => res.json()).then(json => {
            try {
                for (let i in json) {
                    var obj = new Object();
                    obj.charName = json[i]['charName'];
                    obj.rank = json[i]['rank']
                    if (json[i]['mainsName']) {
                        obj.mainsCharacterName = json[i]['mainsName']
                    } else {
                        obj.mainsCharacterName = ""
                    }

                    specMapping.forEach(element => {
                        if (element.specUID == json[i]['specUID']) {
                            var primarySpecObj = new Object();
                            primarySpecObj.specName = element.name;
                            primarySpecObj.role = checkRole(element.role)
                            primarySpecObj.buffs = buffMapping.find(element => { return element.specUID == json[i]['specUID'] }).buffs
                            obj.primarySpec = primarySpecObj;

                        }
                        if (element.specUID == json[i]['offSpecUID']) {
                            var offSpecObj = new Object();
                            offSpecObj.specName = element.name;
                            offSpecObj.role = checkRole(element.role)
                            offSpecObj.buffs = buffMapping.find(element => { return element.specUID == json[i]['offSpecUID'] }).buffs
                            obj.offSpec = offSpecObj;
                        }
                    });

                    if (!obj.offSpec) {
                        var offSpecObj = new Object();
                        offSpecObj.specName = null
                        offSpecObj.role = null
                        obj.offSpec = offSpecObj;
                    }
                    charArray.push(obj)
                }

                response.status(200).json(charArray);
            } catch (error) {
                console.error(error)
            }
        });
    } catch (error) {
        response.status(400).send("Error")
    }

});

app.post('/insertCharacter', (request, response) => {
    try {
        let mainsName;
        if (request.body.rank == process.env.MAIN_RAIDER_RANK_NAME) {
            boolMain = true;
            mainsName = request.body.charName
        } else {
            boolMain = false;
            mainsName = request.body.mainsCharacterName
        }

        let specUID;
        specMapping.forEach(element => {
            if (element.name == request.body.primarySpec.specName) {
                specUID = element.specUID;
            }
        });

        let offSpecUID;
        specMapping.forEach(element => {
            if (element.name == request.body.offSpec.specName) {
                offSpecUID = element.specUID;
            }
        });


        fetch(process.env.DATABASE_SERVER_ADDRESS + "/roster",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'responseType': 'text'
                },
                method: 'POST',
                body: JSON.stringify({
                    charName: request.body.charName,
                    specUID: specUID,
                    rank: request.body.rank,
                    offspecUID: offSpecUID,
                    mainsName: mainsName,
                    userOwner: request.body.userOwner
                })
            }
        ).then((resp) => {
            if (resp.status != 200) {
                throw Error("Cannot insert the requested character");
            } else {
                response.status(200).send({ status: 200, message: `Character inserted with name : ${request.body.charName}` })
            }
        }).catch((err) => {
            console.error(err); // handle error
            response.status(400)
        });
    } catch (error) {
        response.status(400).send("Error during Database Call")
    }
})

app.patch('/updateCharacter', (request, response) => {
    try {
        let mainsName;
        if (request.body.rank == "Havoc Turtle") {
            mainsName = request.body.charName
        } else {
            mainsName = request.body.mainsCharacterName
        }

        let specUID, offSpecUID;
        specMapping.forEach(element => {
            if (element.name == request.body.primarySpec.specName) {
                specUID = element.specUID;
            }
            if (element.name == request.body.offSpec.specName) {
                offSpecUID = element.specUID;
            }
        });

        fetch(process.env.DATABASE_SERVER_ADDRESS + "/roster",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'responseType': 'text'
                },
                method: 'PATCH',
                body: JSON.stringify({
                    charName: request.body.charName,
                    specUID: specUID,
                    rank: request.body.rank,
                    mainsName: mainsName,
                    offspecUID: offSpecUID
                })
            }
        ).then((resp) => {
            if (resp.status != 200) {

                throw Error("Cannot insert the requested character");
            } else {
                response.status(200).send({ status: 200, message: `Character updated with name : ${request.body.charName}` })
            }
        }).catch((err) => {
            console.error(err); // handle error
            response.status(400).send("Error during Database Call")
        });
    } catch (error) {
        response.status(400).send("Error")
    }

})

app.delete('/deleteCharacter/:char_name', (request, response) => {
    try {
        console.log("Delete Character")
        sql = "DELETE FROM public.sheetlock where \"char_name\" = '" + request.params.char_name + "';";
        sqlDelete = "DELETE FROM public.lootsheet where \"char_name\" = '" + request.params.char_name + "';";
        sqlCharDelete = "DELETE FROM public.characters where \"charName\" = '" + request.params.char_name + "';";

        deleteSQLString = sql + sqlDelete + sqlCharDelete;

        console.log(deleteSQLString);

        fetch(process.env.DATABASE_SERVER_ADDRESS + "/characterAndSheet/",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'responseType': 'text'
                },
                method: 'DELETE',
                body: JSON.stringify({
                    sql: deleteSQLString,
                })
            }
        ).then((resp) => {
            if (resp.status != 200) {

                throw Error("Cannot delete your item from list");
            } else {
                response.status(200).send({ status: 200, message: `Character deleted with UID : ${request.params.charUID}` })
            }
        }).catch((err) => {
            console.error(err); // handle error
            response.status(400).send("Error during Database Call")
        });
    } catch (error) {
        response.status(400).send("Error")
    }


})

app.post('/processRaidComp', (request, response) => {

    let tankCount = request.body.tankCount;
    let healerCount = request.body.healerCount;
    let meleeCount = request.body.mDPSCount;
    let rangedCount = request.body.rDPSCount;
    let raidSize = request.body.raidSize

    console.log(tankCount)
    console.log(healerCount)
    console.log(meleeCount)
    console.log(rangedCount)
    console.log(raidSize)

    EmptyArray = {}
    try {
        charArray = request.body.roster;
        if (charArray.length == 0) {
            throw EmptyArray
        }

        optimalRaidWeight = getOptimalRaidWeight(buffMapping)
        console.log("Best Possible Raid Weight Value: " + optimalRaidWeight)

        const worker = new Worker("./raidProcessWorker.js", { workerData: { raidRoster: charArray, optimalWeight: optimalRaidWeight, tankCount: tankCount, healerCount: healerCount, meleeCount: meleeCount, rangedCount: rangedCount, raidSize: raidSize } });

        var ReturnObj;

        worker.on("message", result => {
            if (result.type == 'log') {
                console.log(result.obj);
            } else if (result.type == 'obj') {
                ReturnObj = result.obj
            } else {
                //console.log(result);
            }
        });

        worker.on("error", error => {
            console.log(error);
            response.status(200).json("Error")
        });

        worker.on("exit", exitCode => {
            console.log(`It exited with code ${exitCode}`);
            response.status(200).json(ReturnObj)
            //response.status(200).json("all Results")
        })



        // try {
        //   loop1:
        //   for (var i = 0; i < mDPSPerm.length; i++) {
        //     var raidGroup = []
        //     raidGroup.push(...mDPSPerm[i])
        //     // tankPerm[i].forEach(item => {
        //     //   raidGroup.push(item)
        //     // })
        //     if (isRaidValid(raidGroup)) {
        //       for (var q = 0; q < rDPSPerm.length; q++) {
        //         var b = structuredClone(raidGroup)
        //         b.push(...rDPSPerm[q])
        //         //console.log("B.length: " + b.length)
        //         if (isRaidValid(b)) {
        //           for (var j = 0; j < healerPerm.length; j++) {
        //             //console.log("j: " + j)
        //             //console.log("B.length: " + b.length)
        //             var c = structuredClone(b)
        //             c.push(...healerPerm[j])
        //             //console.log("c.length: " + c.length)
        //             if (isRaidValid(c)) {
        //               for (var k = 0; k < tankPerm.length; k++) {
        //                 var d = structuredClone(c)
        //                 d.push(...tankPerm[k])
        //                 if (isRaidValid(d)) {
        //                   raidWeight = evaluateRaid(d)
        //                   // console.log("RaidWeight: " + raidWeight);
        //                   // console.log("Best RaidWeight: " + bestRaid.weight);    
        //                   if (raidWeight > bestRaid.weight) {
        //                     console.log("New raid more optimal then previous. New RaidWeight: " + raidWeight)
        //                     bestRaid.weight = raidWeight
        //                     bestRaid.raid = structuredClone(d)
        //                   }
        //                 }
        //                 if (optimalRaidWeight == bestRaid.weight) {
        //                   console.log("Found Optimal Raid - Exiting Search")
        //                   break loop1;
        //                 }
        //                 //console.log("d length pre: " + d.length)
        //                 d.splice(d.length - tankPerm[k].length)
        //                 // console.log("d length post: " + d.length)
        //                 //console.log("-------------------------------------------------")
        //               }
        //             }
        //           }
        //         }

        //       }

        //     }

        //   }
        // } catch (error) {
        //   console.log("********************************************")
        //   console.log(error);
        //   console.log(error.message)
        //   console.log("********************************************")
        //   response.status(200).json("Error")
        // }
        // response.status(200).json(bestRaid)

    } catch (error) {
        console.log(error.message)
        response.status(200).json("Error");
    }

});


//CONFIG 
app.get('/config', (request, response) => {
    try {
        fetch(process.env.DATABASE_SERVER_ADDRESS + "/config").then(res => res.json()).then(json => {
            response.send(json);

        });
    } catch (error) {
        response.status(400).send("Error")
    }


});

app.patch('/config', (request, response) => {
    try {
        fetch(process.env.DATABASE_SERVER_ADDRESS + "/config",
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

//DISCORD
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

//LOOT
app.get('/getItems', (request, response) => {
    try {
        fetch(process.env.DATABASE_SERVER_ADDRESS + "/items").then(res => res.json()).then(json => {

            response.send(json);
        });
    } catch (error) {
        response.status(400).send("Error")
    }

});

app.get('/getSpecData', (request, response) => {
    try {
        fetch(process.env.DATABASE_SERVER_ADDRESS + "/specData").then(res => res.json()).then(json => {
            response.send(json);
        });
    } catch (error) {
        response.status(400).send("Error")
    }


});

app.get('/getSpectoItems', (request, response) => {
    try {
        fetch(process.env.DATABASE_SERVER_ADDRESS + "/specToItem").then(res => res.json()).then(json => {
            response.send(json);
        });
    } catch (error) {
        response.status(400).send("Error")
    }


});

app.get('/getMasterLootsheet', (request, response) => {

    try {
        fetch(process.env.DATABASE_SERVER_ADDRESS + "/masterLootsheet").then(res => res.json()).then(json => {
            response.send(json);
        });
    } catch (error) {
        response.status(400).send("Error")
    }

});

app.post('/insertItemtoSpec', (request, response) => {
    try {
        var arr = request.body;
        InsertSQLString = `DELETE FROM spectoitem WHERE item_id = '${arr[0].item_id}';`
        if (arr[0].specUID == 0) {

        } else {
            for (let i = 0; i < arr.length; i++) {
                str = `INSERT INTO spectoitem (item_id, \"specUID\") VALUES( '${arr[i].item_id}','${arr[i].specUID}');`
                InsertSQLString = InsertSQLString + str
            }
        }

        fetch(process.env.DATABASE_SERVER_ADDRESS + "/specToItem",
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
                response.status(200).send({ status: 200, message: `spectoItem object inserted` })
            }
        }).catch((err) => {
            console.error(err); // handle error
            response.status(400).send("Error during Database Call")
        });
    } catch (error) {
        response.status(400).send("Error")
    }

})

app.patch('/updateSheetLimitandRanking', (request, response) => {
    try {
        fetch(process.env.DATABASE_SERVER_ADDRESS + "/updateSheetLimitandRanking",
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
            response.status(400).send("Error during Database Call")
        });
    } catch (error) {
        response.status(400).send("Error")
    }

})

app.get('/getLootSheet/:char_name', (request, response) => {
    try {
        fetch(`http://127.0.0.1:3000/lootSheet/${request.params.char_name}`).then(res => res.json()).then(json => {
            response.send(json);
        });
    } catch (error) {
        response.status(400).send("Error")
    }

});

app.post('/insertLootSheet', (request, response) => {
    try {
        console.log(request.body)
        var arr = request.body;
        InsertSQLString = `DELETE FROM lootsheet WHERE \"char_name\" = '${arr[0].char_name}';`
        if (arr[0].specUID == 0) {

        } else {
            for (let i = 0; i < arr.length; i++) {
                str = `INSERT INTO lootsheet (char_name, phase, item_id, slot, aquired) VALUES( '${arr[i].char_name}',${arr[i].phase},${arr[i].item_id},'${arr[i].slot}','${arr[i].aquired}');`
                InsertSQLString = InsertSQLString + str
            }
        }

        fetch(process.env.DATABASE_SERVER_ADDRESS + "/lootsheet",
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
                response.status(200).send({ status: 200, message: `lootsheet object inserted` })
            }
        }).catch((err) => {
            console.error(err); // handle error
            response.status(400).send("Error during Database Call")
        });
    } catch (error) {
        response.status(400).send("Error")
    }

})

app.get('/getSheetLock/:char_name', (request, response) => {
    try {
        fetch(`http://127.0.0.1:3000/sheetLock/${request.params.char_name}`).then(res => res.json()).then(json => {
            response.send(json);
        });
    } catch (error) {
        response.status(400).send("Error ")
    }

});

app.post('/insertSheetLock', (request, response) => {
    try {
        var arr = request.body;
        InsertSQLString = `DELETE FROM sheetlock WHERE \"char_name\" = '${arr[0].char_name}';`
        if (arr[0].specUID == 0) {

        } else {
            for (let i = 0; i < arr.length; i++) {
                str = `INSERT INTO sheetlock (char_name, phase, locked,mainspec, offspec) VALUES('${arr[i].char_name}',${arr[i].phase},'${arr[i].locked}',${arr[i].mainspec},${arr[i].offspec});`
                InsertSQLString = InsertSQLString + str
            }
        }
        fetch(process.env.DATABASE_SERVER_ADDRESS + "/sheetLock",
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
                throw Error("Cannot insert the requested sheetlock object");
            } else {
                response.status(200).send({ status: 200, message: `sheetlock object inserted` })
            }
        }).catch((err) => {
            console.error(err); // handle error
            response.status(400).send("Error during Database Call")
        });
    } catch (error) {
        response.status(400).send("Error")
    }

})

//RAID
app.get('/getRaids', (request, response) => {

    try {
        fetch(process.env.DATABASE_SERVER_ADDRESS + "/raids").then(res => res.json()).then(raids => {
            var raidArray = new Array()
            for (let i in raids) {
                if (raidArray.some(raid => raid.raid_id == raids[i]['raid_id'])) {

                } else {
                    var raidObj = new Object();
                    raidObj.raid_id = raids[i]['raid_id'];
                    raidObj.raid_date = raids[i]['raid_date'];
                    raidObj.raid_name = raids[i]['raid_name'];
                    raidObj.drops = new Array()
                    raidObj.attendance = new Array()
                    raidArray.push(raidObj)
                }
            }


            for (let i in raids) {
                // if (raidArray.find(raid => raid.raid_id != raids[i]['raid_id']) || raidArray.length == 0) {
                //     console.log("condition true")
                //     var raidObj = new Object();
                //     raidObj.raid_id = raids[i]['raid_id'];
                //     raidObj.raid_date = raids[i]['raid_date'];
                //     raidObj.raid_name = raids[i]['raid_name'];
                //     raidObj.drops = new Array()
                //     raidObj.attendance = new Array()
                //     raidArray.push(raidObj)
                // }
                var matchedRaid = raidArray.find(raid => raid.raid_id == raids[i]['raid_id'])

                if (matchedRaid.drops.filter(drop => drop.item_id == raids[i]['item_id']).length == 0) {
                    var dropItemObj = new Object();
                    dropItemObj.raid_id = raids[i]['raid_id'];
                    dropItemObj.item_id = raids[i]['item_id'];
                    dropItemObj.char_name = raids[i]['charwhogotitem'];
                    matchedRaid.drops.push(dropItemObj)
                }
                if (matchedRaid.attendance.filter(att => att.char_name == raids[i]['char_name']).length == 0) {
                    var attendItemObj = new Object();
                    attendItemObj.raid_id = raids[i]['raid_id'];
                    attendItemObj.char_name = raids[i]['char_name'];
                    attendItemObj.present = raids[i]['present'];
                    attendItemObj.used_time_off = raids[i]['used_time_off'];
                    matchedRaid.attendance.push(attendItemObj)
                }
            }
            response.status(200).json(raidArray);


        });
    } catch (error) {
        response.status(400).send("error");
    }



});

app.get('/getRaidWeeks', (request, response) => {
    try {
        fetch(process.env.DATABASE_SERVER_ADDRESS + "/raidWeeks").then(res => res.json()).then(json => {

            response.status(200).send(json);
        });
    } catch (error) {
        response.status(400).send("error");
    }


});

app.post('/insertRaid', (request, response) => {

    try {
        TotalSQL = ""
        DeleteFromRaid = `delete from raids where raid_id ='${request.body.raid_id}';`
        TotalSQL += DeleteFromRaid
        DeleteFromRaidDrops = `delete from raid_droplist where raid_id ='${request.body.raid_id}';`
        TotalSQL += DeleteFromRaidDrops
        DeleteFromRaidAttendance = `delete from raid_attendance where raid_id ='${request.body.raid_id}';`
        TotalSQL += DeleteFromRaidAttendance

        RaidTableSQL = `insert into raids (raid_id, raid_date, raid_name) VALUES ('${request.body.raid_id}','${request.body.raid_date}','${request.body.raid_name}'); `;
        TotalSQL += RaidTableSQL

        RaidDropSQL = "";
        UpdateLootSheetSQL = ""
        request.body.drops.forEach(drop => {
            RaidDropItemRollingSQL = `insert into raid_droplist (raid_id, item_id, char_name) VALUES ('${request.body.raid_id}', ${drop.item_id},'${drop.char_name}');`;
            UpdateLootSheetSQL += `update lootsheet set aquired = 'true' where item_id=${drop.item_id} and slot='${drop.slot_id_to_update}' and \"charUID\"= (select \"charUID\" from characters where \"charName\"='${drop.char_name}');`
            RaidDropSQL += RaidDropItemRollingSQL;
        });
        TotalSQL += RaidDropSQL
        TotalSQL += UpdateLootSheetSQL

        RaidAttendanceSQL = "";
        request.body.attendance.forEach(attend => {
            RaidAttendanceItemRollingSQL = `insert into raid_attendance (raid_id, char_name, present, used_time_off) VALUES ('${request.body.raid_id}','${attend.char_name}', ${attend.present},${attend.used_time_off});`;
            RaidAttendanceSQL += RaidAttendanceItemRollingSQL;
        });
        TotalSQL += RaidAttendanceSQL

        fetch(process.env.DATABASE_SERVER_ADDRESS + "/raid",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'responseType': 'text'
                },
                method: 'POST',
                body: JSON.stringify({
                    sql: TotalSQL,
                })
            }
        ).then((resp) => {
            if (resp.status != 200) {
                throw Error("Cannot insert the requested raid object");
            } else {
                response.status(200).send({ status: 200, message: `raid object inserted` })
            }
        }).catch((err) => {
            console.error(err); // handle error
            response.status(400).send("Error during Database Call")
        });
    } catch (error) {
        response.status(400).send("Error")
    }
})

app.patch('/updateRaidWeek', (request, response) => {

    try {
        fetch(process.env.DATABASE_SERVER_ADDRESS + "/updateRaidWeek",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'responseType': 'text'
                },
                method: 'PATCH',
                body: JSON.stringify({
                    week_id: request.body.week_id,
                    req_raids_for_attendance: request.body.req_raids_for_attendance,
                    alt_req_raids_for_attendance: request.body.alt_req_raids_for_attendance
                })
            }
        ).then((resp) => {
            if (resp.status != 200) {
                throw Error("Cannot Update the Requested Raid Week");
            } else {
                response.status(200).send({ status: 200, message: `Week updated with id : ${request.body.week_id}` })
            }
        }).catch((err) => {
            console.error(err); // handle error
            response.status(400).send("Error during Database Call")
        });
    } catch (error) {
        response.status(400).send("Error")
    }



})

//USER
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
        fetch(process.env.DATABASE_SERVER_ADDRESS + "/user",
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
        fetch(process.env.DATABASE_SERVER_ADDRESS + "/session",
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
        fetch(process.env.DATABASE_SERVER_ADDRESS + "/session",
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
        fetch(process.env.DATABASE_SERVER_ADDRESS + "/officers").then(res => res.json()).then(json => {
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


function getOptimalRaidWeight(allBuffs) {
    combinedArray = []
    buffCollection = []
    for (let j = 0; j < allBuffs.length; j++) {
        allBuffs[j].buffs.forEach(d => {
            combinedArray.push(d)
        })
    }
    for (let i = 0; i < 28; i++) {
        let buffCod = combinedArray.filter(b => (parseInt(b.buffCode) == (i + 1)))
        let buffToAdd;
        for (let k = 0; k < buffCod.length; k++) {
            if (k == 0) {
                buffToAdd = buffCod[k]
            } else if (buffCod[k].buffWeight > buffToAdd.buffWeight) {
                buffToAdd = buffCod[k];
            }
        }
        // if (buffToAdd.buffWeight != 100){
        //   console.log(buffToAdd)
        // }
        buffCollection.push(buffToAdd);
    }


    // allBuffs.forEach(x => {
    //   //generate ria dbuff collection





    //   x.buffs.forEach(b => {
    //     if (buffCollection.some(q => q.buffCode == b.buffCode)) {
    //       console.log("Matching Code Found. Determine if weights are higher")
    //       console.log("BuffCode : " + b.buffCode)
    //       console.log("Buff Collection BuffCode : " + buffCollection.find(t => t.buffCode == b.buffCode).buffCode)

    //       console.log("Values Before Checking for weights")
    //       console.log("buffWeight : " + b.buffWeight)
    //       console.log("Buff Collection buffWeight : " + buffCollection.find(t => t.buffCode == b.buffCode).buffWeight)

    //       if (buffCollection.some(q => (b.buffWeight > q.buffWeight && q.buffCode == b.buffCode))) {
    //         //found item where weight is higher and buff code is the same
    //         console.log("********************Replacing Item as new Weight is higher**************************")
    //         var index = buffCollection.indexOf(buffCollection.find(q => (q.buffCode == b.buffCode)))
    //         buffCollection[index] = b
    //       }
    //     } else {
    //       // console.log("New Code Found. Adding to Buff cOllection")
    //       // console.log("BuffCode : " + b.buffCode)

    //       buffCollection.push(b)
    //     }
    //   })
    // })
    console.log("Buff Collection Length: " + buffCollection.length)


    // buffCollection.forEach(p =>{
    //   console.log(p)
    // })

    raidWeight = 0

    buffCollection = buffCollection.sort((a, b) => {
        return a.buffCode - b.buffCode
    })
    //console.log(buffCollection)
    buffCollection.forEach(b => {
        raidWeight += b.buffWeight
    })

    console.log("Raid Weight: " + raidWeight)

    return raidWeight;
}
function checkRole(data) {
    if (data == 'rdps') {
        return 'Ranged DPS';
    }
    else if (data == 'mdps') {
        return 'Melee DPS';
    }
    else if (data == 'tank') {
        return 'Tank';
    }
    else if (data == 'healer') {
        return 'Healer';
    }
}
app.listen(port, () => {
    console.log(`App running on port ${port}.`)

    try {
        fetch(process.env.DATABASE_SERVER_ADDRESS + "/spec").then(res => res.json()).then(json => {
            for (let i in json) {
                var obj = new Object();
                obj.specUID = json[i]['specUID'];
                obj.name = json[i]['name'];
                obj.role = json[i]['role']
                specMapping.push(obj)
            }
        })

        fetch(process.env.DATABASE_SERVER_ADDRESS + "/buffs").then(res => res.json()).then(json => {
            for (let i in json) {
                var found = buffMapping.find(element => {
                    return element.specUID == json[i]['specUID'];
                });
                if (found) {
                    var addObj = buffMapping.find(element => {
                        return element.specUID == json[i]['specUID'];
                    });
                    var buffOBJ = new Object();
                    buffOBJ.buffCode = json[i]['buffCode'];
                    buffOBJ.buffText = json[i]['buffText'];
                    buffOBJ.buffName = json[i]['buffName'];
                    buffOBJ.buffWeight = json[i]['buffWeight'];
                    addObj.buffs.push(buffOBJ);
                } else {
                    var obj = new Object();
                    obj.specUID = json[i]['specUID'];
                    obj.buffs = new Array();
                    var buffOBJ = new Object();
                    buffOBJ.buffCode = json[i]['buffCode'];
                    buffOBJ.buffText = json[i]['buffText'];
                    buffOBJ.buffName = json[i]['buffName'];
                    buffOBJ.buffWeight = json[i]['buffWeight'];
                    obj.buffs.push(buffOBJ);
                    buffMapping.push(obj)
                }
            }
        })
    } catch (error) {
        response.status(400).send("Error")
    }

});