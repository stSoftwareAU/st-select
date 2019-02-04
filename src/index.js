import React, { Component } from 'react';
import ReactDOM from "react-dom";
import AsyncSelect from 'react-select/lib/Async';





class WithCallbacks extends Component {

  constructor(props) {
    super(props);
      console.log("ABC")
      console.log(props)
    this.state = {
      data: this.props
    };


    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.render = this.render.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
  }

  handleChange() {
    console.log('asdasd')
    return;
  }

  handleInputChange(newValue) {
      const inputValue = newValue.replace(/\W/g, '');
      this.setState({
        inputValue,
      });
      return inputValue;
    }

  loadOptions(inputValue, callback, props){
    console.log( "XYZ");
    console.log(this);

  //this.state.Data
      console.log(inputValue);
    // let hostitem = stselects[i].dataset.host;
    // let classitem = stselects[i].dataset.class;
    // let nameitem = stselects[i].dataset.name;

    // var url = new URL(hostitem + '/ReST/v8/class/' + classitem)
  //  var url = new URL(stselects[i].dataset.host)
    var url = new URL('https://demo1.jobtrack.com.au/ReST/v8/class/DBFile')
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
      //console.log( data);
      // var tmp= filterColors( inputValue);
      // console.log( tmp);
      var tmp2=[{
        value: "a",
        label: "A"
      }];
      callback( tmp2);

    })
  };
  render(props) {
    console.log(props)
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

// var target = Data[0].target
// console.log(document.getElementsByName(target)[0]);
//document.getElementById("index")
//  ReactDOM.render(<WithCallbacks />, document.getElementById("index"));
//document.getElementsByName('indexTest')[0].prepend('hello')
//ReactDOM.render(<WithCallbacks />, document.getElementsByName(target)[0].prepend(target));

//ReactDOM.render(<WithCallbacks />, document.getElementById("index"));

// ReactDOM.render(<WithCallbacks />, document.getElementById("index"));


let stselects = document.getElementsByClassName('st-select');
for (var i = 0; i < stselects.length; i++) {
    // stselects[i];   key={item.id}
    //console.log( stselects[i]);
    ReactDOM.render(<WithCallbacks data={stselects[i]}/>, stselects[i]);
}
