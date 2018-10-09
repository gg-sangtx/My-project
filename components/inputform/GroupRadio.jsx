import React from 'react';
import {ShowIf, validatable} from 'components/utils';

class GroupRadio extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.props.value || ''
    }
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

  onChange(e) {
    this.state.value = e.target.value
    this.setState({
      ...this.state
    })
    this.props.onChange(e);
  }

  render() {
    return (
      <div className={this.props.className}>
        <ShowIf condition={this.props.label != ''}>
          <label className='form-label'>{this.props.label}
            <ShowIf condition={this.props.require == true}>
              <span className="label-require">&nbsp;*</span>
            </ShowIf>
          </label>
        </ShowIf>
        <div className='pt5'>
        {
          this.props.data.map((Item, i) => {
            return(
              <div className='item-radio' key={i}>
                <input className='form-radio' type='radio' name={`${this.props.name}`} checked={this.state.value == Item[this.props.keyName]} value={Item[this.props.keyName]} onChange={this.onChange.bind(this)}/>
                <span className='radio-mark'></span>
                <label className='radio-label'>{Item[this.props.valueName]}</label>
              </div>
            )
          })
        }
        </div>
      </div>
    )
  }
}

GroupRadio.defaultProps = {
  label: 'This is label',
  name: '',
  onChange: function() {
    console.log('Need to assign onChange method')
  },
  onRef: function() {
  }
}

export default GroupRadio;
