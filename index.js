require('dotenv').config()

const BLUMEA_ADMIN_ID = process.env.BLUMEA_ADMIN_ID

const testBlumeaId = (Id)=>{
    return Id === BLUMEA_ADMIN_ID ? "Valid Admin ID" : "Invalid Admin ID"
}

module.exports = testBlumeaId