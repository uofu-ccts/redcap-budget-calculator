import * as jsPDF from 'jspdf';

import BudgetUtils from '../js/BudgetUtils';


/**
 * Tools for using jsPDF to download the current budget as (SURPRISE!!!) a PDF.
 * 
 * The jsPDF library is an MIT Licensed project found at https://github.com/MrRio/jsPDF
 * The jsPDF-AutoTable library is an MIT Licensed project found 
 * at https://github.com/simonbengtsson/jsPDF-AutoTable
 */
class DownloadPdf 
{
  constructor ()
  {
    let bu = new BudgetUtils();
    this.toDollars = bu.toDollars;

    this.columnLookup = [
            {title: 'Clinical Service', dataKey: 'service'},                    // 0
            {title: 'Base Cost', dataKey: 'base_cost'},                         // 1
            {title: 'Your Rate', dataKey: 'adjusted_rate'},                     // 2
            {title: 'Subjects', dataKey: 'service_quantity'},                   // 3
            {title: 'Quantity Type', dataKey: 'unit_label'},                    // 4
            {title: 'Visits', dataKey: 'visit_count'},                          // 5
            {title: 'Cost Per Subject', dataKey: 'cost_per_subject'},           // 6
            {title: 'Total', dataKey: 'subtotal'}                               // 7
        ];
  }

  savePdf(budgetState) {

    let doc = new jsPDF('l', 'pt');

    // doc.autoTable(columnLookup, pdfFormattedRequest.clinical, {
    //     theme: 'striped',
    //     margin: {top: 60}
    // });
    doc.text('Test worked!!', 10, 10);

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