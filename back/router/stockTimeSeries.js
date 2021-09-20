const { baseURL, router, axios, apiKey, successLog, failLog } = require("../util/common");

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
            const tsiData = data[`Time Series (${interval})`];
            successLog("GET", "time-series-intraday-data");
            res.status(200).json({
                result:"SUCCESS",
                data:[...Object.keys(tsiData).map(time => ({
                        "time":time,
                        "open":tsiData[time]["1. open"],
                        "high":tsiData[time]["2. high"],
                        "low":tsiData[time]["3. low"],
                        "close":tsiData[time]["4. close"],
                        "volume":tsiData[time]["5. volume"]
                }))]
            });
        }else{
            failLog("GET", "time-series-intraday-data")
            res.status(400).json({
                result:"FAIL",
                error:"Invalid API call"
            });
        }
    }catch(e){
        res.status(400).json({ result:"FAIL", error:e });
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
        if(!data["error"]){
            const tokenizedData = data.split("\r\n"); tokenizedData.pop();
            if(tokenizedData.length > 1){
                const keyVal = tokenizedData[0].split(','); tokenizedData.shift();
                successLog("GET", "time-series-intraday-data-extended-history");
                res.status(200).json({
                    result:"SUCCESS",
                    data:tokenizedData.map(e => {
                        const obj = {}; e = e.split(',');
                        for(let index = 0; index < e.length; index++){
                            obj[keyVal[index]] = e[index];
                        }
                        return obj;
                    })
                });
                res.end();
                return;
            }
        }
        failLog("GET", "time-series-intraday-data-extended-history");
        res.status(400).json({
            RESLUT:"FAIL",
            ERROR:"Invalid API call"
        });
    }catch(e){
        res.status(400).json({ RESLUT:"FAIL", ERROR:e });
    }
    res.end();
});

module.exports = router;