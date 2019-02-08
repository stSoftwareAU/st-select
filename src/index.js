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
      defaultOp: []
    };

      this.render = this.render.bind(this);
      this.loadOptions = this.loadOptions.bind(this);
      this.onChange = this.onChange.bind(this);
      this.noOptionsMessage = this.noOptionsMessage.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
      this.handleBlur = this.handleBlur.bind(this);

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
             var item = data.name
             console.log(this.state.value)
             this.setState({
               pending:false,
               value:item
            });
            console.log(this.state.value)

          })
        }
      }
    }

  handleBlur(value, inputValue) {
    console.log(value)
      console.log(inputValue)
    console.log(this.state.value)
    console.log(this.props)

    this.setState({
      value: this.state.value
    })

    this.props.data.firstChild.inputMode.onBlur();

  }

  onChange(newValue) {
    let targetID = this.props.data.dataset.target;
    if (targetID) {
      if (newValue) {
        document.getElementsByName(targetID)[0].value = newValue.value;
      } else {
        document.getElementsByName(targetID)[0].value = "";
      }
    }
  }

  noOptionsMessage(inputvalue) {
    var item =  inputvalue.inputValue.length;
    if (!this.state.callfail) {
      if (inputvalue.inputValue){
        if (inputvalue.inputValue.length >= 3) {
          if (this.state.inputValue) {return "No Matching records" } else {return null;}
        } else {
          return "Not Enough Criteria To Search..."
        }
      }
    } else {
      return "Cannot Get records"
    }
  };

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

      console.log(hostitem + " " + classitem + " " + nameitem + " " + credentialsitem);
      var url = new URL(hostitem + '/ReST/v8/class/' + classitem)
      let qdata="";
       if(dataSet.filter){
        qdata = filteritem + " AND ";
       }

      qdata += "name matches '" + inputValue.trim().replace('\\', '\\\\').replace("'", "\\'") + "*'";
      var params = {
        q: qdata,
        limit: 5
      } // or:

      url.search = new URLSearchParams(params)
      console.log(url);

      //console.log(credentialsitem);

       if(credentialsitem){
         //console.log('yes');
         var credentials = ''
       } else {
         //console.log('no');
         var credentials= 'credentials : include'
       }

      fetch(
          url,{
      //        credentials
          }
        )



        .catch( err => {
            console.warn("UNABLE TO RETRIVE OPTIONS: " + err);
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
          //  var clearoption = tmp.push({value: "", label: ""});
            for (var i = 0; i < data.results.length; i++) {
              tmp.push({
                value: data.results[i]._global_key,
                label: data.results[i].name
              }, );
            }

            this.setState({
              isLoading: false,
              callfail: false,
              defaultOp: tmp
            })
          } else {
            this.setState({
              isLoading: false,
              callfail: true
            })
          }
          callback(tmp);
          //console.log('this.state.value')
        //console.log(this.state.value)
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

  render(newValue2) {

    console.log(this)
      if( this.state.pending)
      {
        return <span>pending...</span>;
      }
      else {
        var input2 = document.getElementsByName(this.props.data.dataset.target)[0];
        return ( <
          AsyncSelect isLoading = {
            this.state.isLoading
          }
          loadOptions = {
            this.loadOptions
          }
          onChange = {
            this.onChange
          }
          noOptionsMessage = {
            this.noOptionsMessage
          }
          onInputChange={
            this.onInputChange
          }
          defaultOptions={
            this.state.defaultOp
          }
          //defaultInputValue , defaultValue, inputValue, inputId, setValue
          // onBlur={() => field.onBlur({value: field.value})}
          onBlur={this.handleBlur}

          defaultInputValue = {
            this.state.value
          }




         isClearable

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
