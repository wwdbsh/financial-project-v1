const express = require('express');
const router = express.Router();
const request = require("request");

router.get('/', function(req, res) {
    res.send("stock time series");
    res.end();
});

router.get("/time-series-intraday-data", (req, res) => {
    // const symbol = req.body.SYMBOL;
    // const interval = req.body.INTERVAL;
    // const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}min&apikey=${api_key}`;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AFRM&interval=1min&apikey=${api_key}`;

    request.get({
        url,
        json:true,
        headers:{"User-Agent":"request"}
    }, (err, res, data) => {
        if(err){
            console.log("Error: ", err);
        }else if(res.statusCode !== 200){
            console.log("Status: ", res.statusCode);
        }else{
            console.log(data);
        }
    });
    res.end();
});

module.exports = router;