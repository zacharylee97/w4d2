const settings = require("./settings");
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

function searchForName(query) {
  if (query) {
    console.log('Searching...');
    knex.select().from('famous_people').where('first_name', query).orWhere('last_name', query)
    .asCallback(function(err, rows) {
      if (err) return console.error(err);
      const output = formatResults(rows);
      console.log(output);
      knex.destroy();
    });
  } else {
    console.log("Please enter a name!");
  }
}

function formatResults(results) {
  let output = "";
  const numOfResults = results.length;
  output += `Found ${numOfResults} person(s) by the name '${query}'\n`;
  let counter = 1;
  results.forEach(function(element, index) {
    const firstName = element['first_name'];
    const lastName = element['last_name'];
    const DOB = element['birthdate'].toISOString().substring(0,10);
    output += `- ${counter}: ${firstName} ${lastName}, born '${DOB}'`;
    if (index != numOfResults - 1) {
      output += "\n";
    }
    counter++;
  });
  return output;
}

const query = process.argv[2];
searchForName(query);