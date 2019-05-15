<div id="wrapper">
    <h1 id="title">Budget Calculator (PROTOTYPE)</h1>
    <img id="logo" src={$logo}>
    <div style="clear: both;"></div>
</div>

<br />
<br />

<div class="modal fade" id="welcome-popup" tabindex="-1" role="dialog" aria-labelledby="welcome-popup" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <div class="welcome-only">
                    <p>{$welcomeDialogBody}</p>
                </div>
                <form id="welcome-form">
                    {if $saveEnabled}
                        <div class="form-row">
                            <div class="form-group initial-info">

                                <label for="savedBudget"><b>Load saved budget:</b></label>
                                <select id="savedBudget" name="savedBudget" class="form-control info-field">
                                    <option value="none">---Select---</option>
                                    {foreach $savedBudgetLookup as $option}
                                        <option value="{$option['value']}">{$option['label']}</option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                    {/if}
                    <div>
                        <div class="form-row">
                            <div class="form-group initial-info">
                                <label for="funding_type"><b>Funding Type:</b></label>
                                <select required id="funding_type" name="funding_type" class="form-control info-field">
                                    <option value="">---Select---</option>
                                    {foreach $rateFields as $field}
                                        <option value="{$field['value']}">{$field['label']}</option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                    </div>
                    {if $termsText}
                        <div class="form-row welcome-only">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="terms-checkbox" name="terms-checkbox">
                                <label class="form-check-label" for="terms-checkbox">
                                    {$termsText}
                                </label>
                            </div>
                        </div>
                    {/if}
                </form>
            </div>
            <div class="modal-footer">
                <button id="welcome-confirm" type="button" class="btn btn-primary" {if $termsText}disabled{/if}>Create New Budget</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="clinical-info-modal" tabindex="-1" role="dialog" aria-labelledby="clinical-info-modal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <div>
                    <p>Before adding clinical services, please supply this additional information:</p>
                </div>
                <form>
                    <div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="subject_count"><b>Subject Count:</b></label>
                                <input required id="subject_count" name="subject_count" type="number" min="1" class="form-control info-field">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="visit_count_default"><b>Visit Count:</b></label>
                                <input required id="visit_count_default" name="visit_count_default" type="number" min="1" class="form-control info-field">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button id="confirm-clinical-info" type="button" class="btn btn-primary" onclick="">Confirm</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="save-modal" tabindex="-1" role="dialog" aria-labelledby="save-modal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <div>
                    <p>You may optionally provide a title for your budget before saving.</p>
                </div>
                <form>
                    <div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="budgetTitle"><b>Budget Title:</b></label>
                                <input required id="budgetTitle" name="budgetTitle" class="form-control info-field">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button id="confirm-save-budget" type="button" class="btn btn-primary">Confirm</button>
            </div>
        </div>
    </div>
</div>
<nav class="main-nav" role="navigation">
    <ul id="main-menu" class="sm sm-blue">
        <li>
            <a href="#">Add Service</a>
            <ul id="add-service-menu">
                <li>
                    <label for="filter-menu" style="padding: 5px">Filter services:</label>
                    <input id="filter-menu" name="filter-menu" type="text" />
                </li>
            </ul>
        </li>
        <li>
            <a href="#" id="edit-budget-info">Edit Budget Information</a>
        </li>
        {if $exportEnabled == true}
        <li>
            <a href="#" id="pdf-export" class="disabled">Download as PDF</a>
        </li>
        {/if}
        {if $saveEnabled == true}
        <li style="float:right">
            <a href="#" id="save-budget" class="disabled">Save for Later</a>
        </li>
        {/if}
    </ul>
</nav>
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
            <td>$<span id="non_clinical-total">0.00</span></td>
        </tr>
        <tr class="total-row">
            <td class="total-header" colspan="{$headerCounts.nonClinical - 1}" style="text-align: right; border-right-style:hidden;">Grand Total:</b></td>
            <td>$<span class="total">0.00</span></td>
        </tr>
    </table>
    <form id="dirtyCheck" name="dirtyCheck">
        <input type="checkbox" id="serviceCount" name="serviceCount" style="display: none;">
    </form>
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
                            <div class="form-row">
                                <label for="budget_title"><b>Budget Title (for future reference):</b></label>
                                <input id="budget_title" class="form-control info-field">
                            </div>
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
                        <h5>Submitted</h5>
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
    {*{if $exportEnabled == true}<div class="action-button"><button id="pdf-export" class="btn btn-primary" disabled>Download as PDF</button></div>{/if}*}
</div>
<div id="disclaimer">
    This is a work in progress and not representative of the final product. Pricing data is for testing purposes only.
</div>