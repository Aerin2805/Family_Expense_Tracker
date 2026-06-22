import PDFDocument from 'pdfkit';

const formatCurrency = (amount) =>
  `Rs. ${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function generateTransactionPdf({ startDate, endDate, summary, transactions }, res) {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="expense-report_${startDate}_to_${endDate}.pdf"`
  );
  doc.pipe(res);

  // --- Header ---
  doc.fontSize(18).fillColor('black').text('Family Expense Tracker', { align: 'center' });
  doc.fontSize(11).fillColor('gray').text(`${startDate} to ${endDate}`, { align: 'center' });
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, { align: 'center' });
  doc.fillColor('black').moveDown(1.5);

  // --- Summary: Spent vs Received ---
  doc.fontSize(14).text('Summary', { underline: true });
  doc.moveDown(0.4);
  doc.fontSize(12);
  doc.text(`Total Spent:     ${formatCurrency(summary.totalSpent)}`);
  doc.text(`Total Received:  ${formatCurrency(summary.totalReceived)}`);
  doc.moveDown(0.2);
  doc
    .fontSize(13)
    .fillColor(summary.netBalance >= 0 ? 'green' : 'red')
    .text(
      `Net Balance:     ${formatCurrency(summary.netBalance)} ${
        summary.netBalance >= 0 ? '(Surplus)' : '(Deficit)'
      }`
    );
  doc.fillColor('black').moveDown(1);

  // --- Cash vs Online ---
  doc.fontSize(14).text('Cash vs Online', { underline: true });
  doc.moveDown(0.4);
  doc.fontSize(11);
  doc.text(
    `Cash    -  Spent: ${formatCurrency(summary.cash.spent)}   ` +
      `Received: ${formatCurrency(summary.cash.received)}   ` +
      `Net: ${formatCurrency(summary.cash.net)}`
  );
  doc.text(
    `Online  -  Spent: ${formatCurrency(summary.online.spent)}   ` +
      `Received: ${formatCurrency(summary.online.received)}   ` +
      `Net: ${formatCurrency(summary.online.net)}`
  );
  doc.moveDown(1);

  // --- Category breakdowns ---
  if (summary.expenseCategoryBreakdown.length) {
    doc.fontSize(13).text('Expense Categories', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(10);
    summary.expenseCategoryBreakdown.forEach((row) => {
      doc.text(`${row.category.padEnd(20)} ${formatCurrency(row.total)}`);
    });
    doc.moveDown(0.8);
  }

  if (summary.incomeCategoryBreakdown.length) {
    doc.fontSize(13).text('Income Categories', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(10);
    summary.incomeCategoryBreakdown.forEach((row) => {
      doc.text(`${row.category.padEnd(20)} ${formatCurrency(row.total)}`);
    });
    doc.moveDown(0.8);
  }

  // --- Transaction list ---
  doc.fontSize(13).text('Transaction List', { underline: true });
  doc.moveDown(0.4);

  const colX = { date: 40, type: 110, category: 175, amount: 300, payment: 390, note: 460 };

  function drawTableHeader(y) {
    doc.fontSize(9).fillColor('black');
    doc.text('Date', colX.date, y);
    doc.text('Type', colX.type, y);
    doc.text('Category', colX.category, y);
    doc.text('Amount', colX.amount, y);
    doc.text('Payment', colX.payment, y);
    doc.text('Note', colX.note, y);
    doc.moveTo(40, y + 13).lineTo(555, y + 13).stroke();
  }

  let y = doc.y;
  drawTableHeader(y);
  y += 18;

  transactions.forEach((t) => {
    if (y > 760) {
      doc.addPage();
      y = 40;
      drawTableHeader(y);
      y += 18;
    }

    doc.fontSize(8.5).fillColor('black');
    doc.text(new Date(t.date).toLocaleDateString('en-IN'), colX.date, y, { width: 65 });

    doc
      .fillColor(t.type === 'income' ? 'green' : 'red')
      .text(t.type === 'income' ? 'Income' : 'Expense', colX.type, y, { width: 60 });

    doc.fillColor('black');
    doc.text(t.category, colX.category, y, { width: 120 });
    doc.text(formatCurrency(t.amount), colX.amount, y, { width: 85 });
    doc.text(t.paymentType === 'cash' ? 'Cash' : 'Online', colX.payment, y, { width: 65 });
    doc.text(t.note || '-', colX.note, y, { width: 95 });

    y += 16;
  });

  doc.end();
}