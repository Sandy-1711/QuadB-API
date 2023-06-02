const express = require('express')
const dotenv = require('dotenv');
const app = express();
const Data = require('./models/Data');
const cors=require('cors')
dotenv.config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL).then(function () {
    console.log("connected to mongodb");
}).catch(function (err) {
    console.log(err);
})
app.use(cors({
    origin: 'http://localhost:3000',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  }));
app.use(express.json())
async function getData() {

    const data = await fetch('https://api.wazirx.com/api/v2/tickers')
    const response = await data.json();


    // console.log(response[i]);
    return (Object.values(response).slice(0, 10));


}
async function fetchData() {

    const arrayData = await getData();
    for (var i = 0; i < 10; i++) {
        const fetchedData = (arrayData[i]);
        const newDataObj = new Data({
            name: fetchedData.name,
            last: fetchedData.sell,
            buy: fetchedData.buy,
            sell: fetchedData.sell,
            volume: fetchedData.volume,
            base_unit: fetchedData.base_unit
        })
        await newDataObj.save();
        
    }
}
// fetchData();
app.get('/',async function (req, res) {
    const foundData=await Data.find();
    if(foundData)
    {
        res.status(200).json(foundData);
    }
    else
    {
        res.status(404).json("Error 404 Not Found")
    }
    

})
app.listen(5000, function () {
    console.log("Server running on port 5000");
})