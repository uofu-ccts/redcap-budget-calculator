// This is the configuration file for this React client
// add any configuration values to the exported 'bcConfig'
// to use the values in a react file, add
// import { bcConfig } from 'config.js';
// to the top of the class, modifying the config.js path
// appropriately.

// IMPORTANT ... All client side code is visible via dev tools
//               in browsers. Never place passwords, PHI, or
//               other private data in this configuration file.

export const bcConfig = { 
  urlBase: 'https://redcap-dev.ccts.utah.edu', 
  urlPathToREDCap: '', //usually a variation of '/redcap'
  serviceCatalogApiPath: '/api/?NOAUTH&type=module&prefix=budget_calculator&page=api/service_catalog_api',
  perServiceAPI: '/api/?NOAUTH&type=module&prefix=budget_calculator&page=api/per_service_api'
  };