const Sauce = require('../models/sauce');
const fs = require('fs');

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
exports.likeASauce = (req, res, next) => {
    let valeurLike = req.body.like;
    let userId = req.body.userId
    let sauceId = req.params.id

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            let presenceLike = sauce.usersLiked.includes(userId)
            let presenceDislike = sauce.usersDisliked.includes(userId)
            if (!presenceLike && !presenceDislike)//l'utilisateur n'est pas présent dans les tableaux des like
            {
                if (valeurLike === 1) {
                    Sauce.updateOne({ _id: req.params.id }, {
                        $push: { usersLiked: userId },
                        $inc: { likes: 1 }
                    })
                        .then(() => { res.status(201).json({ message: "Vous avez liké !" }) })
                        .catch(error => { res.status(500).json({ error }) })

                }
                if (valeurLike === -1) {
                    Sauce.updateOne({ _id: req.params.id }, {
                        $push: { usersDisliked: userId },
                        $inc: { dislikes: 1 }
                    })
                        .then(() => res.status(201).json({ message: "Vous avez liké !" }))
                        .catch(error => res.status(500).json({ error }))
                }
            }
            else {
                if (valeurLike === 0) {
                    if (presenceLike) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $pull: { usersLiked: userId },
                            $inc: { likes: -1 }
                        })
                            .then(() => res.status(201).json({ message: "Vous avez retiré liké !" }))
                            .catch(error => res.status(500).json({ error }))
                    }
                    else {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $pull: { usersDisliked: userId },
                            $inc: { dislikes: -1 }
                        })
                            .then(() => res.status(201).json({ message: "Vous avez retiré votre dislike !" }))
                            .catch(error => res.status(500).json({ error }))
                    }
                }
            }
        })
        .catch(error => res.status(401).json({ error: error }))
}
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (!sauce) {
                res.status(404).json({ error })
            }
            if (sauce.userId != req.auth.userId) {
                res.status(400).json({ error });
            }
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(201).json({ message: "Sauce supprimée de la BDD" }))
                    .catch(error => res.status(500).json({ error: new Error() }))
            })
        })
        .catch(error => res.status(500).json({ error }));
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
exports.updateOneSauce = (req, res, next) => {
    let sauceObj = req.file;

    if (sauceObj != undefined) {
        sauceObj = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => { console.log("Photo effacée"); })
            })
    }
    else {
        sauceObj = { ...req.body }
    }
    Sauce.updateOne({ _id: req.params.id },
        {
            ...sauceObj, _id: req.params.id
        })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
}