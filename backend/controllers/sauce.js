// in controllers/sauce.js
const Sauce = require('../models/Sauce');
const fs = require('fs');
const Arrays = require("../utils/removeFromArray");

exports.createSauce = (req, res, next) => {
   const sauceObject = JSON.parse(req.body.sauce);
   delete sauceObject._id;
   const sauce = new Sauce({
       ...sauceObject,
       likes: 0,
       dislikes: 0,
       usersLiked: [],
       usersDisliked: [],
       userId: req.auth.userId,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   });

   Sauce.create(sauce)
   .then(() =>{
     res.status(201).json({message: "Sauce créée"});
    }).catch( error =>{
        res.status(500).json(error);
      })
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
   const sauceObject = req.file ? {
       ...JSON.parse(req.body.sauce),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };
 
   delete sauceObject._userId;
   Sauce.findOne({_id: req.params.id})
       .then((sauce) => {
           if (sauce.userId != req.auth.userId) {
               res.status(401).json({ message : 'Not authorized'});
           } else {
               Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
               .then(() => res.status(200).json({message : 'Objet modifié!'}))
               .catch(error => res.status(401).json({ error }));
           }
       })
       .catch((error) => {
           res.status(400).json({ error });
       });
};

exports.deleteSauce = (req, res, next) => {
   Sauce.findOne({ _id: req.params.id})
       .then(sauce => {
           if (sauce.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = sauce.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Sauce.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//Modification des likes
exports.likeDislike = (request, response) => {
  Sauce.findOne({
      _id: request.params.id
  }).then(sauce => {
      let usersLiked = sauce.usersLiked;
      let usersDisliked = sauce.usersDisliked;
      let nbLikes = sauce.likes;
      let nbDislikes = sauce.dislikes;
      switch (request.body.like) {
          case -1:
              Arrays.removeFromArray(usersLiked, request.body.userId);
              usersDisliked.push(request.body.userId);
              nbDislikes += 1;
              break;
          case 0:
              if (Arrays.removeFromArray(usersLiked, request.body.userId)) {
                  nbLikes -= 1;
              } else {
                  Arrays.removeFromArray(usersDisliked, request.body.userId)
                  nbDislikes -= 1;
              }
              break;
          case 1:
              Arrays.removeFromArray(usersDisliked, request.body.userId);
              usersLiked.push(request.body.userId);
              nbLikes += 1;
              break;
      }
      const data = {
          likes: nbLikes,
          dislikes: nbDislikes,
          usersLiked: usersLiked,
          usersDisliked: usersDisliked
      }
      Sauce.updateOne({
          _id: request.params.id
      }, data).then(() => {
          response.status(200).json({
              message: "Modification des likes effectuée !"
          });
      }).catch(error => {
          response.status(400).json(error);
          console.error(error);
      });
  });
};