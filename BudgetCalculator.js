$(document).ready(function(){
    var Events = {
        init: function() {
            this.bindEventHandlers();
        },
        bindEventHandlers: function () {
            var allHandlers = _.flatten(this.eventHandlers);

            for (var i = 0; i < allHandlers.length; i++) {
                this.bindEvent(allHandlers[i]);
            }
        },
        bindEvent: function(e) {
            e.$el.on(e.event, e.selector, e.handler);
        },
        eventHandlers: [
            // #addServiceMenu
            [
                {
                    // Add service
                    $el: $('#addServiceMenu'),
                    selector: '.add-service',
                    event: 'click',
                    handler: function() {
                        UIOWA_BudgetCalculator.addService($(this).attr('data-id'));
                    }
                },
                {
                    $el: $('#addServiceMenu'),
                    selector: '#filter-menu',
                    event: 'keyup',
                    handler: function() {
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
                    }
                },
                {
                    // Download PDF
                    $el: $('#downloadPdfBtn'),
                    event: 'click',
                    handler: function() {
                        if (!$(this).hasClass('disabled')) {
                            UIOWA_BudgetCalculator.savePdf();
                        }
                    }
                },
                {
                    // Save budget button
                    $el: $('#saveBtn'),
                    event: 'click',
                    handler: function() {
                        if (!$(this).hasClass('disabled') && !$(this).hasClass('saving')) {
                            if ($('#userTitleInput').val() != '') {
                                $(this).addClass('saving');
                                $('#confirmSaveBtn').click();
                            }
                            else {
                                $('#saveModal').modal('show');
                            }
                        }
                    }
                }
            ],
            // #servicesTable
            [
                {
                    // Update visits page on button click
                    $el: $('#prevVisitsBtn'),
                    event: 'click',
                    handler: function() {
                        if (UIOWA_BudgetCalculator.visitPage > 0) {
                            UIOWA_BudgetCalculator.visitPage--;
                        }

                        UIOWA_BudgetCalculator.updateVisitDisplay();
                    }
                },
                {
                    // Update visits page on button click
                    $el: $('#nextVisitsBtn'),
                    event: 'click',
                    handler: function() {
                        if (UIOWA_BudgetCalculator.visitPage < UIOWA_BudgetCalculator.maxPage) {
                            UIOWA_BudgetCalculator.visitPage++;
                        }

                        UIOWA_BudgetCalculator.updateVisitDisplay();
                    }
                },
                {
                    // Delete service row on button click
                    $el: $('#servicesTable'),
                    selector: '.delete',
                    event: 'click',
                    handler: function() {
                        UIOWA_BudgetCalculator.removeService(
                            $(this).parents('tr').index(),
                            $(this).closest('tbody').attr('id')
                        );
                    }
                },
                {
                    // Delete service row on button click
                    $el: $('#servicesTable'),
                    selector: '.qty-count',
                    event: 'keyup change',
                    handler: function() {
                        UIOWA_BudgetCalculator.toggleSaving(true);
                    }
                },
                {
                    // Visit checkbox
                    $el: $('#servicesTable'),
                    selector: '.visit-checkbox',
                    event: 'click',
                    handler: function() {
                        UIOWA_BudgetCalculator.updateVisitGrid(this, $(this).attr('data-id'));
                    }
                },
                {
                    // Check all visit button (column)
                    $el: $('#servicesTable'),
                    selector: '.check-column-button',
                    event: 'click',
                    handler: function() {
                        UIOWA_BudgetCalculator.updateVisitGrid(this, 'column');
                    }
                },
                {
                    // Check all visit button (row)
                    $el: $('#servicesTable'),
                    selector: '.check-row-button',
                    event: 'click',
                    handler: function() {
                        UIOWA_BudgetCalculator.updateVisitGrid(this, 'row');
                    }
                }
            ],
            // #welcomeModal
            [
                {
                    // Load saved budget
                    $el: $('#savedBudget'),
                    event: 'change',
                    handler: function() {
                        var $confirmBtn = $('#welcomeConfirmBtn');
                        var $renameBtn = $('.rename-budget');
                        var $deleteBtn = $('.delete-budget');

                        UIOWA_BudgetCalculator.clearBudget();

                        if ($(this).val() != 'none') {
                            $confirmBtn.html('Load Selected Budget');
                            $renameBtn.show();
                            $deleteBtn.show();

                            UIOWA_BudgetCalculator.loadFromProject();
                            UIOWA_BudgetCalculator.toggleSaving(false);
                        }
                        else {
                            $confirmBtn.html('Create New Budget');
                            $renameBtn.hide();
                            $deleteBtn.hide();
                            $('#budgetTitleDisplay').hide();
                            UIOWA_BudgetCalculator.toggleSaving(true);
                            $('#saveBtn').addClass('disabled');
                            $('#fundingType').find('option[value=""]').prop('disabled', false);
                        }
                    }
                },
                {
                    // Enable/disable confirm button if terms not accepted
                    $el: $('#termsCheckbox'),
                    event: 'change',
                    handler: function() {
                        var confirmBtn = $('#welcomeConfirmBtn');

                        if (this.checked) {
                            confirmBtn.prop( "disabled", false );
                        }
                        else {
                            confirmBtn.prop( "disabled", true );
                        }
                    }
                },
                {
                    // Update totals on funding type change
                    $el: $('#fundingType'),
                    event: 'change',
                    handler: function() {
                        UIOWA_BudgetCalculator.updateTotals();
                    }
                },
                {
                    // Rename budget
                    $el: $('.rename-budget'),
                    event: 'click',
                    handler: function() {
                        var renameInput = $('#savedBudgetRename');
                        var savedBudgetSelect = $('#savedBudget');
                        var selectedBudgetTitle = $('#savedBudget option:selected').html();

                        if (renameInput.is(":visible")) {
                            if (renameInput.val() != selectedBudgetTitle && renameInput.val() != '') {
                                $('#savedBudget option:selected').html(renameInput.val());
                                $('#budgetTitleText').html(renameInput.val());

                                $.ajax({
                                    method: 'POST',
                                    url: UIOWA_BudgetCalculator.requestUrl + '&type=rename',
                                    data: JSON.stringify([{
                                        record_id: $('#savedBudget').val(),
                                        budget_title: renameInput.val()
                                    }]),
                                    success: function () {
                                        UIOWA_BudgetCalculator.savedBudgets[$('#savedBudget').val()].budget_title = renameInput.val();
                                        $('#userTitleInput').val(renameInput.val());
                                    }
                                });
                            }

                            savedBudgetSelect.show();
                            renameInput.hide();

                            $('#welcomeModal').find('button, input, select').prop('disabled', '');

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
                            $('#welcomeModal')
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
                    }
                },
                {
                    // Rename budget enter key
                    $el: $('#savedBudgetRename'),
                    event: 'keypress',
                    handler: function(e) {
                        if(e.which === 13){
                            $('.rename-budget').click();
                        }
                    }
                },
                {
                    // Delete budget button
                    $el: $('.delete-budget'),
                    event: 'click',
                    handler: function() {
                        var confirmed = confirm('Are you sure you want to delete this budget?');
                        var $savedBudgetSelect = $('#savedBudget');

                        if (confirmed) {
                            $.ajax({
                                method: 'POST',
                                url: UIOWA_BudgetCalculator.requestUrl + '&type=delete',
                                data: {
                                    content: 'record',
                                    action: 'delete',
                                    records: JSON.stringify([
                                        $savedBudgetSelect.val()
                                    ])
                                },
                                success: function () {
                                    $savedBudgetSelect
                                        .find('option:selected')
                                        .remove();
                                    $savedBudgetSelect.change();
                                }
                            });
                        }
                    }
                },
                {
                    // Validate user input before submitting
                    $el: $('#welcomeConfirmBtn'),
                    event: 'click',
                    handler: function() {
                        var $form = $('#welcomeForm');

                        $form.validate();

                        if ($form.valid()) {
                            $('#welcomeModal').modal('hide');
                            $('.welcome-only').hide();
                            $('.edit-only').show();
                        }
                    }
                }
            ],
            // #budgetInfoModal
            [
                {
                    // Update visit display based on input
                    $el: $('#visit_count'),
                    event: 'change',
                    handler: function() {
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
                    }
                },
                {
                    // Confirm clinical info button
                    $el: $('#confirmInfoBtn'),
                    event: 'click',
                    handler: function() {
                        var $modal = $('#budgetInfoModal');
                        var $form = $modal.find('form');

                        $form.validate({
                            rules: {
                                visit_count_default: {
                                    required: false,
                                    min: 1
                                }
                            }
                        });

                        if ($form.valid()) {
                            if (UIOWA_BudgetCalculator.lastService) {
                                UIOWA_BudgetCalculator.addService(UIOWA_BudgetCalculator.lastService);
                            }

                            $modal.modal('hide');
                            $form.validate().destroy();
                        }
                    }
                },
                {
                    // Confirm budget title (enter key)
                    $el: $('#userTitleInput'),
                    event: 'keypress',
                    handler: function(e) {
                        if(e.which === 13){
                            $('#confirmSaveBtn').click();
                        }
                    }
                }
            ],
            // #saveModal
            [
                {
                    // Confirm save budget button
                    $el: $('#confirmSaveBtn'),
                    event: 'click',
                    handler: function() {
                        var $modal = $('#saveModal');
                        var $form = $modal.find('form');

                        $form.validate();

                        if ($form.valid()) {
                            UIOWA_BudgetCalculator.saveToProject();

                            $modal.modal('hide');
                        }
                    }
                },
                {
                    // Clear title value if not saved
                    $el: $('#cancelSaveBtn'),
                    event: 'click',
                    handler: function() {
                        $('#userTitleInput').val('');
                    }
                }
            ],
            // #submitModal
            [
                {
                    // Reload page after successful submit
                    $el: $('#submitSuccessModal'),
                    event: 'hidden.bs.modal',
                    handler: function() {
                        location.reload();
                    }
                },
                {
                    // Validate user input before submitting
                    $el: $('#confirmSubmitBtn'),
                    event: 'click',
                    handler: function() {
                        var $form = $('#submissionForm');

                        $form.validate();

                        // todo fix validation based on redcap rules
                        //$.each(UIOWA_BudgetCalculator.submissionFieldLookup, function (index, field) {
                        //    if (field.element_validation_type !== null) {
                        //        //console.log($('#' + field.field_name + '_regex').val());
                        //        $('#' + field.field_name).rules('add', {
                        //            regex: field.regex_js
                        //        });
                        //    }
                        //});

                        if ($form.valid()) {
                            //$('#submitModal').modal('hide');
                            //UIOWA_BudgetCalculator.saveToProject();
                        }
                    }
                }
            ]
        ]
    };

    Events.init();

    // Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    $('#dirtyCheck')
        .areYouSure({
            message: 'Services have been added to your budget. '
            + 'If you leave before saving, your changes will be lost.'
        })
        .trigger('checkform.areYouSure');

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
        if (field.element_validation_type !== null) {
            if (field.element_validation_type.substring(0, 4) == 'date') {
                var dateFormat = field.element_validation_type.substring(5);
                dateFormat = dateFormat.split('');
                dateFormat[dateFormat.indexOf('y')] = 'yy';
                dateFormat = dateFormat.join('-');

                $('#' + field.field_name).datepicker({
                    dateFormat: dateFormat
                })
            }
        }
    });

    UIOWA_BudgetCalculator.formatServicesData(servicesData, servicesQuantityLabels);

    $('#welcomeModal').modal({backdrop: 'static', keyboard: false});
});

var UIOWA_BudgetCalculator = {
    data: {},
    quantityLabelLookup: [],
    visitGrid: [],
    visitPage: 0,
    maxPage: 0,
    visitsPerPage: 5,
    currentRequest: {
        clinical: [],
        non_clinical: []
    },

    // Format services data from source project
    formatServicesData: function(servicesData, servicesQuantityLabels) {
        servicesData = _.map(servicesData, function(record) {
            var itemKey = Object.keys(record.repeat_instances)[0];
            var instruments = record.repeat_instances[itemKey];
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

                serviceRecord.revision = repeatKeys.length;
            });

            return serviceRecord;
        });

        this.data = _.filter(servicesData, function (item) {
            return item.active_service == '1';
        });

        servicesQuantityLabels = servicesQuantityLabels.element_enum.split("\\n");
        var labelArray = [];

        _.each(servicesQuantityLabels, function(item) {
            item = item.trim();
            item = item.split(",");
            labelArray[item[0]] = item[1].trim();
        });

        this.quantityLabelLookup = labelArray;

        this.populateSmartMenu();
    },

    // Populate core/category/service dropdown with available options
    populateSmartMenu: function() {
        var data = this.data;
        var $addServiceMenu = $('#addServiceMenu');

        var newOptions = _.uniq(_.map(data, function (item) {
            return item.core;
        }));

        for (var j in newOptions) {
            var newOption = document.createElement("option");
            newOption.text = newOptions[j];
            newOption.value = newOptions[j];

            $addServiceMenu.append(`
                <li class="core-menu">
                    <a href="#">${newOption.text}</a>
                    <ul class="category-menu" data-id="${newOption.text}"></ul>
                </li>
            `);
        }

        var $coreList = $addServiceMenu.find('li');

        $addServiceMenu.append(`<li class="no-services hide">No Services Found</li>`);

        $coreList.each(function (index, coreListItem) {
            var $coreItem = $(coreListItem).find('a');
            var $categoryList = $(coreListItem).find('ul');
            var coreData = _.filter(data, function (item) {
                return item.core == $($coreItem).html();
            });
            var categoryData = _.uniq(_.map(coreData, function (item) {
                return item.category;
            }));

            for (var j in categoryData) {
                var categoryLabel = categoryData[j];

                $categoryList.append(`
                    <li class="show">
                        <a href="#">${categoryLabel}</a>
                        <ul class="service-menu" data-id="${categoryLabel}"></ul>
                    </li>
                `);

                var $serviceList = $('ul[data-id="' + $($coreItem).html() + '"]').find('ul[data-id="' + categoryLabel + '"]');
                var filteredData = _.filter(coreData, function (item) {
                    return item.core == $($coreItem).html() && item.category == categoryLabel;
                });
                var serviceData = _.uniq(_.map(filteredData, function (item) {
                    return {
                        'id': item.record_id,
                        'title': item.service,
                        'type': item.clinical == "1" ? 'clinical' : 'non-clinical'
                    };
                }));

                for (var k in serviceData) {
                    $serviceList.append(`
                        <li class="show">
                            <a href="#" class="add-service" data-id=${serviceData[k].id}>
                                ${serviceData[k].title}
                            </a>
                        </li>
                    `);
                }
            }
        });

        $('#main-menu').smartmenus({
            mainMenusSubOffsetX: 1,
            mainMenusSubOffsetY: -8,
            hideOnClick: false
            //,subMenusMinWidth: '300px'
        });
    },

    // Add service line item
    addService: function(recordID, savedBudgetInfo) {
        var visitInputComplete = $('#visit_count_default').val() > 0;
        var subjectInputComplete = $('#subject_count').val() != '';

        var serviceInfo = _.find(this.data, {
            record_id: recordID
        });

        if (serviceInfo.clinical == '1' && (!visitInputComplete || !subjectInputComplete)) {
            this.lastService = recordID;

            $('#budgetInfoModal').modal();

            return;
        }
        else {
            this.lastService = null;
        }

        var baseRate = $('#fundingType option')[1].value;
        var fundingType = $('#fundingType').val();

        var lineItemObj = {
            service_id: serviceInfo.record_id,
            revision: serviceInfo.revision,
            core: serviceInfo.core,
            category: serviceInfo.category,
            service: serviceInfo.service,
            clinical: serviceInfo.clinical,
            base_cost: Number(serviceInfo[baseRate]),
            your_cost: Number(serviceInfo[fundingType]),
            service_quantity: 1,
            unit_label: this.quantityLabelLookup[serviceInfo.per_service],
            subtotal: 0.00
        };

        var serviceType = serviceInfo.clinical == '1' ? 'clinical' : 'non_clinical';
        var visitsCell = "<td class='non_clinical-blank' colspan='7'></td>";

        if (serviceType == 'clinical') {
            // Disable visits input (todo: make this updatable on the fly)
            //$('#visit_count_default:enabled').attr("readonly", "readonly");

            lineItemObj.visit_count = 0;
            lineItemObj.service_quantity = Number($('#subject_count').val());
            visitsCell = `
                <td class='allVisits'>
                    <button
                        class='btn btn-success fas fa-check check-row-button'
                        style='width: 40px'
                        value='all'>
                    </button>
                </td>
                <td class='visit-column'></td>
                <td class='visit-column'></td>
                <td class='visit-column'></td>
                <td class='visit-column'></td>
                <td class='visit-column'></td>
                <td>$<span class='line-total-per-patient'>0.00</span></td>
            `
        }

        var $lineItem = $(`
            <tr class='service-line-item' oninput='UIOWA_BudgetCalculator.updateTotals()'>
                <td style='border-right-style:hidden;'>
                    <span>
                        <button class='delete btn btn-link' title='Delete' data-toggle='tooltip'>
                            <i class='fas fa-trash fa-lg delete-icon' style='color:red'></i>
                        </button>
                    </span>
                </td>
                <td class='service-title'>
                    <small>${lineItemObj.core} > ${lineItemObj.category} </small>
                    <br /><span> ${lineItemObj.service} </span>
                    <i class='fas fa-info-circle info' style='color:#3E72A8' data-toggle='tooltip' title=' ${serviceInfo.service_description} '></i>
                </td>
                <td>$<span class='base-cost'> ${this.formatAsCurrency(lineItemObj.base_cost)} </span></td>
                <td>$<span class='your-cost'> ${this.formatAsCurrency(lineItemObj.your_cost)} </span></td>
                <td><input class='qty-count' type='number' min='1' value='${lineItemObj.service_quantity}'></td>
                <td> ${lineItemObj.unit_label} </td>
                ${visitsCell}
                <td>$<span class='line-total'>0.00</span></td>
            </tr>
        `);

        // Hide "no services" placeholder
        $('#' + serviceType + 'Empty:visible').hide();

        // Enable submit/export buttons
        $('#submit').prop('disabled', false);
        $('#downloadPdfBtn').removeClass('disabled');

        // Add service line item to currentRequest object
        this.currentRequest[serviceType].push(lineItemObj);

        if (savedBudgetInfo) {
            $lineItem.find('.qty-count').val(savedBudgetInfo.service_quantity);
        }
        else {
            this.toggleSaving(true);
        }

        $("#" + serviceType).append($lineItem);
        $('[data-toggle="tooltip"]').tooltip();

        if (serviceType == 'clinical') {
            this.updateVisitDisplay();
        }
    },

    // Remove service line item
    removeService: function (lineIndex, serviceType) {
        var lineItem = $('#' + serviceType + ' > tr')[lineIndex];

        $(lineItem).remove();

        var clinicalServiceCount = $('#clinical').find('.service-line-item').length;
        var nonClinicalServiceCount = $('#non_clinical').find('.service-line-item').length;

        // Show "No services added" placeholders, disable visits
        if (clinicalServiceCount == 0) {
            $('#clinicalEmpty').show();

            $('#prevVisitsBtn, #nextVisitsBtn').prop('disabled', true);

            this.toggleCheckAllButton($('.check-column-button'), false, true);
        }
        if (nonClinicalServiceCount == 0) {
            $('#non_clinicalEmpty').show();
        }

        // Disable submit/export buttons
        if (clinicalServiceCount == 0 && nonClinicalServiceCount == 0) {
            $('#submit').prop('disabled', true);
            $('#downloadPdfBtn').addClass('disabled');

            this.toggleSaving(false);
        }
        else {
            this.toggleSaving(true);
        }

        // Remove line item and visits from objects
        this.currentRequest[serviceType].splice(lineIndex - 1, 1);
        this.visitGrid.splice(lineIndex - 1, 1);

        this.updateTotals();
    },

    // Update budget totals
    updateTotals: function() {
        var self = this;
        var totals = {
            'clinical': 0,
            'non_clinical': 0,
            'grand': 0
        };

        $.each(['clinical', 'non_clinical'], function (i, serviceType) {
            var $serviceTable = $('#' + serviceType + ' > tr').not('#' + serviceType + 'Empty');

            $.each(self.currentRequest[serviceType], function (lineIndex, lineItem) {
                var serviceInfo = _.find(self.data, {
                    record_id: lineItem.service_id
                });

                // Count visit checkboxes
                var visitCount = _.reduce(
                    _.flatten(self.visitGrid[lineIndex]),
                    function(memo, bool) {
                        return memo + (bool === true ? 1 : 0)
                    }
                );

                var subtotal = 0;
                var newServiceCost = Number(serviceInfo[$('#fundingType').val()]);
                var $tableLineItem = $($serviceTable[lineIndex]);
                var serviceQty = Number($tableLineItem.find('.qty-count').val()); // Get latest qty from table

                // todo alert if cost changed
                if (newServiceCost != lineItem.your_cost) {
                    console.log('changed')
                }

                // Update object and table with line totals
                if (serviceType == 'clinical') {
                    var costPerSubject = newServiceCost * visitCount;
                    subtotal = costPerSubject * serviceQty;

                    lineItem.visit_count = _.filter(
                        _.flatten(self.visitGrid[lineIndex]),
                        function (value) {
                            return value;
                        }
                    ).length;

                    lineItem.cost_per_subject = costPerSubject;
                    $tableLineItem
                        .find('.line-total-per-patient')
                        .html(self.formatAsCurrency(costPerSubject));
                }
                else {
                    subtotal = serviceQty * newServiceCost;
                }

                totals[serviceType] += subtotal;

                lineItem.your_cost = newServiceCost;
                lineItem.service_quantity = serviceQty;
                lineItem.subtotal = subtotal;
                $tableLineItem
                    .find('.line-total')
                    .html(self.formatAsCurrency(subtotal));
            });

            // Update object and table with subtotal
            self.currentRequest[serviceType + '_total'] = totals[serviceType];
            $('#' + serviceType + 'Total').html(self.formatAsCurrency(totals[serviceType]));
        });

        totals.grand = totals.clinical + totals.non_clinical;

        // Update object and table with grand total
        this.currentRequest.grand_total = totals.grand;
        $('.total').html(this.formatAsCurrency(totals.grand));
    },

    // Update visit UI
    updateVisitDisplay: function () {
        var self = this;
        var $lineItems = $("#clinical").find('.service-line-item');

        // Set max page based on total visits
        this.maxPage = Math.ceil($('#visit_count_default').val() / this.visitsPerPage) - 1;

        // Set previous/next buttons enabled/disabled
        $('#prevVisitsBtn').prop('disabled', this.visitPage == 0);
        $('#nextVisitsBtn').prop('disabled', this.visitPage == this.maxPage || this.maxPage == -1);

        $('.visit-header').each(function (index, td) {
            $(td).html('');
        });

        $lineItems.each(function (index, row) {
            var $row = $(row);
            var visitCount = $('#visit_count_default').val();

            $row
                .find('.visit-checkbox')
                .remove();

            if (typeof self.visitGrid[index] === 'undefined') {
                var newServiceVisits = [];

                for (var i = 0; i < visitCount; i++) {

                    if (i % self.visitsPerPage == 0) {
                        var newVisitGroup = [];
                    }

                    newVisitGroup.push(false);

                    if (i % self.visitsPerPage == self.visitsPerPage - 1 || i == visitCount - 1) {
                        newServiceVisits.push(newVisitGroup);
                    }
                }

                self.visitGrid[index] = newServiceVisits;
            }

            var $visitColumns = $row.find('.visit-column');
            var visitData = self.visitGrid[index][self.visitPage];
            var visitIndex = self.visitPage * self.visitsPerPage;
            var loopMax = visitIndex + self.visitsPerPage;

            if (!(typeof visitData === 'undefined')) {
                for (var j = 0; j < loopMax; j++) {
                    if (!(typeof visitData[j] === 'undefined')) {
                        $($visitColumns[j]).append(`
                            <input
                                type='checkbox'
                                class='visit-checkbox'
                                data-id='${j}'
                                ${visitData[j] ? 'checked' : ''}
                            >
                        `);

                        visitIndex++;

                        $('.visit-header')
                            .eq(j)
                            .html(visitIndex);
                    }
                }
            }

            // update (un)check all row buttons
            var allVisitsChecked = visitData.every(function (value) {
                return value == true
            });

            self.toggleCheckAllButton($row.find('.check-row-button'), allVisitsChecked)
        });

        // update (un)check all column buttons
        $('.check-all-column').each(function (index, column) {
            var allVisitsChecked = $.map(UIOWA_BudgetCalculator.visitGrid, function (row) {
                return row[UIOWA_BudgetCalculator.visitPage][index];
            });

            allVisitsChecked = allVisitsChecked.every(function (value) {
                return value == true
            });

            self.toggleCheckAllButton($(column).find('.check-column-button'), allVisitsChecked)
        });

        this.updateTotals();
    },

    // Update visit data stored in array
    updateVisitGrid: function (checkbox, index) {
        var lineIndex = $(checkbox).parents('tr').index() - 1;
        var checkAll = $(checkbox).val() == 'all';

        if (index == 'row') {
            var pages = this.visitGrid[lineIndex];

            $.each(pages, function(pageIndex, boxes) {
                $.each(boxes, function(boxIndex) {
                    UIOWA_BudgetCalculator.visitGrid[lineIndex][pageIndex][boxIndex] = checkAll;
                })
            });
        }
        else if (index == 'column') {
            var columnIndex = $(checkbox).parent().attr('data-id') - 1;

            $.each(this.visitGrid, function (lineIndex) {
                UIOWA_BudgetCalculator.visitGrid[lineIndex][UIOWA_BudgetCalculator.visitPage][columnIndex] = checkAll;
            });
        }
        else {
            this.visitGrid[lineIndex][this.visitPage][index] = checkbox.checked;
        }

        UIOWA_BudgetCalculator.toggleSaving(true);
        UIOWA_BudgetCalculator.updateVisitDisplay();
    },

    // Update styling of 'check all' button
    toggleCheckAllButton: function($btn, toggle, disable = false) {
        if (toggle) {
            $btn
                .removeClass('btn-success fa-check')
                .addClass('btn-danger fa-times')
                .val('');
        }
        else {
            $btn
                .removeClass('btn-danger fa-times')
                .addClass('btn-success fa-check')
                .val('all');
        }

        $btn.prop('disabled', disable);
    },

    // Save request data object as PDF table
    savePdf: function() {
        var serviceReference = {
            clinical: this.currentRequest.clinical,
            non_clinical: this.currentRequest.non_clinical
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
        //doc.autoTable(columnLookup, pdfFormattedRequest.clinical, {
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
        doc.autoTable(columnLookup, pdfFormattedRequest.clinical, {
            theme: 'striped',
            margin: {top: 60}
        });

        // Modify/remove clinical columns
        columnLookup[0].title = 'Non-Clinical Service'; // was 'Clinical Service'
        columnLookup[3].title = 'Quantity'; // was 'Subjects'
        columnLookup[5].title = ''; // was 'Visits'
        columnLookup[6].title = ''; // was 'Cost Per Subject'

        doc.autoTable(columnLookup, pdfFormattedRequest.non_clinical, {
            theme: 'striped',
            margin: {top: 60},
            startY: doc.autoTable.previous.finalY
        });

        doc.text('Grand Total: $' + UIOWA_BudgetCalculator.formatAsCurrency(
                UIOWA_BudgetCalculator.currentRequest.grand_total
            ), 650, doc.autoTable.previous.finalY + 25);

        doc.save('budget.pdf');
    },

    // Submit request data to REDCap project
    saveToProject: function () {
        var $saveBtn = $('#saveBtn');
        var $savedSelect = $('#savedBudget');

        $saveBtn
            .prop('disabled', true)
            .html('<i class="fas fa-spinner fa-spin test-progress"></i> Saving...');

        var serviceReference = {
            clinical: this.currentRequest.clinical,
            non_clinical: this.currentRequest.non_clinical
        };
        var redcapFormattedRequest = [];
        var requestIndex = 0;
        var savedTimestamp = UIOWA_BudgetCalculator.getTimestamp();

        $.each(serviceReference, function (serviceType, lineItems) { // clinical, non_clinical
            $.each(lineItems, function (lineIndex) { // line items
                redcapFormattedRequest.push(_.clone(serviceReference[serviceType][lineIndex]));
                redcapFormattedRequest[requestIndex].redcap_repeat_instrument = 'service_info';
                redcapFormattedRequest[requestIndex].redcap_repeat_instance = requestIndex + 1;

                if (serviceType == 'clinical') {
                    redcapFormattedRequest[requestIndex].clinical = 1;
                }

                requestIndex++;
            });
        });

        redcapFormattedRequest.push({
            timestamp: savedTimestamp,
            budget_title: $('#userTitleInput').val(),
            subject_count: $('#subject_count').val(),
            visit_total: $('#visit_count_default').val(),
            visit_data: JSON.stringify(this.visitGrid),
            funding_type: $('#fundingType').val(),
            username: this.currentUser,
            clinical_total: this.currentRequest.clinical_total,
            non_clinical_total: this.currentRequest.non_clinical_total,
            grand_total: this.currentRequest.grand_total
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
                record_id: $savedSelect.val() == 'none' ? null : $savedSelect.val(),
                username: UIOWA_BudgetCalculator.currentUser,
                budget: JSON.stringify(redcapFormattedRequest)
            }),
            success: function (data) {
                data = JSON.parse(data);
                var newRecordId = Object.keys(data.ids)[0];

                if (data.errors.length > 0) {
                    console.log(data.errors);
                    $saveBtn.html('<i class="fas fa-times"></i> Save Failed');
                }
                else {
                    $('#budgetTitleDisplay').show();
                    $('#budgetTitleText').html($('#userTitleInput').val());

                    // Add new record_id to dropdown to avoid duplicates
                    if ($savedSelect.val() == 'none') {
                        $savedSelect
                            .append(
                                $('<option></option>')
                                    .attr('value', newRecordId)
                                    .text($('#userTitleInput').val())
                            )
                            .val(newRecordId);
                    }

                    $('#lastSaveTime').attr('datetime', savedTimestamp);
                    timeago.cancel();
                    timeago.render($('#lastSaveTime'));

                    $saveBtn
                        .html('<i class="fas fa-check"></i> Saved')
                        .removeClass('saving');
                    UIOWA_BudgetCalculator.toggleSaving(false);
                }
            }
        });
    },

    // Load request data from REDCap project
    loadFromProject: function () {
        var recordId = $('#savedBudget').val();
        var budgetInfo = this.savedBudgets[recordId];

        $('#subject_count').val(budgetInfo.subject_count);
        $('#visit_count_default').val(budgetInfo.visit_total);
        $('#userTitleInput').val(budgetInfo.budget_title);
        $('#fundingType')
            .val(budgetInfo.funding_type)
            .find('option[value=""]').prop('disabled', true);

        $.each(budgetInfo.repeat_instances, function (index, lineItem) {
            UIOWA_BudgetCalculator.addService(lineItem.service_id, lineItem);
        });

        $('#budgetTitleDisplay').show();
        $('#budgetTitleText').html($('#userTitleInput').val());

        var timestamp = budgetInfo.timestamp;
        $('#lastSaveTime').attr('datetime', timestamp);
        timeago.cancel();
        timeago.render($('#lastSaveTime'));

        this.visitGrid = JSON.parse(budgetInfo.visit_data);
        this.updateVisitDisplay();
    },

    // Remove all services and clear fields
    clearBudget: function () {
        var clinicalRows = $('#clinical > tr').not('#clinicalEmpty').length;
        var nonClinicalRows = $('#non_clinical > tr').not('#non_clinicalEmpty').length;

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
        $('#fundingType').val('');
        $('#userTitleInput').val('');
    },

    // Enable/disable save button
    toggleSaving: function (saveAllowed) {
        var saveBtn = $('#saveBtn');
        var dirtyCheck = $('#dirtyCheck');

        if (saveAllowed) {
            saveBtn
                .html('Save for Later')
                .removeClass('disabled');
            dirtyCheck.addClass('dirty');
        }
        else {
            saveBtn
                .html('Saved')
                .addClass('disabled');
            dirtyCheck.removeClass('dirty');
        }
    },

    // Format dollar amounts
    formatAsCurrency: function(value) {
        return Number(value).toLocaleString("en-US", {style: "decimal", minimumFractionDigits: 2})
    },

    // Get current datetime
    getTimestamp: function () {
        var date = new Date();

        date =
            date.getFullYear() + "-" +
            ('0' + (date.getMonth() + 1)).slice(-2) + "-" +
            ('0' + date.getDate()).slice(-2) + " " +
            ('0' + date.getHours()).slice(-2) + ":" +
            ('0' + date.getMinutes()).slice(-2) + ":" +
            ('0' + date.getSeconds()).slice(-2);

        return date;
    }
};