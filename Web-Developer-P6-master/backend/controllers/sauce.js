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


/*Il faut terminé cette partie*/
exports.likeASauce = (req, res, next) => {

    let valeurLike = req.body.like;
    let userId = req.body.userId
    let sauceId = req.params.id
    Sauce.findOne({ _id: sauceId })
        .then(
            sauce => {

                // statusLikeUser = checkUser(usersLiked,usersDisliked,userId)
                //Si l'utilisateur n'est pas présent
                console.clear();
                console.log(userId)
                console.log(sauce.usersLiked)
                console.log(sauce.usersLiked.includes(userId))
                if (!sauce.usersLiked.includes(userId) && !sauce.usersDisliked.includes(userId)) {
                    console.log("l'utilisateur n'a jamais jugé la sauce")
                    if (valeurLike === 1) {
                        Sauce.updateOne({ _id: sauceId }, {
                            $inc: { likes: 1 },
                            $pull: { usersLiked: userId }
                        })
                            .then(sauce => console.log(sauce.likes))
                            .catch(error => res.status(400).json({ error }))
                    }
                }
            })
        .catch()


}
exports.deleteSauce = (req, res, next) => {
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

