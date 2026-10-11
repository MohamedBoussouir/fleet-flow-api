const mongoose = require('mongoose');

const remorqueSchema = new mongoose.Schema({
  immatriculation: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  capaciteKg: {
    type: Number,
    required: true,
    min: 0
  },
  statut: {
    type: String,
    enum: ['disponible', 'en_mission', 'en_maintenance'],
    default: 'disponible'
  }
}, { timestamps: true });

module.exports = mongoose.model('Remorque', remorqueSchema);