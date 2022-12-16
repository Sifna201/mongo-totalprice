var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
const { ObjectId } = require("mongodb")
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://127.0.0.1:27017', async (err, client) => {
  //if (err) throw err;
  console.log("connected")
  const db = client.db("products")
  /* GET home page. */
  router.post('/', async function (req, res, next) {
    const data = req.body
    console.log(data)
    console.log(data[1].qty)
    var total = 0;
    for (let i = 0; i < data.length; i++) {
      const product = await db.collection("product_collection").find({ _id: { $in: [ObjectId(data[i].id)] } }).toArray()


      var rate = product[0].rate
      console.log(rate)
      var qty=data[i].qty

      



      const subTotal = rate* qty;

      total += subTotal;
      
    }
    var date=new Date()
    console.log(date)
    console.log(total)
   await db.collection("total").insertOne({"total":total,
                                            "date":date})
    const startDate=new Date("2022-11-09") 
    const endDate=new Date("2022-12-16")   
    var dateView=await db.collection("total").find({
      date:{
        $gte:startDate,
        $lt:endDate
      }
    }).toArray()
    console.log(dateView)
    // var   totalWithDate=0
    // for(let i=0;i<dateView.length;i++){
    //   //console.log(dateView[i].total)
    //   totalWithDate +=dateView[i].total
    // }
   // console.log(totalWithDate)
  const  totalAll=await db.collection("total").aggregate(
    [{ $match : { 
    date:{
      $gte:startDate,
      $lt:endDate
    }}},
   {$group:
          {
            _id: { year: { $year: "$date" } },
            totalAmount: { $sum: "$total" },
            count: { $sum: 1 }
          }
      }
    
    ]
 ).toArray()
   console.log(totalAll)
    res.send({"total":total,
                 "dateArray":dateView,
                 "totalAll":totalAll
                 })                                
    //res.send(total.toString());
  });
});

module.exports = router;
