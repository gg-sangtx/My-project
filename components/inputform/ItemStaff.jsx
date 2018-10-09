import React from 'react';
import { Input, DropDown } from 'components/inputform';

class ItemStaff extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dataOption: this.props.dataOption,
      id: this.props.item && this.props.item.id ? this.props.item.id : '',
      type: this.props.item && this.props.item.type ? this.props.item.type : '',
      sort_value: this.props.item && this.props.item.sort_value ? this.props.item.sort_value : '',
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataOption != this.props.dataOption) {
      this.state.dataOption = nextProps.dataOption;
    }
    this.state.id = nextProps.item.id ? nextProps.item.id : '';
    this.state.type = nextProps.item.type ? nextProps.item.type : '';
    this.state.sort_value = nextProps.item.sort_value ? nextProps.item.sort_value : '';

    this.setState({...this.state});
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.setState({...this.state})
    let data = {
      id: this.state.id,
      type: this.props.item.type,
      sort_value: this.state.sort_value
    }
    this.props.onChange(this.props.index, data)
  }

  remove() {
    this.props.onRemove(this.props.index);
  }

  render() {
    return (
      <div className='col-sm-12 no-gutter group-dropdown'>
        <DropDown label={`${this.props.index + 1}人目を選択`} showPlaceholder={true} placeholder={`${this.props.index + 1}人目を選択`} options={this.state.dataOption} keyName={this.props.keyName} valueName={this.props.valueName} value={this.state.id} onChange={this.onChange.bind(this, 'id')}/>
        <Input changeOnBlur={true} label='優先度' type='text' maxLength='40' name='sort_value' value={this.state.sort_value} onChange={this.onChange.bind(this, 'sort_value')}/>
        <span className='btn-close-confirm btn-red' onClick={this.remove.bind(this)}>削除</span>
      </div>
    )
  }
}

export default ItemStaff;
