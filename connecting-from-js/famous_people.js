const pg = require("pg");
const settings = require("./settings");

const client = new pg.Client({
  user: settings.user,
  password: settings.password,
  database: settings.database,
  host: settings.host,
  port: settings.port,
  ssl: settings.ssl
});

function searchForName(query) {
  if (query) {
    //Connect to database
    console.log("Searching...");
    client.connect((err) => {
      if (err) {
        return console.error("Connection Error", err);
      }
      //Search for match with first_name or last_name
      client.query("SELECT * FROM famous_people WHERE first_name = $1::text OR last_name = $1::text", [query], (err, result) => {
        if (err) {
          return console.err("error running query", err);
        }
        //Format results
        const output = formatResults(result.rows);
        console.log(output);
      client.end();
      });
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
