import React, {Component} from 'react';
import ResourceItem from './ResourceItem.jsx';
import {connect} from 'react-redux';
import {Res} from 'api';
import Pagination from "react-js-pagination";
import {Link, NavLink} from 'react-router-dom';
import queryString from 'query-string';
import {withRouter} from 'react-router';
import {Checkbox} from '@blueprintjs/core';
import {CheckAll} from 'components/utils';
import {toastr} from 'react-redux-toastr';
import {bindActionCreators} from 'redux'
import {actions as toastrActions} from 'react-redux-toastr';

class ResourceContainer extends Component {
  constructor(props, context) {
    super(props, context);
    const parsed = queryString.parse(location.search);
    if (parsed.dis) {
      parsed.dis = parsed.dis.slice(1, -1);
    }

    this.storeCheckAll = new CheckAll();

    this.state = {
      resources: [],
      activePage: parsed.page || 1,
      pageSize: parsed.size || 10,
      totalObjects: '',
      totalPages: '',
      searchString: parsed.dis || '',
      isCheckAll: false,
      storeCheckAll: this.storeCheckAll,
      type: 'resource',
      isLoading: false
    }
  }

  handleCheckAllChange(e) {
    let isCheckAll = !this.state.isCheckAll;

    this.setState({
      isCheckAll: isCheckAll
    });

    this.state.storeCheckAll.dispatch({
      type: 'TOGGLE_CHECKALL',
      isCheckAll
    });

    this.setState({});
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search != nextProps.location.search) {
      this.state.storeCheckAll.dispatch({
        type: 'RESET'
      });

      this.setState({
        isCheckAll: false
      });

      this.state.storeCheckAll.addCheckAllControl((isCheckAll) => {
        this.setState({
          isCheckAll: isCheckAll
        })
      });
    }
  }

  getRes(pageNumber) {
    Res.actions.all.request({
      title: `%${this.state.searchString}%`,
      page: {number: pageNumber, size: this.state.pageSize},
      type: this.state.type
    }).then(response => {
      if (pageNumber != 1 && response.data.data.length == 0) {
        let nextPage = pageNumber -1;
        let url = `?title=%${this.state.searchString}%&page=${nextPage}&size=${this.state.pageSize}`;

        this.getRes(nextPage);
        this.setState({
          activePage: nextPage
        });
        this.props.history.push({
          pathname: '/resources',
          search: url,
          state: null
        });
      } else {
        this.setState({
          resources: response.data.data,
          totalObjects: response.data.meta.totalObjects,
          totalPages: response.data.meta.totalPages,
          isLoading: false
        })
      }
    });
  }

  componentDidMount() {
    this.getRes(this.state.activePage);

    this.state.storeCheckAll.addCheckAllControl((isCheckAll) => {
      this.setState({
        isCheckAll: isCheckAll
      })
    });
  }

  handlePageChange(pageNumber) {
    if (pageNumber !== this.state.activePage && !this.state.isLoading) {
      this.setState({
        isLoading: true
      })
      this.getRes(pageNumber);
      this.setState({
        activePage: pageNumber,
      });
      let url = `?title=%${this.state.searchString}%&page=${pageNumber}&size=${this.state.pageSize}`;
      this.props.history.push({
        pathname: '/resources',
        search: url,
        state: null
      });
    }
  }

  handleChange(e) {
    this.setState({
      searchString: e.target.value,
      activePage: 1
    });
  }

  handleKeyPress(e) {
    if (e.key == 'Enter') {
      this.handleSearch();
    }
  }

  handleSearch() {
      this.getRes(1);
      let url = `?title=%${this.state.searchString}%&page=1&size=${this.state.pageSize}`;
      this.props.history.push({
        pathname: '/resources',
        search: url,
        state: null
      });
  }

  handleDelete() {

    let arrayDeleteId = [];
    this.state.storeCheckAll.getCheckedItems().map(district => {
      arrayDeleteId.push(district.key);
    });

    if (arrayDeleteId.length === 0) {
      toastr.error('Error!', 'Please choose resource.');
    } else {
      toastr.confirm('Are you sure you want to Delete!', {
        onOk: () => {
          Res.actions.delete.request({}, {
            data: {
              id: arrayDeleteId
            }
          }).then(response => {
            toastr.success('Success!', 'Delete successfully.');

            // do remove item in the store
            arrayDeleteId.map(id => {
              this.state.storeCheckAll.dispatch({
                type: "REMOVE_ITEM",
                key: id
              });
            });

            // do reset checkall
            if (this.state.isCheckAll) {
              let isCheckAll = !this.state.isCheckAll;

              this.setState({
                isCheckAll: isCheckAll
              });
              this.state.storeCheckAll.dispatch({
                type: 'TOGGLE_CHECKALL',
                isCheckAll
              });
            }

            this.getRes(this.state.activePage)
          });
        }
      });
    }
  }

  render() {
    return (
      <div>
        <section className="content-header row">
          <h1 className="col-xs-6">Resource</h1>
          <div className="col-xs-6">
            <button className="btn btn-default pull-right" onClick={this.handleDelete.bind(this)}>Delete</button>
            <Link to="/resources/create" className="btn btn-cuedin pull-right">Create</Link>
            <div className="input-group">
              <input type="text" value={this.state.searchString} name="message" placeholder="Search..." className="form-control" onChange={this.handleChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)}/>
              <span className="input-group-btn">
                <button type="button" className="btn btn-warning btn-flat" onClick={this.handleSearch.bind(this)}>Search</button>
              </span>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="box box-cuedin">
            <table id="example1" className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th width="38" className="text-center">
                    <Checkbox className="delete-checkbox" checked={this.state.isCheckAll} onChange={this.handleCheckAllChange.bind(this)}/>
                  </th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.resources.length == 0 ? (
                    <tr>
                      <td colSpan="3">
                        <p className="not-found">No resource found</p>
                      </td>
                    </tr>
                  ) : (
                    this.state.resources.map((item, i) => {
                      return (<ResourceItem key={i} {...item.attributes}
                        checkboxStore={this.state.storeCheckAll}/>)
                    })
                  )
                }
              </tbody>
            </table>
          </div>
          {
            this.state.totalPages > 1 ? (
              <div className="row">
                <div className="col-xs-6">
                  <span className="pagination-info">
                    {
                      `Showing
                        ${(this.state.activePage - 1) * this.state.pageSize + 1}
                      to
                        ${(this.state.activePage * this.state.pageSize) > this.state.totalObjects ? this.state.totalObjects : (this.state.activePage * this.state.pageSize)}
                      of
                        ${this.state.totalObjects}
                      resources`
                    }
                  </span>
                </div>
                <div className="col-xs-6 text-right">
                  <Pagination
                  prevPageText={<i className="fa fa-angle-left"></i>}
                  nextPageText={<i className="fa fa-angle-right"></i>}
                  firstPageText={<i className="fa fa-angle-double-left"></i>}
                  lastPageText={<i className="fa fa-angle-double-right"></i>}
                  activePage={parseInt(this.state.activePage , 10 )}
                  itemsCountPerPage={this.state.pageSize}
                  totalItemsCount={this.state.totalObjects}
                  onChange={this.handlePageChange.bind(this)}
                  />
                </div>
              </div>
            ) :
            (
              null
            )
          }
        </section>
      </div>
    );
  }
}

export default withRouter(ResourceContainer);
