var Model = require('../model/model');
const path = require('path');
const fs = require('fs');
var endoscopyDirectoryPath;

var mongoose = require('mongoose');
var db = mongoose.connection;
var Schema = mongoose.Schema;
var dbUrl = 'mongodb://localhost:27017/endoscopy';

var spawn = require('child_process').spawn;

var tests = Model.Test(Schema, mongoose);
var testRecord = Model.TestRecord(Schema,mongoose);

db.on('error', function () {
    console.log('there was an error communicating with the database');
});
mongoose.connect(dbUrl,{ useFindAndModify: false }, function (err) {
    if (err) {
        return console.log('there was a problem connecting to the database!' + err);
    }
});

exports.test_list = function(req, res) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    tests.find({}).exec(function(err, results) {
        if (err) {
            res.send(err);
        }
// Respond with valid data
        res.send(results);
    });
};

exports.test_add = function(req, res)  {
    console.log(req.body)
    var test = new tests();

    tests.findOne({test_name: req.body.test_name},function(err,docs){
        if(err)
        {
            res.status(500).send('Error Occurred')}
        else {
            if(docs){
                res.status(500).send(doc+'Test Already Exists')
            }
            else{
                test.test_name= req.body.test_name,
                test.test_description= req.body.test_description,
                test.bill=req.body.bill,
                test.test_time=req.body.test_time,
                test.test_frequency=req.body.test_frequency

                test.save(function(err,user){
                    if(err){
                        res.status(500).send('Error in DB1')
                    }
                    else{
                        res.send("Test Added successfully")
                    }
                })
            }
        }
    })
} 

exports.test_delete = function(req, res) {
    tests.deleteOne({test_name:req.body.test_name}).exec(function(err,data) {
        if (err) {
            return next(err);
        }
        else{
            res.send("Deleted successfully:--- ");
        }
    })
};

exports.test_edit = function(req, res) {
    tests.findOneAndUpdate({
        test_name: req.body.test_name
    },{
        test_name: req.body.test_name,
        test_description: req.body.test_description,
        bill: req.body.bill,
        test_time:req.body.test_time,
        test_frequency:req.body.test_frequency

    },{new:true},function(error, results) {
        if (error) {
            console.log(req.body.test_name +" Does not exist\n");
            return next(error);
        }else {
            res.send(results);
        }
        ;
    });
}

exports.test_detail = function(req, res) {
    tests.find({
        test_name: req.body.test_name
    }).populate('Test').exec(function (error, results) {
        if (error) {
            return next(error);
        }
// If valid user was not found, send 404
        if (!results) {
            res.send(404);
        }
        else{
// Respond with valid data
                res.json(results);
            }
        });
    }


    exports.performEndoscopy = function(req, res) {
        var lesionPercentage="";
        // console.log(req.body.email)
        var child = spawn('python',['E:/Studies/Wireless capsule endoscopy for shifa international hospital/python endoscopy/Red Lesion Dataset/Set 1/testing.py',req.body.email])
        child.stdout.setEncoding('utf8');
        child.stdout.on('data', function(data) {
            if(!isNaN(data)){
            lesionPercentage=""+data;
            console.log(lesionPercentage)
            testrecord=new testRecord({
                email:req.body.email,
                test_name:"Wireless Capsule Endoscopy",
                lesionPercentage:lesionPercentage
            })
            testrecord.save((err,docs)=>{
                if(!err){
                    console.log("Inserted");
                }
            }) }
            return null
        });
        console.log(lesionPercentage);
        
        child.stderr.setEncoding('utf8');
        child.stderr.on('data', data=>{
            console.log("stderr")
            console.log(data);
            return null
        })

                child.err.on('data',function(data){
            console.log(data)
            return null
        })

        child.on('close', function(code) {
            // testrecord=new testRecord({
            //     email:req.body.email,
            //     test_name:"Wireless Capsule Endoscopy",
            //     lesionPercentage:lesionPercentage
            // })
            // testrecord.save((err,docs)=>{
            //     if(!err){
            //         console.log("Inserted");
            //     }
            // })
            //Here you can get the exit code of the script
        
            console.log('closing code: ' + code);
        
            console.log('Full output of script: ',scriptOutput);
            return null
        });
    }

    exports.getEndoscopyResult = function(req, res) {
        
        testRecord.find({
            email: req.body.email,
        }).exec(function (error, results) {
            if (error) {
                return next(error);
            }
    // If valid user was not found, send 404
            if (!results) {
                res.send(404);
            }
            else if(results){
                // console.log(results)
    // Respond with valid data
            var images=[];
            endoscopyDirectoryPath= path.join("E:/Studies/Wireless capsule endoscopy for shifa international hospital/Backend server/endoscopy/assets/", req.body.email);
            fs.readdir(endoscopyDirectoryPath, function (err, files) {
                //handling error
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                } 
                //listing all files using forEach
                files.forEach(function (file) {
                    // Do whatever you want to do with the file
                    images.push("http://localhost:3000/assets/"+req.body.email+"/"+file);
                });
                
                res.send({"result":results,"images":images})
            });
                        }
            });
        
    }