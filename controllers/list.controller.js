const List = require('../model/List.js');

exports.create = (req, res) => {
    if(!req.body.content){
        return res.status(400).send({ message: "List cannot be empy" });
    }

    const list = new List({
        position: req.body.position,
        list: req.body.list
    });

    list.save().then(data => {res.send(data)});
};

exports.findAll = (req, res) => {
    List.find().then(data => res.send(data));
};

exports.findOne = (req, res) => {
    List.findOne({position: req.params.position})
    .then(data => {
        if(!data){
            return res.status(404).send({message: "List not found with position " + req.params.position});
        }
        else res.send(data);
    });
};

exports.update = (req, res) => {
    List.findByIdAndUpdate(req.params.position, {
        position: req.body.position,
        list: req.body.list
    }, {new: true})
    .then(data => {
        res.send(data);
    })
};

exports.delete = (req, res) => {
    List.findByIdAndRemove(req.params.postion)
    .then(() => {
        res.send("Delete successful");
    });
};