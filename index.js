const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const app = express();
const request = require("request");
const port = 7000

function string(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
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

app.get("/:url", (req, res) => {
  const video_url = req.params.url;
  const filename = `/${string(16)}.mp3`;
  convert(video_url,filename,(err) => {
    if(!err){
      console.log('Conversion successfull');
      const protocol = req.protocol;
    const host = req.hostname;
    const url = req.originalUrl;
   // const port = process.env.PORT || PORT;

    const fullUrl = `${protocol}://${host}:${url}/${filename}`
      const arr = new Array();
      arr.push({'ok': true});
      arr.push({'src': fullUrl});
      res.end(JSON.stringify(arr));
    }else{
      console.log(err)
    }
  })
});

app.listen(port,(error) => {
  if(error){
    console.log('Error running application');
  }else{
    console.log(`Server running at ${port}`)
  }
})
