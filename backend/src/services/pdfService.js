import PDFDocument from 'pdfkit';
import {
  formatDateDisplay,
  formatDateForFilename,
  formatShortDate,
} from '../utils/dateHelpers.js';

const APP_NAME = 'Family Expense Tracker';

function formatCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function drawTableHeader(doc, y) {
  doc.font('Helvetica-Bold').fontSize(10);
  doc.text('Date', 50, y, { width: 70 });
  doc.text('Category', 120, y, { width: 90 });
  doc.text('Amount', 210, y, { width: 70 });
  doc.text('Type', 280, y, { width: 60 });
  doc.text('Note', 340, y, { width: 200 });
  doc.moveTo(50, y + 14).lineTo(545, y + 14).stroke();
}

export function generateExpenseReportPdf(summary, expenses) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const startDisplay = formatDateDisplay(new Date(summary.startDate));
  const endDisplay = formatDateDisplay(new Date(summary.endDate));
  const generatedOn = formatDateDisplay(new Date());

  doc.font('Helvetica-Bold').fontSize(18).text(`${APP_NAME} — Expense Report`, {
    align: 'center',
  });
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(11).text(`Date Range: ${startDisplay} – ${endDisplay}`, {
    align: 'center',
  });
  doc.text(`Generated on: ${generatedOn}`, { align: 'center' });
  doc.moveDown(1.5);

  doc.font('Helvetica-Bold').fontSize(14).text('SUMMARY');
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(12);
  doc.text(`Total Cash Spent:      ${formatCurrency(summary.totalCash)}`);
  doc.text(`Total Online Spent:    ${formatCurrency(summary.totalOnline)}`);
  doc.font('Helvetica-Bold').text(`Grand Total:           ${formatCurrency(summary.totalOverall)}`);
  doc.moveDown(1.5);

  if (summary.categoryBreakdown.length > 0) {
    doc.font('Helvetica-Bold').fontSize(14).text('CATEGORY BREAKDOWN');
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(11);
    summary.categoryBreakdown.forEach((item) => {
      doc.text(`${item.category}    ${formatCurrency(item.total)}`);
    });
    doc.moveDown(1.5);
  }

  doc.font('Helvetica-Bold').fontSize(14).text('TRANSACTION LIST');
  doc.moveDown(0.5);

  let y = doc.y;
  drawTableHeader(doc, y);
  y += 22;
  doc.font('Helvetica').fontSize(9);

  expenses.forEach((expense) => {
    if (y > 740) {
      doc.addPage();
      y = 50;
      drawTableHeader(doc, y);
      y += 22;
      doc.font('Helvetica').fontSize(9);
    }

    doc.text(formatShortDate(expense.date), 50, y, { width: 70 });
    doc.text(expense.category, 120, y, { width: 90 });
    doc.text(formatCurrency(expense.amount), 210, y, { width: 70 });
    doc.text(expense.paymentType === 'cash' ? 'Cash' : 'Online', 280, y, { width: 60 });
    doc.text(expense.note || '—', 340, y, { width: 200 });
    y += 16;
  });

  doc.end();
  return doc;
}

export function getPdfFilename(startDate, endDate) {
  return `expense-report_${formatDateForFilename(new Date(startDate))}_to_${formatDateForFilename(new Date(endDate))}.pdf`;
}
