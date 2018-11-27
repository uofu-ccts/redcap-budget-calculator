$(document).ready(function(){
    // Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Append table on add new button click
    $(".add-new").click(function(){
        UIOWA_ServiceCalculator.addService();
    });
    // Delete row on delete button click
    $('#services-table').on("click", ".delete", function(){
        UIOWA_ServiceCalculator.visitGrid.splice(
            $(this).parents("tr").index(), 1
        );

        $(this).parents("tr").remove();

        // Show "No services added" placeholders
        if ($('#clinical').find('.lineItem').length == 0) {
            $('#clinical-empty').show();
        }
        if ($('#nonClinical').find('.lineItem').length == 0) {
            $('#nonClinical-empty').show();
        }

        UIOWA_ServiceCalculator.updateTotals();
    });

    $('#core').change(function() {
        UIOWA_ServiceCalculator.populateDropdown('category');
    });
    $('#category').change(function() {
        UIOWA_ServiceCalculator.populateDropdown('service');
    });
    $('#service').change(function() {
        var addServiceButton = $('#addService');

        if ($(this).val() == 'not selected') {
            addServiceButton.prop('disabled', true);
        }
        else {
            addServiceButton.prop('disabled', false);
        }
    });

    // Update visits page on button click
    $('#prevVisitPage').click(function() {
        if (UIOWA_ServiceCalculator.visitPage > 0) {
            UIOWA_ServiceCalculator.visitPage--;
        }

        UIOWA_ServiceCalculator.changeVisitsPage();
    });
    $('#nextVisitPage').click(function() {
        if (UIOWA_ServiceCalculator.visitPage < UIOWA_ServiceCalculator.maxPage) {
            UIOWA_ServiceCalculator.visitPage++;
        }

        UIOWA_ServiceCalculator.changeVisitsPage();
    });

    $('#visitCount').change(function(){
        UIOWA_ServiceCalculator.changeVisitsPage();
    });

    $('#pdf-export').click(function(){
        UIOWA_ServiceCalculator.savePdf();
    });

    UIOWA_ServiceCalculator.formatServicesData(servicesData, servicesQuantityLabels);
});

var UIOWA_ServiceCalculator = {};

UIOWA_ServiceCalculator.data = {};
UIOWA_ServiceCalculator.quantityLabelLookup = [];
UIOWA_ServiceCalculator.visitGrid = [];
UIOWA_ServiceCalculator.allChecked = [];
UIOWA_ServiceCalculator.visitPage = 0;
UIOWA_ServiceCalculator.maxPage = 0;
UIOWA_ServiceCalculator.visitsPerPage = 5;
UIOWA_ServiceCalculator.currentRequest = {
    clinical: [],
    nonClinical: []
};

// Format services data from source project
UIOWA_ServiceCalculator.formatServicesData = function(servicesData, servicesQuantityLabels) {
    servicesData = _.map(servicesData, function(item) {
        item = item[Object.keys(item)[0]];
        return item;
    });

    this.data = _.filter(servicesData, function (item) {
        return item['active_service'] == '1';
    });

    servicesQuantityLabels = servicesQuantityLabels['element_enum'].split("\\n");
    var labelArray = [];

    _.each(servicesQuantityLabels, function(item) {
        item = item.split(", ");
        labelArray[item[0]] = item[1];
    });

    this.quantityLabelLookup = labelArray;

    this.populateDropdown('core');
};

// Populate core/category/service dropdown with available options
UIOWA_ServiceCalculator.populateDropdown = function(type) {
    var dropdown = document.getElementById(type);
    var label = document.getElementById(type + 'Label');
    var data = this.data;

    for (var i = dropdown.options.length - 1 ; i >= 0 ; i--)
    {
        dropdown.remove(i);
    }

    var initialOption = document.createElement("option");
    initialOption.text = '---Select---';
    initialOption.value = 'not selected';
    dropdown.appendChild(initialOption);

    var coreValue = document.getElementById('core').value;
    var catValue = document.getElementById('category').value;

    if (type == 'category') {
        var serviceDropdown = document.getElementById('service');

        for (var i = serviceDropdown.options.length - 1 ; i >= 0 ; i--)
        {
            serviceDropdown.remove(i);
        }

        initialOption = document.createElement("option");
        initialOption.text = '---Select---';
        initialOption.value = 'not selected';
        serviceDropdown.appendChild(initialOption);

        data = _.filter(data, function (item) {
            return item['core'] == coreValue;
        });
    }
    if (type == 'service') {
        data = _.filter(data, function (item) {
            return item['core'] == coreValue && item['category'] == catValue;
        });
    }

    var newOptions = _.uniq(_.map(data, function(item) {
        return item[type];
    }));

    for (var j in newOptions) {
        var newOption = document.createElement("option");
        newOption.text = newOptions[j];
        newOption.value = newOptions[j];
        dropdown.appendChild(newOption);
    }

    dropdown.style.display = '';
    label.style.display = '';
};

// Add service line item
UIOWA_ServiceCalculator.addService = function() {
    var serviceInfo = _.findWhere(this.data, {
        core: $('#core').val(),
        category: $('#category').val(),
        service: $('#service').val()
    });

    var lineItemObj = {
        core: serviceInfo['core'],
        category: serviceInfo['category'],
        service: serviceInfo['service'],
        industryRate: Number(serviceInfo['industry_rate']),
        federalRate: Number(serviceInfo['federal_rate']),
        serviceQty: 1,
        perServiceLabel: this.quantityLabelLookup[serviceInfo['per_service']],
        lineTotal: 0.00
    };

    //console.log(serviceInfo);

    var serviceType = serviceInfo['clinical'] == '1' ? 'clinical' : 'nonClinical';
    var uniqueCols = "<td class='non-clinical-blank' colspan='7'></td>";

    if (serviceType == 'clinical') {
        // Disable visits input (todo: make this updatable on the fly)
        $('#visitCount:enabled').prop("disabled", true);

        lineItemObj['visitCount'] = 0;
        lineItemObj['serviceQty'] = Number($('#subjectCount').val());
        uniqueCols =
            "<td class='allVisits'>" +
                "<button" +
                    " class='btn btn-success fas fa-check checkAllRow'" +
                    " style='width: 75%'" +
                    " onclick='UIOWA_ServiceCalculator.updateVisitGrid(this, \"row\")'" +
                    " value='all'>" +
                "</button>" +
                "<button" +
                    " class='btn btn-danger fas fa-times uncheckAllRow'" +
                    " style='width: 75%;display:none'" +
                    " onclick='UIOWA_ServiceCalculator.updateVisitGrid(this, \"row\")'" +
                    " value='none'>" +
                "</button>" +
            "</td>" +
            "<td class='visitCol'></td>" +
            "<td class='visitCol'></td>" +
            "<td class='visitCol'></td>" +
            "<td class='visitCol'></td>" +
            "<td class='visitCol'></td>" +
            "<td>$<span class='line-total-per-patient'>0.00</span></td>";
    }

    var lineItem =
        "<tr class='lineItem' oninput='UIOWA_ServiceCalculator.updateTotals()'>" +
            "<td style='border-right-style:hidden;'>" +
                "<span>" +
                    "<a class=\"delete\" title=\"Delete\" data-toggle=\"tooltip\">" +
                        "<i class=\"material-icons\" style='color:red'>&#xE872;</i>" +
                    "</a>" +
                "</span>" +
            "</td>" +
            "<td class='service-title'>" + lineItemObj['service'] +
                "<i class='fas fa-info-circle' style='color:#3E72A8' data-toggle='tooltip' title='" + serviceInfo['service_description'] + "'></i>" +
            "</td>" +
            "<td>$<span class='industry-rate'>" + this.formatAsCurrency(lineItemObj['industryRate']) + "</span></td>" +
            "<td>$<span class='federal-rate'>" + this.formatAsCurrency(lineItemObj['federalRate']) + "</span></td>" +
            "<td><input class='qty-count' value='" + lineItemObj['serviceQty'] + "'></td>" +
            "<td>" + lineItemObj['perServiceLabel'] + "</td>" +
            uniqueCols +
            "<td>$<span class='line-total'>0.00</span></td>" +
        "</tr>";

    // Hide "no services" placeholder
    $('#' + serviceType + '-empty:visible').hide();

    // Add service line item to currentRequest object
    this.currentRequest[serviceType].push(lineItemObj);

    // Add service line item to table and enable tooltips
    $("#" + serviceType).append(lineItem);
    $('[data-toggle="tooltip"]').tooltip();

    this.changeVisitsPage();
};

// Update request totals
UIOWA_ServiceCalculator.updateTotals = function() {
    var totals = {
        'clinical': 0,
        'nonClinical': 0,
        'grand': 0
    };

    var visitGrid = this.visitGrid;

    $.each(['clinical', 'nonClinical'], function (i, serviceType) {
        var serviceTable = $('#' + serviceType + ' > tr').not('#' + serviceType + '-empty');

        $.each(UIOWA_ServiceCalculator.currentRequest[serviceType], function (lineIndex, lineItem) {
            var tableLineItem = serviceTable[lineIndex];
            var lineTotal = 0;

            var serviceCost = lineItem['federalRate'];
            var serviceQty = Number($(tableLineItem).find('.qty-count').val()); // Get latest qty from table

            // Count visit checkboxes
            var visitsArray = _.flatten(visitGrid[lineIndex]);
            var visitCount = _.reduce(visitsArray, function(memo, bool) { return memo + (bool === true ? 1 : 0)});

            // Update object and table with line totals
            if (serviceType == 'clinical') {
                var lineTotalPerPatient = serviceCost * visitCount;
                lineTotal = lineTotalPerPatient * serviceQty;

                UIOWA_ServiceCalculator.currentRequest[serviceType][lineIndex]['visitCount'] = visitCount;
                UIOWA_ServiceCalculator.currentRequest[serviceType][lineIndex]['lineTotalPerPatient'] = lineTotalPerPatient;
                $(tableLineItem).find(".line-total-per-patient").html(UIOWA_ServiceCalculator.formatAsCurrency(lineTotalPerPatient));
            }
            else {
                lineTotal = serviceQty * serviceCost;
            }

            totals[serviceType] += lineTotal;

            UIOWA_ServiceCalculator.currentRequest[serviceType][lineIndex]['serviceQty'] = serviceQty;
            UIOWA_ServiceCalculator.currentRequest[serviceType][lineIndex]['lineTotal'] = lineTotal;
            $(tableLineItem).find(".line-total").html(UIOWA_ServiceCalculator.formatAsCurrency(lineTotal));
        });

        // Update object and table with subtotal
        UIOWA_ServiceCalculator.currentRequest[serviceType + 'Total'] = totals[serviceType];
        $('#' + serviceType + '-total').html(UIOWA_ServiceCalculator.formatAsCurrency(totals[serviceType]));
    });

    totals['grand'] = totals['clinical'] + totals['nonClinical'];

    // Update object and table with grand total
    this.currentRequest['grandTotal'] = totals['grand'];
    $(".total").html(this.formatAsCurrency(totals['grand']));

    //console.log(this.currentRequest);

};

// Change visit checkboxes displayed
UIOWA_ServiceCalculator.changeVisitsPage = function () {
    this.maxPage = Math.ceil(document.getElementById('visitCount').value / this.visitsPerPage) - 1;

    var lineItems = $("#clinical").find('.lineItem');
    var prevButton = $('#prevVisitPage');
    var nextButton = $('#nextVisitPage');

    if (this.visitPage == 0) {
        prevButton.prop('disabled', true);
    }
    else {
        prevButton.prop('disabled', false);
    }
    if (this.visitPage == this.maxPage) {
        nextButton.prop('disabled', true);
    }
    else {
        nextButton.prop('disabled', false);
    }

    $('.visitHeader').each(function (index, td) {
        $(td).html('');
    });
    $('.checkAllColumn').each(function (index, td) {
        $(td).html('');
    });

    lineItems.each(function (index) {
        $(lineItems[index]).find('.visitCheckbox').remove();

        var visitCount = document.getElementById('visitCount').value;

        if (typeof UIOWA_ServiceCalculator.visitGrid[index] === 'undefined') {
            var newServiceVisits = [];

            for (var i = 0; i < visitCount; i++) {

                if (i % UIOWA_ServiceCalculator.visitsPerPage == 0) {
                    var newVisitGroup = [];
                }

                newVisitGroup.push(false);

                if (i % UIOWA_ServiceCalculator.visitsPerPage == UIOWA_ServiceCalculator.visitsPerPage - 1 || i == visitCount - 1) {
                    newServiceVisits.push(newVisitGroup);
                }
            }

            UIOWA_ServiceCalculator.visitGrid[index] = newServiceVisits;
        }

        var visitColumns = $(lineItems[index]).find('.visitCol');
        var visitData = UIOWA_ServiceCalculator.visitGrid[index][UIOWA_ServiceCalculator.visitPage];
        var startingVisitIndex = UIOWA_ServiceCalculator.visitPage * UIOWA_ServiceCalculator.visitsPerPage;
        var loopMax = startingVisitIndex + UIOWA_ServiceCalculator.visitsPerPage;

        if (!(typeof visitData === 'undefined')) {
            var visitIndex = startingVisitIndex;

            for (var j = 0; j < loopMax; j++) {
                var checkbox = '';

                if (!(typeof visitData[j] === 'undefined')) {
                    if (visitData[j] == true) {
                        checkbox = "<input type='checkbox' class='visitCheckbox'" +
                            "onclick='UIOWA_ServiceCalculator.updateVisitGrid(this, " + j + ")' checked>";
                    }
                    else {
                        checkbox = "<input type='checkbox' class='visitCheckbox'" +
                            "onclick='UIOWA_ServiceCalculator.updateVisitGrid(this, " + j + ")'>";
                    }

                    $(visitColumns[j]).append(checkbox);

                    var visitHeader = $('.visitHeader')[j];
                    var checkAllColumn = $('.checkAllColumn')[j];

                    $(visitHeader).html((visitIndex + 1));
                    $(checkAllColumn).html(
                        //"<input type='checkbox' onclick='UIOWA_ServiceCalculator.updateVisitGrid(this, \"column\")'" +
                        //    ($.inArray(visitIndex, UIOWA_ServiceCalculator.allChecked) != -1 ? 'checked' : '')
                        //+ ">"
                        $.inArray(visitIndex, UIOWA_ServiceCalculator.allChecked) != -1 ?
                            "<button" +
                                " class='btn btn-danger fas fa-times'" +
                                " style='width: 75%'" +
                                " onclick='UIOWA_ServiceCalculator.updateVisitGrid(this, \"column\")'" +
                                " value='none'>" +
                            "</button>"
                                :
                            "<button" +
                                " class='btn btn-success fas fa-check'" +
                                " style='width: 75%'" +
                                " onclick='UIOWA_ServiceCalculator.updateVisitGrid(this, \"column\")'" +
                                " value='all'>" +
                            "</button>"
                    );

                    visitIndex++;
                }
            }
        }
    });

    this.updateTotals();
};

// Update visit data stored in array
UIOWA_ServiceCalculator.updateVisitGrid = function (checkbox, index) {
    var lineIndex = $(checkbox).parents("tr").index() - 1;
    var checked;

    if (index == 'row') {
        var pages = this.visitGrid[lineIndex];
        checked = $(checkbox).val() == 'all';

        $(checkbox).hide();
        console.log($(checkbox).siblings().show());


        //if (checked) {
        //    $(checkbox).siblings().show();
        //}
        //else {
        //    $(checkbox).siblings().show();
        //}

        for (var page in pages) {
            var boxes = pages[page];

            for (var box in boxes) {
                this.visitGrid[lineIndex][page][box] = checked;
            }
        }

        UIOWA_ServiceCalculator.changeVisitsPage();
    }
    else if (index == 'column') {
        var startingVisitIndex = UIOWA_ServiceCalculator.visitPage * UIOWA_ServiceCalculator.visitsPerPage;
        var columnIndex = $(checkbox).parent().attr('data-visitIndex') - 1;
        var visitIndex = columnIndex + startingVisitIndex;
        checked = $(checkbox).val() == 'all';

        for (var lineItem in this.visitGrid) {
            this.visitGrid[lineItem][this.visitPage][columnIndex] = checked;
        }

        if (checked) {
            this.allChecked.push(visitIndex);
        }
        else {
            this.allChecked = $.grep(this.allChecked, function(value) {
                return value != visitIndex;
            });
        }

        UIOWA_ServiceCalculator.changeVisitsPage();
    }
    else {
        checked = checkbox.checked ? true : false;

        this.visitGrid[lineIndex][this.visitPage][index] = checked;
    }


};

// Save request data object as PDF table
UIOWA_ServiceCalculator.savePdf = function() {
    var formattedServices = {
        clinical: this.currentRequest['clinical'],
        nonClinical: this.currentRequest['nonClinical']
    };
    var currencyHeaders = [
        'industryRate',
        'federalRate',
        'lineTotalPerPatient',
        'lineTotal'
    ];

    $.each(formattedServices, function (serviceType, lineItems) { // clinical, nonClinical
        $.each(lineItems, function (lineIndex) { // line items
            $.each(lineItems[lineIndex], function (key, value) { // columns
                // Format dollar amounts
                if ($.inArray(key, currencyHeaders) !== -1) {
                    formattedServices[serviceType][lineIndex][key] = '$' + UIOWA_ServiceCalculator.formatAsCurrency(value);
                }
            })
        });

        formattedServices[serviceType].push({
            'lineTotalPerPatient': serviceType == 'clinical' ? 'Clinical Total:' : 'Non-Clinical Total:',
            'lineTotal': UIOWA_ServiceCalculator.formatAsCurrency(
                UIOWA_ServiceCalculator.currentRequest[serviceType + 'Total']
            )
        })
    });

    console.log(formattedServices);

    var columnLookup = [
        {title: 'Clinical Service', dataKey: 'service'},                    // 0
        {title: 'Industry Rate', dataKey: 'industryRate'},                  // 1
        {title: 'Federal Rate', dataKey: 'federalRate'},                    // 2
        {title: 'Subjects', dataKey: 'serviceQty'},                         // 3
        {title: 'Quantity Type', dataKey: 'perServiceLabel'},               // 4
        {title: 'Visits', dataKey: 'visitCount'},                           // 5
        {title: 'Cost Per Subject', dataKey: 'lineTotalPerPatient'},        // 6
        {title: 'Total', dataKey: 'lineTotal'}                              // 7
    ];

    var doc = new jsPDF('l', 'pt');
    doc.autoTable(columnLookup, formattedServices['clinical'], {
        theme: 'striped',
        margin: {top: 60}
    });

    // Modify/remove clinical columns
    columnLookup[0]['title'] = 'Non-Clinical Service'; // was 'Clinical Service'
    columnLookup[3]['title'] = 'Quantity'; // was 'Subjects'
    columnLookup[5]['title'] = ''; // was 'Visits'
    columnLookup[6]['title'] = ''; // was 'Cost Per Subject'

    doc.autoTable(columnLookup, formattedServices['nonClinical'], {
        theme: 'striped',
        margin: {top: 60},
        startY: doc.autoTable.previous.finalY
    });

    doc.text('Grand Total: ' + UIOWA_ServiceCalculator.formatAsCurrency(
            UIOWA_ServiceCalculator.currentRequest['grandTotal']
        ), 650, doc.autoTable.previous.finalY + 25);

    doc.save('services.pdf');
};

// Format dollar amounts
UIOWA_ServiceCalculator.formatAsCurrency = function(value) {
    return Number(value).toLocaleString("en-US", {style: "decimal", minimumFractionDigits: 2})
};