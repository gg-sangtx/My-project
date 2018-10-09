import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import {ShowIf} from 'components/utils';
import {DropDown} from 'components/inputform';

const tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

export default class Datatable extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      sort: this.props.sort || ''
    };
  }

  handlePageClick(page) {
    let element = document.getElementsByClassName('content-wrapper');
    element[0].scrollTop = 0;
    this.props.handlePageClick(page);
  }

  downloadCSV() {
    this.props.downloadCSV();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.sort != this.props.sort) {
      this.state.sort = nextProps.sort;
      this.setState({...this.state})
    }
  }

  onChange(e) {
    this.state.sort = e.target.value;
    this.setState({...this.state});
    this.props.onChange(e)
  }

  replaceTag(tag) {
    return tagsToReplace[tag] || tag;
  }

  safe_tags_replace(str) {
    return String(str).replace(/[&<>]/g, this.replaceTag);
  }

  render() {
    let pageNumber = this.props.pageData ? this.props.pageData.number : 0;
    let pageSize = this.props.pageData ? this.props.pageData.size : 0;
    let dataListItem = this.props.dataList.map((item, i) => {
      return (
      React.cloneElement(this.props.children, {
        key: i,
        count: (pageNumber * pageSize) + i + 1,
        item,
        parent: this.props.parent
      }))
    });

    let ItemLoading = (
    <div className="loading-content">
      <span className="shape1"></span>
      <span className="shape2"></span>
      <span className="shape3"></span>
      <span className="shape4"></span>
      <span className="shape5"></span>
      <span className="shape6"></span>
      <span className="shape7"></span>
      <span className="shape8"></span>
      <span className="shape9"></span>
      <span className="shape10"></span>
      <span className="shape11"></span>
      <span className="shape12"></span>
    </div>
    )
    return (
      <div className='table-container' style={{position: 'relative'}}>
        <ShowIf condition = {this.props.loading != true && this.props.showTitle == true}>
          <h3 className={`heading-3 bold ${this.props.download == true ? 'heading-inline' : ''}`}>{this.props.title}<ShowIf condition={this.props.smallTitle}><span className='ml15 pl30'>{this.props.smallTitle}</span></ShowIf></h3>
        </ShowIf>
        <ShowIf condition = {this.props.download == true && this.props.loading != true}>
          <span className='btn-confirm ml15' onClick={this.downloadCSV.bind(this)}>CSVダウンロード</span>
        </ShowIf>
        <ShowIf condition = {this.props.hasSort == true && this.props.loading != true}>
          <div className='wrap-sort'>
            <ShowIf condition={this.props.showLabelSort == true}>
              <label className='label-sort'>並べ替え</label>
            </ShowIf>
            <DropDown className='drop-down-sort' label='' onChange={this.onChange.bind(this)} options={this.props.dataSort} keyName={this.props.keyName} valueName={this.props.valueName} value={this.state.sort}/>
          </div>
        </ShowIf>
        <div className='wrap-table'>
          <table className='data-table'>
            <thead>
              <tr>
                { this.props.header.map((item, i) => {
                    return (
                      <th key={ i } dangerouslySetInnerHTML={{__html: this.safe_tags_replace(item.name).replace(/\n/gi, '<br/>')}} className={ "table-header-col " + (item.className ? item.className : '') } colSpan={ item.colSpan } style={ { width: item.width, minWidth: item.minWidth, maxWidth: item.maxWidth } }>
                      </th>
                      );
                  })
                }
              </tr>
            </thead>
            <ShowIf condition={this.props.loading == true}>
              <tbody className="table-body">
                  <tr className="table-loading">
                    <td colSpan={ this.props.numberColumnHeader }>
                      { ItemLoading }
                      { ItemLoading }
                      { ItemLoading }
                      { ItemLoading }
                      { ItemLoading }
                      { ItemLoading }
                      <div className='clearfix'></div>
                    </td>
                  </tr>
              </tbody>
            </ShowIf>
            <ShowIf condition={this.props.loading != true && this.props.dataList.length == 0}>
              <tbody className="table-body">
                <tr className="table-loading">
                  <td colSpan={ this.props.numberColumnHeader } className='text-center'>データなし</td>
                </tr>
              </tbody>
            </ShowIf>
            <ShowIf condition={this.props.loading != true}>
              <tbody className="table-body">
                { dataListItem }
              </tbody>
            </ShowIf>
        </table>
        </div>
        <ShowIf condition={this.props.pageData.totalElements > 50 && !this.props.hidePagination}>
          <ReactPaginate
            pageCount={ this.props.pageData ? this.props.pageData.totalElements/this.props.pageData.size : 1 }
            marginPagesDisplayed={ 1 } pageRangeDisplayed={ 2 } previousLabel={ "<" } nextLabel={ ">" }
            breakLabel={ <a href="javascript:void(0)">...</a> } breakClassName={ "item" }
            onPageChange={ this.handlePageClick.bind(this) }
            containerClassName={ "pagination-list" } pageClassName={ 'item' }
            subContainerClassName={ "pages pagination" } previousClassName={ 'item' }
            nextClassName={ 'item' } activeClassName={ "active" }
            forcePage={ this.props.pageData ? this.props.pageData.number : 0 } />
        </ShowIf>
      </div>
    );
  }
}

Datatable.defaultProps = {
  dataList: [],
  header: [],
  download: false,
  hasSort: false,
  showTitle: true,
  showLabelSort: true,
  hidePagination: false,
  handlePageClick: function () {console.log('Need append method handlePageClick')}
}
