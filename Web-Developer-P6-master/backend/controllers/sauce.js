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
                let presenceLike=sauce.usersLiked.includes(userId)
                let presenceDislike =sauce.usersDisliked.includes(userId)
                console.log(presenceDislike);
                console.log(valeurLike)

                if (!presenceLike && !presenceDislike) {
                    if (valeurLike == 1) {
                        Sauce.updateOne({ _id: sauceId }, {
                            $inc: { likes: 1 },
                            $push: { usersLiked: userId }
                        })
                            .then(() => res.status(201).json({ message: "Vous avez likez cette sauce !" }))
                            .catch(error => res.status(400).json({ error }))
                    }
                    if (valeurLike === -1) {
                        Sauce.updateOne({ _id: sauceId }, {
                            $inc: { dislikes: 1 },
                            $push: { usersDisliked: userId }
                        })
                            .then(() => res.status(201).json({ message: "Vous êtes sûr d'avoir bien gouté cette sauce ?" }))
                            .catch(error => res.status(400).json({ error }))
                    }
                }
                if (valeurLike ===0)
                {
                    if(presenceLike)
                    {
                        Sauce.updateOne({_id : sauceId},{
                            $inc:{likes:-1},
                            $pull:{usersLiked : userId}
                        })
                        .then(()=> res.status(201).json({message : "Vous avez décidé d'être neutre"}))
                        .catch(error => res.status(400).json({ error }))
                    }
                    else
                    {
                        Sauce.updateOne({_id : sauceId},{
                            $inc:{dislikes:-1},
                            $pull:{usersDisliked : userId}
                        })
                        .then(()=> res.status(201).json({message : "Vous avez décidé d'être neutre"}))
                        .catch(error => res.status(400).json({ error }))    
                    }
                }

            })
        .catch()


}
exports.deleteSauce = (req, res, next) => {

    // const query = Sauce.deleteOne();
    // query.where('_id').gte(req.params.id).exec(()=>
    // {
    //     if(!query.error)
    //     {
    //         res.status(201).json({message:"Sauce supprimée"})
    //     }
    //     else
    //     {
    //         res.status(500).json({message:"Problème suppression de la BDD"})
    //     }
    // });
    

    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(201).json({ message: "Sauce supprimée de la BDD" }))
        .catch(error => res.status(500).json({ message: "Problème suppression de la BDD" }))

};
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(Sauce => res.status(200).json(Sauce))
        .catch(error => res.status(404).json({ error: new Error("Sauce non trouvée") }))

};
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(Sauce => res.status(200).json(Sauce))
        .catch(error => res.status(400).json({ error: "Problème de récupération des sauces." }))
};

