<img id="logo" src={$logo}></img>
<div id="title"><h1>Budget Calculator (PROTOTYPE)</h1></div>
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
        <tbody id="non_clinical">
        <tr id="non_clinical-empty">
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
    {if $submitEnabled != 0}
        <div class="action-button">
            <button id="submit" class="btn btn-success" data-toggle="modal" data-target="#submit-confirmation-popup" disabled>Submit</button>
        </div>
        <div class="modal fade" id="submit-confirmation-popup" tabindex="-1" role="dialog" aria-labelledby="submit-confirmation-popup" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Submission</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <p>{$submissionDialogBody}</p>
                        </div>
                        <form id="submission-form">
                            {foreach $submissionFields as $field}
                                <div class="form-row">
                                    <div class="form-group requester-info">
                                        <label for="{$field.field_name}"><b>{$field.element_label}</b></label>
                                        {if $field.element_note}
                                            <i class="fas fa-question-circle info-description" style="color:#3E72A8" data-toggle="tooltip" title="{$field.element_note}"></i>
                                        {/if}
                                        {if $field.element_type == 'radio' || $field.element_type == 'checkbox'}
                                            {foreach $field.choices as $choice}
                                                <div class="form-check">
                                                    <input class="form-check-input info-field-{$field.element_type}" type="{$field.element_type}" id="{$field.field_name}___{$choice.value}" name="{$field.field_name}" value="{$choice.value}">
                                                    <label class="form-check-label" for="{$field.field_name}___{$choice.value}">
                                                        {$choice.label}
                                                    </label>
                                                </div>
                                            {/foreach}
                                        {elseif $field.element_type == 'select'}
                                            <select {if $field.field_req == 1}required{/if} class="form-control info-field" id="{$field.field_name}" name="{$field.field_name}">
                                            {foreach $field.choices as $choice}
                                                <option value="{$choice.value}">{$choice.label}</option>
                                            {/foreach}
                                            </select>
                                        {elseif $field.element_type == 'textarea'}
                                            <textarea {if $field.field_req == 1}required{/if} id="{$field.field_name}" name="{$field.field_name}" class="form-control info-field">{$field.value}</textarea>
                                        {elseif $field.element_type == 'text'}
                                            <input {if $field.field_req == 1}required{/if} id="{$field.field_name}" name="{$field.field_name}" value="{$field.value}" class="form-control info-field">
                                        {/if}
                                    </div>
                                </div>
                            {/foreach}
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="submit-confirm" class="btn btn-primary">Submit</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="submit-success-popup" tabindex="-1" role="dialog" aria-labelledby="submit-success-popup" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Success!
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
    {if $exportEnabled == true}<div class="action-button"><button id="pdf-export" class="btn btn-primary" disabled>Download as PDF</button></div>{/if}
</div>
<div id="disclaimer">
    This is a work in progress and not representative of the final product. Pricing data is for testing purposes only.
</div>