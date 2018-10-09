import React from 'react';
import {ShowIf, validatable} from 'components/utils';
import {msg} from "constants/message";
import {checkEmail} from 'lib/validate';

const tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

class Text extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.props.value || ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.value != this.props.value) {
      this.state.value = nextProps.value;
      this.setState({
        ...this.state
      });
    }
  }

  replaceTag(tag) {
    return tagsToReplace[tag] || tag;
  }

  safe_tags_replace(str) {
    return String(str).replace(/[&<>]/g, this.replaceTag);
  }

  render() {
    let content = this.state.value ? this.safe_tags_replace(this.state.value) : '';
    return (
      <div className={this.props.className}>
        <ShowIf condition={this.props.label != ''}>
          <label className='form-label'>{this.props.label}</label>
        </ShowIf>
        <ShowIf condition={this.props.hasUnit != true && this.props.showHtml != true}>
          <label className='mb0' style={{fontWeight: 400}} name={this.props.name}>
            {this.state.value}
          </label>
        </ShowIf>
        <ShowIf condition={this.props.showHtml == true}>
          <label className='mb0' style={{fontWeight: 400}} dangerouslySetInnerHTML={{__html: content.replace(/\n/gi, '<br/>')}}></label>
        </ShowIf>
      </div>
    )
  }
}

Text.defaultProps = {
  label: 'This is label',
  className: 'form-group',
  showHtml: false
}

export default validatable(Text);
