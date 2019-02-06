import React, {
  Component
} from 'react';
import ReactDOM from "react-dom";
import AsyncSelect from 'react-select/lib/Async';


class WithCallbacks extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      callfail: false,
      loadedData: '',
    };

    this.render = this.render.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
    this.onChange = this.onChange.bind(this);
    this.noOptionsMessage = this.noOptionsMessage.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

    let targetID = this.props.data.dataset.target;
    if (targetID) {
      let key=document.getElementsByName(targetID)[0].value;

      if( key )
      {
        this.state.pending=true;
        this.componentDidMount;
      }
      else {
        this.state.pending=false;
      }
    }
  }

  componentDidMount(){

    let targetlocation = this.props.data.dataset.target
    let retrivedGlobalKey = document.getElementsByName(targetlocation)[0].value
    var isloaded = document.getElementsByName(targetlocation)[0].dataset.loaded

    if(retrivedGlobalKey){
      if(!isloaded){
      document.getElementsByName(targetlocation)[0].dataset.loaded = true;
      let dataSet = this.props.data.dataset
      let hostdata = dataSet.host;
      let classdata = dataSet.class;
      let fielddata = dataSet.field;

      var url = hostdata + "/ReST/v8/class/"+ classdata + "/" + retrivedGlobalKey;

         fetch(
           url, {
             //    credentials: credentials
             }
           )
           .catch( err => {
               console.warn("UNABLE TO RETRIVE OPTIONS: " + err);
               this.setState({
                 pending:false
               });
             })
           .then(results => {
               return results.json();
           })
           .then(data => {
             console.log(data);
             var item = data.results
             this.setState({
               pending:false,
               value:item
            });
          })
        }
      }
    }






  onChange(newValue) {
    let targetID = this.props.data.dataset.target;
    if (targetID) {
      document.getElementsByName(targetID)[0].value = newValue.value;
    }
  }

  noOptionsMessage() {
    if (!this.state.callfail) {
      if (this.state.validValue) {
        return "No Matching records"
      } else {
        return null;
      }
    } else {
      return "Cannot Get records"
    }
  }

  loadOptions(inputValue, callback) {

    var valueLength = inputValue.length;
    if (valueLength >= 3) {
      this.setState({
        validValue: true,
        isLoading: true,
        callfail: false
      })

      let dataSet = this.props.data.dataset
      let hostitem = dataSet.host;
      let classitem = dataSet.class;
      let nameitem = dataSet.field;
      let filteritem = dataSet.filter;
      let credentialsitem = dataSet.credentials;

      console.log(hostitem + " " + classitem + " " + nameitem);
      var url = new URL(hostitem + '/ReST/v8/class/' + classitem)

       if(dataSet.filter){
        var qdata = filteritem + "AND name matches '" + inputValue.trim().replace('\\', '\\\\').replace("'", "\\'") + "*'";
       } else {
         var qdata = "name matches '" + inputValue.trim().replace('\\', '\\\\').replace("'", "\\'") + "*'";
       }

      var params = {
        q: qdata,
        limit: 5
      } // or:

      url.search = new URLSearchParams(params)
      console.log(url);

      if(credentialsitem){
        var credentials = 'true'
      } else {
        var credentials= 'false'
      }

      fetch(
          url,{
              credentials: credentials
          }
        )

        .catch( err => {
            console.log("UNABLE TO RETRIVE OPTIONS: " + err);
              callback();
          })


        .then(results => {
          if(results){
            return results.json();
          } else {
            return;
          }
        })

        .then(data => {
          if(data){
            var tmp = []
            for (var i = 0; i < data.results.length; i++) {
              tmp.push({
                value: data.results[i]._global_key,
                label: data.results[i].name
              }, );
            }

            this.setState({
              isLoading: false,
              callfail: false
            })
          } else {
            this.setState({
              isLoading: false,
              callfail: true
            })
          }
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

      if( this.state.pending)
      {
        return <span>pending...</span>;
      }
      else {
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
           defaultInputValue = {
             this.state.value
           }
          // defaultOptions=false
          // onInputChange={this.handleInputChange}
          />
        );

      }

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
