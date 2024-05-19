const http = require("http");
const fs = require("fs");
require('dotenv').config();

var requests = require("requests");
const url = process.env.URL || 9000;


const file = fs.readFileSync("HOME.html", "utf-8");

const replaceval = (tempval, orgval) => {
  let temperature = tempval.replace("{%tempval%}", orgval.main.temp);
  temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
  temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
  temperature = temperature.replace("{%location%}", orgval.name);
  temperature = temperature.replace("{%country%}", orgval.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgval.weather[0].main);
  return temperature;
};

const server = http.createServer((req, res) => {
  if ((req.url = "/")) {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=jaunpur&appid=ffd967aa8d24e1e560a9e224412e42ff"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrdata = [objdata];

        const realtimedata = arrdata
          .map((val) => replaceval(file, val))
          .join("");
        res.write(realtimedata);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});
server.listen(url);
