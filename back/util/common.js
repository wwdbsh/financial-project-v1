module.exports = {
    baseURL:"https://www.alphavantage.co/query",
    router:require('express').Router(),
    axios:require("axios"),
    apiKey:process.env.ALPHA_API_KEY,
    successLog:(method, api) => console.log(`200 ${method} ${api} SUCCESS`),
    failLog:(method, api) => console.log(`400 ${method} ${api} FAIL`)
};