import { bcConfig } from './config.js';

class PerServiceData {
  constructor() {
    this.fetchPerServicesFromApi = this.fetchPerServicesFromApi.bind(this);
  }

  //side effect of setting state in component's state passed into constructor
  fetchPerServicesFromApi(setPerService)
  {
    //all paths are configurable in 'config.js'
    const perServiceAPI = bcConfig.urlBase + bcConfig.urlPathToREDCap + bcConfig.perServiceAPI;

    fetch(perServiceAPI)
      .then(response => response.json())
      .then(perService => {
        setPerService(perService);
      }).catch(err => console.log(err));
  }

}

export default PerServiceData;