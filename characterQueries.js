const Pool = require('pg').Pool
require('dotenv').config();
const pool = new Pool({
  user: 'tblhuetj',
  host: 'fanny.db.elephantsql.com',
  database: 'tblhuetj',
  password: process.env.DB_PSWD,
  port: 5432,
})

const getRoster = (request, response) => {
  console.log('Processing request: getRoster')

  pool.query("SELECT \"charName\", \"specUID\", main, \"offSpecUID\", \"mainsName\" FROM public.characters", (error, results) => {
    if (error) {
      throw error
    }
    console.log("Returning: getRoster")
    response.status(200).json(results.rows)
  });



  // pool.query("SELECT public.characters.\"charName\", public.characters.\"specUID\", public.specs.\"role\",public.raidbuffdebuff.\"buffCode\",public.raidbuffdebuff.\"buffText\",public.characters.main, public.characters.\"offSpecUID\" FROM public.characters join public.specs on public.characters.\"specUID\" = public.specs.\"specUID\" join public.\"specToBuffDebuff\" on public.specs.\"specUID\" = public.\"specToBuffDebuff\".\"specUID\" join public.raidbuffdebuff on public.\"specToBuffDebuff\".\"buffDebuffUID\" = public.raidbuffdebuff.\"buffDebuffUID\" order by public.raidbuffdebuff.\"buffText\" desc", (error, results) => {
  //   if (error) {
  //     throw error
  //   }
  //   console.log("Returning: getRoster")
  //   response.status(200).json(results.rows)
  // });
}

const getRosterbyID = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query(`SELECT public.characters.\"charName\", public.specs.\"spec\"||' '|| public.specs.base_class as name, public.specs.\"role\",public.raidbuffdebuff.\"buffCode\",public.raidbuffdebuff.\"buffText\",public.characters.main FROM public.characters join public.specs on public.characters.\"specUID\" = public.specs.\"specUID\" join public.\"specToBuffDebuff\" on public.specs.\"specUID\" = public.\"specToBuffDebuff\".\"specUID\" join public.raidbuffdebuff on public.\"specToBuffDebuff\".\"buffDebuffUID\" = public.raidbuffdebuff.\"buffDebuffUID\" where public.characters.\"charUID\" = $1 order by public.raidbuffdebuff.\"buffText\" desc`, [id], (error, results) => {
    if (error) {
      throw error
    }


    response.status(200).json(results.rows)
  });
};

const updateCharacter = (request, response) => {
  console.log('Processing request: updateCharacter')
  const { charName, specUID, main, offspecUID} = request.body

  pool.query(
    `UPDATE public.characters SET \"specUID\" = $2, main = $3, \"offSpecUID\" = $4 WHERE \"charName\" = $1`,
    [charName, specUID, main, offspecUID],
    (error, results) => {
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
    if (error) {
      throw error
    }

    response.status(200).json(results.rows)
  });

}

const insertCharacter = (request, response) => {
  console.log('Processing request: insertCharacter')
  const { charName, specUID, main, offSpecUID, mainsName } = request.body
    pool.query(
      `INSERT INTO public.characters(\"charName\", \"specUID\", main, \"offSpecUID\", \"mainsName\" )VALUES ($1, $2, $3, $4,$5);`, [charName, specUID, main,offSpecUID, mainsName],
      (error, results) => {
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
    if (error) {
      throw error
    }
    console.log("Returning: All Specs")
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
  getBuffTable
};