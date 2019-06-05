<div id="wrapper">
    <div id="title">
        <h1>Budget Calculator (PROTOTYPE)</h1>
        <br />
        <br />
        <div id="budgetTitleDisplay" style="display: none">
            <h5>Title: <span id="budgetTitleText"></span></h5>
            <small>Last saved <span id="lastSaveTime"></span></small>
        </div>
    </div>
    <img id="logo" src={$logo}>
    <div style="clear: both;"></div>
</div>

<br />
<br />

<div class="modal fade" id="welcomeModal" tabindex="-1" role="dialog" aria-labelledby="welcomeModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <div class="welcome-only">
                    <p>{$welcomeDialogBody}</p>
                </div>
                <form id="welcomeForm" onsubmit="return false;">
                    {if $saveEnabled}
                        <div {if !$savedBudgetLookup}style="display: none;"{/if}>
                            <div class="form-row">
                                <label for="savedBudget"><b>Load saved budget:</b></label>
                            </div>
                            <div class="form-row">
                                <div class="col">
                                    <div class="form-group initial-info">
                                        <select id="savedBudget" name="savedBudget" class="form-control info-field">
                                            <option value="none">---Select---</option>
                                            {foreach $savedBudgetLookup as $option}
                                                <option value="{$option.value}">{$option.label}</option>
                                            {/foreach}
                                        </select>
                                        <input id="savedBudgetRename" class="form-control info-field" style="display: none;">
                                    </div>
                                </div>
                                <div class="col">
                                    <button type="button" class="btn btm-sm btn-primary rename-budget" style="max-width:50px; display: none;">
                                        <i class="fas fa-edit"></i>
                                        <span class="sr-only">Rename Budget</span>
                                    </button>
                                    <button type="button" class="btn btm-sm btn-danger delete-budget" style="max-width:50px; display: none;">
                                        <i class="fas fa-trash"></i>
                                        <span class="sr-only">Delete Budget</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    {/if}
                    <div>
                        <div class="form-row">
                            <div class="form-group initial-info">
                                <label for="fundingType"><b>Funding Type:</b></label>
                                <select required id="fundingType" name="fundingType" class="form-control info-field">
                                    <option value="">---Select---</option>
                                    {foreach $rateFields as $field}
                                        <option value="{$field.value}">{$field.label}</option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                    </div>
                    {if $termsText}
                        <div class="form-row welcome-only">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="termsCheckbox" name="termsCheckbox">
                                <label class="form-check-label" for="termsCheckbox">
                                    {$termsText}
                                </label>
                            </div>
                        </div>
                    {/if}
                </form>
            </div>
            <div class="modal-footer">
                <button id="welcomeConfirmBtn" type="button" class="btn btn-primary" {if $termsText}disabled{/if}>Create New Budget</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="budgetInfoModal" tabindex="-1" role="dialog" aria-labelledby="budgetInfoModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <div>
                    <p>Before adding clinical services, please supply this additional information:</p>
                </div>
                <form onsubmit="return false;">
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
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button id="confirmInfoBtn" type="button" class="btn btn-primary" onclick="">Confirm</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="saveModal" tabindex="-1" role="dialog" aria-labelledby="saveModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <div>
                    <p>Please provide a title for your budget before saving. This is for personal reference only.</p>
                </div>
                <form onsubmit="return false;">
                    <div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="userTitleInput"><b>Budget Title:</b></label>
                                <input required id="userTitleInput" name="userTitleInput" class="form-control info-field">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button id="cancelSaveBtn" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button id="confirmSaveBtn" type="button" class="btn btn-primary">Save</button>
            </div>
        </div>
    </div>
</div>
<nav class="main-nav" role="navigation">
    <ul id="main-menu" class="sm sm-blue">
        <li>
            <a href="#">Add Service</a>
            <ul id="addServiceMenu">
                <li>
                    <label for="filter-menu" style="padding: 5px">Filter services:</label>
                    <input id="filter-menu" name="filter-menu" type="text" />
                </li>
            </ul>
        </li>
        <li>
            <a href="#" data-toggle="modal" data-target="#budgetInfoModal">Edit Budget Information</a>
        </li>
        {if $exportEnabled == true}
        <li>
            <a href="#" id="downloadPdfBtn" class="disabled">Download as PDF</a>
        </li>
        {/if}
        {if $saveEnabled == true}
        <li style="float:right">
            <a href="#" id="saveBtn" class="disabled">Save for Later</a>
        </li>
        {/if}
    </ul>
</nav>
<br />
<br />
<div>
    <table id="servicesTable" class="table table-bordered table-striped">
        <tr class="clinicalHeaders">
            {foreach $headerInfo.clinical as $header}
                {if $header.title eq 'Visits'}
                    <th class="hide-border">
                        <div>
                            <button id="prevVisitsBtn" disabled class="btn btn-primary fas fas fa-arrow-left">
                            </button>
                        </div>
                    </th>
                    <th class="hide-border" colspan="4">{$header.title}</th>
                    <th class="hide-border">
                        <div>
                            <button id="nextVisitsBtn" disabled class="btn btn-primary fas fa-arrow-right">
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
        <tr class="visit-header-row">
            <td rowspan="2"></td>
            {for $i = 1 to 5}
                <td><b class="visit-header"></b></td>
            {/for}
        </tr>
        <tr>
            {for $i = 1 to 5}
                <td class="check-all-column" data-id="{$i}">
                    <button
                        class='btn btn-success fas fa-check check-column-button'
                        style='width: 40px'
                        value='all'
                        disabled
                    >
                    </button>
                </td>
            {/for}
        </tr>
        <tbody id="clinical">
        <tr id="clinicalEmpty">
            <td colspan="{$headerCounts.clinical}">No services added</td>
        </tr>
        </tbody>
        <tr class="bg-secondary text-white">
            <td colspan="{$headerCounts.nonClinical - 1}" style="text-align: right; border-right-style:hidden;">Clinical Total:</td>
            <td id="clinicalTotal">$0.00</td>
        </tr>
        <tr class="nonClinicalHeaders">
            {foreach $headerInfo.nonClinical as $header}
                <th
                    {if $header.colspan}colspan="{$header.colspan}"{/if}
                    {if $header.style}style="{$header.style}"{/if}
                >
                    {$header.title}
                </th>
            {/foreach}
        </tr>
        <tbody id="non_clinical">
        <tr id="non_clinicalEmpty">
            <td colspan="{$headerCounts.nonClinical}">No services added</td>
        </tr>
        </tbody>
        <tr class="bg-secondary text-white">
            <td colspan="{$headerCounts.clinical - 1}" style="text-align: right; border-right-style:hidden;">Non-Clinical Total:</td>
            <td id="non_clinicalTotal">$0.00</td>
        </tr>
        <tr class="total-row">
            <td class="total-header" colspan="{$headerCounts.nonClinical - 1}" style="text-align: right; border-right-style:hidden;">Grand Total:</b></td>
            <td class="total">$0.00</td>
        </tr>
    </table>
    <form id="dirtyCheck" name="dirtyCheck" onsubmit="return false;">
    </form>
    {if $submitEnabled != 0}
        <div class="action-button">
            <button id="submit" class="btn btn-success" data-toggle="modal" data-target="#submitModal" disabled>Submit</button>
        </div>
        <div class="modal fade" id="submitModal" tabindex="-1" role="dialog" aria-labelledby="submitModal" aria-hidden="true">
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
                        <form id="submissionForm" onsubmit="return false;">
                            <div class="form-row">
                                <label for="userTitleInputSubmit"><b>Budget Title (for future reference):</b></label>
                                <input id="userTitleInputSubmit" class="form-control info-field">
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
                        <button type="button" id="confirmSubmitBtn" class="btn btn-primary">Submit</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="submitSuccessModal" tabindex="-1" role="dialog" aria-labelledby="submitSuccessModal" aria-hidden="true">
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
</div>
<div id="disclaimer">
    This is a work in progress and not representative of the final product. Pricing data is for testing purposes only.
</div>