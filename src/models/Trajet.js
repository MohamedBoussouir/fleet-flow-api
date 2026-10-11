const mongoose = require('mongoose');

const trajetSchema = new mongoose.Schema({
  siteDepart: { type: String, required: true },
  siteArrivee: { type: String, required: true },
  marchandise: { type: String, required: true },
  dateDepartPrevue: { type: Date, required: true },
  dateArriveePrevue: { type: Date, required: true },
  camionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Camion', required: true },
  remorqueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Remorque', required: true },
  chauffeurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  statut: {
    type: String,
    enum: ['à faire', 'en cours', 'terminé'],
    default: 'à faire'
  },
  kmDepart: { type: Number, default: 0 },
  kmArrivee: { type: Number, default: 0 },
  volumeGasoil: { type: Number, default: 0 },
  coutGasoil: { type: Number, default: 0 },
  consommationMoyenne: { type: Number, default: 0 },
  remarques: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Trajet', trajetSchema);