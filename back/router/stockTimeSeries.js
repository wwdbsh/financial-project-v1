const { baseURL, router, axios, apiKey, successLog, failLog } = require("../util/common");

router.get('/', function(req, res) {
    res.send("stock time series");
    res.end();
});

/*
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

/*
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

/*
 * SYMBOL: ticker e.g. AAPL, IBM, MSFT
 * OUTPUTSIZE: in (compact, full)
 */
router.get("/time-series-daily", async (req, res) => {
    const symbol = req.body.SYMBOL;
    const outputsize = req.body.OUTPUTSIZE;
    const url =
     `${baseURL}?function=TIME_SERIES_DAILY&` +
     `symbol=${symbol}&` +
     `outputsize=${outputsize}&` +
     `apikey=${apiKey}`
     ;
    try{
        const { data } = await axios.get(url);
        if(data["Time Series (Daily)"]){
            const tsdData = data["Time Series (Daily)"];
            successLog("GET", "time-series-daily");
            res.status(200).json({
                result:"SUCCESS",
                data:[...Object.keys(tsdData).map(time => ({
                        "time":time,
                        "open":tsdData[time]["1. open"],
                        "high":tsdData[time]["2. high"],
                        "low":tsdData[time]["3. low"],
                        "close":tsdData[time]["4. close"],
                        "volume":tsdData[time]["5. volume"]
                }))]
            });
        }else{
            failLog("GET", "time-series-daily")
            res.status(400).json({
                result:"FAIL",
                error:"Invalid API call"
            });
        }
    }catch(e){
        res.status(400).json({ RESLUT:"FAIL", ERROR:e });
    }
    res.end();
});

/*
 * SYMBOL: ticker e.g. AAPL, IBM, MSFT
 * OUTPUTSIZE: in (compact, full)
 */
router.get("/time-series-daily-adjusted", async (req, res) => {
    const symbol = req.body.SYMBOL;
    const outputsize = req.body.OUTPUTSIZE;
    const url =
     `${baseURL}?function=TIME_SERIES_DAILY_ADJUSTED&` +
     `symbol=${symbol}&` +
     `outputsize=${outputsize}&` +
     `apikey=${apiKey}`
     ;
    try{
        const { data } = await axios.get(url);
        if(data["Time Series (Daily)"]){
            const tsdData = data["Time Series (Daily)"];
            successLog("GET", "time-series-daily-adjusted");
            res.status(200).json({
                result:"SUCCESS",
                data:[...Object.keys(tsdData).map(date => ({
                        "date":date,
                        "open":tsdData[date]["1. open"],
                        "high":tsdData[date]["2. high"],
                        "low":tsdData[date]["3. low"],
                        "close":tsdData[date]["4. close"],
                        "adjusted-close":tsdData[date]["5. adjusted close"],
                        "volume":tsdData[date]["6. volume"],
                        "dividend-amount":tsdData[date]["7. dividend amount"],
                        "split-coefficient":tsdData[date]["8. split coefficient"]
                }))]
            });
        }else{
            failLog("GET", "time-series-daily-adjusted")
            res.status(400).json({
                result:"FAIL",
                error:"Invalid API call"
            });
        }
    }catch(e){
        res.status(400).json({ RESLUT:"FAIL", ERROR:e });
    }
    res.end();
});

/*
 * SYMBOL: ticker e.g. AAPL, IBM, MSFT
 */
router.get("/time-series-weekly", async (req, res) => requestTimeSeriesData(req, res, "TIME_SERIES_WEEKLY", "Weekly Time Series", "time-series-weekly"));
router.get("/time-series-weekly-adjusted", async (req, res) => requestTimeSeriesAdjustedData(req, res, "TIME_SERIES_WEEKLY_ADJUSTED", "Weekly Adjusted Time Series", "time-series-weekly-adjusted"));
router.get("/time-series-monthly", async (req, res) => requestTimeSeriesData(req, res, "TIME_SERIES_MONTHLY", "Monthly Time Series", "time-series-monthly"));
router.get("/time-series-monthly-adjusted", async (req, res) => requestTimeSeriesAdjustedData(req, res, "TIME_SERIES_MONTHLY_ADJUSTED", "Monthly Adjusted Time Series", "time-series-monthly-adjusted"));

const requestTimeSeriesData = async (req, res, func, key, endpoint) => {
    const symbol = req.body.SYMBOL;
    const url =
     `${baseURL}?function=${func}&` +
     `symbol=${symbol}&` +
     `apikey=${apiKey}`
     ;
    try{
        const { data } = await axios.get(url);
        if(data[key]){
            const tsdData = data[key];
            successLog("GET", endpoint);
            res.status(200).json({
                result:"SUCCESS",
                data:[...Object.keys(tsdData).map(date => ({
                        "date":date,
                        "open":tsdData[date]["1. open"],
                        "high":tsdData[date]["2. high"],
                        "low":tsdData[date]["3. low"],
                        "close":tsdData[date]["4. close"],
                        "volume":tsdData[date]["5. volume"]
                }))]
            });
        }else{
            failLog("GET", endpoint)
            res.status(400).json({
                result:"FAIL",
                error:"Invalid API call"
            });
        }
    }catch(e){
        res.status(400).json({ RESLUT:"FAIL", ERROR:e });
    }
    res.end();
};

const requestTimeSeriesAdjustedData = async (req, res, func, key, endpoint) => {
    const symbol = req.body.SYMBOL;
    const url =
     `${baseURL}?function=${func}&` +
     `symbol=${symbol}&` +
     `apikey=${apiKey}`
     ;
    try{
        const { data } = await axios.get(url);
        if(data[key]){
            const tsdData = data[key];
            successLog("GET", endpoint);
            res.status(200).json({
                result:"SUCCESS",
                data:[...Object.keys(tsdData).map(date => ({
                        "date":date,
                        "open":tsdData[date]["1. open"],
                        "high":tsdData[date]["2. high"],
                        "low":tsdData[date]["3. low"],
                        "close":tsdData[date]["4. close"],
                        "adjusted-close":tsdData[date]["5. adjusted close"],
                        "volume":tsdData[date]["6. volume"],
                        "dividend-amount":tsdData[date]["7. dividend amount"],
                        "split-coefficient":tsdData[date]["8. split coefficient"]
                }))]
            });
        }else{
            failLog("GET", endpoint)
            res.status(400).json({
                result:"FAIL",
                error:"Invalid API call"
            });
        }
    }catch(e){
        res.status(400).json({ RESLUT:"FAIL", ERROR:e });
    }
    res.end();
};

module.exports = router;