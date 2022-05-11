var express = require('express')
var bodyParser = require('body-parser')
var cors = require("cors");
const https = require('https');
const fs = require('fs')
var db_config = require(__dirname + '/config/database.js');
var conn = db_config.init();
db_config.connect(conn);

// express 는 함수이므로, 반환값을 변수에 저장한다.
var app = express()


app.use(cors());
app.use(bodyParser.urlencoded({extended:true})); 
app.use(bodyParser.json());



app.get("/map", (req, res) => {
    // console.log(req.query);
    let restaurant = req.query.restaurant;
    let livingAlone = req.query.livingAlone;
    let address = req.query.address;
    let name = req.query.name;
    let number = req.query.number;
    let recommend = req.query.recommend;
    let sql1 = "select exists (select id from data where name = ? and number = ? limit 1) as success";
    let params1 = [name, number];
    conn.query(sql1, params1, function(err1, rows1, fields1){
        if(err1){
            console.log(err1)
            throw err1;
        }
        else{
            if(rows1[0].success == 0){
                let sql0 = "INSERT INTO data VALUES (id, ?, ?, ?, ?, ?, ?, ?)";
                let params0 = [name, number, recommend, address, livingAlone, restaurant, 'false'];
                conn.query(sql0, params0, function(err0, rows0, fields0){
                    if(err0){
                        console.log(err0);
                        throw err0;
                    }
                    else{
                        let params = ['true']
                        let sql = "select * from data where share = ?";
                        conn.query(sql, params, function(err, rows, fields){
                            if(err){
                                console.log(err)
                                throw err;
                            }
                            else{
                                // console.log(rows);
                                // console.log(rows.length);
                                res.json({
                                    num: rows.length.toString(),
                                    exist: rows1[0].success.toString()
                                });
                            }
                        })
                    }
                })
            }
            else{
                let params = ['true']
                let sql = "select * from data where share = ?";
                conn.query(sql, params, function(err, rows, fields){
                    if(err){
                        console.log(err)
                        throw err;
                    }
                    else{
                        // console.log(rows);
                        // console.log(rows.length);
                        res.json({
                            num: rows.length.toString(),
                            exist: rows1[0].success.toString()
                        });
                    }
                })
            }
        }
    })


    // let sql1 = "INSERT INTO data VALUES (id, ?, ?, ?, ?, ?, ?, ?)";
    // let params1 = [name, number, recommend, address, livingAlone, restaurant, 'false'];
    // conn.query(sql1, params1, function(err1, rows1, fields1){
    //     if(err1){
    //         console.log(err1)
    //         throw err1;
    //     }
    //     else{
    //         let sql0 = "select exists (select id from data where name = ? and number = ? limit 1) as success";
    //         let params0 = [name, number]
    //         conn.query(sql0, params0, function(err0, rows0, fields0){
    //             if(err0){
    //                 console.log(err0)
    //                 throw err0;
    //             }
    //             else{
    //                 let params = ['true']
    //                 let sql = "select * from data where share = ?";
    //                 conn.query(sql, params, function(err, rows, fields){
    //                     if(err){
    //                         console.log(err)
    //                         throw err;
    //                     }
    //                     else{
    //                         // console.log(rows);
    //                         // console.log(rows.length);
    //                         console.log(rows0.success)
    //                         res.json({
    //                             num: rows.length.toString(),
    //                             exist: rows0[0].success.toString()
    //                         });
    //                     }
    //                 })
    //             }
    //         })
    //     }
    // })  
})

app.get("/share", (req, res) => {
    let name = req.query.name;
    let number = req.query.number;
    let params0 = ['true', name, number];
    let sql0 = "update data set share = ? where name = ? and number = ?";
    conn.query(sql0, params0, function(err0, rows0, fields0){
        if(err0){
            console.log(err0)
            throw err0;
        }
        else{
            // console.log(rows0)
            let params = ['true']
            let sql = "select * from data where share = ?";
            conn.query(sql, params, function(err, rows, fields){
                if(err){
                    console.log(err)
                    throw err;
                }
                else{
                    // console.log(rows.length)
                    res.send(rows.length.toString())
                }
            })
        }
    })
})

// app.listen(8080, function() {
//     console.log("start! express server on port 8080")
// })
const options = {

    ca: fs.readFileSync('/etc/letsencrypt/live/www.snubaedalgeek.com/fullchain.pem'),
  
    key: fs.readFileSync('/etc/letsencrypt/live/www.snubaedalgeek.com/privkey.pem'),
  
    cert: fs.readFileSync('/etc/letsencrypt/live/www.snubaedalgeek.com/cert.pem')
  
  };
https.createServer(options, app).listen(8080);