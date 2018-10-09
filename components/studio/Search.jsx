import React, { Component } from 'react';
import {Collapse} from 'react-collapse';
import {Input, DropDown, GroupCheckBox} from 'components/inputform';
import {connect} from 'react-redux';

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: true,
      search: false,
      name: '',
      code: '',
      prefecture: '',
    }
  }

  onChange(name, e) {
    this.setState({
      [name]: e.target.value
    })
  }

  Collapse() {
    this.state.isOpen = !this.state.isOpen;
    this.setState({
      ...this.state
    })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.loading == false) {
      this.state.search = false;
    }
    if(nextProps.goBack == true) {
      this.state.name = nextProps.dataSearch.name;
      this.state.code = nextProps.dataSearch.code;
      this.state.prefecture = nextProps.dataSearch.prefecture;
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
      prefecture: this.state.prefecture ? this.state.prefecture : ''
    }
    this.props.search(data);
    return;
  }

  render() {
    return (
      <div className='search-container'>
        <div className='title-collapse'>
          <h3 className='heading-3 bold'>検索条件</h3>
          <button className={`btn-collapse ${this.state.isOpen ? 'collaped' : ''}`} onClick={this.Collapse.bind(this)}></button>
        </div>
        <Collapse isOpened={this.state.isOpen}>
          <div className='wrap-collapse-content'>
            <form className='search-form'>
              <div className='col-xs-12'>
                <Input className=' col-xs-12 col-sm-6 col-md-4 mb15' label='スタジオコード' type='text' maxLength='40' name='code' value={this.state.code} onChange={this.onChange.bind(this, 'code')}/>
                <Input className=' col-xs-12 col-sm-6 col-md-4 mb15' label='スタジオ名' type='text' maxLength='40' name='Name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
                <DropDown className=' col-xs-12 col-sm-6 col-md-4 mb15' label='都道府県' showPlaceholder={true} placeholder='都道府県' options={this.props.dataPrefectures} keyName='value' valueName='value' value={this.state.prefecture} onChange={this.onChange.bind(this, 'prefecture')}/>
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
  dataPrefectures: [],
  dataSearch: {},
  goBack: false,
}

function bindStateToProps(state) {
  return {
    dataPrefectures: state.systemData.prefectures,
    dataSearch: state.listStudios.dataSearch,
    goBack: state.listStudios.goBack,
  }
}

export default connect(bindStateToProps)(Search)
