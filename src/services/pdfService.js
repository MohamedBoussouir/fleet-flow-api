const PDFDocument = require('pdfkit');

class PdfService {
  static generateOrdreDeMission(trajet, dataCallback, endCallback) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    // عنوان الوثيقة
    doc.fontSize(20).text('ORDRE DE MISSION', { align: 'center', underline: true });
    doc.moveDown(2);

    // معلومات الرحلة الأساسية
    doc.fontSize(12);
    doc.text(`Identifiant du Trajet: ${trajet._id}`);
    doc.text(`Date de création: ${new Date(trajet.createdAt || Date.now()).toLocaleDateString('fr-FR')}`);
    doc.moveDown();

    // السائق
    doc.fontSize(14).text('1. Informations Chauffeur', { underline: true });
    doc.fontSize(11);
    doc.text(`Nom: ${trajet.chauffeurId ? trajet.chauffeurId.nom : 'Non assigné'}`);
    doc.text(`Email: ${trajet.chauffeurId ? trajet.chauffeurId.email : 'N/A'}`);
    doc.moveDown();

    // المركبات
    doc.fontSize(14).text('2. Véhicules Assignés', { underline: true });
    doc.fontSize(11);
    doc.text(`Camion: ${trajet.camionId ? `${trajet.camionId.immatriculation} (${trajet.camionId.modele})` : 'N/A'}`);
    doc.text(`Remorque: ${trajet.remorqueId ? `${trajet.remorqueId.immatriculation} (Capacité: ${trajet.remorqueId.capaciteKg} Kg)` : 'N/A'}`);
    doc.moveDown();

    // تفاصيل المسار والبضاعة
    doc.fontSize(14).text('3. Détails de la Mission', { underline: true });
    doc.fontSize(11);
    doc.text(`Site de Départ: ${trajet.siteDepart}`);
    doc.text(`Site d'Arrivée: ${trajet.siteArrivee}`);
    doc.text(`Marchandise: ${trajet.marchandise}`);
    doc.text(`Date Départ Prévue: ${new Date(trajet.dateDepartPrevue).toLocaleString('fr-FR')}`);
    doc.text(`Date Arrivée Prévue: ${new Date(trajet.dateArriveePrevue).toLocaleString('fr-FR')}`);
    doc.text(`Statut Actuel: ${trajet.statut}`);
    doc.moveDown(2);

    // خانة توقيع السائق والإدارة
    doc.text('Signature Chauffeur:Signature Administration:', { align: 'left' });

    doc.end();
  }
}

module.exports = PdfService;