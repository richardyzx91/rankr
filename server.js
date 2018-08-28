const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const csv = require('fast-csv');
const fs = require('fs');
const multer = require('multer');
const assert = require('assert');

const port = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient;

const mongoUrl = 'mongodb://richardyzx91:admin1@ds133202.mlab.com:33202/rankrdatabase';

const upload = multer({dest: "/tmp/csv"});

const getRankings = (db, callback) => {
    db.collection('players')
    .find({})
    .toArray((err, docs) => {
        assert.equal(err, null);
        callback(docs);
    });
};

const updateRankings = (db, position, updateList, callback) => {
    db.collection('players')
    .updateOne({"position": position}, {$set: {"list": updateList}}, (err, result) => {
        assert.equal(err, null);
        callback(result);
    })
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/upload-csv", router);

//app.use('/', router);

app.post("/upload-csv", upload.single('file'), (req, res) => {
    var fileRows = [];
    console.log("We are in the csv upload method on server");

    var stream = fs.createReadStream(req.file.path);
    csv.fromStream(stream, {headers: ["player", , , , , , , ,]})
        .on("data", (data) => {
            fileRows.push(data);
        })
        .on("end", () => {
            const position = fileRows[0].player;
            const list = [];

            for(var i = 1; i < fileRows.length; i++){
                list.push(fileRows[i].player);
            }

            console.log(position);
            console.log(list);

            MongoClient.connect(mongoUrl, (err, client) => {
                assert.equal(null, err);
            
                const db = client.db("rankrdatabase");
                
                updateRankings(db, position, list, () => {
                    client.close();
                });
            });
            
            fs.unlinkSync(req.file.path);
        });
});

app.put('/data', (req,res) => {
    const position = req.body.position;
    const list = req.body.list;

    MongoClient.connect(mongoUrl, (err, client) => {
        assert.equal(null, err);
    
        const db = client.db("rankrdatabase");
        
        updateRankings(db, position, list, () => {
            client.close();
        });
    });
});

app.get('/data', (req, res) => {
    MongoClient.connect(mongoUrl, (err, client) => {
        assert.equal(err, null);
    
        const db = client.db("rankrdatabase");
        
        getRankings(db, (docs) => {
            var rb = [];
            var wr = [];
            var te = [];
            var qb = [];

            for(var i = 0; i < docs.length; i++){
                if(docs[i].position == "rb")
                    rb = docs[i].list;
                else if(docs[i].position == "wr") 
                    wr = docs[i].list;
                else if(docs[i].position == "te") 
                    te = docs[i].list;
                else //docs[i].position == "qb"
                    qb = docs[i].list;
            }

            console.log(rb);
            console.log(wr);
            console.log(te);
            console.log(qb);

            res.json({
                "rb": rb,
                "wr": wr,
                "te": te, 
                "qb": qb
            });

            client.close();
        });
    });
});

app.listen(port, () => console.log(`Server started on port ${port}`));