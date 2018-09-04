const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let User = require('../models/user');

let registerSchema = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().trim().min(6)

});

let loginSchema = Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().trim().min(6)  
})

function createTokenResponse(user, res, next){
    const payload = {
        _id: user._id,
        email: user.email
    };

    jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: '1d'
    }, (err, token)=>{
        if(err){
            respondError422(res, next);
        }else{
            res.json({token});
        }
    });

}

function respondError422(res, next){
    res.status(422);
    const error =  new Error('Unable to login');
    next(error);
}

register = (req, res, next)=>{
    const result = Joi.validate(req.body, registerSchema);
    if(result.error === null){
        User.findOne({
            email: req.body.email 
        }).then(user => {
            if(user){
                const error = new Error('A user with that email already exist. Please choose a different email.');
                res.status(409);
                next(error);
            }else{
                const newUser = new User();
                newUser.first_name = req.body.first_name;
                newUser.last_name = req.body.last_name;
                newUser.email = req.body.email;
                newUser.password = bcrypt.hashSync(req.body.password, 10);
                newUser.save((err, user)=>{
                    if(err){
                        return res.status(400).send({
                            message: err 
                        });
                    }else{
                        user.password = undefined;
                        return res.json(user);
                    }
                });
            }
        });
    }
}

login = (req, res, next)=>{
    const result = Joi.validate(req.body, loginSchema);
    if(result.error === null){
        User.findOne({
            email: req.body.email
        }).then(user =>{
            if(user){
                bcrypt.compare(req.body.password, user.password)
                    .then((result)=>{
                        if(result){
                            createTokenResponse(user, res, next);
                        }else{
                            respondError422(res, next);
                        }
                    });
            }else{
                respondError422(res, next);
            }
        });
    }else{
        respondError422(res, next);
    }
}

loginRquired = (req, res, next)=>{
    if(req.user){
        next();
    }else{
        return res.status(401).json({
            message: 'Unauthorized user!' 
        });
    }
}

module.exports = {register, login, loginRquired};