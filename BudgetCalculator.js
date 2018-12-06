$(document).ready(function(){
    UIOWA_BudgetCalculator.requestUrl = requestUrl;
    UIOWA_BudgetCalculator.apiUrl = apiUrl;
    UIOWA_BudgetCalculator.currentUser = currentUser;
    UIOWA_BudgetCalculator.submissionFieldLookup = submissionFieldLookup;

    // Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Append table on add new button click
    $(".add-new").click(function(){
        UIOWA_BudgetCalculator.addService();
    });

    // Delete row on delete button click
    $('#services-table').on("click", ".delete", function(){
        var lineIndex = $(this).parents('tr').index();
        var serviceType = $(this).closest('tbody').attr('id');

        UIOWA_BudgetCalculator.visitGrid.splice(
            lineIndex, 1
        );

        $(this).parents("tr").remove();

        var clinicalServiceCount = $('#clinical').find('.lineItem').length;
        var nonClinicalServiceCount = $('#non_clinical').find('.lineItem').length;

        // Show "No services added" placeholders, disable visits
        if (clinicalServiceCount == 0) {
            $('#clinical-empty').show();

            $('#prevVisitPage').prop('disabled', true);
            $('#nextVisitPage').prop('disabled', true);

            $('.checkAllColumn > button').hide();

            $('.visitHeader').each(function (index, td) {
                $(td).html('');
            });
        }
        if (nonClinicalServiceCount == 0) {
            $('#non_clinical-empty').show();
        }

        // Disable submit/export buttons
        if (clinicalServiceCount == 0 && nonClinicalServiceCount == 0) {
            $('#submit').prop('disabled', true);
            $('#pdf-export').prop('disabled', true);
        }

        // Remove line item from object
        UIOWA_BudgetCalculator.currentRequest[serviceType].splice(
            lineIndex - 1, 1
        );

        UIOWA_BudgetCalculator.updateTotals();
    });

    // Populate dropdowns
    $('#core').change(function() {
        UIOWA_BudgetCalculator.populateDropdown('category');
    });
    $('#category').change(function() {
        UIOWA_BudgetCalculator.populateDropdown('service');
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
        if (UIOWA_BudgetCalculator.visitPage > 0) {
            UIOWA_BudgetCalculator.visitPage--;
        }

        UIOWA_BudgetCalculator.changeVisitsPage();
    });
    $('#nextVisitPage').click(function() {
        if (UIOWA_BudgetCalculator.visitPage < UIOWA_BudgetCalculator.maxPage) {
            UIOWA_BudgetCalculator.visitPage++;
        }

        UIOWA_BudgetCalculator.changeVisitsPage();
    });

    $('#visitCount').change(function(){
        UIOWA_BudgetCalculator.changeVisitsPage();
    });

    // Initiate PDF download
    $('#pdf-export').click(function(){
        UIOWA_BudgetCalculator.savePdf();
    });

    // Validate user input before submitting
    $('#submit-confirm').click(function(){
        var form = $('#submission-form');

        form.validate();

        // todo fix this
        //$.each(UIOWA_BudgetCalculator.submissionFieldLookup, function (index, field) {
        //    if (field['element_validation_type'] !== null) {
        //        //console.log($('#' + field['field_name'] + '_regex').val());
        //        $('#' + field['field_name']).rules('add', {
        //            regex: field['regex_js']
        //        });
        //    }
        //});

        if (form.valid()) {
            $('#submit-confirmation-popup').modal('hide');
            UIOWA_BudgetCalculator.sendToProject();
        }
    });

    // Reload page after successful submit
    $('#submit-success-popup').on('hidden.bs.modal', function (e) {
        location.reload();
    });

    // Add RegEx validation method
    $.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "The value you entered is invalid for this field."
    );

    // Add datepicker to date fields
    $.each(UIOWA_BudgetCalculator.submissionFieldLookup, function (index, field) {
        if (field['element_validation_type'] !== null) {
            if (field['element_validation_type'].substring(0, 4) == 'date') {
                var dateFormat = field['element_validation_type'].substring(5);
                dateFormat = dateFormat.split('');
                dateFormat[dateFormat.indexOf('y')] = 'yy';
                dateFormat = dateFormat.join('-');

                $('#' + field['field_name']).datepicker({
                    dateFormat: dateFormat
                })
            }
        }
    });

    UIOWA_BudgetCalculator.formatServicesData(servicesData, servicesQuantityLabels);
});

var UIOWA_BudgetCalculator = {};

UIOWA_BudgetCalculator.data = {};
UIOWA_BudgetCalculator.quantityLabelLookup = [];
UIOWA_BudgetCalculator.visitGrid = [];
UIOWA_BudgetCalculator.allChecked = [];
UIOWA_BudgetCalculator.visitPage = 0;
UIOWA_BudgetCalculator.maxPage = 0;
UIOWA_BudgetCalculator.visitsPerPage = 5;
UIOWA_BudgetCalculator.currentRequest = {
    clinical: [],
    non_clinical: []
};

// Format services data from source project
UIOWA_BudgetCalculator.formatServicesData = function(servicesData, servicesQuantityLabels) {
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
UIOWA_BudgetCalculator.populateDropdown = function(type) {
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
UIOWA_BudgetCalculator.addService = function() {
    var serviceInfo = _.findWhere(this.data, {
        core: $('#core').val(),
        category: $('#category').val(),
        service: $('#service').val()
    });

    var lineItemObj = {
        core: serviceInfo['core'],
        category: serviceInfo['category'],
        service: serviceInfo['service'],
        industry_rate: Number(serviceInfo['industry_rate']),
        federal_rate: Number(serviceInfo['federal_rate']),
        service_quantity: 1,
        unit_label: this.quantityLabelLookup[serviceInfo['per_service']],
        subtotal: 0.00
    };

    //console.log(serviceInfo);

    var serviceType = serviceInfo['clinical'] == '1' ? 'clinical' : 'non_clinical';
    var uniqueCols = "<td class='non_clinical-blank' colspan='7'></td>";

    if (serviceType == 'clinical') {
        // Disable visits input (todo: make this updatable on the fly)
        $('#visitCount:enabled').prop("disabled", true);

        lineItemObj['visit_count'] = 0;
        lineItemObj['service_quantity'] = Number($('#subjectCount').val());
        uniqueCols =
            "<td class='allVisits'>" +
                "<button" +
                    " class='btn btn-success fas fa-check checkAllRow'" +
                    " style='width: 40px'" +
                    " onclick='UIOWA_BudgetCalculator.updateVisitGrid(this, \"row\")'" +
                    " value='all'>" +
                "</button>" +
                "<button" +
                    " class='btn btn-danger fas fa-times uncheckAllRow'" +
                    " style='width: 40px;display:none'" +
                    " onclick='UIOWA_BudgetCalculator.updateVisitGrid(this, \"row\")'" +
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
        "<tr class='lineItem' oninput='UIOWA_BudgetCalculator.updateTotals()'>" +
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
            "<td>$<span class='industry-rate'>" + this.formatAsCurrency(lineItemObj['industry_rate']) + "</span></td>" +
            "<td>$<span class='federal-rate'>" + this.formatAsCurrency(lineItemObj['federal_rate']) + "</span></td>" +
            "<td><input class='qty-count' value='" + lineItemObj['service_quantity'] + "'></td>" +
            "<td>" + lineItemObj['unit_label'] + "</td>" +
            uniqueCols +
            "<td>$<span class='line-total'>0.00</span></td>" +
        "</tr>";

    // Hide "no services" placeholder
    $('#' + serviceType + '-empty:visible').hide();

    // Enable submit/export buttons
    $('#submit').prop('disabled', false);
    $('#pdf-export').prop('disabled', false);

    // Add service line item to currentRequest object
    this.currentRequest[serviceType].push(lineItemObj);

    // Add service line item to table and enable tooltips
    $("#" + serviceType).append(lineItem);
    $('[data-toggle="tooltip"]').tooltip();

    this.changeVisitsPage();
};

// Update request totals
UIOWA_BudgetCalculator.updateTotals = function() {
    var totals = {
        'clinical': 0,
        'non_clinical': 0,
        'grand': 0
    };

    var visitGrid = this.visitGrid;

    $.each(['clinical', 'non_clinical'], function (i, serviceType) {
        var serviceTable = $('#' + serviceType + ' > tr').not('#' + serviceType + '-empty');

        $.each(UIOWA_BudgetCalculator.currentRequest[serviceType], function (lineIndex, lineItem) {
            var tableLineItem = serviceTable[lineIndex];
            var subtotal = 0;

            var serviceCost = lineItem['federal_rate'];
            var serviceQty = Number($(tableLineItem).find('.qty-count').val()); // Get latest qty from table

            // Count visit checkboxes
            var visitsArray = _.flatten(visitGrid[lineIndex]);
            var visitCount = _.reduce(visitsArray, function(memo, bool) { return memo + (bool === true ? 1 : 0)});

            // Update object and table with line totals
            if (serviceType == 'clinical') {
                var costPerSubject = serviceCost * visitCount;
                subtotal = costPerSubject * serviceQty;

                UIOWA_BudgetCalculator.currentRequest[serviceType][lineIndex]['visit_count'] = visitCount;
                UIOWA_BudgetCalculator.currentRequest[serviceType][lineIndex]['cost_per_subject'] = costPerSubject;
                $(tableLineItem).find(".line-total-per-patient").html(UIOWA_BudgetCalculator.formatAsCurrency(costPerSubject));
            }
            else {
                subtotal = serviceQty * serviceCost;
            }

            totals[serviceType] += subtotal;

            UIOWA_BudgetCalculator.currentRequest[serviceType][lineIndex]['service_quantity'] = serviceQty;
            UIOWA_BudgetCalculator.currentRequest[serviceType][lineIndex]['subtotal'] = subtotal;
            $(tableLineItem).find(".line-total").html(UIOWA_BudgetCalculator.formatAsCurrency(subtotal));
        });

        // Update object and table with subtotal
        UIOWA_BudgetCalculator.currentRequest[serviceType + '_total'] = totals[serviceType];
        $('#' + serviceType + '-total').html(UIOWA_BudgetCalculator.formatAsCurrency(totals[serviceType]));
    });

    totals['grand'] = totals['clinical'] + totals['non_clinical'];

    // Update object and table with grand total
    this.currentRequest['grand_total'] = totals['grand'];
    $(".total").html(this.formatAsCurrency(totals['grand']));

    //console.log(this.currentRequest);

};

// Change visit checkboxes displayed
UIOWA_BudgetCalculator.changeVisitsPage = function () {
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

        if (typeof UIOWA_BudgetCalculator.visitGrid[index] === 'undefined') {
            var newServiceVisits = [];

            for (var i = 0; i < visitCount; i++) {

                if (i % UIOWA_BudgetCalculator.visitsPerPage == 0) {
                    var newVisitGroup = [];
                }

                newVisitGroup.push(false);

                if (i % UIOWA_BudgetCalculator.visitsPerPage == UIOWA_BudgetCalculator.visitsPerPage - 1 || i == visitCount - 1) {
                    newServiceVisits.push(newVisitGroup);
                }
            }

            UIOWA_BudgetCalculator.visitGrid[index] = newServiceVisits;
        }

        var visitColumns = $(lineItems[index]).find('.visitCol');
        var visitData = UIOWA_BudgetCalculator.visitGrid[index][UIOWA_BudgetCalculator.visitPage];
        var startingVisitIndex = UIOWA_BudgetCalculator.visitPage * UIOWA_BudgetCalculator.visitsPerPage;
        var loopMax = startingVisitIndex + UIOWA_BudgetCalculator.visitsPerPage;

        if (!(typeof visitData === 'undefined')) {
            var visitIndex = startingVisitIndex;

            for (var j = 0; j < loopMax; j++) {
                var checkbox = '';

                if (!(typeof visitData[j] === 'undefined')) {
                    if (visitData[j] == true) {
                        checkbox = "<input type='checkbox' class='visitCheckbox'" +
                            "onclick='UIOWA_BudgetCalculator.updateVisitGrid(this, " + j + ")' checked>";
                    }
                    else {
                        checkbox = "<input type='checkbox' class='visitCheckbox'" +
                            "onclick='UIOWA_BudgetCalculator.updateVisitGrid(this, " + j + ")'>";
                    }

                    $(visitColumns[j]).append(checkbox);

                    var visitHeader = $('.visitHeader')[j];
                    var checkAllColumn = $('.checkAllColumn')[j];

                    $(visitHeader).html((visitIndex + 1));
                    $(checkAllColumn).html(
                        //"<input type='checkbox' onclick='UIOWA_BudgetCalculator.updateVisitGrid(this, \"column\")'" +
                        //    ($.inArray(visitIndex, UIOWA_BudgetCalculator.allChecked) != -1 ? 'checked' : '')
                        //+ ">"
                        $.inArray(visitIndex, UIOWA_BudgetCalculator.allChecked) != -1 ?
                            "<button" +
                                " class='btn btn-danger fas fa-times'" +
                                " style='width: 40px'" +
                                " onclick='UIOWA_BudgetCalculator.updateVisitGrid(this, \"column\")'" +
                                " value='none'>" +
                            "</button>"
                                :
                            "<button" +
                                " class='btn btn-success fas fa-check'" +
                                " style='width: 40px'" +
                                " onclick='UIOWA_BudgetCalculator.updateVisitGrid(this, \"column\")'" +
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
UIOWA_BudgetCalculator.updateVisitGrid = function (checkbox, index) {
    var lineIndex = $(checkbox).parents("tr").index() - 1;
    var checked;

    if (index == 'row') {
        var pages = this.visitGrid[lineIndex];
        checked = $(checkbox).val() == 'all';

        $(checkbox).hide();
        $(checkbox).siblings().show();


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

        UIOWA_BudgetCalculator.changeVisitsPage();
    }
    else if (index == 'column') {
        var startingVisitIndex = UIOWA_BudgetCalculator.visitPage * UIOWA_BudgetCalculator.visitsPerPage;
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

        UIOWA_BudgetCalculator.changeVisitsPage();
    }
    else {
        checked = checkbox.checked ? true : false;

        this.visitGrid[lineIndex][this.visitPage][index] = checked;
    }


};

// Save request data object as PDF table
UIOWA_BudgetCalculator.savePdf = function() {
    var serviceReference = {
        clinical: this.currentRequest['clinical'],
        non_clinical: this.currentRequest['non_clinical']
    };
    var pdfFormattedRequest = {
        clinical: [],
        non_clinical: []
    };
    var currencyHeaders = [
        'industry_rate',
        'federal_rate',
        'cost_per_subject',
        'subtotal'
    ];

    $.each(serviceReference, function (serviceType, lineItems) { // clinical, non_clinical
        $.each(lineItems, function (lineIndex) { // line items
            pdfFormattedRequest[serviceType].push(_.clone(serviceReference[serviceType][lineIndex]));

            $.each(lineItems[lineIndex], function (key, value) { // columns
                // Format dollar amounts
                if ($.inArray(key, currencyHeaders) !== -1) {
                    pdfFormattedRequest[serviceType][lineIndex][key] = '$' + UIOWA_BudgetCalculator.formatAsCurrency(value);
                }
            })
        });

        pdfFormattedRequest[serviceType].push({
            'cost_per_subject': serviceType == 'clinical' ? 'Clinical Total:' : 'Non-Clinical Total:',
            'subtotal': '$' + UIOWA_BudgetCalculator.formatAsCurrency(
                UIOWA_BudgetCalculator.currentRequest[serviceType + '_total']
            )
        });
    });

    //console.log(pdfFormattedRequest);

    var columnLookup = [
        {title: 'Clinical Service', dataKey: 'service'},                    // 0
        {title: 'Industry Rate', dataKey: 'industry_rate'},                 // 1
        {title: 'Federal Rate', dataKey: 'federal_rate'},                   // 2
        {title: 'Subjects', dataKey: 'service_quantity'},                   // 3
        {title: 'Quantity Type', dataKey: 'unit_label'},                    // 4
        {title: 'Visits', dataKey: 'visit_count'},                          // 5
        {title: 'Cost Per Subject', dataKey: 'cost_per_subject'},           // 6
        {title: 'Total', dataKey: 'subtotal'}                               // 7
    ];

    var doc = new jsPDF('l', 'pt');
    doc.autoTable(columnLookup, pdfFormattedRequest['clinical'], {
        theme: 'striped',
        margin: {top: 60}
    });

    // Modify/remove clinical columns
    columnLookup[0]['title'] = 'Non-Clinical Service'; // was 'Clinical Service'
    columnLookup[3]['title'] = 'Quantity'; // was 'Subjects'
    columnLookup[5]['title'] = ''; // was 'Visits'
    columnLookup[6]['title'] = ''; // was 'Cost Per Subject'

    doc.autoTable(columnLookup, pdfFormattedRequest['non_clinical'], {
        theme: 'striped',
        margin: {top: 60},
        startY: doc.autoTable.previous.finalY
    });

    doc.text('Grand Total: $' + UIOWA_BudgetCalculator.formatAsCurrency(
            UIOWA_BudgetCalculator.currentRequest['grand_total']
        ), 650, doc.autoTable.previous.finalY + 25);

    doc.save('budget.pdf');
};

// Submit request data to REDCap project
UIOWA_BudgetCalculator.sendToProject = function () {
    var serviceReference = {
        clinical: this.currentRequest['clinical'],
        non_clinical: this.currentRequest['non_clinical']
    };
    var redcapFormattedRequest = [];
    var requestIndex = 0;

    $.each(serviceReference, function (serviceType, lineItems) { // clinical, non_clinical
        $.each(lineItems, function (lineIndex) { // line items
            redcapFormattedRequest.push(_.clone(serviceReference[serviceType][lineIndex]));
            redcapFormattedRequest[requestIndex]['redcap_repeat_instrument'] = 'service_info';
            redcapFormattedRequest[requestIndex]['redcap_repeat_instance'] = requestIndex + 1;

            if (serviceType == 'clinical') {
                redcapFormattedRequest[requestIndex]['clinical'] = 1;
            }

            requestIndex++;
        });
    });

    redcapFormattedRequest.push({
        clinical_total: this.currentRequest['clinical_total'],
        non_clinical_total: this.currentRequest['non_clinical_total'],
        grand_total: this.currentRequest['grand_total']
    });

    var requesterInfo = {};

    // get values from requester fields
    $('.info-field').each(function (index, input) {
        requesterInfo[$(input).attr('name')] = $(input).val();
    });
    $('.info-field-radio:checked').each(function (index, input) {
        requesterInfo[$(input).attr('name')] = $(input).val();
    });
    $('.info-field-checkbox:checked').each(function (index, input) {
        requesterInfo[$(input).attr('id')] = '1';
    });

    redcapFormattedRequest.push(requesterInfo);

    //console.log(redcapFormattedRequest);

    $.ajax({
        method: 'POST',
        url: UIOWA_BudgetCalculator.requestUrl + '&type=submit',
        data: JSON.stringify(redcapFormattedRequest)
    })
    .done(function(data) {
        $('#submit-success-popup').modal();
    })
};

// Format dollar amounts
UIOWA_BudgetCalculator.formatAsCurrency = function(value) {
    return Number(value).toLocaleString("en-US", {style: "decimal", minimumFractionDigits: 2})
};