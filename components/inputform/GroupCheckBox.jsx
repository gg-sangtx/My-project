import React from 'react';
import {ShowIf, validatable} from 'components/utils';
import {msg} from "constants/message";

class GroupCheckBox extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.props.value || [],
      isValid: false
    }
    this.checkAll = this.checkAll.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.value != this.props.value) {
      this.state.value = nextProps.value;
      this.setState({...this.state})
    }
  }

  onChange(name, e) {
    let dataFilter = [...this.state.value];
    let dataCheck = dataFilter.filter(state => {
      return state == name
    })
    if(dataCheck.length > 0) {
      let index = dataFilter.indexOf(name)
      this.state.value.splice(index, 1);
      this.setState({
        ...this.state
      })
    } else {
      this.state.value.push(name);
      this.state.isValid = false;
      this.setState({
        ...this.state
      })
    }
    let value = {
      target: {
        value: this.state.value
      }
    }
    this.props.onChange(value);
  }

  checkValue(value) {
    if(this.state.value.indexOf(value) == -1) {
      return false
    } else {
      return true
    }
  }

  checkAll() {
    this.state.value = [];
    this.props.data.map(item => {
      this.state.value.push(item[this.props.keyName])
    })
    this.setState({
      ...this.state
    })
    let value = {
      target: {
        value: this.state.value
      }
    }
    this.props.onChange(value);
  }

  unCheckAll() {
    this.state.value = [];
    this.setState({
      ...this.state
    })
    let value = {
      target: {
        value: []
      }
    }
    this.props.onChange(value);
  }

  validate() {
    if (this.props.require == true && this.state.value.length == 0) {
      this.state.isValid = true;
      this.setState({...this.state})
      this.checkBox.focus();
      return false
    } else {
      return true
    }
  }

  onChangeCheckBox(value, index) {
    let dataFilter = [...this.state.value];
    let dataCheck = dataFilter.filter(state => {
      return state[this.props.keyName] == value
    })
    if(dataCheck.length > 0) {
      let index = this.state.value.findIndex(x => x[this.props.keyName] == value)
      this.state.value.splice(index, 1);
      this.setState({
        ...this.state
      })
    } else {
      let Item = {
        [this.props.keyName]: value,
        [this.props.valueInput]: '120'
      }
      this.state.value.push(Item);
      this.state.isValid = false;
      this.setState({
        ...this.state
      })
    }
    let data = {
      target: {
        value: this.state.value
      }
    }
    this.props.onChange(data);
  }

  onChangeInput(keyName, e) {
    let index = this.state.value.findIndex(x => x[this.props.keyName] == keyName);
    if(index != -1) {
      this.state.value[index] = {
        ...this.state.value[index],
        [this.props.valueInput]: e.target.value
      }
      this.setState({...this.state});
      let data = {
        target: {
          value: this.state.value
        }
      }
      this.props.onChange(data);
    }
    return;
  }

  render() {
    return (
      <div style={{position: 'relative'}}>
        <ShowIf condition={this.props.label != ''}>
          <label className='form-label'>{this.props.label}
            <ShowIf condition={this.props.require == true}>
              <span className="label-require">&nbsp;*</span>
            </ShowIf>
          </label>
        </ShowIf>
        {
          this.props.data.map((Item, i) => {
            return(
              <div className='item-check-box' key={i}>
                <ShowIf condition={this.props.hasInput != true}>
                  <input className='form-checkbox' id={`${this.props.name}${i}`} type='checkbox' name={`${this.props.name}${i}`} checked={this.state.value && this.state.value.length > 0 && this.state.value.indexOf(Item[this.props.keyName]) != -1} onChange={this.onChange.bind(this, Item[this.props.keyName])}/>
                </ShowIf>
                <ShowIf condition={this.props.hasInput == true}>
                  <input className='form-checkbox' id={`${this.props.name}${i}`} type='checkbox' name={`${this.props.name}${i}`} checked={this.state.value && this.state.value.length > 0 && this.state.value.findIndex(x => x[this.props.keyName] == Item[this.props.keyName]) != -1} onChange={this.onChangeCheckBox.bind(this, Item[this.props.keyName])}/>
                </ShowIf>
                <label className='checkmark'></label>
                <label className='check-box-label' htmlFor={`${this.props.name}${i}`}>{Item[this.props.valueName]}</label>
                <ShowIf condition={this.props.hasInput == true && (this.state.value && this.state.value.length > 0 && this.state.value.findIndex(x => x[this.props.keyName] == Item[this.props.keyName]) != -1)}>
                  <input className='input-checkbox' style={{width: 50, marginLeft: 10, padding: '0 10px'}} maxLength={3}
                  value={
                    (this.state.value && this.state.value.length > 0 &&
                      (this.state.value.findIndex(x => x[this.props.keyName] == Item[this.props.keyName]) != -1 )
                    ) ? (this.state.value[(this.state.value.findIndex(x => x[this.props.keyName] == Item[this.props.keyName]))][this.props.valueInput]) : ''}
                    onChange={this.onChangeInput.bind(this, Item[this.props.keyName])}/>
                </ShowIf>
              </div>
            )
          })
        }
        <ShowIf condition={this.props.require == true}>
          <input className='hidden-input' ref={(checkBox) => {this.checkBox = checkBox}}/>
        </ShowIf>
        <ShowIf condition={this.state.isValid}>
          <span className="pt-form-helper-text">{msg.messageDefault}</span>
        </ShowIf>
      </div>
    )
  }
}

GroupCheckBox.defaultProps = {
  label: 'This is label',
  name: '',
  onChange: function() {
    console.log('Need to assign onChange method')
  },
  onRef: function() {
  },
  hasInput: false,
  valueInput: ''
}

export default validatable(GroupCheckBox);