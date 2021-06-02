# Budget Calculator

Budget Calculator is an external module designed for use with REDCap. 

# Install

These instructions will build and default to the react client for the front end of the module.
1. Copy or clone the Budget Calculator repository found at https://github.com/ui-icts/redcap-budget-calculator
2. Rename the Budget Calculator's folder to `budget_calculator_v1.0`. The folder name must end with a version number in proper format, or REDCap will not be able to install and deploy the external module.
3. Install Composer dependency manager using the instructions found at https://getcomposer.org. Local or global installation will work.
4. Run `composer install` from the Budget Calculator project folder to add the PHP dependencies for the Budget Calculator to the project. They are installed in the `vendor` directory. If you do not intend to make any development changes, use the command `composer install --no-dev` instead of `composer install`.
5. Deploy the Budget Calculator to your REDCap environment by copying the Budget Calculator folder to the `<REDCap>/module` directory. If you installed the composer executable locally in the Budget Calculator, do not copy it over to the REDCap environment with the rest of the project. Remember proper REDCap naming conventions are necessary for external modules to be recognized by REDCap.
6. Navigate to `Control Center` > `External Modules` as your REDCap admin.
7. Click the `Enable a module` button on the External Modules - Module Manager page, and then click the `Enable` button next to the Budget Calculator from the available modules list.
8. Build with Composer/PHing (Complete the 5 steps in the 'TL;DR' section below).
9. Cd to `bcclient` and install the dependencies with `npm install —-force` (*this is a known issue with npm@7.9* Recommended: then `npm audit fix —force`, then in package.json, change the jspdf release to `^1.5.3`, and run `npm install`)
10. Create a ‘Service Catalog’ redcap project using the included ‘ServiceCatalogTemplate.xml’
11. Upload services to the project or create test services. 
12. Update the settings exported from `bcclient/src/lib/bc/js/config.js` for environment - you may also need to update ‘ServiceData.js’ and ‘PerServiceData.js’.
13. Update or modify the “homepage” setting in `bcclient/package.json` to point to your redcap modules folder
14. Build the react client with `npm run redcap-build`
15. Navigate to the `Control Center` > `External Modules` as your REDCap admin, and configure the Budget Calculator module. Once configured, the module can be accessed through the External Modules menu.

# Budget Calculator React Client

For documentation for the React client used with the Budget Calculator, see [bcclient/README.md](bcclient/). The React client is an NPM project that can be built and run directly from its project directory in 'bcclient'.

## Installing and configuring NPM

Building the React client with PHing requires a current version of NPM to be installed on your build machine. See [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm) for instructions on installing and configuring NPM.

# Building with PHing

This project contains integration with [PHing](https://www.phing.info/guide/hlhtml/#ch.gettingstarted) for building and
deployment of the ReactJS client and the PHP based REDCap external module. You may choose to only build the PHP based REDCap external module while using the prebuilt React client found in 'resources/bcclient', or fully build the project from both the PHP and the ReactJS source. The default PHing task uses the prebuilt ReactJS client. There is also another PHing task for building both the ReactJS client and the PHP REDCap external module.

## TL;DR

- `mkdir <project>/bin`
- Install [Composer](https://getcomposer.org/download/) as `<project>/bin/composer` (Use this cmd: `php composer-setup.php --install-dir=bin --filename=composer` )
- Run `php ./bin/composer install`
- Copy `<project>/vendor/phing` directory to `<project>/bin/`
- Run `php bin/phing/phing/bin/phing.php`


## Install and run PHing

PHP's Composer loads dependencies for the Budget Calculator. PHing is setup as a dev dependency for the Budget Calculator's PHP project.

Add the Composer executable to &lt;project folder&gt;/bin with the file name of 'composer', renaming from 'composer.phar'. This location and name are required for the default PHing build.xml to work properly. Modify 'build.xml' for PHing if 'composer' is installed in another location.


After installing Composer as &lt;project folder&gt;/bin/composer, install the project dependencies with the commands **'php ./bin/composer install'** and **'php ./bin/composer update'** from your Budget Calculator project root.


PHing is now installed at **&lt;project folder&gt;/vendor/phing/phing/bin/phing.php** and can run with the command 'php ./vendor/phing/phing/bin/phing.php'. However, the 'vendor' directory is not stable and contents will come and go during the build process. Copy the ./vendor/phing directory to '&lt;project folder&gt;/bin/phing' and run the default PHing task with the command 'php bin/phing/phing/bin/phing.php'.
