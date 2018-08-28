const express = require('express');
const lists = require('../controllers/list.controller.js');

const operations = (app) => {
    
    //Create
    app.post('/data', lists.create);

    //Read
    app.get('/data', lists.findAll);
    app.get('/data/:position', lists.findOne);

    //Update
    app.put('/data/:position', lists.update);

    //Delete
    app.delete('data/:position', lists.delete);
}


module.exports = operations;