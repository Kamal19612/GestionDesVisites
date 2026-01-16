/**
 * Service for exporting data to PDF and Excel formats
 */

// Export to Excel using basic CSV format (compatible with Excel)
export const exportToExcel = (data, columns, filename) => {
  // Create CSV content
  const headers = columns.map(col => `"${col.label}"`).join(',');
  const rows = data.map(item =>
    columns.map(col => {
      const value = col.accessor ? col.accessor(item) : item[col.key];
      // Escape quotes and wrap in quotes if contains comma or quote
      const escaped = String(value || '').replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(',')
  );

  const csv = [headers, ...rows].join('\n');
  downloadFile(csv, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};

// Export to PDF using jsPDF library
export const exportToPDF = async (data, columns, filename, title = '') => {
  try {
    const { jsPDF } = await import('jspdf');
    const { autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF();

    // Add title
    if (title) {
      doc.setFontSize(16);
      doc.text(title, 14, 20);
    }

    // Prepare table data
    const tableColumns = columns.map(col => col.label);
    const tableRows = data.map(item =>
      columns.map(col => col.accessor ? col.accessor(item) : item[col.key] || '')
    );

    // Add table
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: title ? 30 : 10,
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [79, 70, 229], // indigo-600
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [242, 242, 242],
      },
    });

    // Add footer with date
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} sur ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Erreur lors de la génération du PDF');
  }
};

// Helper function to download file
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default {
  exportToExcel,
  exportToPDF,
};
