import React, { Component } from 'react';
import ReactDOM from "react-dom";
import AsyncSelect from 'react-select/lib/Async';





class WithCallbacks extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props
    };


    this.handleInputChange = this.handleInputChange.bind(this);
    this.render = this.render.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
  }


  handleInputChange(newValue) {
      const inputValue = newValue.replace(/\W/g, '');
      this.setState({
        inputValue,
      });
      return inputValue;
    }

  loadOptions(inputValue, callback){
    let dataSet = this.props.data.dataset
    let hostitem = dataSet.host;
    let classitem = dataSet.class;
    let nameitem = dataSet.field;
    console.log(dataSet)
    console.log(hostitem + " " + classitem + " " + nameitem);

     var url = new URL(hostitem + '/ReST/v8/class/' + classitem)
  //  var url = new URL(stselects[i].dataset.host)
  //  var url = new URL('https://demo1.jobtrack.com.au/ReST/v8/class/DBFile')
    var params = {q:"name matches '" + inputValue.trim().replace( '\\','\\\\').replace( "'","\\'") +"*'"} // or:
    url.search = new URLSearchParams(params)

    // var request = new Request({
    //   url: 'https://demo1.jobtrack.com.au/ReST/v8/class/DBFile',
    //   method: 'GET'
    // });
    fetch(
      url,
      {
      //  credentials: 'include'
      }
    )
    .then( results => {
      return results.json();
    }).then( data => {
      console.log(data.results[0]);
      // console.log(data.results[0].name);
      // var tmp= filterColors( inputValue);
      // console.log( tmp);
      var tmp2=[
        { value: data.results[0]._global_key, label: data.results[0].name},
        { value: data.results[1]._global_key, label: data.results[1].name},
        { value: data.results[2]._global_key, label: data.results[2].name},
        { value: data.results[3]._global_key, label: data.results[3].name},
        { value: data.results[4]._global_key, label: data.results[4].name},

    ];
      callback( tmp2);

    })
  };
  render() {
    return (
      <div>
        <pre>inputValue: "{this.state.inputValue}"</pre>
        <AsyncSelect
          cacheOptions
          loadOptions={this.loadOptions}
          defaultOptions
          onChange={this.handleOnChange}
          onInputChange={this.handleInputChange}
        />
      </div>
    );
  }
}



let stselects = document.getElementsByClassName('st-select');
for (var i = 0; i < stselects.length; i++) {
  ReactDOM.render(<WithCallbacks data={stselects[i]}/>, stselects[i]);
}
