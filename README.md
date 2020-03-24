# Budget Calculator

Budget Calculator is an external module designed for use with REDCap.

# Install

1. Copy or clone the Budget Calculator repository found at https://github.com/ui-icts/redcap-budget-calculator
2. Rename the Budget Calculator's folder to `budget_calculator_v0.1`. The folder name must end with a version number in proper format, or REDCap will not be able to install and deploy the external module.
3. Install Composer dependency manager using the instructions found at https://getcomposer.org. Local or global installation will work.
4. Run `composer install` from the Budget Calculator project folder to add the PHP dependencies for the Budget Calculator to the project. They are installed in the `vendor` directory. If you do not intend to make any development changes, use the command `composer install --no-dev` instead of `composer install`.
5. Deploy the Budget Calculator to your REDCap environment by copying the Budget Calculator folder to the `<REDCap>/module` directory. If you installed the composer exectable locally in the Budget Calculator, do not copy it over to the REDCap environment with the rest of the project. Remember proper REDCap naming conventions are necessary for external modules to be recognized by REDCap.
6. Navigate to the `Control Center` as your REDCap admin.
7. Click `External Modules` on the left sidebar.
8. Click the `Enable a module` button on the External Modules - Module Manager page.
9. Click the `Enable` button next to the Budget Calculator from the available modules list.

# Budget Calculator React Client

Documentation for the React client used with the Budget Calculator, see [bcclient/README.md](bcclient/)