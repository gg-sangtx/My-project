import React from 'react';
import {validatable, ShowIf} from 'components/utils';
import {msg} from "constants/message";

class DropDown extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      value: this.props.value,
      isValid: true
    }
  }

  onChange(e) {
    this.state.value = e.target.value;
    this.state.isValid = true;
    this.setState({ ...this.state });
    this.props.onChange(e);
  }

  validate() {
    if (!this.state.value && this.props.require) {
      this.setState({
        isValid: false
      });
      this.select.focus();
      return false;
    } else {
      this.setState({
        isValid: true
      });
      return true;
    }
  }

  componentWillReceiveProps(nextProps) {
    this.state.value = nextProps.value;
    this.setState({
      ...this.state
    });
  }

  classNames() {
    if (!this.state.isValid && !this.state.value) {
      return 'pt-intent-danger';
    } else {
      return '';
    }
  }

  focus() {
    this.select.focus();
  }

  render() {
  return (
    <div className={this.props.className}>
      <ShowIf condition={this.props.label != ''}>
        <label className="form-label">
          { this.props.label }
          <ShowIf condition={this.props.require == true}>
            <span className="label-require">&nbsp;*</span>
          </ShowIf>
        </label>
      </ShowIf>
      <select disabled={this.props.disable} className={`form-select ${this.classNames()}`} value={ this.state.value } onChange={ this.onChange.bind(this) } ref={(select) => {this.select = select}} name = {this.props.name}>
        <ShowIf condition = { this.props.showPlaceholder == true }>
          <option value=''>
            {this.props.placeholder ? this.props.placeholder : ''}
          </option>
        </ShowIf>
        { this.props.options.map((item, i) => {
            return (
              <option key={i} value={ item[this.props.keyName] }>
                { item[this.props.valueName] }
              </option>
            );
          }) }
      </select>
      <ShowIf condition={!this.state.isValid && !this.state.value}>
        <span className="pt-form-helper-text">{msg.messageDefault}</span>
      </ShowIf>
    </div>
    );
  }
}

DropDown.defaultProps = {
  disable: false,
  label: 'This is label',
  options: [],
  onChange: function() {
    console.log('Need to assign onChange method');
  },
  onRef: function() {
  },
  value: '',
  keyName: 'key',
  className: 'form-group',
  valueName: 'value',
  showPlaceholder: false,
  placeholder: 'Placeholder',
  require: false,
  name : ''
}

export default validatable(DropDown);
