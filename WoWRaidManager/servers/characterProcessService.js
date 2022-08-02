
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
const fetch = require('node-fetch');
const cors = require('cors');
const lodash = require('lodash')
const { Worker } = require("worker_threads");
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
  origin: 'https://localhost:4200',
  origin: 'http://localhost:4200',

}));

app.get('/processRoster', (request, response) => {

  try {
    const charArray = new Array();

    fetch("http://127.0.0.1:3000/roster").then(res => res.json()).then(json => {


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

    fetch(`http://localhost:3000/roster/user/${request.params.user_id}`).then(res => res.json()).then(json => {
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


    fetch("http://127.0.0.1:3000/roster",
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

    fetch("http://127.0.0.1:3000/roster",
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

app.delete('/deleteCharacter/:charName', (request, response) => {
  try {
    fetch("http://127.0.0.1:3000/roster/" + request.params.charName,
      {
        method: 'DELETE'
      }
    ).then((resp) => {
      if (resp.status != 200) {

        throw Error("Cannot delete your item from list");
      } else {
        response.status(200).send({ status: 200, message: `Character deleted with name : ${request.params.charName}` })
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
    fetch("http://127.0.0.1:3000/spec").then(res => res.json()).then(json => {
      for (let i in json) {
        var obj = new Object();
        obj.specUID = json[i]['specUID'];
        obj.name = json[i]['name'];
        obj.role = json[i]['role']
        specMapping.push(obj)
      }
    })

    fetch("http://127.0.0.1:3000/buffs").then(res => res.json()).then(json => {
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