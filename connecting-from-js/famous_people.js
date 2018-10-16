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

const name = process.argv[2];
if (name) {
  console.log("Searching...");
  client.connect((err) => {
    if (err) {
      return console.error("Connection Error", err);
    }
    //Search for matching first name
    client.query("SELECT * FROM famous_people WHERE first_name = $1::text OR last_name = $1::text", [name], (err, result) => {
      if (err) {
        return console.err("error running query", err);
      }
      console.log(result.rows);
    client.end();
    });
  });
} else {
  console.log("Please enter a name!");
}