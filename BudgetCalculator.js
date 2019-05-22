$(document).ready(function(){
    // Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    $('#dirtyCheck')
        .areYouSure({
            message: 'Services have been added to your budget. '
            + 'If you leave before saving, your changes will be lost.'
        })
        .trigger('checkform.areYouSure');

    // Delete row on delete button click
    $('#services-table').on("click", ".delete", function(){
        UIOWA_BudgetCalculator.removeService($(this).parents('tr').index(), $(this).closest('tbody').attr('id'));
    });

    // Update visits page on button click
    $('#prevVisitPage').click(function() {
        if (UIOWA_BudgetCalculator.visitPage > 0) {
            UIOWA_BudgetCalculator.visitPage--;
        }

        UIOWA_BudgetCalculator.updateVisitDisplay();
    });
    $('#nextVisitPage').click(function() {
        if (UIOWA_BudgetCalculator.visitPage < UIOWA_BudgetCalculator.maxPage) {
            UIOWA_BudgetCalculator.visitPage++;
        }

        UIOWA_BudgetCalculator.updateVisitDisplay();
    });

    $('#visit_count').change(function(){
        $.each(UIOWA_BudgetCalculator.visitGrid, function (index, row) {
            var lengthDiff = _.flatten(row).length - $('#visit_count_default').val();

            if (lengthDiff != 0) {
                var negative = Math.sign(lengthDiff) == -1;
                lengthDiff = Math.abs(lengthDiff);

                for (var i = 0; i < lengthDiff; i++) {
                    var pageIndex = UIOWA_BudgetCalculator.visitGrid[index].length - 1;

                    if (negative) {
                        UIOWA_BudgetCalculator.visitGrid[index][pageIndex].pop();
                    }
                    else {
                        UIOWA_BudgetCalculator.visitGrid[index][pageIndex].push(false);
                    }
                }
            }
        });

        UIOWA_BudgetCalculator.updateVisitDisplay();
    });

    $('#terms-checkbox').change(function () {
        var confirmBtn = $('#welcome-confirm');

        if (this.checked) {
            confirmBtn.prop( "disabled", false );
        }
        else {
            confirmBtn.prop( "disabled", true );
        }
    });

    // Initiate PDF download
    $('#pdf-export').click(function(){
        if (!$(this).hasClass('disabled')) {
            UIOWA_BudgetCalculator.savePdf();
        }
    });

    $('#savedBudget').change(function(){
        var confirmBtn = $('#welcome-confirm');
        var renameBtn = $('.rename-budget');
        var deleteBtn = $('.delete-budget');

        UIOWA_BudgetCalculator.clearBudget();

        if ($(this).val() != 'none') {
            confirmBtn.html('Load Selected Budget');
            renameBtn.show();
            deleteBtn.show();

            UIOWA_BudgetCalculator.loadFromProject();
            UIOWA_BudgetCalculator.toggleSaving(false);
        }
        else {
            confirmBtn.html('Create New Budget');
            renameBtn.hide();
            deleteBtn.hide();
            $('#budgetTitleDisplay').hide();
            UIOWA_BudgetCalculator.toggleSaving(true);
            $('#save-budget').addClass('disabled');
            $('#funding_type').find('option[value=""]').prop('disabled', false);
        }
    });

    $('#funding_type').change(function() {
        UIOWA_BudgetCalculator.updateTotals();
    });

    $('.rename-budget').click(function () {
        var renameInput = $('#savedBudgetRename');
        var savedBudgetSelect = $('#savedBudget');
        var selectedBudgetTitle = $('#savedBudget option:selected').html();

        if (renameInput.is(":visible")) {
            $('#savedBudget option:selected').html(renameInput.val());
            $('#budgetTitleText').html(renameInput.val());

            if (renameInput.val() != selectedBudgetTitle) {
                $.ajax({
                    method: 'POST',
                    url: UIOWA_BudgetCalculator.requestUrl + '&type=rename',
                    data: JSON.stringify([{
                        record_id: $('#savedBudget').val(),
                        budget_title: renameInput.val()
                    }]),
                    success: function () {
                        UIOWA_BudgetCalculator.savedBudgets[$('#savedBudget').val()]['budget_title'] = renameInput.val();
                        $('#budgetTitle').val(renameInput.val());
                    }
                });
            }

            savedBudgetSelect.show();
            renameInput.hide();

            $('#welcome-popup').find('button, input, select').prop('disabled', '');

            $(this)
                .removeClass('btn-success')
                .addClass('btn-primary')
                .find('i')
                .removeClass('fa-check')
                .addClass('fa-edit');
        }
        else {
            renameInput.val(selectedBudgetTitle);
            renameInput.prop('placeholder', selectedBudgetTitle);
            savedBudgetSelect.hide();
            renameInput.show();

            //disable all other buttons/inputs/etc until rename is done
            $('#welcome-popup')
                .find('button, input, select')
                .not('#savedBudgetRename, .rename-budget')
                .prop('disabled', 'disabled');

            //change rename button to green checkmark
            $(this)
                .removeClass('btn-primary')
                .addClass('btn-success')
                .find('i')
                .removeClass('fa-edit')
                .addClass('fa-check');

            //focus and highlight input
            renameInput.focus().select();
        }
    });

    $('#savedBudgetRename').on('keypress', function (e) {
        if(e.which === 13){
            $('.rename-budget').click();
        }
    });

    $('.delete-budget').click(function () {
        var confirmed = confirm('Are you sure you want to delete this budget?');

        if (confirmed) {
            $.ajax({
                method: 'POST',
                url: UIOWA_BudgetCalculator.requestUrl + '&type=delete',
                data: {
                    content: 'record',
                    action: 'delete',
                    records: JSON.stringify([
                        $('#savedBudget').val()
                    ])
                },
                success: function (data) {
                    $('#savedBudget option:selected').remove();
                    $('#savedBudget').change();
                }
            });


        }
    });

    $('#edit-budget-info').click(function(){
        $('#clinical-info-modal').modal('show');
    });

    $('#confirm-clinical-info').click(function(){
        var modal = $('#clinical-info-modal');
        var form = modal.find('form');

        form.validate({
            rules: {
                visit_count_default: {
                    required: false,
                    min: 1
                }
            }
        });

        if (form.valid()) {
            if (UIOWA_BudgetCalculator.lastService) {
                UIOWA_BudgetCalculator.addService(UIOWA_BudgetCalculator.lastService);
            }

            modal.modal('hide');
            form.validate().destroy();
        }
    });

    // Validate user input before submitting
    $('#welcome-confirm').click(function(){
        var form = $('#welcome-form');

        form.validate();

        if (form.valid()) {
            $('#welcome-popup').modal('hide');
            $('.welcome-only').hide();
            $('.edit-only').show();
        }
    });

    // Validate user input before submitting
    $('#submit-confirm').click(function(){
        var form = $('#submission-form');

        form.validate();

        // todo fix validation based on redcap rules
        //$.each(UIOWA_BudgetCalculator.submissionFieldLookup, function (index, field) {
        //    if (field['element_validation_type'] !== null) {
        //        //console.log($('#' + field['field_name'] + '_regex').val());
        //        $('#' + field['field_name']).rules('add', {
        //            regex: field['regex_js']
        //        });
        //    }
        //});

        if (form.valid()) {
            //$('#submit-confirmation-popup').modal('hide');
            //UIOWA_BudgetCalculator.saveToProject();
        }
    });

    $('#budgetTitle').on('keypress', function (e) {
        if(e.which === 13){
            $('#confirm-save-budget').click();
        }
    });

    $('#save-budget').click(function () {
        if (!$(this).hasClass('disabled') && !$(this).hasClass('saving')) {
            if ($('#budgetTitle').val() != '') {
                $(this).addClass('saving');
                $('#confirm-save-budget').click();
            }
            else {
                $('#save-modal').modal('show');
            }
        }
    });

    $('#confirm-save-budget').click(function(){
        UIOWA_BudgetCalculator.saveToProject();
    });

    $('#cancel-save-budget').click(function () {
        $('#budgetTitle').val('');
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

    $('#welcome-popup').modal({backdrop: 'static', keyboard: false});
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
    servicesData = _.map(servicesData, function(record) {
        var itemKey = Object.keys(record['repeat_instances'])[0];
        var instruments = record['repeat_instances'][itemKey];
        var serviceRecord = {};

        _.each(instruments, function(instrument) {
            var repeatKeys = Object.keys(instrument);
            var latestKey = repeatKeys[repeatKeys.length - 1];
            var latestInstance = instrument[latestKey];

            _.each(latestInstance, function(field, key) {
                if (field !== '') {
                    serviceRecord[key] = field;
                }
            });

            serviceRecord['revision'] = repeatKeys.length;
        });

        return serviceRecord;
    });

    this.data = _.filter(servicesData, function (item) {
        return item['active_service'] == '1';
    });

    servicesQuantityLabels = servicesQuantityLabels['element_enum'].split("\\n");
    var labelArray = [];

    _.each(servicesQuantityLabels, function(item) {
        item = item.trim();
        item = item.split(",");
        labelArray[item[0]] = item[1].trim();
    });

    this.quantityLabelLookup = labelArray;

    this.populateSmartMenu();
};

// Populate core/category/service dropdown with available options
UIOWA_BudgetCalculator.populateSmartMenu = function() {
    var data = this.data;
    var addServiceMenu = $('#add-service-menu');

    var newOptions = _.uniq(_.map(data, function(item) {
        return item['core'];
    }));

    for (var j in newOptions) {
        var newOption = document.createElement("option");
        newOption.text = newOptions[j];
        newOption.value = newOptions[j];

        addServiceMenu.append('<li class="core-menu"><a href="#">' + newOption.text + '</a><ul class="category-menu" data-id="' + newOption.text + '"></ul></li>');
    }

    var coreList = addServiceMenu.find('li');

    addServiceMenu.append('<li class="no-services hide">No Services Found</li>');

    coreList.each(function (index, coreListItem) {
        var coreItem = $(coreListItem).find('a');
        var categoryList = $(coreListItem).find('ul');
        var coreData = _.filter(data, function (item) {
            return item['core'] == $(coreItem).html();
        });
        var categoryData = _.uniq(_.map(coreData, function(item) {
            return item['category'];
        }));

        for (var j in categoryData) {
            var categoryLabel = categoryData[j];

            categoryList.append('<li class="show"><a href="#">' + categoryLabel + '</a><ul class="service-menu" data-id="' + categoryLabel + '"></ul></li>');

            var serviceList = $('ul[data-id="' + $(coreItem).html() + '"]').find('ul[data-id="' + categoryLabel + '"]');
            var filteredData = _.filter(coreData, function (item) {
                return item['core'] == $(coreItem).html() && item['category'] == categoryLabel;
            });
            var serviceData = _.uniq(_.map(filteredData, function(item) {
                return {
                    'id': item['record_id'],
                    'title': item['service'],
                    'type': item['clinical'] == "1" ? 'clinical' : 'non-clinical'
                };
            }));

            for (var k in serviceData) {
                serviceList.append('<li class="show"><a href="#" class="add-new" onclick="UIOWA_BudgetCalculator.addService(\'' + serviceData[k]['id'] + '\')">' + serviceData[k]['title'] + '</a></li>');
            }
        }
    });

    $('#main-menu').smartmenus({
        mainMenusSubOffsetX: 1,
        mainMenusSubOffsetY: -8,
        hideOnClick: false
        //,subMenusMinWidth: '300px'
    });

    // Filter box
    $(function() {
        $('#filter-menu').on('keyup', function() {
            var val = $(this).val();
            var $services = $('.service-menu > li');
            var $categories = $('.category-menu > li');
            var $cores = $('.core-menu');

            // clear all filtering
            $services.removeClass('hide').addClass('show');
            $categories.removeClass('hide').addClass('show');
            $cores.removeClass('hide').addClass('show');

            // filter services by textbox
            if (val.length > 0) {
                $services.filter(function() {
                    return $(this).children('a').eq(0).text().toLowerCase().indexOf(val.toLowerCase()) == -1;
                }).removeClass('show').addClass('hide');

                $categories.each(function () {
                    $services = $(this).find('.service-menu > li');

                    if ($services.filter(function() { return $(this).hasClass('show') }).length == 0) {
                        $(this).removeClass('show');
                        $(this).addClass('hide');
                    }
                    else {
                        $(this).removeClass('hide');
                        $(this).addClass('show');
                    }
                });

                $cores.each(function () {
                    $categories = $(this).find('.category-menu > li');

                    if ($categories.filter(function() { return $(this).hasClass('show') }).length == 0) {
                        $(this).removeClass('show');
                        $(this).addClass('hide');
                    }
                    else {
                        $(this).removeClass('hide');
                        $(this).addClass('show');
                    }
                });

                var $noServicesMsg = $('.no-services');

                if ($cores.find('.show').length == 0) {
                    $noServicesMsg.removeClass('hide');
                    $noServicesMsg.addClass('show');
                }
                else {
                    $noServicesMsg.removeClass('show');
                    $noServicesMsg.addClass('hide');
                }
            }
        });
    });
};

// Add service line item
UIOWA_BudgetCalculator.addService = function(recordID, savedBudgetInfo) {
    var visitInputComplete = $('#visit_count_default').val() > 0;
    var subjectInputComplete = $('#subject_count').val() != '';

    var serviceInfo = _.find(this.data, {
        record_id: recordID
    });

    if (serviceInfo['clinical'] == '1' && (!visitInputComplete || !subjectInputComplete)) {
        UIOWA_BudgetCalculator.lastService = recordID;

        $('#clinical-info-modal').modal();

        return;
    }
    else {
        UIOWA_BudgetCalculator.lastService = null;
    }

    var baseRate = $('#funding_type option')[1].value;
    var fundingType = $('#funding_type').val();

    var lineItemObj = {
        service_id: serviceInfo['record_id'],
        revision: serviceInfo['revision'],
        core: serviceInfo['core'],
        category: serviceInfo['category'],
        service: serviceInfo['service'],
        clinical: serviceInfo['clinical'],
        base_cost: Number(serviceInfo[baseRate]),
        your_cost: Number(serviceInfo[fundingType]),
        service_quantity: 1,
        unit_label: this.quantityLabelLookup[serviceInfo['per_service']],
        subtotal: 0.00
    };

    var serviceType = serviceInfo['clinical'] == '1' ? 'clinical' : 'non_clinical';
    var uniqueCols = "<td class='non_clinical-blank' colspan='7'></td>";

    if (serviceType == 'clinical') {
        // Disable visits input (todo: make this updatable on the fly)
        //$('#visit_count_default:enabled').attr("readonly", "readonly");

        lineItemObj['visit_count'] = 0;
        lineItemObj['service_quantity'] = Number($('#subject_count').val());
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
        $("<tr class='lineItem' oninput='UIOWA_BudgetCalculator.updateTotals()'>" +
            "<td style='border-right-style:hidden;'>" +
                "<span>" +
                    "<a class='delete' title='Delete' data-toggle='tooltip'>" +
                        "<i class='fas fa-trash fa-lg' style='color:red'></i>" +
                    "</a>" +
                "</span>" +
            "</td>" +
            "<td class='service-title'>" +
                "<small>" + lineItemObj['core'] + " > " + lineItemObj['category'] + "</small>" +
                "<br /><span>" + lineItemObj['service'] + "</span>" +
                "<i class='fas fa-info-circle info' style='color:#3E72A8' data-toggle='tooltip' title='" + serviceInfo['service_description'] + "'></i>" +
            "</td>" +
            "<td>$<span class='base-cost'>" + this.formatAsCurrency(lineItemObj['base_cost']) + "</span></td>" +
            "<td>$<span class='your-cost'>" + this.formatAsCurrency(lineItemObj['your_cost']) + "</span></td>" +
            "<td><input class='qty-count' type='number' min='1' value='" + lineItemObj['service_quantity'] + "'></td>" +
            "<td>" + lineItemObj['unit_label'] + "</td>" +
            uniqueCols +
            "<td>$<span class='line-total'>0.00</span></td>" +
        "</tr>");

    // Hide "no services" placeholder
    $('#' + serviceType + '-empty:visible').hide();

    // Enable submit/export buttons
    $('#submit').prop('disabled', false);
    $('#pdf-export').removeClass('disabled');

    // Add service line item to currentRequest object
    this.currentRequest[serviceType].push(lineItemObj);

    // Add service line item to table and add update qty inputs (if loaded budget)
    var qtyInput = lineItem.find('.qty-count');

    qtyInput.on('keyup change', function() {
        UIOWA_BudgetCalculator.toggleSaving(true);
    });

    if (savedBudgetInfo) {
        qtyInput.val(savedBudgetInfo['service_quantity']);
    }
    else {
        UIOWA_BudgetCalculator.toggleSaving(true);
    }

    $("#" + serviceType).append(lineItem);
    $('[data-toggle="tooltip"]').tooltip();

    this.updateVisitDisplay();
};

// Remove service line item
UIOWA_BudgetCalculator.removeService = function (lineIndex, serviceType) {
    var lineItem = $('#' + serviceType + ' > tr')[lineIndex];

    UIOWA_BudgetCalculator.visitGrid.splice(
        lineIndex - 1, 1
    );

    $(lineItem).remove();

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
        $('#pdf-export').addClass('disabled');

        UIOWA_BudgetCalculator.toggleSaving(false);
    }
    else {
        UIOWA_BudgetCalculator.toggleSaving(true);
    }

    // Remove line item from object
    UIOWA_BudgetCalculator.currentRequest[serviceType].splice(
        lineIndex - 1, 1
    );

    UIOWA_BudgetCalculator.updateTotals();
};

// Update budget totals
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
            var serviceInfo = _.find(UIOWA_BudgetCalculator.data, {
                record_id: lineItem['service_id']
            });

            var newServiceCost = Number(serviceInfo[$('#funding_type').val()]);

            // update "Your Cost" if changed
            if (newServiceCost != lineItem['your_cost']) {
                lineItem['your_cost'] = newServiceCost;
            }

            var tableLineItem = serviceTable[lineIndex];
            var subtotal = 0;

            var serviceCost = lineItem['your_cost'];
            var serviceQty = Number($(tableLineItem).find('.qty-count').val()); // Get latest qty from table

            // Count visit checkboxes
            var visitsArray = _.flatten(visitGrid[lineIndex]);
            var visitCount = _.reduce(visitsArray, function(memo, bool) { return memo + (bool === true ? 1 : 0)});

            // Update object and table with line totals
            if (serviceType == 'clinical') {
                var costPerSubject = serviceCost * visitCount;
                subtotal = costPerSubject * serviceQty;

                UIOWA_BudgetCalculator.currentRequest[serviceType][lineIndex]['visit_count'] = _.filter(
                    _.flatten(UIOWA_BudgetCalculator.visitGrid[lineIndex]),
                    function (value) {
                        return value;
                    }
                ).length;
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
};

// Update visit UI
UIOWA_BudgetCalculator.updateVisitDisplay = function () {
    this.maxPage = Math.ceil(document.getElementById('visit_count_default').value / this.visitsPerPage) - 1;

    var lineItems = $("#clinical").find('.lineItem');
    var prevButton = $('#prevVisitPage');
    var nextButton = $('#nextVisitPage');

    if (this.visitPage == 0) {
        prevButton.prop('disabled', true);
    }
    else {
        prevButton.prop('disabled', false);
    }
    if (this.visitPage == this.maxPage || this.maxPage == -1) {
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

    lineItems.each(function (index, row) {
        $(lineItems[index]).find('.visitCheckbox').remove();

        var visitCount = document.getElementById('visit_count_default').value;

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
                        "<button" +
                            " class='btn btn-danger fas fa-times uncheck-all-column-button'" +
                            " style='width: 40px'" +
                            " onclick='UIOWA_BudgetCalculator.updateVisitGrid(this, \"column\")'" +
                            " value='none'>" +
                        "</button>" +
                        "<button" +
                            " class='btn btn-success fas fa-check check-all-column-button'" +
                            " style='width: 40px'" +
                            " onclick='UIOWA_BudgetCalculator.updateVisitGrid(this, \"column\")'" +
                            " value='all'>" +
                        "</button>"
                    );

                    visitIndex++;
                }
            }
        }

        // update (un)check all row buttons
        var allVisitsChecked = visitData.every(function (value) {
            return value == true
        });
        var checkAllButton = $(row).find('.checkAllRow');
        var uncheckAllButton = $(row).find('.uncheckAllRow');

        if (allVisitsChecked) {
            checkAllButton.hide();
            uncheckAllButton.show();
        }
        else {
            checkAllButton.show();
            uncheckAllButton.hide();
        }
    });

    // update (un)check all column buttons
    $('.checkAllColumn').each(function (index, column) {
        var allVisitsChecked = $.map(UIOWA_BudgetCalculator.visitGrid, function (row) {
            return row[UIOWA_BudgetCalculator.visitPage][index];
        });

        allVisitsChecked = allVisitsChecked.every(function (value) {
            return value == true
        });
        var checkAllButton = $(column).find('.check-all-column-button');
        var uncheckAllButton = $(column).find('.uncheck-all-column-button');

        if (allVisitsChecked) {
            checkAllButton.hide();
            uncheckAllButton.show();
        }
        else {
            checkAllButton.show();
            uncheckAllButton.hide();
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
    }
    else {
        checked = checkbox.checked ? true : false;

        this.visitGrid[lineIndex][this.visitPage][index] = checked;
    }

    UIOWA_BudgetCalculator.toggleSaving(true);
    UIOWA_BudgetCalculator.updateVisitDisplay();
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
        'base_cost',
        'your_cost',
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

    var doc = new jsPDF('l', 'pt');

    //console.log(pdfFormattedRequest);

    // todo user info from submit
    //var columnLookup = [
    //    {title: 'Clinical Service', dataKey: 'service'},                    // 0
    //    {title: 'Base Cost', dataKey: 'base_cost'},                         // 1
    //    {title: 'Your Rate', dataKey: 'adjusted_rate'},                     // 2
    //    {title: 'Subjects', dataKey: 'service_quantity'},                   // 3
    //    {title: 'Quantity Type', dataKey: 'unit_label'},                    // 4
    //    {title: 'Visits', dataKey: 'visit_count'},                          // 5
    //    {title: 'Cost Per Subject', dataKey: 'cost_per_subject'},           // 6
    //    {title: 'Total', dataKey: 'subtotal'}                               // 7
    //];
    //
    //doc.autoTable(columnLookup, pdfFormattedRequest['clinical'], {
    //    //theme: 'striped',
    //    margin: {top: 60}
    //});

    columnLookup = [
        {title: 'Clinical Service', dataKey: 'service'},                    // 0
        {title: 'Base Cost', dataKey: 'base_cost'},                         // 1
        {title: 'Your Rate', dataKey: 'adjusted_rate'},                     // 2
        {title: 'Subjects', dataKey: 'service_quantity'},                   // 3
        {title: 'Quantity Type', dataKey: 'unit_label'},                    // 4
        {title: 'Visits', dataKey: 'visit_count'},                          // 5
        {title: 'Cost Per Subject', dataKey: 'cost_per_subject'},           // 6
        {title: 'Total', dataKey: 'subtotal'}                               // 7
    ];

    doc = new jsPDF('l', 'pt');
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
UIOWA_BudgetCalculator.saveToProject = function () {
    var saveBtn = $('#save-budget');
    var savedSelect = $('#savedBudget');

    saveBtn.prop('disabled', true);
    saveBtn.html('<i class="fas fa-spinner fa-spin test-progress"></i> Saving...');

    var serviceReference = {
        clinical: this.currentRequest['clinical'],
        non_clinical: this.currentRequest['non_clinical']
    };
    var redcapFormattedRequest = [];
    var requestIndex = 0;
    var savedTimestamp = UIOWA_BudgetCalculator.getTimestamp();

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
        timestamp: savedTimestamp,
        budget_title: $('#budgetTitle').val(),
        subject_count: $('#subject_count').val(),
        visit_total: $('#visit_count_default').val(),
        visit_data: JSON.stringify(UIOWA_BudgetCalculator.visitGrid),
        funding_type: $('#funding_type').val(),
        username: UIOWA_BudgetCalculator.currentUser,
        clinical_total: this.currentRequest['clinical_total'],
        non_clinical_total: this.currentRequest['non_clinical_total'],
        grand_total: this.currentRequest['grand_total']
    });

    //if () {
    //    var requesterInfo = {};
    //
    //    // get values from requester fields
    //    $('.info-field').not('.ignore').each(function (index, input) {
    //        requesterInfo[$(input).attr('name')] = $(input).val();
    //    });
    //    $('.info-field-radio:checked').each(function (index, input) {
    //        requesterInfo[$(input).attr('name')] = $(input).val();
    //    });
    //    $('.info-field-checkbox:checked').each(function (index, input) {
    //        requesterInfo[$(input).attr('id')] = '1';
    //    });
    //
    //    redcapFormattedRequest.push(requesterInfo);
    //}

    $.ajax({
        method: 'POST',
        url: UIOWA_BudgetCalculator.requestUrl + '&type=save',
        data: JSON.stringify({
            record_id: savedSelect.val() == 'none' ? null : savedSelect.val(),
            username: UIOWA_BudgetCalculator.currentUser,
            budget: JSON.stringify(redcapFormattedRequest)
        }),
        success: function (data) {
            data = JSON.parse(data);
            var newRecordId = Object.keys(data['ids'])[0];

            if (data['errors'].length > 0) {
                console.log(data['errors']);
                $(saveBtn).html('<i class="fas fa-times"></i> Save Failed');
            }
            else {
                $('#budgetTitleDisplay').show();
                $('#budgetTitleText').html($('#budgetTitle').val());

                //todo still saving duplicates...only on first cause no dropdown exists
                // Add new record_id to dropdown to avoid duplicates
                if (savedSelect.val() == 'none') {
                    savedSelect
                        .append(
                            $('<option></option>')
                                .attr('value', newRecordId)
                                .text($('#budgetTitle').val())
                        )
                        .val(newRecordId);
                }

                $('#lastSaveTime').attr('datetime', savedTimestamp);
                timeago.cancel();
                timeago.render($('#lastSaveTime'));

                $(saveBtn).html('<i class="fas fa-check"></i> Saved');
                $(saveBtn).removeClass('saving');
                UIOWA_BudgetCalculator.toggleSaving(false);
            }
        }
    });
};

// Load request data from REDCap project
UIOWA_BudgetCalculator.loadFromProject = function () {
    var record_id = $('#savedBudget').val();
    var budgetInfo = UIOWA_BudgetCalculator.savedBudgets[record_id];

    $('#subject_count').val(budgetInfo['subject_count']);
    $('#visit_count_default').val(budgetInfo['visit_total']);
    $('#budgetTitle').val(budgetInfo['budget_title']);
    $('#funding_type')
        .val(budgetInfo['funding_type'])
        .find('option[value=""]').prop('disabled', true);

    $.each(budgetInfo['repeat_instances'], function (index, lineItem) {
        UIOWA_BudgetCalculator.addService(lineItem['service_id'], lineItem);
    });

    $('#budgetTitleDisplay').show();
    $('#budgetTitleText').html($('#budgetTitle').val());

    var timestamp = budgetInfo['timestamp'];
    $('#lastSaveTime').attr('datetime', timestamp);
    timeago.cancel();
    timeago.render($('#lastSaveTime'));

    UIOWA_BudgetCalculator.visitGrid = JSON.parse(budgetInfo['visit_data']);
    UIOWA_BudgetCalculator.updateVisitDisplay();
};

// Remove all services and clear fields
UIOWA_BudgetCalculator.clearBudget = function () {
    var clinicalRows = $('#clinical > tr').not('#clinical-empty').length;
    var nonClinicalRows = $('#non_clinical > tr').not('#non_clinical-empty').length;

    while (clinicalRows > 0) {
        UIOWA_BudgetCalculator.removeService(1, 'clinical');
        clinicalRows--;
    }
    while (nonClinicalRows > 0) {
        UIOWA_BudgetCalculator.removeService(1, 'non_clinical');
        nonClinicalRows--;
    }

    $('#subject_count').val('');
    $('#visit_count_default').val('');
    $('#funding_type').val('');
    $('#budgetTitle').val('');
};

UIOWA_BudgetCalculator.toggleSaving = function (saveAllowed) {
    var saveBtn = $('#save-budget');
    var dirtyCheck = $('#dirtyCheck');

    if (saveAllowed) {
        saveBtn.html('Save for Later');
        saveBtn.removeClass('disabled');
        dirtyCheck.addClass('dirty');
    }
    else {
        saveBtn.html('Saved');
        saveBtn.addClass('disabled');
        dirtyCheck.removeClass('dirty');
    }
};

// Format dollar amounts
UIOWA_BudgetCalculator.formatAsCurrency = function(value) {
    return Number(value).toLocaleString("en-US", {style: "decimal", minimumFractionDigits: 2})
};

// Get current datetime
UIOWA_BudgetCalculator.getTimestamp = function () {
    var date = new Date();

    date =
        date.getFullYear() + "-" +
        ('0' + (date.getMonth() + 1)).slice(-2) + "-" +
        ('0' + date.getDate()).slice(-2) + " " +
        ('0' + date.getHours()).slice(-2) + ":" +
        ('0' + date.getMinutes()).slice(-2) + ":" +
        ('0' + date.getSeconds()).slice(-2);

    return date;
};