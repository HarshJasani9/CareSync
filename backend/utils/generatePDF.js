const PDFDocument = require('pdfkit');

const TEAL = '#1D9E75';
const DARK = '#085041';
const GRAY = '#6B7280';
const LIGHT_BG = '#F4F6F8';

/**
 * Generate a prescription PDF and return it as a Buffer
 * @param {Object} data - Prescription data
 * @returns {Promise<Buffer>}
 */
const generatePrescriptionPDF = (data) => {
  return new Promise((resolve, reject) => {
    const {
      doctorName,
      doctorSpecialization,
      doctorQualifications,
      patientName,
      patientDOB,
      patientBloodGroup,
      date,
      diagnosis,
      instructions,
      validUntil,
      medicines,
    } = data;

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', (err) => reject(err));

    // ─── HEADER ──────────────────────────────────────────────
    doc
      .fontSize(24)
      .fillColor(TEAL)
      .text('CareSync', 50, 45, { continued: true })
      .fontSize(12)
      .fillColor(GRAY)
      .text(' — Digital Prescription', { baseline: 'alphabetic' });

    doc.moveDown(0.3);

    // Horizontal rule
    doc
      .strokeColor(TEAL)
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();

    doc.moveDown(1);

    // ─── DOCTOR INFO (left) | DATE (right) ───────────────────
    const infoY = doc.y;

    doc
      .fontSize(14)
      .fillColor(DARK)
      .text(`Dr. ${doctorName}`, 50, infoY);

    doc
      .fontSize(10)
      .fillColor(GRAY)
      .text(doctorSpecialization, 50, infoY + 18);

    if (doctorQualifications && doctorQualifications.length > 0) {
      doc.text(doctorQualifications.join(', '), 50, infoY + 32);
    }

    // Date — right aligned
    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    doc
      .fontSize(10)
      .fillColor(DARK)
      .text(`Date: ${formattedDate}`, 380, infoY, { width: 165, align: 'right' });

    if (validUntil) {
      const formattedValid = new Date(validUntil).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      doc.text(`Valid Until: ${formattedValid}`, 380, infoY + 15, {
        width: 165,
        align: 'right',
      });
    }

    doc.moveDown(3);

    // ─── PATIENT INFO ────────────────────────────────────────
    const patientY = doc.y;

    // Light background box
    doc
      .rect(50, patientY - 5, 495, 45)
      .fill(LIGHT_BG);

    doc
      .fontSize(11)
      .fillColor(DARK)
      .text('Patient Information', 60, patientY + 2, { underline: true });

    const patientDetails = [`Name: ${patientName}`];
    if (patientDOB) {
      patientDetails.push(
        `DOB: ${new Date(patientDOB).toLocaleDateString('en-IN')}`
      );
    }
    if (patientBloodGroup) {
      patientDetails.push(`Blood Group: ${patientBloodGroup}`);
    }

    doc
      .fontSize(10)
      .fillColor(GRAY)
      .text(patientDetails.join('   |   '), 60, patientY + 20);

    doc.y = patientY + 50;
    doc.moveDown(1);

    // ─── DIAGNOSIS ───────────────────────────────────────────
    doc
      .fontSize(12)
      .fillColor(DARK)
      .text('Diagnosis', 50, doc.y, { underline: true });

    doc.moveDown(0.3);

    doc
      .fontSize(10)
      .fillColor('#111827')
      .text(diagnosis, 50, doc.y, { width: 495 });

    doc.moveDown(1.2);

    // ─── MEDICINES TABLE ─────────────────────────────────────
    doc
      .fontSize(12)
      .fillColor(DARK)
      .text('Prescribed Medicines', 50, doc.y, { underline: true });

    doc.moveDown(0.5);

    // Table header
    const tableTop = doc.y;
    const colX = { name: 55, dosage: 220, frequency: 320, duration: 440 };

    doc
      .rect(50, tableTop - 3, 495, 20)
      .fill(TEAL);

    doc
      .fontSize(9)
      .fillColor('#FFFFFF')
      .text('Medicine', colX.name, tableTop + 2)
      .text('Dosage', colX.dosage, tableTop + 2)
      .text('Frequency', colX.frequency, tableTop + 2)
      .text('Duration', colX.duration, tableTop + 2);

    // Table rows
    let rowY = tableTop + 22;
    if (medicines && medicines.length > 0) {
      medicines.forEach((med, index) => {
        // Alternate row background
        if (index % 2 === 0) {
          doc.rect(50, rowY - 3, 495, 18).fill(LIGHT_BG);
        }

        doc
          .fontSize(9)
          .fillColor('#111827')
          .text(med.name || '—', colX.name, rowY)
          .text(med.dosage || '—', colX.dosage, rowY)
          .text(med.frequency || '—', colX.frequency, rowY)
          .text(med.duration || '—', colX.duration, rowY);

        rowY += 20;
      });
    } else {
      doc
        .fontSize(9)
        .fillColor(GRAY)
        .text('No medicines prescribed', colX.name, rowY);
      rowY += 20;
    }

    // Table bottom border
    doc
      .strokeColor(TEAL)
      .lineWidth(0.5)
      .moveTo(50, rowY)
      .lineTo(545, rowY)
      .stroke();

    doc.y = rowY + 15;

    // ─── INSTRUCTIONS ────────────────────────────────────────
    if (instructions) {
      doc
        .fontSize(12)
        .fillColor(DARK)
        .text('Instructions / Follow-up Notes', 50, doc.y, { underline: true });

      doc.moveDown(0.3);

      doc
        .fontSize(10)
        .fillColor('#111827')
        .text(instructions, 50, doc.y, { width: 495 });

      doc.moveDown(1);
    }

    // ─── FOOTER ──────────────────────────────────────────────
    doc
      .fontSize(8)
      .fillColor(GRAY)
      .text(
        'This prescription is digitally generated by CareSync',
        50,
        750,
        { width: 495, align: 'center' }
      );

    doc
      .strokeColor(GRAY)
      .lineWidth(0.5)
      .moveTo(50, 745)
      .lineTo(545, 745)
      .stroke();

    doc.end();
  });
};

module.exports = generatePrescriptionPDF;
