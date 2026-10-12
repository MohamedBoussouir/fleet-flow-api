const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


router.use(authMiddleware);
router.use(roleMiddleware(['Admin']));


router.get('/', async (req, res, next) => {
  try {
    const chauffeurs = await User.find({ role: 'Chauffeur' }).select('-password');
    res.status(200).json(chauffeurs);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { statut } = req.body; 
    if (!['actif', 'suspendu'].includes(statut)) {
      return res.status(400).json({ message: "Le statut doit être 'actif' ou 'suspendu'" });
    }

    const chauffeur = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'Chauffeur' },
      { statut },
      { new: true }
    ).select('-password');

    if (!chauffeur) {
      return res.status(404).json({ message: 'Chauffeur non trouvé' });
    }

    res.status(200).json({ message: `Statut mis à jour avec succès (${statut})`, chauffeur });
  } catch (error) {
    next(error);
  }
});

module.exports = router;