
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3010;
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

app.get('/getRaids', (request, response) => {

    try {
        fetch("http://127.0.0.1:3000/raids").then(res => res.json()).then(raids => {
            var raidArray = new Array()
            for (let i in raids) {
                if (raidArray.find(raid => raid.raid_id != raids[i]['raid_id']) || raidArray.length == 0) {
                    var raidObj = new Object();
                    raidObj.raid_id = raids[i]['raid_id'];
                    raidObj.raid_date = raids[i]['raid_date'];
                    raidObj.raid_name = raids[i]['raid_name'];
                    raidObj.drops = new Array()
                    raidObj.attendance = new Array()
                    raidArray.push(raidObj)
                }

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
        fetch("http://127.0.0.1:3000/raidWeeks").then(res => res.json()).then(json => {

            response.status(200).send(json);
        });
    } catch (error) {
        response.status(200).send("error");
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

        fetch("http://127.0.0.1:3000/raid",
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
        fetch("http://127.0.0.1:3000/updateRaidWeek",
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

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});

