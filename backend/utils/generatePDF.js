const PDFDocument = require('pdfkit');

const TEAL = '#1D9E75';
const DARK = '#085041';
const GRAY = '#6B7280';
const LIGHT_BG = '#F0F7F4';
const WHITE = '#FFFFFF';
const TEXT_DARK = '#111827';
const BORDER_LIGHT = '#D1D5DB';

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

    const pageWidth = 595.28; // A4 width in points
    const marginLeft = 50;
    const marginRight = 50;
    const contentWidth = pageWidth - marginLeft - marginRight;
    const rightEdge = pageWidth - marginRight;

    // ─── HEADER BAR ─────────────────────────────────────────
    // Teal banner at the very top
    doc.rect(0, 0, pageWidth, 80).fill(TEAL);

    doc
      .fontSize(22)
      .fillColor(WHITE)
      .font('Helvetica-Bold')
      .text('CareSync', marginLeft, 20);

    doc
      .fontSize(9)
      .fillColor(WHITE)
      .font('Helvetica')
      .text('DIGITAL PRESCRIPTION', marginLeft, 48, { characterSpacing: 2 });

    // Small Rx symbol on the right
    doc
      .fontSize(32)
      .fillColor('rgba(255,255,255,0.2)')
      .font('Helvetica-Bold')
      .text('Rx', rightEdge - 70, 18);

    // ─── DOCTOR INFO + DATE ROW ─────────────────────────────
    let currentY = 100;

    // Format the doctor name — avoid double "Dr." prefix
    const cleanDoctorName = doctorName.replace(/^Dr\.?\s*/i, '').trim();
    const displayDoctorName = `Dr. ${cleanDoctorName}`;

    doc
      .fontSize(15)
      .fillColor(DARK)
      .font('Helvetica-Bold')
      .text(displayDoctorName, marginLeft, currentY);

    currentY += 20;

    if (doctorSpecialization) {
      doc
        .fontSize(10)
        .fillColor(TEAL)
        .font('Helvetica-Bold')
        .text(doctorSpecialization, marginLeft, currentY);
      currentY += 15;
    }

    if (doctorQualifications && doctorQualifications.length > 0) {
      doc
        .fontSize(9)
        .fillColor(GRAY)
        .font('Helvetica')
        .text(doctorQualifications.join(', '), marginLeft, currentY);
      currentY += 14;
    }

    // Date block — right aligned, same row as doctor name
    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    doc
      .fontSize(9)
      .fillColor(GRAY)
      .font('Helvetica')
      .text('Date:', rightEdge - 140, 100, { width: 140, align: 'right' });

    doc
      .fontSize(10)
      .fillColor(DARK)
      .font('Helvetica-Bold')
      .text(formattedDate, rightEdge - 140, 112, { width: 140, align: 'right' });

    if (validUntil) {
      const formattedValid = new Date(validUntil).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      doc
        .fontSize(9)
        .fillColor(GRAY)
        .font('Helvetica')
        .text('Valid Until:', rightEdge - 140, 130, { width: 140, align: 'right' });

      doc
        .fontSize(10)
        .fillColor(DARK)
        .font('Helvetica-Bold')
        .text(formattedValid, rightEdge - 140, 142, { width: 140, align: 'right' });
    }

    // Divider line
    currentY = Math.max(currentY, 160) + 10;
    doc
      .strokeColor(BORDER_LIGHT)
      .lineWidth(0.5)
      .moveTo(marginLeft, currentY)
      .lineTo(rightEdge, currentY)
      .stroke();

    currentY += 15;

    // ─── PATIENT INFORMATION ────────────────────────────────
    // Background box
    const patientBoxHeight = 55;
    doc.rect(marginLeft, currentY, contentWidth, patientBoxHeight).fill(LIGHT_BG);

    // Left teal accent bar
    doc.rect(marginLeft, currentY, 4, patientBoxHeight).fill(TEAL);

    doc
      .fontSize(10)
      .fillColor(DARK)
      .font('Helvetica-Bold')
      .text('Patient Information', marginLeft + 15, currentY + 10);

    const patientDetailParts = [];
    if (patientName) patientDetailParts.push(patientName);
    if (patientDOB) {
      patientDetailParts.push(
        `DOB: ${new Date(patientDOB).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
      );
    }
    if (patientBloodGroup) {
      patientDetailParts.push(`Blood Group: ${patientBloodGroup}`);
    }

    doc
      .fontSize(10)
      .fillColor(TEXT_DARK)
      .font('Helvetica')
      .text(patientDetailParts.join('    •    '), marginLeft + 15, currentY + 30, {
        width: contentWidth - 30,
      });

    currentY += patientBoxHeight + 20;

    // ─── DIAGNOSIS ──────────────────────────────────────────
    doc
      .fontSize(11)
      .fillColor(TEAL)
      .font('Helvetica-Bold')
      .text('Diagnosis', marginLeft, currentY);

    currentY += 18;

    doc
      .fontSize(10)
      .fillColor(TEXT_DARK)
      .font('Helvetica')
      .text(diagnosis || '—', marginLeft + 10, currentY, { width: contentWidth - 10 });

    currentY = doc.y + 20;

    // ─── MEDICINES TABLE ────────────────────────────────────
    doc
      .fontSize(11)
      .fillColor(TEAL)
      .font('Helvetica-Bold')
      .text('Prescribed Medicines', marginLeft, currentY);

    currentY += 20;

    // Define column layout with proper widths
    const columns = [
      { label: 'Medicine',  x: marginLeft,       width: 160 },
      { label: 'Dosage',    x: marginLeft + 160,  width: 110 },
      { label: 'Frequency', x: marginLeft + 270,  width: 110 },
      { label: 'Duration',  x: marginLeft + 380,  width: 115 },
    ];

    // Table header row
    doc.rect(marginLeft, currentY, contentWidth, 22).fill(DARK);

    columns.forEach((col) => {
      doc
        .fontSize(9)
        .fillColor(WHITE)
        .font('Helvetica-Bold')
        .text(col.label, col.x + 8, currentY + 6, { width: col.width - 16 });
    });

    currentY += 22;

    // Table rows
    if (medicines && medicines.length > 0) {
      medicines.forEach((med, index) => {
        const rowHeight = 24;

        // Alternate row coloring
        if (index % 2 === 0) {
          doc.rect(marginLeft, currentY, contentWidth, rowHeight).fill(LIGHT_BG);
        }

        // Vertical text centering: offset from top of row
        const textY = currentY + 7;

        doc.fontSize(9).fillColor(TEXT_DARK).font('Helvetica');

        doc.text(med.name || '—', columns[0].x + 8, textY, { width: columns[0].width - 16 });
        doc.text(med.dosage || '—', columns[1].x + 8, textY, { width: columns[1].width - 16 });
        doc.text(med.frequency || '—', columns[2].x + 8, textY, { width: columns[2].width - 16 });
        doc.text(med.duration || '—', columns[3].x + 8, textY, { width: columns[3].width - 16 });

        currentY += rowHeight;
      });
    } else {
      doc
        .rect(marginLeft, currentY, contentWidth, 24)
        .fill(LIGHT_BG);
      doc
        .fontSize(9)
        .fillColor(GRAY)
        .font('Helvetica')
        .text('No medicines prescribed', columns[0].x + 8, currentY + 7);
      currentY += 24;
    }

    // Table bottom border
    doc
      .strokeColor(DARK)
      .lineWidth(0.5)
      .moveTo(marginLeft, currentY)
      .lineTo(rightEdge, currentY)
      .stroke();

    currentY += 25;

    // ─── INSTRUCTIONS ───────────────────────────────────────
    if (instructions) {
      doc
        .fontSize(11)
        .fillColor(TEAL)
        .font('Helvetica-Bold')
        .text('Instructions / Follow-up Notes', marginLeft, currentY);

      currentY += 18;

      // Instructions in a subtle box
      const instrWidth = contentWidth - 20;
      const instrTextHeight = doc.heightOfString(instructions, {
        width: instrWidth,
        fontSize: 10,
      });
      const instrBoxHeight = instrTextHeight + 20;

      doc
        .rect(marginLeft, currentY, contentWidth, instrBoxHeight)
        .fill(LIGHT_BG);

      doc
        .rect(marginLeft, currentY, 4, instrBoxHeight)
        .fill(TEAL);

      doc
        .fontSize(10)
        .fillColor(TEXT_DARK)
        .font('Helvetica')
        .text(instructions, marginLeft + 15, currentY + 10, { width: instrWidth });

      currentY += instrBoxHeight + 15;
    }

    // ─── FOOTER ─────────────────────────────────────────────
    const footerY = 760;

    doc
      .strokeColor(BORDER_LIGHT)
      .lineWidth(0.5)
      .moveTo(marginLeft, footerY)
      .lineTo(rightEdge, footerY)
      .stroke();

    doc
      .fontSize(8)
      .fillColor(GRAY)
      .font('Helvetica')
      .text(
        'This prescription is digitally generated by CareSync. For authentication, verify with your healthcare provider.',
        marginLeft,
        footerY + 8,
        { width: contentWidth, align: 'center' }
      );

    doc.end();
  });
};

module.exports = generatePrescriptionPDF;
