const mongoose = require('mongoose');

const pneuSchema = new mongoose.Schema({
  numeroSerie: {
    type: String,
    required: true,
    unique: true
  },
  camionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camion',
    required: true
  },
  position: {
    type: String, // مثلاً: AV-G (أمامي يسار), AV-D, AR-G, AR-D
    required: true
  },
  kilometrageUsure: {
    type: Number,
    default: 0
  },
  seuilUsureKm: {
    type: Number,
    required: true,
    default: 50000 // الحد الأقصى قبل التآكل والحاجة للاستبدال
  },
  etat: {
    type: String,
    enum: ['neuf', 'bon', 'a_remplacer'],
    default: 'bon'
  }
}, { timestamps: true });

module.exports = mongoose.model('Pneu', pneuSchema);