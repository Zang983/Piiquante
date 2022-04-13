const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({ //créer un schéma de données
    userId : { type : String, required : true,unique: true},
    name :  { type: String, required: true},
    manufacturer : { type : String, required : true},
    description :  { type : String, required : true},
    mainPepper : {type : String, required : true},
    imageUrl : {type : String},
    heat : {type : Number, required : true},
    likes:{type : Number, required : true},
    dislikes:{type : Number, required : true},
    usersLiked:{type : [String], required:true},
    usersDisliked:{type : [String], required:true}
});

module.exports = mongoose.model('Sauce', sauceSchema); //transforme ce modèle en un modèle utilisable