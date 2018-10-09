import React from 'react';

export default function(WrappedComponent) {
  class HOC extends React.Component {
    constructor(props, context) {
      super(props, context);

      this.validators = {};

      if (this.props.bindValidator && this.props.bindValidator.props.validators) {
        this.validators = this.props.bindValidator.props.validators;
      }
    }

    validate() {
      if (typeof this.validator.validate != "function") {
        return true;
      } else {
        return this.validator.validate();
      }
    }

    componentDidMount() {
      this.validator = this.refs.wrappedComponent;

      if (this.props.channel) {
        if (!this.validators[this.props.channel]) {
          this.validators[this.props.channel] = [];
        }

        this.validators[this.props.channel].push(this);
      }
    }

    componentWillReceiveProps(nextProps) {
      this.validator = this.refs.wrappedComponent;

      if (nextProps.channel) {
        if (!this.validators[nextProps.channel]) {
          this.validators[nextProps.channel] = [];
        }

        this.validators[nextProps.channel].push(this);
      }
    }

    componentWillUnmount() {
      this.validator = {};
    }

    render() {
      return <WrappedComponent ref='wrappedComponent' {...this.props} validators={this.validators}/>
    }
  };

  HOC.defaultProps = {
    validators: {}
  }

  return HOC;
}
