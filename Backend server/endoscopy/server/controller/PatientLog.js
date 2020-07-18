var Model  = require('../model/model');
var appointment_controller = require('../controller/TestAppointment');

var mongoose = require('mongoose');
var db = mongoose.connection;
var Schema = mongoose.Schema;
var dbUrl = 'mongodb://localhost:27017/endoscopy';

db.on('error', function () {
    console.log('there was an error communicating with the database');
});
mongoose.connect(dbUrl, { useFindAndModify: false },function (err) {
    if (err) {
        return console.log('there was a problem connecting to the database!' + err);
    }
});

var pat_log = Model.PatientLog(Schema, mongoose);
var test_app = Model.TestAppointment(Schema, mongoose);

exports.patientLog_add = function(req, res) {
    var logInfo;

    test_app.find({
        email:req.body.email,test_name:req.body.test_name
    }).populate('Test Appointment').exec(function (error, results) {
        if (error) {
            return next(error);
        }
        else{
            logInfo=results
            var log = new pat_log();

            log.email=req.body.email;
            log.test_name = req.body.test_name;
            log.date = logInfo[0].date;
            log.save(function(err,data){
                if(err){
                    res.status(500).send('Error')
                }
                else if(data){
                    test_app.deleteOne({email:req.body.email,test_name:req.body.test_name}).exec(function(err,data) {
                        if (err) {
                            console.log("Error while deleting")
                            return res.send(err);
                        }
                        else if(data){
                            console.log("Appointment deleted")
                            console.log(data)
                            return res.send(data);
                        }
                    })
                }
            })
            }
        });
    
}

exports.log_detail = function(req, res) {
    pat_log.find({
        email:req.body.email
    }).populate('Patient Log').exec(function (error, results) {
        if (error) {
            return next(error);
        }
// If valid user was not found, send 404
        if (!results) {
            res.send(404);
        }
        else{
// Respond with valid data
            res.send(results);
        }
    });
}
        
