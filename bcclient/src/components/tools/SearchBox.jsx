import React, { Component } from 'react';

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      inputValue: '',
      lastSearchValue: ''
     }
  }

  updateSearchResults = () =>
  {
    //consider moving the update to a webworker if the UI is impacted by updates
    let keyword = this.state.inputValue.trim();
    this.props.searchFunction(keyword);
    this.setState({'lastSearchValue':keyword});
  }

  searchKeywords = (e) =>
  {
    e.preventDefault();//stops page refresh
    this.updateSearchResults();
  }

  inputKeywords = (e) =>
  {
    e.preventDefault();

    //use callback to avoid action until state is actually updated
    this.setState({'inputValue':e.target.value},
    () => {
      if ( this.state.inputValue.trim().length === 0)
      {
        if (this.state.lastSearchValue.length !== 0)
        {
          this.updateSearchResults();
        }
      }
    });
    
  }

  render() { 
    return ( 

      <form className="form-inline" onSubmit={this.searchKeywords}>
        <input className="form-control mr-sm-2" type="search" placeholder="Search for services" aria-label="Search" value={this.state.inputValue} onChange={this.inputKeywords} />
      </form>

     );
  }
}

export default SearchBox;