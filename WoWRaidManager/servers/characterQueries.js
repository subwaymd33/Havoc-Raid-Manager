const { release } = require('os');

const Pool = require('pg').Pool
require('dotenv').config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PSWD,
  max: 2000,
  port: 5432,
})

const getRoster = (request, response) => {
  console.log('Processing request: getRoster')

  pool.query("SELECT \"charName\", \"specUID\", main, \"offSpecUID\", \"mainsName\" FROM public.characters", (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getRoster")
    response.status(200).json(results.rows)
  });
}

const getRosterbyID = (request, response) => {
  console.log('Processing request: getRosterbyID')
  const id = parseInt(request.params.id)
  pool.query(`SELECT public.characters.\"charName\", public.specs.\"spec\"||' '|| public.specs.base_class as name, public.specs.\"role\",public.raidbuffdebuff.\"buffCode\",public.raidbuffdebuff.\"buffText\",public.characters.main FROM public.characters join public.specs on public.characters.\"specUID\" = public.specs.\"specUID\" join public.\"specToBuffDebuff\" on public.specs.\"specUID\" = public.\"specToBuffDebuff\".\"specUID\" join public.raidbuffdebuff on public.\"specToBuffDebuff\".\"buffDebuffUID\" = public.raidbuffdebuff.\"buffDebuffUID\" where public.characters.\"charUID\" = $1 order by public.raidbuffdebuff.\"buffText\" desc`, [id], (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getRosterbyID")
    response.status(200).json(results.rows)
  });
};

const getRosterbyUser = (request, response) => {
  console.log('Processing request: getRosterbyUser')
  const user_id = request.params.user_id
  pool.query(`SELECT \"charName\", \"specUID\", main, \"offSpecUID\", \"mainsName\" FROM public.characters WHERE \"user\" = $1`, [user_id], (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getRosterbyUser")
    response.status(200).json(results.rows)
  });
};

const updateCharacter = (request, response) => {
  console.log('Processing request: updateCharacter')
  const { charName, specUID, main, offspecUID, mainsName } = request.body

  pool.query(
    `UPDATE public.characters SET \"specUID\" = $2, main = $3, \"offSpecUID\" = $4, \"mainsName\"=$5  WHERE \"charName\" = $1`,
    [charName, specUID, main, offspecUID,mainsName],
    (error, results) => {
      release()
      if (error) {
        throw error
      }
      console.log("Returning: updateCharacter")
      response.status(200).send(`Character modified with name: ${charName}`)
    }
  )
}

const getBuffTable = (request, response) => {
  console.log('Processing request: getBuffTable')
  pool.query('SELECT public.\"specToBuffDebuff\".\"specUID\",public.\"raidbuffdebuff\".\"buffCode\", public.\"raidbuffdebuff\".\"buffName\", public.\"raidbuffdebuff\".\"buffText\", public.\"raidbuffdebuff\".\"buffWeight\" FROM public.\"specToBuffDebuff\" join public.\"raidbuffdebuff\" on public.\"specToBuffDebuff\".\"buffDebuffUID\" = public.\"raidbuffdebuff\".\"buffDebuffUID\"', (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getBuffTable")
    response.status(200).json(results.rows)
  });
};

const getSpecUID = (request, response) => {
  const baseClass = request.params.baseClass
  const specName = request.params.spec

  pool.query("SELECT \"specUID\" from public.specs where name ='" + specName + "' and base_class like '%" + baseClass + "'", (error, results) => {
    release()
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  });
}

const insertCharacter = (request, response) => {
  console.log('Processing request: insertCharacter')
  const { charName, specUID, main, offspecUID, mainsName, userOwner } = request.body

  pool.query(
    `INSERT INTO public.characters(\"charName\", \"specUID\", main, \"offSpecUID\", \"mainsName\", \"user\") VALUES ($1, $2, $3, $4, $5,$6);`, [charName, specUID, main, offspecUID, mainsName, userOwner],
    (error, results) => {
      release()
      if (error) {
        throw error
      }
      console.log("Returning: insertCharacter")
      response.status(200).send(`Character created`)
    }
  )
}

const deleteCharacter = (request, response) => {
  console.log('Processing request: deleteCharacter')
  const charName = request.params.charName

  pool.query(`DELETE FROM public.characters WHERE \"charName\" = $1`, [charName], (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log('Returning: deleteCharacter')
    response.status(200).send(`Character deleted with name : ${charName}`)
  })
}

const getAllSpecs = (request, response) => {
  console.log('Processing request: getAllSpecs')
  pool.query("SELECT \"specUID\", \"spec\"||' '|| base_class as name, role from public.specs", (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: All Specs")
    response.status(200).json(results.rows)
  });
}


const getUserbyID = (request, response) => {
  console.log('Processing request: getUserbyID')
  const user_id = request.params.user_id
  pool.query(`SELECT \"user_name\", role from public.users where \"user_id\" = $1`, [user_id], (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getUserbyID")
    response.status(200).json(results.rows)
  });
};

const insertUser = (request, response) => {
  console.log('Processing request: insertUser')
  const { user_id, user_name, role } = request.body
  pool.query(
    `INSERT INTO public.users(\"user_id\", \"user_name\", role )VALUES ($1, $2, $3);`, [user_id, user_name, role],
    (error, results) => {
      release()
      if (error) {
        throw error
      }
      console.log("Returning: insertUser")
      response.status(200).send(`User created`)
    }
  )
}

const getSessionbyID = (request, response) => {
  const user_id = request.params.user_id
  pool.query(`SELECT \"user_id\",\"access_token\",\"refresh_token\",\"expiry_time\" from public.sessions where \"user_id\" = $1`, [user_id], (error, results) => {
    release()
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  });
};

const insertSession = (request, response) => {
  console.log('Processing request: insertSession')
  const { user_id, access_token, refresh_token, expiry_time } = request.body
  pool.query(
    `INSERT INTO public.sessions(\"user_id\", \"access_token\", \"refresh_token\", \"expiry_time\" )VALUES ($1, $2, $3, $4);`, [user_id, access_token, refresh_token, expiry_time],
    (error, results) => {
      release()
      if (error) {
        throw error
      }
      console.log("Returning: insertSession")
      response.status(200).send(`Session created`)
    }
  )
}

const updateSession = (request, response) => {
  console.log('Processing request: updateSession')
  const { user_id, access_token, refresh_token, expiry_time } = request.body
  pool.query(
    `UPDATE public.sessions SET \"access_token\"= $2, \"refresh_token\" = $3, \"expiry_time\"= $4 WHERE \"user_id\" = $1;`, [user_id, access_token, refresh_token, expiry_time],
    (error, results) => {
      release()
      if (error) {
        throw error
      }
      console.log("Returning: updateSession")
      response.status(200).send(`Session UPDATED`)
    }
  )
}

const getItems = (request, response) => {
  console.log('Processing request: getItems')

  pool.query("SELECT item_id, item_name, item_phase, item_slot, item_ranking, wowhead_link, item_source, raid, sheet_limit FROM public.items order by item_id asc", (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getItems")
    response.status(200).json(results.rows)
  });
}

const getSpecToItem = (request, response) => {
  console.log('Processing request: getSpecToItem')

  pool.query("SELECT \"item_id\", \"specUID\" FROM public.spectoitem", (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getSpecToItem")
    response.status(200).json(results.rows)
  });
}

const getSpecData = (request, response) => {
  console.log('Processing request: getSpecData')

  pool.query("SELECT \"specUID\", \"spec\",\"base_class\" FROM public.specs", (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getSpecData")
    response.status(200).json(results.rows)
  });
}

const insertSpecToItem = (request, response) => {
  console.log('Processing request: insertSpecToItem')
  const { sql } = request.body
  pool.query(
    sql,
    (error, results) => {
      release()
      if (error) {
        throw error
      }
      console.log("Returning: insertSpecToItem")
      response.status(200).send(`SpectoItem created`)
    }
  )
}

const getConfig = (request, response) => {
  console.log('Processing request: getConfig')

  pool.query("SELECT name, value FROM public.app_configurations", (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getConfig")
    response.status(200).json(results.rows)
  });
}

const updateConfig = (request, response) => {
  console.log('Processing request: updateConfig')
  const { name, value } = request.body

  pool.query(
    `UPDATE public.app_configurations SET value = $2 WHERE name = $1`,
    [name, value],
    (error, results) => {
      release()
      if (error) {
        throw error
      }
      console.log("Returning: updateConfig")
      response.status(200).send(`Config modified for: ${name}`)
    }
  )
}

const updateSheetLimitandRanking = (request, response) => {
  console.log('Processing request: updateSheetLimitandRanking')
  const { item_id, item_ranking, sheet_limit } = request.body

  pool.query(
    `UPDATE public.items SET item_ranking = $2, sheet_limit=$3 WHERE item_id = $1`,
    [item_id, item_ranking, sheet_limit],
    (error, results) => {
      release()
      if (error) {
        throw error
      }
      console.log("Returning: updateSheetLimitandRanking")
      response.status(200).send(`Ranking and Sheet modified for: ${item_id}`)
    }
  )
}

const getLootSheetByCharName = (request, response) => {
  console.log('Processing request: getLootSheetByCharName')
  const charName = request.params.charName
  pool.query(`SELECT l.\"charUID\", l.phase, l.item_id, l.slot, l.aquired FROM public.lootsheet l join characters c on c.\"charUID\" = l.\"charUID\" where c.\"charName\" = $1`,[charName], (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getLootSheetByCharName")
    response.status(200).json(results.rows)
  });
}
const insertLootSheet = (request, response) => {
  console.log('Processing request: insertLootSheet')
  const { sql } = request.body
  pool.query(
    sql,
    (error, results) => {
      release()
      if (error) {
        throw error
      }
      console.log("Returning: insertLootSheet")
      response.status(200).send(`LootSheet Record created`)
    }
  )
}
const getCharUIDByCharName = (request, response) => {
  console.log('Processing request: getCharUIDByCharName')
  const charName = request.params.charName
  pool.query(`SELECT \"charUID\" FROM public.characters where \"charName\" = $1`,[charName], (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getCharUIDByCharName")
    response.status(200).json(results.rows)
  });
}
const getsheetLockByCharUID = (request, response) => {
  console.log('Processing request: getsheetLockByCharUID')
  const charUID = request.params.charUID
  pool.query(`SELECT \"charUID\", phase, locked, mainspec, offspec FROM public.sheetlock where \"charUID\" = $1`,[charUID], (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getsheetLockByCharUID")
    response.status(200).json(results.rows)
  });
}
const insertSheetLock = (request, response) => {
  console.log('Processing request: insertSheetLock')
  const { sql } = request.body
  pool.query(
    sql,
    (error, results) => {
      release()
      if (error) {
        throw error
      }
      console.log("Returning: insertSheetLock")
      response.status(200).send(`LootSheet Record created`)
    }
  )
}

const getMasterLootSheet = (request, response) => {
  console.log('Processing request: getMasterLootSheet')

  pool.query("SELECT c.\"charName\",l.phase, l.item_id, l.slot,c.\"charUID\",aquired, c.\"specUID\" from lootsheet l join characters c on c.\"charUID\" = l.\"charUID\" where aquired ='false';", (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getMasterLootSheet")
    response.status(200).json(results.rows)
  });
}
const insertRaid = (request, response) => {
  console.log('Processing request: insertRaid')
  const { sql } = request.body
  pool.query(
    sql,
    (error, results) => {
      release()
      if (error) {
        throw error
      }
      console.log("Returning: insertRaid")
      response.status(200).send(`Raid Record created`)
    }
  )
}
const getRaidDropsforRaidID = (request, response) => {
  console.log('Processing request: getRaidDropsforRaidID')
  const raid_id = request.params.raid_id
  pool.query(`SELECT raid_id, item_id, char_name FROM public.raid_droplist where raid_id = $1`,[raid_id], (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getRaidDropsforRaidID")
    response.status(200).json(results.rows)
  });
}
const getRaidAttendanceforRaidID = (request, response) => {
  console.log('Processing request: getRaidAttendanceforRaidID')
  const raid_id = request.params.raid_id
  pool.query(`SELECT raid_id, char_name, present, used_time_off FROM public.raid_attendance where raid_id = $1`,[raid_id], (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getRaidAttendanceforRaidID")
    response.status(200).json(results.rows)
  });
}
const getRaids = (request, response) => {
  console.log('Processing request: getRaids')

  pool.query("SELECT r.raid_id, r.raid_date, r.raid_name, a.char_name, a.present, a.used_time_off, d.item_id, d.char_name as charWhoGotItem from raids r join raid_droplist d on r.raid_id=d.raid_id join raid_attendance a on a.raid_id = r.raid_id ", (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getRaids")
    response.status(200).json(results.rows)
  });
}
const getRaidWeeks = (request, response) => {
  console.log('Processing request: getRaidWeeks')

  pool.query("SELECT week_id, start_dt, end_dt, req_raids_for_attendance from raid_weeks order by start_dt asc;", (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getRaidWeeks")
    response.status(200).json(results.rows)
  });
}
const updateRaidWeek = (request, response) => {
  console.log('Processing request: updateRaidWeek')
  const { week_id, req_raids_for_attendance } = request.body
  pool.query(
    `UPDATE public.raid_weeks SET req_raids_for_attendance = $2 WHERE week_id = $1`,
    [week_id, req_raids_for_attendance],
    (error, results) => {
      release()
      if (error) {
        throw error
      }
      console.log("Returning: updateRaidWeek")
      response.status(200).send(`Ranking modified for: ${week_id}`)
    }
  )
}
const getOfficers = (request, response) => {
  console.log('Processing request: getOfficers')
  pool.query("SELECT user_id from public.users where role ='officer'", (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getOfficers")
    response.status(200).json(results.rows)
  });
}

module.exports = {
  getRoster,
  getRosterbyID,
  updateCharacter,
  deleteCharacter,
  getSpecUID,
  insertCharacter,
  getAllSpecs,
  getBuffTable,
  insertUser,
  insertSession,
  updateSession,
  getUserbyID,
  getSessionbyID,
  getRosterbyUser,
  getItems,
  getSpecToItem,
  getSpecData,
  insertSpecToItem,
  getConfig,
  updateConfig,
  getLootSheetByCharName,
  insertLootSheet,
  getCharUIDByCharName,
  getsheetLockByCharUID,
  insertSheetLock,
  getMasterLootSheet,
  insertRaid,
  getRaidDropsforRaidID,
  getRaidAttendanceforRaidID,
  getRaids,
  getRaidWeeks,
  updateRaidWeek,
  updateSheetLimitandRanking,
  getOfficers
};