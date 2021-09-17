const { baseURL, router, axios, apiKey } = require("../util/common");
const { StringStream } = require("scramjet");

router.get('/', function(req, res) {
    res.send("stock time series");
    res.end();
});

/**
 * SYMBOL: ticker e.g. AAPL, IBM, MSFT
 * INTERVAL: in (1min, 5min, 15min, 30min, 60min)
 */
router.get("/time-series-intraday-data", async (req, res) => {
    const symbol = req.body.SYMBOL;
    const interval = req.body.INTERVAL;
    const url =
     `${baseURL}?function=TIME_SERIES_INTRADAY&` +
     `symbol=${symbol}&` +
     `interval=${interval}&` +
     `apikey=${apiKey}`
     ;
    
    try{
        const { data } = await axios.get(url);
        if(data[`Time Series (${interval})`]){
            res.status(200).json({
                RESULT:"SUCCESS",
                TIME_SERIES_DATA:data[`Time Series (${interval})`]
            });
        }else{
            res.status(400).json({
                RESLUT:"FAIL",
                ERROR:"Invalid API call"
            });
        }
    }catch(e){
        res.status(400).json({ RESLUT:"FAIL", ERROR:e });
    }
    res.end();
});

/**
 * SYMBOL: ticker e.g. AAPL, IBM, MSFT
 * INTERVAL: in (1min, 5min, 15min, 30min, 60min)
 * SLICE: in (year1month1, year1month2, year1month3, ..., year1month11, year1month12, year2month1, year2month2, year2month3, ..., year2month11, year2month12)
 */
router.get("/time-series-intraday-data-extended-history", async (req, res) => {
    const symbol = req.body.SYMBOL;
    const interval = req.body.INTERVAL;
    const slice = req.body.SLICE;
    const url =
     `${baseURL}?function=TIME_SERIES_INTRADAY_EXTENDED&` +
     `symbol=${symbol}&` +
     `interval=${interval}&` +
     `slice=${slice}&` +
     `apikey=${apiKey}`
     ;
    try{
        const { data } = await axios.get(url);
        res.status(200).json({
            DATA:data
        });
    }catch(e){
        console.log(e);
    }
    res.end();
});

module.exports = router;