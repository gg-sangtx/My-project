import React from 'react';
import {Text, DropDown, DatePicker, TimePicker, Input} from 'components/inputform';

class ListItemEdit extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      plan_option_id: this.props.item.plan_option_id || '',
      price: this.props.item.price || '',
      plan_option_code: this.props.item.plan_option_code || '',
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.item != this.props.item) {
      this.state.plan_option_id = nextProps.item.plan_option_id || '';
      this.state.price = nextProps.item.price || '';
      this.state.plan_option_code = nextProps.item.plan_option_code || '';
    }
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    if(name == 'plan_option_id') {
      this.state.price = this.props.dataOptions[this.props.dataOptions.findIndex(x => x.id == e.target.value)].price;
      this.state.plan_option_code = this.props.dataOptions[this.props.dataOptions.findIndex(x => x.id == e.target.value)].code;
    }
    this.setState({...this.state});
    let Item = {
      id: this.props.item.id,
      plan_option_id: this.state.plan_option_id,
      plan_option_code: this.state.plan_option_code,
      price: this.state.price
    }
    this.props.onChange(Item, this.props.count - 1)
  }

  deleteItem() {
    this.props.deleteItem(this.props.item.id);
  }

  getPrice(value) {
    String.prototype.splice = function(idx, rem, str) {
      return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };
    let result = value;
    if(String(result).length < 3) {
      return result
    } else {
      for (let j = Number(String(result).length); j > 0;) {
        j = j - 3;
        if(j > 0) {
          result = String(result).splice(j, 0, ",");
        }
      }
      return result
    }
  }

  render() {
    return (
      <tr>
        <td><DropDown label='' className='mb0' value={this.state.plan_option_id} onChange={this.onChange.bind(this, 'plan_option_id')} options={this.props.dataOptions} keyName='id' valueName='name'/></td>
        <td>{this.state.plan_option_code}</td>
        <td>{'¥' + this.getPrice(Number(this.state.price))}</td>
        <td>
          <div className='wrap-button-action'>
            <button className='item-link-action btn-danger' onClick={this.deleteItem.bind(this)}>削除</button>
          </div>
        </td>
      </tr>
    )
  }
}

export default ListItemEdit;
