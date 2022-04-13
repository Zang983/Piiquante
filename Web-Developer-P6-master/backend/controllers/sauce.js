const Sauce = require('../models/sauce');


exports.createSauce = (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Une nouvelle sauce a été ajoutée." }))
        .catch(error => res.status(400).json({ error }))
};
exports.likeASauce = (req, res, next) => {

    let valeurLike = req.body.like; 
    let userId = req.body.userId
    let sauceId = req.params.id

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

