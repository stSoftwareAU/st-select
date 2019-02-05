import React, { Component } from 'react';
import ReactDOM from "react-dom";
import AsyncSelect from 'react-select/lib/Async';




class WithCallbacks extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props,
      Options: []
    };


    this.handleInputChange = this.handleInputChange.bind(this);
    this.render = this.render.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
    this.onChange = this.onChange.bind(this);
  }

onChange(newValue){
  let targetID=this.props.data.dataset.target;
  if(targetID){
      console.log(targetID);
      console.log(newValue.value);
    //document.getElementsByName("folder-global-key")[0]
    document.getElementsByName(targetID)[0].value = newValue.value;
  }
}


  handleInputChange(newValue) {
      const inputValue = newValue.replace(/\W/g, '');
      this.setState({
        inputValue,
      });
      return inputValue;
    }


  loadOptions(inputValue, callback){

    var valueLength = inputValue.length;
    if(valueLength >= 3){

      let dataSet = this.props.data.dataset
      let hostitem = dataSet.host;
      let classitem = dataSet.class;
      let nameitem = dataSet.field;
    //  console.log(dataSet) ?limit=5
      console.log(hostitem + " " + classitem + " " + nameitem);
      var url = new URL(hostitem + '/ReST/v8/class/' + classitem)
      console.log(url)
    //  var url = new URL(stselects[i].dataset.host)
    //  var url = new URL('https://demo1.jobtrack.com.au/ReST/v8/class/DBFile')
      var params = {q:"name matches '" + inputValue.trim().replace( '\\','\\\\').replace( "'","\\'") +"*'", limit: 5} // or:
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
        var tmp = []
        for (var i = 0; i < data.results.length; i++) {
          tmp.push({ value: data.results[i]._global_key, label: data.results[i].name},);
        }

         this.setState({
           Options: tmp
         });


        callback( tmp);
      })
    } else {
      callback();
    }
  };




  render() {
    return (
      <div>
        <pre>inputValue: "{this.state.inputValue}"</pre>
        <AsyncSelect
          cacheOptions
          // inputValue
          loadOptions={this.loadOptions}
          onChange={this.onChange}
          defaultOptions
          // onInputChange={this.handleInputChange}
        />
      </div>
    );
  }
}



let stselects = document.getElementsByClassName('st-select');
  for (var i = 0; i < stselects.length; i++) {
    // ReactDOM.render(<WithCallbacks data={stselects[i]}/>, stselects[i]);
    ReactDOM.render(<WithCallbacks data={stselects[i]}/>, stselects[i]);
  }
