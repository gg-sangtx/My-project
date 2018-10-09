import React from 'react';
import ItemStaff from './ItemStaff.jsx';
import {ShowIf} from 'components/utils';

class ListStaff extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.props.value || []
    }
  }

  onChange(index, data) {
    this.state.value[index] = data;
    this.setState({...this.state});
    let value = {
      target: {
        value: this.state.value
      }
    }
    this.props.onChange(value)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.value != this.props.value) {
      this.state.value = nextProps.value;
      this.setState({...this.state})
    }
  }

  onRemove(index) {
    this.state.value.splice(index, 1)
    this.setState({...this.state});
    let value = {
      target: {
        value: this.state.value
      }
    }
    this.props.onChange(value)
  }

  addNewStaff(e) {
    e.preventDefault();
    let item = {
      id: '',
      sort_value: '',
      type: this.props.type
    }
    this.state.value.push(item);
    this.setState({...this.state})
  }

  render() {
    return (
      <div className={this.props.className}>
        <label className='bold col-sm-12'>{this.props.label}</label>
        <ShowIf condition={this.props.dataStaff.length > 0}>
          <div>
            {this.state.value.map((item, i) => {
              return(
                <ItemStaff keyName={this.props.keyName} item={item} valueName={this.props.valueName} dataOption={this.props.dataStaff} onChange={this.onChange.bind(this)} onRemove={this.onRemove.bind(this)} index={i} key={i}/>
              )
            })}
            <div className='text-center'>
              <span className='btn-confirm mr20' onClick={this.addNewStaff.bind(this)}>{this.props.labelAddnew}</span>
            </div>
          </div>
        </ShowIf>
        <ShowIf condition={this.props.dataStaff.length == 0}>
          <label className='bold col-sm-12 text-center'>{this.props.labelShowOnNull}</label>
        </ShowIf>
      </div>
    )
  }
}

ListStaff.defaultProps = {
  label: '',
  className: '',
  dataStaff: [],
  onChange: function() {console.log('Please append onChange() method')},
  onRemove: function() {console.log('Please append onRemove() method')},
}

export default ListStaff;
