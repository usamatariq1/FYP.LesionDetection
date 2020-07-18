function PatientLog(Schema, mongoose) {

    var TheSchema = new Schema({
        email:String,
        test_name: String,
        date: String
    });
    try {
        if (mongoose.model('PatientLog')) return mongoose.model('PatientLog');
    } catch(e) {
        if (e.name === 'MissingSchemaError') {
                return mongoose.model('PatientLog', TheSchema);
        }
        }
}


function TestAppointment(Schema, mongoose) {

    var TheSchema = new Schema({
        email: String,
        date: String,
        time: String,
        test_name:String,
    });

    try {
        if (mongoose.model('TestAppointment')) return mongoose.model('TestAppointment');
    } catch(e) {
        if (e.name === 'MissingSchemaError') {
                return mongoose.model('TestAppointment', TheSchema);
        }
        }
}

function Test(Schema, mongoose) {

    var TheSchema = new Schema({
        test_name: String,
        test_description: String,
        bill:String,
        test_time:String,
        test_frequency:Number
    });
    try {
        if (mongoose.model('Test')) return mongoose.model('Test');
    } catch(e) {
        if (e.name === 'MissingSchemaError') {
                return mongoose.model('Test', TheSchema);
        }
        }
}

function TestRecord(Schema, mongoose) {

    var TheSchema = new Schema({
        email: String,
        test_name: String,
        lesionPercentage: String
    });
    try {
        if (mongoose.model('TestRecord')) return mongoose.model('TestRecord');
    } catch(e) {
        if (e.name === 'MissingSchemaError') {
                return mongoose.model('TestRecord', TheSchema);
        }
        }
}


module.exports.PatientLog = PatientLog;
module.exports.TestAppointment = TestAppointment;
module.exports.Test = Test;
module.exports.TestRecord = TestRecord;