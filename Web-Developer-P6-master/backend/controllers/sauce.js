const Sauce = require('../models/sauce');


// function checkUser(usersLiked,usersDislike,userId)
// {
//     let presence =0;
//     for(user of usersLiked)
//     {
//         if(userId === usersLiked[user])
//         return 1;
//     }
//     for(user of usersDislike)
//     {
//         if(userId ===usersDislike[user])
//         return -1;
//     }
//     return 0;
// }



exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Une nouvelle sauce a été ajoutée." }))
        .catch(error => res.status(400).json({ error }))
};

exports.updateOneSauce = (req, res, next) => {
    res.status(201).json({ message: "Sauce modifiée !" })

}


/*
Plusieurs pistes :
    - Enchaîné les conditions avec une partie du code qui se répète.
    - Voir s'il est possible comme dans la partie delete, de préparer des requêtes.
    - A chaque interraction, reset la présence dans le tableau de présence des like ou dislike quitte à le remettre une nouvelle fois dans la catégorie ou il était déjà présent.
    
*/
exports.likeASauce = (req, res, next) => {

    let valeurLike = req.body.like;
    let userId = req.body.userId
    let sauceId = req.params.id
    Sauce.findOne({ _id: sauceId })
        .then(
            sauce => {
                let presenceLike = sauce.usersLiked.includes(userId)
                let presenceDislike = sauce.usersDisliked.includes(userId)
/*Si l'utilisateur devient neutre*/
                if (valeurLike === 0) {
                    if (presenceLike) {
                        Sauce.updateOne({ _id: sauceId }, {
                            $pull: { usersLiked: userId },
                            $inc: { likes: -1 }
                        })
                            .then(() => res.status(201).json({ message: "Vous avez décidé d'être neutre, c'est cool !" }))
                            .catch(error => res.status(500).json({ error: new Error() }))
                    }
                    if (presenceDislike) {
                        Sauce.updateOne({ _id: sauceId }, {
                            $pull: { usersDisliked: userId },
                            $inc: { dislikes: -1 }
                        })
                        .then(() => res.status(201).json({ message: "Vous avez décidé d'être neutre, c'est cool !" }))
                        .catch(error => res.status(500).json({ error: new Error() }))
                    }
                }
/*Si l'utilisateur n'est pas neutre*/
                else {
                    if (valeurLike === 1) {//s'il like la sauce on vérifie s'il l'avais disliké auparavant
                        if (presenceDislike) {
                            Sauce.updateOne({ _id: sauceId }, {
                                $pull: { usersDisliked: userId },
                                $inc: {dislikes : -1},
                                $push:{usersLiked:  userId},
                                $inc : {likes : 1}
                            })
                            .then(() => res.status(201).json({ message: "Vous avez liké une sauce que vous n\'aimiez pas." }))
                            .catch(error => res.status(500).json({ error: new Error() }))
                        }
                        if(!presenceLike)//il like la sauce sans l'avoir dislike auparavant.
                        {
                            Sauce.updateOne({_id:sauceId},{
                                $push:{usersLiked:userId},
                                $inc:{likes:1}
                            })
                            .then(() => res.status(201).json({ message: "Vous avez liké une sauce" }))
                            .catch(error => res.status(500).json({ error: new Error() }))
                        }
                    }
                    if (valeurLike === -1) {
                        if (presenceLike) {//s'il dislike la sauce on vérifie s'il l'avait liké auparavant
                            Sauce.updateOne({ _id: sauceId }, {
                                $pull: { usersLiked: userId },
                                $inc: {dislikes : 1},
                                $push:{usersDisliked:  userId},
                                $inc : {likes : -1}
                            })
                            .then(() => res.status(201).json({ message: "Vous avez disliké une sauce que vous aimiez." }))
                            .catch(error => res.status(500).json({ error: new Error() }))
                        }
                        if(!presenceDislike)//il dislike la sauce sans l'avoir like auparavant.
                        {
                            Sauce.updateOne({_id:sauceId},{
                                $push:{usersDisliked:userId},
                                $inc:{dislikes:1}
                            })
                            .then(() => res.status(201).json({ message: "Vous avez liké une sauce" }))
                            .catch(error => res.status(500).json({ error: new Error() }))
                        }
                    }
                }

            })
        .catch(error => res.status(500).json({ error }))
}
exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(201).json({ message: "Sauce supprimée de la BDD" }))
        .catch(error => res.status(500).json({ error: new Error() }))

};
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(Sauce => res.status(200).json(Sauce))
        .catch(error => res.status(404).json({ error: new Error() }))

};
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(Sauce => res.status(200).json(Sauce))
        .catch(error => res.status(400).json({ error: new Error() }))
};

