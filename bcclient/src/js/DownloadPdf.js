import * as jsPDF from 'jspdf';

//Tools for using jsPDF to download the current budget as (SURPRISE!!!) a PDF
class DownloadPdf 
{
  constructor ()
  {}

  downloadBudgetAsPdf(budgetState)
  {
    console.log("PDF will download .... soon");

    // Default export is a4 paper, portrait, using milimeters for units
    var doc = new jsPDF();
    
    doc.text('Hello world!', 10, 10);
    doc.save('a4.pdf');
  }

}

export default DownloadPdf;