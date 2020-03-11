class PerServiceData {
  constructor() {
    this.fetchPerServicesFromApi = this.fetchPerServicesFromApi.bind(this);
  }

  //side effect of setting state in component's state passed into constructor
  fetchPerServicesFromApi(setPerService)
  {
    //TODO: all paths should be configurable
    //if using outside of REDCap External module, make sure this path code is adjust to match your API endpoint
    let basePath = 'http://2019augredcap:8888/redcap';//customize basePath for your development or production environment

    const localUri = window.location.href;
    const found = localUri.indexOf("/redcap");//location of REDCap directory to prepend the API request path to
    if (found > -1)
    {
      basePath = localUri.substring(0, found+7);
    }

    const perServiceAPI = basePath + '/api/?NOAUTH&type=module&prefix=budget_calculator&page=api/per_service_api';

    fetch(perServiceAPI)
      .then(response => response.json())
      .then(perService => {
        setPerService(perService);
      }).catch(err => console.log(err));
  }

}

export default PerServiceData;