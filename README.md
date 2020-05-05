# Budget Calculator

Budget Calculator is an external module designed for use with REDCap.

# Install

1. Copy or clone the Budget Calculator repository found at https://github.com/ui-icts/redcap-budget-calculator
2. Rename the Budget Calculator's folder to `budget_calculator_v1.0`. The folder name must end with a version number in proper format, or REDCap will not be able to install and deploy the external module.
3. Install Composer dependency manager using the instructions found at https://getcomposer.org. Local or global installation will work.
4. Run `composer install` from the Budget Calculator project folder to add the PHP dependencies for the Budget Calculator to the project. They are installed in the `vendor` directory. If you do not intend to make any development changes, use the command `composer install --no-dev` instead of `composer install`.
5. Deploy the Budget Calculator to your REDCap environment by copying the Budget Calculator folder to the `<REDCap>/module` directory. If you installed the composer executable locally in the Budget Calculator, do not copy it over to the REDCap environment with the rest of the project. Remember proper REDCap naming conventions are necessary for external modules to be recognized by REDCap.
6. Navigate to the `Control Center` as your REDCap admin.
7. Click `External Modules` on the left sidebar.
8. Click the `Enable a module` button on the External Modules - Module Manager page.
9. Click the `Enable` button next to the Budget Calculator from the available modules list.

# Budget Calculator React Client

For documentation for the React client used with the Budget Calculator, see [bcclient/README.md](bcclient/). The React client is an NPM project that can be built and run directly from its project directory in 'bcclient'.


# Building with PHing

This project contains integration with [PHing](https://www.phing.info/guide/hlhtml/#ch.gettingstarted) for building and
deployment of the ReactJS client and the PHP based REDCap external module. You may choose to only build the PHP based REDCap external module while using the prebuilt React client found in 'resources/bcclient', or fully build the project from both the PHP and the ReactJS source. The default PHing task uses the prebuilt ReactJS client. There is also another PHing task for building both the ReactJS client and the PHP REDCap external module.

## TL;DR

- Install Composer as &lt;project&gt;/bin/composer
- 'php ./bin/composer install'
- Copy '&lt;project&gt;/./vendor/phing' directory to '&lt;project&gt;/bin/phing'
- 'php bin/phing/phing/bin/phing.php'
- See 'build' directory for REDCap Budget Calculator external module.

## Installing and using Composer

The REDCap Budget Calculator uses Composer as its package manager. To use Composer, install it as &lt;project&gt;/bin/composer. See the instructions for installing and using Composer at the Composer project home page. See [https://getcomposer.org/](https://getcomposer.org/). The PHing tasks in this project depend on Composer being located in &lt;project&gt;/bin/composer. However, you can customize 'build.xml' to fit your build environment's needs.

## Installing and configuring NPM

Building the React client with PHing requires a current version of NPM to be installed on your build machine. See [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm) for instructions on installing and configuring NPM.

## Install and run PHing

PHP's Composer loads dependencies for the Budget Calculator. PHing is setup as a dev dependency for the Budget Calculator's PHP project.

Add the Composer executable to &lt;project folder&gt;/bin with the file name of 'composer', renaming from 'composer.phar'. This location and name are required for the default PHing build.xml to work properly. Modify 'build.xml' for PHing if 'composer' is installed in another location.

After installing Composer as &lt;project folder&gt;/bin/composer, install the project dependencies with the commands **'php ./bin/composer install'** and **'php ./bin/composer update'** from your Budget Calculator project root.

PHing is now installed at **&lt;project folder&gt;/vendor/phing/phing/bin/phing.php** and can run with the command 'php ./vendor/phing/phing/bin/phing.php'. However, the 'vendor' directory is not stable and contents will come and go during the build process. Copy the ./vendor/phing directory to '&lt;project folder&gt;/bin/phing' and run the default PHing task with the command 'php bin/phing/phing/bin/phing.php'.

To build the react client with NPM and then assemble the Budget Calculator external module use the command 'php bin/phing/phing/bin/phing.php buildall'. The default task uses a prebuilt React client, instead of building from the React source in the bcclient directory.

NOTE: To view the new web client for the Budget Calculator in Master on GitHub, use the local link with page parameter of "bcclient" in the URL. For example, in my local dev environment, the link is "/redcap/redcap_v9.7.6/ExternalModules/?prefix=budget_calculator&page=bcclient#/" from the REDCap root directory. The default link to the Budget Calculator is still to the old client. This allows the new and old client to be compared side-by-side during development.
