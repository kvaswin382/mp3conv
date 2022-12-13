const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const app = express();
const request = require("request");
const fs = require("fs");
const http = require("http");
const port = 8000;

function string(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function convert(input, output, callback) {
  ffmpeg(input)
    .output(output)
    .on("end", function () {
      console.log("conversion ended");
      callback(null);
    })
    .on("error", function (err) {
      console.log("error: ", e.code, e.msg);
      callback(err);
    })
    .run();
}

app.get("/", (req, res) => {
  res.send("App is working");
});

app.get("/mp3", (req, res) => {
  try {
    const video_url = req.query.url;
    http.get(video_url, (res) => {
      const video_name = `/${string(24)}.mp4`;
      const file = fs.createWriteStream(video_name);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`File downloaded ${video_name}`);
      });
    });
    const filename = `/${string(16)}.mp3`;
    convert(video_url, filename, (err) => {
      if (!err) {
        console.log("Conversion successfull");
        const protocol = req.protocol;
        const host = req.hostname;
        const url = req.originalUrl;
        // const port = process.env.PORT || PORT;

        const fullUrl = `${protocol}://${host}:${url}/${filename}`;
        const arr = new Array();
        arr.push({ ok: true });
        arr.push({ src: fullUrl });
        res.send(JSON.stringify(arr));
      } else {
        console.log(err);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, (error) => {
  if (error) {
    console.log("Error running application");
  } else {
    console.log(`Server running at ${port}`);
  }
});
