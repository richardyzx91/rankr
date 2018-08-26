const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;

var runningBacks = ["Todd Gurley", "Leveon Bell", "Alvin Kamara", "Ezekiel Elliot"];
var wideReceivers = ["Antonio Brown", "Odell Beckham", "Deandre Hopkins", "Julio Jones"];
var tightEnds = ["Rob Gronkowski", "Zach Ertz", "Travis Kelce", "Trey Burton"];
var quarterbacks = ["Aaron Rodgers", "Russell Wilson", "Deshaun Watson", "Cam Newton"];


app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/data', (req, res, next) => {
    //Submitted data is available in req.body
    res.json({
        rb: runningBacks,
        wr: wideReceivers,
        tw: tightEnds, 
        te: quarterbacks
    });
    res.end();
});

app.listen(port, () => console.log(`Server started on port ${port}`));