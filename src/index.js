import React, {
  Component
} from 'react';
import ReactDOM from "react-dom";
import AsyncSelect from 'react-select/lib/Async';

class WithCallbacks extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
      // data: this.props,
      // Options: []
    };

    // this.handleInputChange = this.handleInputChange.bind(this);
    this.render = this.render.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
    this.onChange = this.onChange.bind(this);
    this.noOptionsMessage = this.noOptionsMessage.bind(this);
  }

  onChange(newValue) {
    let targetID = this.props.data.dataset.target;
    if (targetID) {
      // console.log(targetID);
      // console.log(newValue.value);
      //document.getElementsByName("folder-global-key")[0]
      document.getElementsByName(targetID)[0].value = newValue.value;
    }
  }

  noOptionsMessage() {
    if (this.state.validValue) {
      return "No Matching records"
    } else {
      return null;
    }
  }
  // handleInputChange(newValue) {
  //     const inputValue = newValue.replace(/\W/g, '');
  //     this.setState({
  //       inputValue,
  //     });
  //     return inputValue;
  //   }


  loadOptions(inputValue, callback) {

    var valueLength = inputValue.length;
    if (valueLength >= 3) {
      this.setState({
        validValue: true,
        isLoading: true
      })
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
      var params = {
        q: "name matches '" + inputValue.trim().replace('\\', '\\\\').replace("'", "\\'") + "*'",
        limit: 5
      } // or:
      url.search = new URLSearchParams(params)

      fetch(
          url, {
            //  credentials: 'include'
          }
        )
        .then(results => {
          return results.json();
        }).then(data => {
          var tmp = []
          for (var i = 0; i < data.results.length; i++) {
            tmp.push({
              value: data.results[i]._global_key,
              label: data.results[i].name
            }, );
          }

          // this.setState({
          //   Options: tmp
          // });

          this.setState({
            isLoading: false
          })

          callback(tmp);
        })
    } else {
      // callback();
      this.setState({
        validValue: false,
        isLoading: false
      });

      callback();
    }
  };

  render() {
    return ( <
      AsyncSelect isLoading = {
        this.state.isLoading
      }
      cacheOptions = {
        true
      }
      // cacheOptions
      // inputValue
      loadOptions = {
        this.loadOptions
      }
      onChange = {
        this.onChange
      }
      noOptionsMessage = {
        this.noOptionsMessage
      }
      // defaultOptions=false
      // onInputChange={this.handleInputChange}
      />
    );
  }
}

let stselects = document.getElementsByClassName('st-select');
for (var i = 0; i < stselects.length; i++) {
  // ReactDOM.render(<WithCallbacks data={stselects[i]}/>, stselects[i]);
  ReactDOM.render( <
    WithCallbacks data = {
      stselects[i]
    }
    />, stselects[i]);
  }
