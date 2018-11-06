$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    var actions = $("table td:last-child").html();
    // Append table on add new button click
    $(".add-new").click(function(){
        UIOWA_ServiceCalculator.addElement(actions);
    });
    // Delete row on delete button click
    $(document).on("click", ".delete", function(){
        UIOWA_ServiceCalculator.deleteVisitData($(this).parents("tr").index());
        $(this).parents("tr").remove();

        UIOWA_ServiceCalculator.updateTotals();

        if ($('#clinical').find('.lineItem').length == 0) {
            document.getElementById('noClinicalServices').style.display = '';
            $('#noClinicalServices').removeClass('tableexport-ignore');
        }
        if ($('#non-clinical').find('.lineItem').length == 0) {
            document.getElementById('noNonClinicalServices').style.display = '';
            $('#noNonClinicalServices').removeClass('tableexport-ignore');
        }
    });

    UIOWA_ServiceCalculator.tables = $("#services-table").tableExport({
        formats: ['xlsx'],
        bootstrap: false,
        //ignoreCols: [0],
        ignoreCSS: '.tableexport-ignore'
    });

    UIOWA_ServiceCalculator.formatServicesData(servicesData, servicesQuantityLabels);
});

var UIOWA_ServiceCalculator = {};

UIOWA_ServiceCalculator.data = {};
UIOWA_ServiceCalculator.quantityLabelLookup = [];
UIOWA_ServiceCalculator.visitGrid = [];
UIOWA_ServiceCalculator.visitPage = 0;
UIOWA_ServiceCalculator.maxPage = 0;
UIOWA_ServiceCalculator.visitsPerPage = 5;

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
        var index = item[0];
        var label = item[1];

        labelArray[index] = label;
    });

    this.quantityLabelLookup = labelArray;

    this.populateDropdown('core');
};

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

UIOWA_ServiceCalculator.addElement = function() {
    var coreValue = document.getElementById('core').value;
    var categoryValue = document.getElementById('category').value;
    var serviceValue = document.getElementById('service').value;

    var subjectCount = document.getElementById('subjectCount').value;

    var index = $("table tbody tr:last-child").index();

    var serviceInfo = _.findWhere(this.data, {core: coreValue, category: categoryValue, service: serviceValue});
    var lineItem = '';

    if (serviceInfo['clinical'] == '1') {
        document.getElementById('noClinicalServices').style.display = 'none';
        $('#noClinicalServices').addClass('tableexport-ignore');

        // Disable visits input (todo: make this updatable on the fly)
        if (!document.getElementById('visitCount').disabled) {
            document.getElementById('visitCount').disabled = true;
        }

        lineItem =
            "<tr id='lineItem" + index + "' class='lineItem' oninput='UIOWA_ServiceCalculator.updateTotals()'>" +
            "<td style='width:1%; white-space: nowrap' class='tableexport-ignore'><span><a class=\"delete\" title=\"Delete\" data-toggle=\"tooltip\"><i class=\"material-icons\">&#xE872;</i></a></span></td>" +
            "<td class='service-title'>" +
            serviceValue +
            "</td>" +
            "<td>$<span class='industry-rate'>" + serviceInfo['industry_rate'] + "</span></td>" +
            "<td>$<span class='federal-rate'>" + serviceInfo['federal_rate'] + "</span></td>" +
            "<td><input class='subject-count' value='" + subjectCount + "'></td>" +
            "<td>" + this.quantityLabelLookup[serviceInfo['per_service']] + "</td>" +
            "<td class='visitCol tableexport-ignore'></td><td class='visitCol tableexport-ignore'></td><td class='visitCol tableexport-ignore'></td><td class='visitCol tableexport-ignore'></td><td class='visitCol tableexport-ignore'></td>" +
            "<td>$<span class='line-total-per-patient'>0.00</span></td>" +
            "<td>$<span class='line-total'>0.00</span></td>" +
            "</tr>";

        $("#clinical").append(lineItem);

        this.updateVisits();
    }
    else {
        document.getElementById('noNonClinicalServices').style.display = 'none';
        $('#noNonClinicalServices').addClass('tableexport-ignore');

        lineItem =
            "<tr id='lineItem" + index + "' class='lineItem' oninput='UIOWA_ServiceCalculator.updateTotals()'>" +
            "<td style='border-right-style:hidden;'><span><a class=\"delete\" title=\"Delete\" data-toggle=\"tooltip\"><i class=\"material-icons\">&#xE872;</i></a></span></td>" +
            "<td class='service-title'>" +
            serviceValue +
            "</td>" +
            "<td>$<span class='industry-rate'>" + serviceInfo['industry_rate'] + "</span></td>" +
            "<td>$<span class='federal-rate'>" + serviceInfo['federal_rate'] + "</span></td>" +
            "<td><input class='qty-count' value='1'></td>" +
            "<td>" + this.quantityLabelLookup[serviceInfo['per_service']] + "</td>" +
            "<td class='non-clinical-blank tableexport-ignore' colspan='6'></td>" +
            "<td>$<span class='line-total'>0.00</span></td>" +
            "</tr>";

        $("#non-clinical").append(lineItem);
    }

    this.updateTotals();
};

UIOWA_ServiceCalculator.toggleAdd = function() {
    var button = document.getElementById('addService');
    var serviceDropdown = document.getElementById('service');

    if (serviceDropdown.value == 'not selected') {
        button.disabled = 'disabled';
    }
    else {
        button.disabled = '';
    }
};

UIOWA_ServiceCalculator.updateTotals = function() {
    var clinicalTotal = 0;
    var nonClinicalTotal = 0;
    var visitGrid = this.visitGrid;

    var clinicalServices = $('#clinical > tr').slice(1);
    var nonClinicalServices = $('#non-clinical > tr').slice(1);

    $.each(clinicalServices, function () {
        var serviceCost = $(this).find(".federal-rate").html();
        var subjectCount = $(this).find(".subject-count").val();

        var visitsArray = _.flatten(visitGrid[$(this).index() - 1]);
        var visitCount = _.reduce(visitsArray, function(memo, bool) { return memo + (bool === true ? 1 : 0)});

        var lineTotalPerPatient = serviceCost * visitCount;
        var lineTotal = lineTotalPerPatient * subjectCount;

        clinicalTotal += lineTotal;

        $(this).find(".line-total-per-patient").html(lineTotalPerPatient.toFixed(2));
        $(this).find(".line-total").html(lineTotal.toFixed(2));
    });

    $.each(nonClinicalServices, function () {
        var serviceCost = $(this).find(".federal-rate").html();
        var qtyCount = $(this).find(".qty-count").val();

        var lineTotal = qtyCount * serviceCost;
        nonClinicalTotal += lineTotal;

        $(this).find(".line-total").html(lineTotal.toFixed(2));
    });

    var total = clinicalTotal + nonClinicalTotal;

    $(".clinical-total").html(clinicalTotal.toFixed(2));
    $(".non-clinical-total").html(nonClinicalTotal.toFixed(2));
    $(".total").html(total.toFixed(2));

    UIOWA_ServiceCalculator.tables.reset();
};

UIOWA_ServiceCalculator.updateVisitCheckboxes = function(lineItem, rowIndex) {
    var visitCount = document.getElementById('visitCount').value;

    if (typeof this.visitGrid[rowIndex] === 'undefined') {
        var newServiceVisits = [];

        for (var i = 0; i < visitCount; i++) {

            if (i % this.visitsPerPage == 0) {
                var newVisitGroup = [];
            }

            newVisitGroup.push(false);

            if (i % this.visitsPerPage == this.visitsPerPage - 1 || i == visitCount - 1) {
                newServiceVisits.push(newVisitGroup);
            }
        }

        this.visitGrid[rowIndex] = newServiceVisits;
    }

    var visitColumns = $(lineItem).find('.visitCol');
    var visitData = this.visitGrid[rowIndex][this.visitPage];
    var startingVisitIndex = this.visitPage * this.visitsPerPage;
    var loopMax = startingVisitIndex + this.visitsPerPage;

    if (!(typeof visitData === 'undefined')) {
        var visitIndex = startingVisitIndex;

        for (var j = 0; j < loopMax; j++) {
            var checkbox = '';

            if (!(typeof visitData[j] === 'undefined')) {
                if (visitData[j] == true) {
                    checkbox = "<input type='checkbox' class='visitCheckbox' onclick='UIOWA_ServiceCalculator.updateVisitData(this, " + j + ")' id='visit" + visitIndex + "' checked>";
                }
                else {
                    checkbox = "<input type='checkbox' class='visitCheckbox' onclick='UIOWA_ServiceCalculator.updateVisitData(this, " + j + ")' id='visit" + visitIndex + "'>";
                }

                $(visitColumns[j]).append(checkbox);
                var visitHeader = $('.visitHeader')[j];
                $(visitHeader).html((visitIndex + 1));
                visitIndex++;
            }
        }
    }
};

UIOWA_ServiceCalculator.updateVisits = function () {
    this.maxPage = Math.ceil(document.getElementById('visitCount').value / this.visitsPerPage) - 1;

    if (this.visitPage == 0)
        $('#prevVisitPage > button').attr('disabled', 'disabled');
    else
        $('#prevVisitPage > button').removeAttr('disabled');

    if (this.visitPage == this.maxPage)
        $('#nextVisitPage > button').attr('disabled', 'disabled');
    else
        $('#nextVisitPage > button').removeAttr('disabled');

    $('.visitHeader').each(function (index, elm) {
        $(elm).html('');
    });

    var lineItems = $("#clinical").find('.lineItem');

    lineItems.each(function (index) {
        $(lineItems[index]).find('.visitCheckbox').remove();
        UIOWA_ServiceCalculator.updateVisitCheckboxes(lineItems[index], index)
    })
};

UIOWA_ServiceCalculator.deleteVisitData = function (lineIndex) {
    this.visitGrid.splice(lineIndex, 1);
};

UIOWA_ServiceCalculator.updateVisitData = function (checkbox, index) {
    var lineIndex = $(checkbox).parents("tr").index() - 1;

    this.visitGrid[lineIndex][this.visitPage][index] = checkbox.checked ? true : false;
};