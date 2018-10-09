import React from 'react';
import {DatePicker} from 'components/inputform';
import moment from 'moment';
import * as CONFIG from 'constants/datetime';
import {msg} from "constants/message";
import {validatable,ShowIf} from 'components/utils';

class GroupDatePicker extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.props.value || [],
      valueSelected: '',
      hasError: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value != this.props.value) {
      this.state.value = nextProps.value;
      this.setState({...this.state});
    }
  }

  onChange(e) {
    if (e && e._d) {
      this.setState({
        valueSelected: e._d
      });
    } else {
      this.setState({
        valueSelected: e
      });
    }
  }

  addItem() {
    if(this.state.valueSelected) {
      if(this.state.value.indexOf(moment(this.state.valueSelected).format(CONFIG.DateFormat)) == -1) {
        this.state.value.push(moment(this.state.valueSelected).format(CONFIG.DateFormat));
        this.state.valueSelected = '';
        this.state.hasError = false;
        this.setState({
          ...this.state
        })
        let data = {
          target: {
            value: this.state.value
          }
        }
        this.props.onChange(data);
      } else {
        this.state.hasError = false;
        this.state.valueSelected = '';
        this.setState({
          ...this.state
        })
      }
    }
  }

  removeItem(index) {
    this.state.value.splice(index, 1);
    this.setState({
      ...this.state
    })
    let data = {
      target: {
        value: this.state.value
      }
    }
    this.props.onChange(data);
  }

  validate() {

    let pass = true;
    if(this.props.require == true && this.state.value.length == 0) {
      this.state.hasError = true;
      pass = false;
      this.setState({...this.state})
    }
    return pass;
  }

  render() {
    return (
      <div className='group-datepicker'>
        <ShowIf condition={this.props.label != ''}>
          <label className='form-label'>{this.props.label}
            <ShowIf condition={this.props.require == true}>
              <span className='label-require'>*</span>
            </ShowIf>
          </label>
        </ShowIf>
        <DatePicker value={this.state.valueSelected} onChange={this.onChange.bind(this)}/>
        <div className='button-wrap'>
          <span className='btn-close-confirm' onClick={this.addItem.bind(this)}>追加</span>
        </div>
        <div className='list-result'>
          {
            this.state.value.map((item, i) => {
              return(
                <div className='item-result'>
                  <span>{item}</span>
                  <span className='item-close' onClick={this.removeItem.bind(this, i)}>×</span>
                </div>
              )
            })
          }
        </div>
        <div className='col-xs-12 pl0 pr0'>
          <ShowIf condition={this.state.hasError == true && this.state.value.length == 0}>
            <span className="pt-form-helper-text">{msg.messageDefault}</span>
          </ShowIf>
        </div>

      </div>
    )
  }
}

GroupDatePicker.defaultProps = {
  require: false
}

export default validatable(GroupDatePicker);
