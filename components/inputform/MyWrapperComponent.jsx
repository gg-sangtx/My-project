import React from 'react';

class MyWrapperComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    let wrap = document.getElementById('content-list-manager');
    if(wrap) {
      let Event = document.getElementsByClassName('rbc-show-more');
      var ListEvent = Array.from(Event);
      ListEvent.map(event => {
        event.style.marginRight = (((wrap.clientWidth - 68) / 7) - event.clientWidth) + 'px';
      })
    }
  }

  render() {
    const { event, children } = this.props;
    return (
      <div className={`${event.color}`}>
        {this.props.children}
      </div>
    );
  }
}

export default MyWrapperComponent;