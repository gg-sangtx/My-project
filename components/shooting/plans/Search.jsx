import React, {Component} from 'react';
import {Collapse} from 'react-collapse';
import {Input, InputGroupCurrency} from 'components/inputform';
import {connect} from 'react-redux';

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: true,
      search: false,
      name: '',
      code: '',
      WeekDayPriceFrom: '',
      WeekDayPriceTo: '',
      HolidayFriceFrom: '',
      HolidayFriceTo: ''
    };
  }

  onChange(name, e) {
    this.setState({
      [name]: e.target.value
    });
  }

  onBlur(name, e) {
    this.setState({
      [name]: e.target.value
    });
    
    if(name=="WeekDayPriceTo" && this.state.WeekDayPriceFrom > this.state.WeekDayPriceTo) {
      this.setState({
        WeekDayPriceFrom: this.state.WeekDayPriceTo,
        WeekDayPriceTo: this.state.WeekDayPriceFrom
      })
    }
    
    if(name=="HolidayFriceTo" && this.state.HolidayFriceFrom > this.state.HolidayFriceTo) {
      this.setState({
        HolidayFriceFrom: this.state.HolidayFriceTo,
        HolidayFriceTo: this.state.HolidayFriceFrom
      })
    }
  }

  Collapse() {
    this.state.isOpen = !this.state.isOpen;
    this.setState({
      ...this.state
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading == false) {
      this.state.search = false;
    }
    if (nextProps.goBack == true) {
      this.state.code = nextProps.dataSearch.code;
      this.state.name = nextProps.dataSearch.name;
      this.state.WeekDayPriceFrom = nextProps.dataSearch.weekday_price_from;
      this.state.WeekDayPriceTo = nextProps.dataSearch.weekday_price_to;
      this.state.HolidayFriceFrom = nextProps.dataSearch.holiday_price_from;
      this.state.HolidayFriceTo = nextProps.dataSearch.holiday_price_to;
    }
    this.setState({...this.state});
  }

  search(e) {
    e.preventDefault();
    this.state.search = true;
    this.setState({...this.state});
    let data = {
      code: this.state.code ? this.state.code : '',
      name: this.state.name ? this.state.name : '',
      weekday_price_from: this.state.WeekDayPriceFrom ? this.state.WeekDayPriceFrom : '',
      weekday_price_to: this.state.WeekDayPriceTo ? this.state.WeekDayPriceTo : '',
      holiday_price_from: this.state.HolidayFriceFrom ? this.state.HolidayFriceFrom : '',
      holiday_price_to: this.state.HolidayFriceTo ? this.state.HolidayFriceTo : ''
    };
    this.props.search(data);
    return;
  }

  handleFocus(e) {
    e.target.select();
  }

  render() {
    return (
      <div className='search-container'>
        <div className='title-collapse'>
          <h3 className='heading-3 bold'>検索条件</h3>
          <button className={`btn-collapse ${this.state.isOpen ? 'collaped' : ''}`} onClick={this.Collapse.bind(this)} />
        </div>
        <Collapse isOpened={this.state.isOpen}>
          <div className='wrap-collapse-content'>
            <form className='search-form'>
              <div className='col-xs-12'>
                <Input className='col-xs-12 col-sm-6 col-md-6 mb15' label='撮影費用コード' type='text' maxLength='40' name='code' value={this.state.code} onChange={this.onChange.bind(this, 'code')}/>
                <Input className='col-xs-12 col-sm-6 col-md-6 mb15' label='表示名' type='text' maxLength='40' name='name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
              </div>
              <div className = "col-xs-12">
                <div className="col-xs-12 col-sm-6 col-md-6 mb15">
                  <InputGroupCurrency labelGroup="平日価格" labelFrom="¥" labelTo="¥" name="WeekDayPrice" type="number" valueFrom={this.state.WeekDayPriceFrom} valueTo={this.state.WeekDayPriceTo} onChangeFrom={this.onChange.bind(this, 'WeekDayPriceFrom')} onChangeTo={this.onChange.bind(this, 'WeekDayPriceTo')}  onBlurFrom={this.onBlur.bind(this, 'WeekDayPriceFrom')} onBlurTo={this.onBlur.bind(this, 'WeekDayPriceTo')}  disabled={false} />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-6 mb15">
                  <InputGroupCurrency labelGroup="休日価格" labelFrom="¥" labelTo="¥" name="HolidayFrice" type="number" valueFrom={this.state.HolidayFriceFrom} valueTo={this.state.HolidayFriceTo} onChangeFrom={this.onChange.bind(this, 'HolidayFriceFrom')} onChangeTo={this.onChange.bind(this, 'HolidayFriceTo')} onBlurFrom={this.onBlur.bind(this, 'HolidayFriceTo')} onBlurTo={this.onBlur.bind(this, 'HolidayFriceTo')} disabled={false} />
                </div>
              </div>
              <div className='wrap-button text-center mt10 mb15 col-xs-12 no-gutter'>
                <button className={`btn-submit-form${this.state.search == true ? ' has-loading' : ''}`} disabled={this.props.loading ? true : false} onClick={this.search.bind(this)}>検索する</button>
              </div>
            </form>
          </div>
        </Collapse>
      </div>
    );
  }
}

Search.defaultProps = {
  dataSearch: {},
  goBack: false
};

function bindStateToProps(state) {
  return {
    dataSearch: state.listStudios.dataSearch,
    goBack: state.listStudios.goBack
  };
}

export default connect(bindStateToProps)(Search);
