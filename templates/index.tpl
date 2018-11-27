<img id="logo" src={$logo}></img>
<div id="title"><h1>Service Calculator (PROTOTYPE)</h1></div>
<br />
<div>
    <label for="subjectCount">Subjects:</label>
    <input id="subjectCount" value="5"><br />
    <label for="visitCount">Visits:</label>
    <input id="visitCount" value="12"><br />
    <label id="coreLabel" for="core">Core:</label>
    <select id="core">
        <option>--Select--</option>
    </select>
    <br />
    <label id="categoryLabel" for="category" style="display:none">Category:</label>
    <select id="category" style="display:none">
        <option>--Select--</option>
    </select>
    <br />
    <label id="serviceLabel" for="service" style="display:none">Service:</label>
    <select id="service" style="display:none">
        <option>--Select--</option>
    </select>
</div>
<button type="button" id="addService" disabled class="btn btn-success add-new"><i class="fa fa-plus"></i> Add Service</button>
<br />
<br />
<div>
    <table id="services-table" class="table table-bordered table-striped">
        <tr class="clinicalHeaders">
            {foreach $headerInfo['clinical'] as $header}
                {if $header.title eq 'Visits'}
                    <th id="hide-border">
                        <div>
                            <button type='button' id="prevVisitPage" disabled class="btn btn-primary fas fas fa-arrow-left">
                            </button>
                        </div>
                    </th>
                    <th id="hide-border" colspan="4">{$header.title}</th>
                    <th>
                        <div>
                            <button type='button' id="nextVisitPage" disabled class="btn btn-primary fas fa-arrow-right">
                            </button>
                        </div>
                    </th>
                {else}
                    <th
                        rowspan="3"
                        {if $header.colspan}colspan="{$header.colspan}"{/if}
                        {if $header.style}style="{$header.style}"{/if}
                    >
                        {$header.title}
                    </th>
                {/if}
            {/foreach}
        </tr>
        <tr class="visitHeaders">
            <td rowspan="2"></td>
            {for $i = 1 to 5}
                <td><b class="visitHeader"></b></td>
            {/for}
        </tr>
        <tr>
            {for $i = 1 to 5}
                <td class="checkAllColumn" data-visitIndex="{$i}"></td>
            {/for}
        </tr>
        <tbody id="clinical">
        <tr id="clinical-empty">
            <td colspan="{$headerCounts.clinical}">No services added</td>
        </tr>
        </tbody>
        <tr class="bg-secondary text-white">
            <td colspan="{$headerCounts.nonClinical - 1}" style="text-align: right; border-right-style:hidden;">Clinical Total:</td>
            <td>$<span id="clinical-total">0.00</span></td>
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
        <tbody id="nonClinical">
        <tr id="nonClinical-empty">
            <td colspan="{$headerCounts.nonClinical}">No services added</td>
        </tr>
        </tbody>
        <tr class="bg-secondary text-white">
            <td colspan="{$headerCounts.clinical - 1}" style="text-align: right; border-right-style:hidden;">Non-Clinical Total:</td>
            <td>$<span id="nonClinical-total">0.00</span></td>
        </tr>
        <tr class="total-row">
            <td class="total-header" colspan="{$headerCounts.nonClinical - 1}" style="text-align: right; border-right-style:hidden;">Grand Total:</b></td>
            <td>$<span class="total">0.00</span></td>
        </tr>
    </table>
    <button id="pdf-export" class="btn btn-primary">Download as PDF</button>
</div>
<div id="disclaimer">
    This is a work in progress and not representative of the final product. Pricing data is for testing purposes only.
</div>