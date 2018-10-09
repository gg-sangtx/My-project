import React from 'react';

class WrapBlockEdit extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className={`wrap-block-edit ${this.props.hasBottomBorder ? 'has-border-bottom' : ''}`}>
        <h2 className='title-block-edit'>{this.props.title}</h2>
        <div className='wrap-content-block-edit'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

WrapBlockEdit.defaultProps = {
  hasBottomBorder: false,
  title: ''
}

export default WrapBlockEdit;