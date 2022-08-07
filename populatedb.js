require("dotenv").config()
const Contributor = require('./models/contributor')
const Material = require('./models/material')
const Stage = require('./models/stage')
const mongoose = require('mongoose')
const mongoDB = process.env.DB
const async = require('async')

mongoose.connect(mongoDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const contributors = []
const materials = []
const stages = []

const createContributor = function (name, cb) {
  const contributor = new Contributor({ name: name })
  contributor.save((err) => {
    if (err) {
      console.log('Contributor Error')
      cb(err, null)
      return
    } else {
      console.log('New Contributor' + contributor)
      contributors.push(contributor)
      cb(null, contributor)
    }
  })
}

const createStage = function (name, descrip, sanity, pic, addedBy, cb) {
  stageDetail = {
    name: name,
    descrip: descrip,
    addedBy: addedBy
  }
  if (sanity != false) stageDetail.sanity = sanity
  if (pic != false) stageDetail.pic = pic
  const stage = new Stage(stageDetail)
  stage.save(err => {
    if (err) {
      console.log('Stage Error')
      cb(err, null)
      return
    } else {
      console.log('New Stage' + stage)
      stages.push(stage)
      cb(null,stage)
    }
  })
}


const createMaterial = function (name, usage, descrip, pic, dropFrom, addedBy, cb) {
  matDetail = {
    name: name,
    usage: usage,
    descrip: descrip,
    dropFrom: dropFrom,
    addedBy: addedBy
  }
  if (pic != false) matDetail.pic = pic
  const material = new Material(matDetail)
  material.save(err => {
    if (err) {
      console.error('Material Error')
      cb(err, null)
      return
    } else {
      console.log('New Material' + material)
      materials.push(material)
      cb(null, material)
    }
  })
}

const newContributor = function(cb) {
  async.series([
    function(callback) {
      createContributor('Remi', callback)
    },
    function(callback) {
      createContributor('Test1', callback)
    },
    function(callback) {
      createContributor('Shrek', callback)
    }
  ], cb)
}

const newStage = function(cb) {
  async.series([
    function(callback) {
      createStage('LS-5', "Annihilation Drill\nDefend against the enemy's surprise attack.\nDeployment Points will not automatically recover in this operation; You get 1 Deployment Point upon killing 1 enemy.", 30, 'https://prts.wiki/images/thumb/c/c5/LS-5_%E6%AD%BC%E7%81%AD%E6%88%98%E6%BC%94%E4%B9%A0_%E5%9C%B0%E5%9B%BE.png//600px-LS-5_%E6%AD%BC%E7%81%AD%E6%88%98%E6%BC%94%E4%B9%A0_%E5%9C%B0%E5%9B%BE.png', contributors[0], callback)
    },
    function(callback) {
      createStage('4-6', 'Ignorance\nUnknown creatures infected with Oripathy have been found on the battlefield. They deal massive damage to nearby Operators when they die.\nIn addition, please look out for Heated Paths. They emit burning gas.\n[Heated Path] Deals massive damage to Operators and enemies on it at intervals.',18, 'https://prts.wiki/images/thumb/3/3b/4-6_%E5%B0%91%E8%A7%81%E5%A4%9A%E6%80%AA_%E5%9C%B0%E5%9B%BE.png/600px-4-6_%E5%B0%91%E8%A7%81%E5%A4%9A%E6%80%AA_%E5%9C%B0%E5%9B%BE.png', contributors[0], callback)
    },
    function(callback) {
      createStage('7-18', "Death of a Patriot\nThey are commanded by the 'Aegis' of the Infected. The most ancient bloodline among the warriors of Sarkaz. Ursus's indomitable incarnation of war. The backbone of the Reunion Movement. Yelena's father.\n[Originium Altar] Periodically emits Pulse Waves to the surrounding tiles, damaging both allied and enemy units.\n[Interference Mine]Upon explosion, deals heavy damage to enemies in the surrounding tiles and amplifies the damage they take for 15 seconds.", 21, false, contributors[1], callback )
    }
  ], cb)
}

const newMaterial = function(cb) {
  async.parallel([
    function(callback) {
      createMaterial('Orirock Concentration', 'A refined matter produced with Orirock Cluster. Can be used for a variety of upgrades and the synthesis of Polymerization Preparation.', 'This Orirock looks different from the raw material after the refinement process. It costs much more than other processing methods. Anyone who has seen the smooth cutting surface will be amazed. That must be the charm of combining nature with industry.','https://prts.wiki/images/c/c8/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%8F%90%E7%BA%AF%E6%BA%90%E5%B2%A9.png', stages[1], contributors[1], callback)
    },
    function(callback) {
      createMaterial('Strategic Battle Record', 'A device that stores battle videos. Gives Operators a huge amount of EXP. Total EXP: 2000.', "In such a hostile environment, every operation has the potential for a loss of life. We may be able to save more people if we are well prepared.\nComes with a collector's edition, a HD version, an HD remastered version, an Enhanced edition, a Director's cut edition, an Annual Gold edition...", 'https://prts.wiki/images/6/66/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E9%AB%98%E7%BA%A7%E4%BD%9C%E6%88%98%E8%AE%B0%E5%BD%95.png', stages[0], contributors[0], callback)
    }
  ], cb)
}

async.series([
  newContributor,
  newStage,
  newMaterial
],
// Optional callback
function(err, results) {
  if (err) {
      console.log('FINAL ERR: '+err);
  }
  else {
      console.log('ASDF: '+ materials);   
  }
  mongoose.connection.close();
});

