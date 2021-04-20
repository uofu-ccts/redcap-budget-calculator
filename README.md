# Budget Calculator

Budget Calculator is an external module designed for use with REDCap. 

# Install

1. Copy or clone the Budget Calculator repository found at https://github.com/ui-icts/redcap-budget-calculator
2. Rename the Budget Calculator's folder to `budget_calculator_v1.0`. The folder name must end with a version number in proper format, or REDCap will not be able to install and deploy the external module.
3. Deploy the Budget Calculator to your REDCap environment by copying the Budget Calculator folder to the `<REDCap>/module` directory. If you installed the composer executable locally in the Budget Calculator, do not copy it over to the REDCap environment with the rest of the project. Remember proper REDCap naming conventions are necessary for external modules to be recognized by REDCap.
4. Navigate to `Control Center` > `External Modules` as your REDCap admin.
5. Click the `Enable a module` button on the External Modules - Module Manager page, and then click the `Enable` button next to the Budget Calculator from the available modules list.
6. Cd to `bcclient` and install the dependencies with `npm install —-force` (*this is a known issue with npm@7.9* Recommended: then `npm audit fix —force`, then in package.json, change the jspdf release to `^1.5.3`, and run `npm install`)
7. Create a ‘Service Catalog’ redcap project using the included ‘ServiceCatalogTemplate.xml’
8. Upload services to the REDCap project or create test services in the project. 
9. Update the settings exported from `bcclient/src/lib/bc/js/config.js` for environment - you may also need to update ‘ServiceData.js’ and ‘PerServiceData.js’.
10. Update or modify the “homepage” setting in `bcclient/package.json` to point to your redcap modules folder
11. Build the react client with `npm run redcap-build`
12. Navigate to the `Control Center` > `External Modules` as your REDCap admin, and configure the Budget Calculator module. Once configured, the module can be accessed through the External Modules menu.

# Budget Calculator React Client

For documentation for the React client used with the Budget Calculator, see [bcclient/README.md](bcclient/). The React client is an NPM project that can be built and run directly from its project directory in 'bcclient'.

## Installing and configuring NPM

Building the React client requires a current version of NPM to be installed on your build machine. See [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm) for instructions on installing and configuring NPM.

