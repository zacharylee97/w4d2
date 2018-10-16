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

const query = process.argv[2];
if (query) {
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
      const numOfResults = result.rows.length;
      console.log(`Found ${numOfResults} person(s) by the name '${query}'`)
      let counter = 1;
      //Format results
      result.rows.forEach(function(element) {
        const firstName = element['first_name'];
        const lastName = element['last_name'];
        const DOB = element['birthdate'].toISOString().substring(0,10);
        console.log(`- ${counter}: ${firstName} ${lastName}, born '${DOB}'`);
        counter++;
      });

    client.end();
    });
  });
} else {
  console.log("Please enter a name!");
}