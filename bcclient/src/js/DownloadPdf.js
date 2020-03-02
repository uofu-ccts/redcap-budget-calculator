import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

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
    this.isClinical = bu.isClinical;
    this.isNotClinical = bu.isNotClinical;

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

    this.clinicalHeaders = [[
      'Clinical Service', 
      'Base Cost', 
      'Your Rate', 
      'Subjects', 
      'Quantity Type', 
      'Visits', 
      'Cost Per Subject', 
      'Total']];

    this.nonClinicalHeaders = [[
      'Non-Clinical Service', 
      'Base Cost', 
      'Your Rate', 
      'Quantity', 
      'Quantity Type', 
      'Total']];
  }

  /**
   * Making a copy of the budgetState, then using the copy for creating the PDF.
   */
  savePdf(originalBudget) {
    const budgetCopy = {...originalBudget}

    let clinicalTotals = this.toDollars(budgetCopy.clinicalTotals);
    let nonclinicalTotals = this.toDollars(budgetCopy.nonclinicalTotals);
    let grandTotal = this.toDollars(budgetCopy.grandTotal);

    let rows = budgetCopy.bcrows;

    // preparing data for the clinical table
    let clinicalData = [];

    Object.values(rows).filter(this.isClinical).forEach(obj => {
      clinicalData.push(
        [
          obj.service,
          this.toDollars(obj.industry_rate),
          this.toDollars(obj.yourCost),
          obj.subjectCount,
          "Q. Type",
          obj.visitCount.filter(vc => {return vc;}).length,
          this.toDollars(obj.costPerSubject),
          this.toDollars(obj.totalCost)
        ]);
    });

    clinicalData.push(['', '', '', '', '', '', 'Clinical Total:', clinicalTotals]);

    //preparing data for the non-clinical table
    let nonClinicalData = [];

    Object.values(rows).filter(this.isNotClinical).forEach(obj => {
      nonClinicalData.push(
        [
          obj.service,
          this.toDollars(obj.industry_rate),
          this.toDollars(obj.yourCost),
          obj.quantity,
          "Q. Type",
          this.toDollars(obj.totalCost)
        ]);
    });
    
    nonClinicalData.push(['','','','','Non-Clinical Total:', nonclinicalTotals]);

    console.log("PDF will download .... soon.",budgetCopy);

    //creating the PDF
    let doc = new jsPDF('l', 'pt');
    // doc.autoTable(columnLookup, pdfFormattedRequest.clinical, {
    doc.autoTable({
      head:this.clinicalHeaders,
      body:
            clinicalData,
            theme: 'striped',
            margin: {top: 60}
        });

    doc.autoTable({
      head:this.nonClinicalHeaders,
      body:
            nonClinicalData,
            theme: 'striped',
            margin: {top: 60},
            startY: doc.autoTable.previous.finalY
        });

    doc.text('Grand Total: ' + grandTotal, 650, doc.autoTable.previous.finalY + 25);


    // doc.autoTable(columnLookup, pdfFormattedRequest.clinical, {
    //     theme: 'striped',
    //     margin: {top: 60}
    // });
    // doc.text('Test worked!!', 10, 10);

    doc.save('budget.pdf');
  }

  testDownloadWorking()
  {
    console.log("PDF will download .... soon.");

    // Default export is a4 paper, portrait, using milimeters for units
    let doc = new jsPDF();
    
    doc.text('Test worked!!', 10, 10);
    doc.save('a4.pdf');
  }

}

export default DownloadPdf;