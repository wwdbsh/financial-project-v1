const express = require('express');
const router = express.Router();
const axios = require("axios");

router.get('/', function(req, res) {
    res.send("stock time series");
    res.end();
});

router.get("/time-series-intraday-data", async (req, res) => {
    const symbol = req.body.SYMBOL;
    const interval = req.body.INTERVAL;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}min&apikey=${api_key}`;
    
    const { data } = await axios.get(url);

    res.status(200).json({
        TIME_SERIES_DATA:data[`Time Series (${interval}min)`]
    });
    res.end();
});

module.exports = router;