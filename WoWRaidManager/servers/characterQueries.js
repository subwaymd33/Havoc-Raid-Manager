const { release } = require('os');

const Pool = require('pg').Pool
require('dotenv').config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PSWD,
  max: 200,
  port: 5432,
})

const getRoster = (request, response) => {
  console.log('Processing request: getRoster')

  pool.query("SELECT char_name, spec_uid, rank, offspec_uid, mains_name FROM public.characters", (error, results) => {
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
  pool.query(`SELECT public.characters.char_name, public.specs.spec||' '|| public.specs.base_class as name, public.specs.role,public.raidbuffdebuff.buff_code,public.raidbuffdebuff.buff_text,public.characters.rank FROM public.characters join public.specs on public.characters.spec_uid = public.specs.spec_uid join public.spectobuffdebuff on public.specs.spec_uid = public.spectobuffdebuff.spec_uid join public.raidbuffdebuff on public.spectobuffdebuff.buff_debuff_uid = public.raidbuffdebuff.buff_debuff_uid where public.characters.char_uid = $1 order by public.raidbuffdebuff.buff_text desc`, [id], (error, results) => {
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
  pool.query(`SELECT char_name, spec_uid, rank, offspec_uid, mains_name FROM public.characters WHERE user_id = $1`, [user_id], (error, results) => {
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
  const { char_name, specUID, rank, offspecUID, mainsName } = request.body

  pool.query(
    `UPDATE public.characters SET spec_uid = $2, rank = $3, offspec_uid = $4, mains_name=$5  WHERE char_name = $1`,
    [char_name, specUID, rank, offspecUID, mainsName],
    (error, results) => {
      release()
      if (error) {
        throw error
      }
      console.log("Returning: updateCharacter")
      response.status(200).send(`Character modified with name: ${char_name}`)
    }
  )
}

const getBuffTable = (request, response) => {
  console.log('Processing request: getBuffTable')
  pool.query('SELECT public.spectobuffdebuff.spec_uid,public.raidbuffdebuff.buff_code, public.raidbuffdebuff.buff_name, public.raidbuffdebuff.buff_text, public.raidbuffdebuff.buff_weight FROM public.spectobuffdebuff join public.raidbuffdebuff on public.spectobuffdebuff.buff_debuff_uid = public.raidbuffdebuff.buff_debuff_uid', (error, results) => {
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

  pool.query("SELECT spec_uid from public.specs where name ='" + specName + "' and base_class like '%" + baseClass + "'", (error, results) => {
    release()
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  });
}

const insertCharacter = (request, response) => {
  console.log('Processing request: insertCharacter')
  const { char_name, specUID, rank, offspecUID, mainsName, userOwner } = request.body

  pool.query(
    `INSERT INTO public.characters(char_name, spec_uid, rank, offspec_uid, mains_name, user_id) VALUES ($1, $2, $3, $4, $5,$6);`, [char_name, specUID, rank, offspecUID, mainsName, userOwner],
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
  const char_name = request.params.char_name

  pool.query(`DELETE FROM public.characters WHERE char_name = $1`, [char_name], (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log('Returning: deleteCharacter')
    response.status(200).send(`Character deleted with name : ${char_name}`)
  })
}

const getAllSpecs = (request, response) => {
  console.log('Processing request: getAllSpecs')
  pool.query("SELECT spec_uid, spec||' '|| base_class as name, role from public.specs", (error, results) => {
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
  pool.query(`SELECT user_name, role from public.users where user_id = $1`, [user_id], (error, results) => {
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
    `INSERT INTO public.users(user_id, user_name, role )VALUES ($1, $2, $3);`, [user_id, user_name, role],
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
  console.log('Processing request: getSessionbyID')
  const user_id = request.params.user_id
  pool.query(`SELECT user_id,access_token,refresh_token,expiry_time from public.sessions where user_id = $1`, [user_id], (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getSessionbyID")
    response.status(200).json(results.rows)
  });
};

const insertSession = (request, response) => {
  console.log('Processing request: insertSession')
  const { user_id, access_token, refresh_token, expiry_time } = request.body
  pool.query(
    `INSERT INTO public.sessions(user_id, access_token, refresh_token, expiry_time )VALUES ($1, $2, $3, $4);`, [user_id, access_token, refresh_token, expiry_time],
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
    `UPDATE public.sessions SET access_token= $2, refresh_token = $3, expiry_time= $4 WHERE user_id = $1;`, [user_id, access_token, refresh_token, expiry_time],
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

  pool.query("SELECT item_id, spec_uid FROM public.spectoitem", (error, results) => {
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

  pool.query("SELECT spec_uid, spec,base_class FROM public.specs", (error, results) => {
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
  const char_name = request.params.char_name
  pool.query(`SELECT phase, item_id, slot, aquired FROM public.lootsheet where char_name = $1`, [char_name], (error, results) => {
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
  const char_name = request.params.char_name
  pool.query(`SELECT char_uid FROM public.characters where char_name = $1`, [char_name], (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getCharUIDByCharName")
    response.status(200).json(results.rows)
  });
}
const getSheetLock = (request, response) => {
  console.log('Processing request: getSheetLock')
  const char_name = request.params.char_name
  pool.query(`SELECT char_name, phase, status, mainspec, offspec FROM public.sheetlock where char_name = $1`, [char_name], (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getSheetLock")
    response.status(200).json(results.rows)
  });
}
const getSheetLockForApproval = (request, response) => {
  console.log('Processing request: getSheetLockForApproval')
  pool.query(`SELECT char_name, phase, status, mainspec, offspec FROM public.sheetlock where status = 'true'`, (error, results) => {
    release()
    if (error) {
      throw error
    }
    console.log("Returning: getSheetLockForApproval")
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
const updateSheetlock = (request, response) => {
  console.log('Processing request: updateSheetlock')
  const { char_name, status } = request.body
  pool.query(
    `UPDATE public.sheetlock SET status = $2 WHERE char_name = $1`,
    [char_name, status],
    (error, results) => {
      release()
      if (error) {
        throw error
      }
      console.log("Returning: updateSheetlock")
      response.status(200).send(`Sheetlock modified for: ${char_name}`)
    }
  )
}


const getMasterLootSheet = (request, response) => {
  console.log('Processing request: getMasterLootSheet')

  pool.query("SELECT c.char_name,l.phase, l.item_id, l.slot,c.char_uid,aquired, c.spec_uid, c.rank as char_rank from lootsheet l join characters c on c.char_name = l.char_name join sheetlock s on c.char_name = s.char_name where aquired ='false' and s.status = 'approved';", (error, results) => {
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
  pool.query(`SELECT raid_id, item_id, char_name FROM public.raid_droplist where raid_id = $1`, [raid_id], (error, results) => {
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
  pool.query(`SELECT raid_id, char_name, present, used_time_off FROM public.raid_attendance where raid_id = $1`, [raid_id], (error, results) => {
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

  pool.query("SELECT week_id, start_dt, end_dt, req_raids_for_attendance,alt_req_raids_for_attendance  from raid_weeks order by start_dt asc;", (error, results) => {
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
  const { week_id, req_raids_for_attendance, alt_req_raids_for_attendance} = request.body
  pool.query(
    `UPDATE public.raid_weeks SET req_raids_for_attendance = $2, alt_req_raids_for_attendance = $3 WHERE week_id = $1`,
    [week_id, req_raids_for_attendance, alt_req_raids_for_attendance],
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
const deleteCharacterandSheet = (request, response) => {
  console.log('Processing request: deleteSheetLock')
  console.log(request.body)
  const { sql } = request.body
  pool.query(
    sql,
    (error, results) => {
      release()
      if (error) {
        throw error
      }
      console.log("Returning: deleteSheetLock")
      response.status(200).send(`Character and Lootsheet Deleted`)
    }
  )
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
  getSheetLock,
  insertSheetLock,
  getMasterLootSheet,
  insertRaid,
  getRaidDropsforRaidID,
  getRaidAttendanceforRaidID,
  getRaids,
  getRaidWeeks,
  updateRaidWeek,
  updateSheetLimitandRanking,
  getOfficers,
  deleteCharacterandSheet,
  updateSheetlock,
  getSheetLockForApproval
};