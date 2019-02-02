import React, { Component } from 'react';
import ReactDOM from "react-dom";


import AsyncSelect from 'react-select/lib/Async';

const loadOptions = (inputValue, callback) => {
  var url = new URL('https://demo1.jobtrack.com.au/ReST/v8/class/DBFile')

  var params = {q:"name matches '" + inputValue.trim().replace( '\\','\\\\').replace( "'","\\'") +"*'"} // or:

  url.search = new URLSearchParams(params)
  console.log( url);
  // var request = new Request({
  //   url: 'https://demo1.jobtrack.com.au/ReST/v8/class/DBFile',
  //   method: 'GET'
  // });
  fetch(
    url,
    {
      credentials: 'include'
    }
  )
  .then( results => {
    return results.json();
  }).then( data => {
    console.log( data);
    // var tmp= filterColors( inputValue);
    // console.log( tmp);
    var tmp2=[{
      value: "a",
      label: "A"
    }];
    callback( tmp2);

  })
};

class WithCallbacks extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleInputChange = this.handleInputChange.bind(this);
    this.render = this.render.bind(this);
  }

  handleInputChange(newValue) {
      const inputValue = newValue.replace(/\W/g, '');
      this.setState({ inputValue });
      return inputValue;
    }

  render() {
    return (
      <div>
        <pre>inputValue: "{this.state.inputValue}"</pre>
        <AsyncSelect
          cacheOptions
          loadOptions={loadOptions}
          defaultOptions
          onInputChange={this.handleInputChange}
        />
      </div>
    );
  }
}
ReactDOM.render(<WithCallbacks />, document.getElementById("index"));
