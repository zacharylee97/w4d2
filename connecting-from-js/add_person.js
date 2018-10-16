const settings = require('./settings');
const knex = require('knex')({
  client: 'pg',
  connection: {
    user: settings.user,
    password: settings.password,
    database: settings.database,
    host: settings.host,
    port: settings.port,
    ssl: settings.ssl
  }
});

function addFamousPerson(firstName, lastName, DOB) {
  if (firstName && lastName && DOB) {
    //Find number of rows in db for id
    knex('famous_people').count('id').asCallback(function(err, count) {
      if (err) return console.error(err);
      const ID = parseInt(count[0]['count']) + 1;
      //Insert famous person data into db
      knex.insert({'id': ID, 'first_name': firstName, 'last_name': lastName, 'birthdate': DOB}).into('famous_people').asCallback(function(err, count) {
        if (err) return console.error(err);
        console.log(`Added ${firstName} ${lastName}!`);
        knex.destroy();
      });
    });
  } else {
    console.log("Please input first name, last name and birth date!")
  }
}

const firstName = process.argv[2];
const lastName = process.argv[3];
const DOB = process.argv[4];
addFamousPerson(firstName, lastName, DOB);