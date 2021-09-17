module.exports = {
    baseURL:"https://www.alphavantage.co/query",
    router:require('express').Router(),
    axios:require("axios"),
    apiKey:process.env.ALPHA_API_KEY
};