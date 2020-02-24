import * as jsPDF from 'jspdf';

import BudgetUtils from '../js/BudgetUtils';


/**
 * Tools for using jsPDF to download the current budget as (SURPRISE!!!) a PDF.
 * 
 * The jsPDF library is an MIT Licensed project found at https://github.com/MrRio/jsPDF
 */
class DownloadPdf 
{
  constructor ()
  {
    let bu = new BudgetUtils();
    this.toDollars = bu.toDollars;
  }

  savePdf(budgetState) {

    let doc = new jsPDF('l', 'pt');

    // doc.text('Grand Total: ' + UIOWA_BudgetCalculator.formatAsCurrency(
    //     UIOWA_BudgetCalculator.currentRequest.grand_total
    //     ), 650, doc.autoTable.previous.finalY + 25);

    doc.text('Budget here!', 10, 10);


    doc.save('budget.pdf');
  }

  testDownloadWorking()
  {
    console.log("PDF will download .... soon");

    // Default export is a4 paper, portrait, using milimeters for units
    let doc = new jsPDF();
    
    doc.text('Test worked!!', 10, 10);
    doc.save('a4.pdf');
  }

}

export default DownloadPdf;