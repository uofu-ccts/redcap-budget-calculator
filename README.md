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


# Building with PHing

This project contains integration with [PHing](https://www.phing.info/guide/hlhtml/#ch.gettingstarted) for building and
deployment of the ReactJS client and the PHP based REDCap external module. You may choose to only build the PHP based REDCap external module while using the prebuilt React client found in 'resources/bcclient', or fully build the project from the PHP and ReactJS source.

## Installing and using Composer

The REDCap BudgetCalculator uses Composer as its package manager. To use composer, install it as <project>/bin/composer. See the instructions for installing and using Composer at the Composer project home page. See [https://getcomposer.org/](https://getcomposer.org/).

## Installing and configuring NPM

Building the React client with PHing requires a current version of NPM to be installed on your build machine. See [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm) for instruction on installing and configuring NPM.

## Install and run PHing

PHP's Composer loads dependencies for the BudgetCalculator. PHing is setup as a dependency for the BudgetCalculator's PHP project, so it is loaded into the project when Composer is run.

Before running Composer, you will need to add the executable to &lt;project folder&gt;/bin with the file name of 'composer'. This location and name are required for the default PHing build.xml to work properly. Of course, you can modify the build.xml for PHing if you wish to use a 'composer' that you have installed in another location.

After installing, Composer as &lt;project folder&gt;/bin/composer , install the dependencies by running the command **'php ./bin/composer install'** and **'php ./bin/composer update'** from your BudgetCalculator project root.

You will find that PHing is now installed at **'./vendor/phing/phing/bin/phing.php'** and can run with the command 'php ./vendor/phing/phing/bin/phing.php'. However, that directory is not stable and contents will come and go during the build process. Copy the ./vendor/phing directory to '&lt;project folder&gt;/bin/phing' and call with the command 'php bin/phing/phing/bin/phing.php'.

Be sure that Composer and NPM are installed, before running the default build of the Budget Calculator from source.