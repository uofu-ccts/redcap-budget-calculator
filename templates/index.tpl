<img id="logo" src={$logo}></img>
<div id="title"><h1>Service Calculator (PROTOTYPE)</h1></div>
<br />
<div>
    <label for="subjectCount">Subjects:</label>
    <input id="subjectCount" value="5"><br />
    <label for="visitCount">Visits:</label>
    <input id="visitCount" oninput="UIOWA_ServiceCalculator.updateVisits()" value="12"><br />
    <label id="coreLabel" for="core">Core:</label>
    <select id="core" onchange="UIOWA_ServiceCalculator.populateDropdown('category')">
        <option>--Select--</option>
    </select>
    <br />
    <label id="categoryLabel" for="category" style="display:none">Category:</label>
    <select id="category" onchange="UIOWA_ServiceCalculator.populateDropdown('service')" style="display:none">
        <option>--Select--</option>
    </select>
    <br />
    <label id="serviceLabel" for="service" style="display:none">Service:</label>
    <select id="service" style="display:none" onchange="UIOWA_ServiceCalculator.toggleAdd();">
        <option>--Select--</option>
    </select>
</div>
<button type="button" id="addService" disabled="disabled" class="btn btn-success add-new"><i class="fa fa-plus"></i> Add Service</button>
<br />
<br />
<div>
    <table id="services-table" class="table table-bordered table-striped">
        <tr class="clinicalHeaders">
            {foreach $headerInfo['clinical'] as $header}
                {if $header.title eq 'Visits'}
                    <th class="tableexport-ignore" style="border-right: hidden;">
                        <div id="prevVisitPage">
                            <button disabled="disabled" class="btn btn-primary fas fas fa-arrow-left" onclick="UIOWA_ServiceCalculator.visitPage > 0 ? UIOWA_ServiceCalculator.visitPage-- : UIOWA_ServiceCalculator.visitPage;UIOWA_ServiceCalculator.updateVisits(this)">
                            </button>
                        </div>
                    </th>
                    <th class="tableexport-ignore" style="border-right: hidden;"></th>
                    <th style="border-right: hidden;">{$header.title}</th>
                    <th class="tableexport-ignore" style="border-right: hidden;"></th>
                    <th class="tableexport-ignore">
                        <div id="nextVisitPage">
                            <button disabled="disabled" class="btn btn-primary fas fa-arrow-right" onclick="UIOWA_ServiceCalculator.visitPage < UIOWA_ServiceCalculator.maxPage ? UIOWA_ServiceCalculator.visitPage++ : UIOWA_ServiceCalculator.visitPage;UIOWA_ServiceCalculator.updateVisits(this)">
                            </button>
                        </div>
                    </th>
                {else}
                    <th
                        rowspan="2"
                        {if $header.colspan}colspan="{$header.colspan}"{/if}
                        {if $header.style}style="{$header.style}"{/if}
                    >
                        {$header.title}
                    </th>
                {/if}
            {/foreach}
        </tr>
        <tr class="visitHeaders tableexport-ignore">
            {for $i = 1 to 5}
                <td><b class="visitHeader"></b></td>
            {/for}
        </tr>
        <tbody id="clinical">
        <tr id="noClinicalServices">
            <td colspan="{$headerCounts.clinical}">No services added</td>
        </tr>
        </tbody>
        <tr class="bg-secondary text-white">
            <td colspan="{$headerCounts.nonClinical - 1}" style="text-align: right; border-right-style:hidden;">Clinical Total:</td>
            <td>$<span class="clinical-total">0.00</span></td>
        </tr>
        <tr class="nonClinicalHeaders">
            {foreach $headerInfo['nonClinical'] as $header}
                <th
                    {if $header.colspan}colspan="{$header.colspan}"{/if}
                    {if $header.style}style="{$header.style}"{/if}
                >
                    {$header.title}
                </th>
            {/foreach}
        </tr>
        <tbody id="non-clinical">
        <tr id="noNonClinicalServices">
            <td colspan="{$headerCounts.nonClinical}">No services added</td>
        </tr>
        </tbody>
        <tr class="bg-secondary text-white">
            <td colspan="{$headerCounts.clinical - 1}" style="text-align: right; border-right-style:hidden;">Non-Clinical Total:</td>
            <td>$<span class="non-clinical-total">0.00</span></td>
        </tr>
        <tr class="total-row">
            <td class="total-header" colspan="{$headerCounts.nonClinical - 1}" style="text-align: right; border-right-style:hidden;">Grand Total:</b></td>
            <td>$<span class="total">0.00</span></td>
        </tr>
    </table>
</div>
<div id="disclaimer">
    This is a work in progress and not representative of the final product. Pricing data is for testing purposes only.
</div>