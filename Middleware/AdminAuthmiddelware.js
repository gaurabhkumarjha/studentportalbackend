const jwt = require('jsonwebtoken');
const AdminSignup = require('../Models/Adminsignup');


// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
    const authorization = req.header('Authorization');

    if (!authorization) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    //console.log(authorization);
    const token = authorization.split(' ')[1]
    //console.log(token);


    try {

        const { _id } = jwt.verify(token, 'dsgcgdgcuggyfgewfgefgewc');
        // console.log(_id);
        req.user = await AdminSignup.findOne({ _id }).select('_id');
        // console.log( req.user);
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
}

module.exports = authenticateToken