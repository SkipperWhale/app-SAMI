const jwt = require('jsonwebtoken');
const fs = require('fs');
//definisce lla durata del token e l'algoritmo utilizzato
const options = { expiresIn: '100s', algorithm: 'RS256' };

//verifica che l'utente sia loggato
function verifyToken(req,res,next) {
    const token = req.cookies.token;
    const options = { expiresIn: '100s', algorithm: 'RS256' };
    if (!token) return res.status(200).redirect('/login'); //nessun token foornito dal client
    try {
        const pub_key = fs.readFileSync('rsa.public');
        req.user = jwt.verify(token, pub_key, options);
        next();
    } catch (err) {
        return res.status(200).redirect('/login');//Il token non è valido oppure è scaduto
    }
}

//genera il token
function signToken(req,res,next) {
    const payload = { user: req.body.username, isAdmin: false, isLogged: true };
    const cookieSetting = {
        expires: new Date(Date.now() + 1e5),
        httpOnly: true,
        secure: false
    };
    const prv_key = fs.readFileSync('rsa.private');
    const token = jwt.sign(payload, prv_key, options);
    res.cookie('token', token, cookieSetting);
    next();
}

//elimina il token
function deleteToken(req,res,next) {
    const cookieSetting = {
        expires: new Date(0),
        httpOnly: true,
        secure: false
    };
    console.log(req.cookies);
    res.cookie('token', '', cookieSetting);
    next();
}

module.exports = {
    verifyToken,
    signToken,
    deleteToken
}