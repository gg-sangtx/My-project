import React from 'react';
import {RenderRoutes} from 'base/routes';
import { withRouter } from 'react-router';
import {connect} from 'react-redux';
import cookie from 'react-cookie';
import {getUserInfo} from 'base/actions';
import locations from 'constants/locations';
import {Toastr} from 'components/modules/toastr';
import {System} from 'api';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.initData(this.props.loadData);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps.loadData);
  }

  initData(type) {
    if (cookie.load('accessToken') && type == false) {
      let User = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
      if (User && User.type_user == 'staff') {
        this.props.dispatch({type: 'UPDATED_SYSTEM_DATA'})
        Promise.all([
          this.listStudio(),
        ]).then(responses => {
          this.props.dispatch({
            type: 'UPDATE_SYSTEM_DATA',
            systemData: responses
          })
        });
      } else if (User) {
        this.props.dispatch({type: 'UPDATED_SYSTEM_DATA'})
        Promise.all([
          this.prefectures(),
          this.authorities(),
          this.fixedHolidays(),
          this.bookingHours(),
          this.typeStaff(),
          this.typeWage(),
          this.studioCanWork(),
          this.listStudio(),
          this.listSize(),
          this.listCategory(),
        ]).then(responses => {
          this.props.dispatch({
            type: 'UPDATE_SYSTEM_DATA',
            systemData: responses
          })
        });
      }

    }
  }

  prefectures() {
    return System.actions.prefectures.request().then(res => {
      return Promise.resolve({
        key: 'prefectures',
        data: res.data.data.prefectures
      });
    }).catch(err => {
      return Promise.resolve({
        key: 'prefectures',
        data: []
      });
      if(err.response) {
        Toastr(err.response.data.errors[0], 'error')
      }
    });
  }

  authorities() {
    return System.actions.authorities.request().then(res => {
      return Promise.resolve({
        key: 'authorities',
        data: res.data.data.authorities
      });
    }).catch(err => {
      return Promise.resolve({
        key: 'authorities',
        data: []
      });
      if(err.response) {
        Toastr(err.response.data.errors[0], 'error')
      }
    });
  }

  fixedHolidays() {
    return System.actions.fixedHolidays.request().then(res => {
      return Promise.resolve({
        key: 'fixedHolidays',
        data: res.data.data.fixedHolidays
      });
    }).catch(err => {
      return Promise.resolve({
        key: 'fixedHolidays',
        data: []
      });
      if(err.response) {
        Toastr(err.response.data.errors[0], 'error')
      }
    });
  }

  bookingHours() {
    return System.actions.bookingHours.request().then(res => {
      return Promise.resolve({
        key: 'bookingHours',
        data: res.data.data.bookingHours
      });
    }).catch(err => {
      return Promise.resolve({
        key: 'bookingHours',
        data: []
      });
      if(err.response) {
        Toastr(err.response.data.errors[0], 'error')
      }
    });
  }

  typeStaff() {
    return System.actions.typeStaff.request().then(res => {
      return Promise.resolve({
        key: 'typeStaff',
        data: res.data.data.typesStaff
      });
    }).catch(err => {
      return Promise.resolve({
        key: 'typeStaff',
        data: []
      });
      if(err.response) {
        Toastr(err.response.data.errors[0], 'error')
      }
    });
  }

  typeWage() {
    return System.actions.typeWage.request().then(res => {
      return Promise.resolve({
        key: 'typeWage',
        data: res.data.data.typesWage
      });
    }).catch(err => {
      return Promise.resolve({
        key: 'typeWage',
        data: []
      });
      if(err.response) {
        Toastr(err.response.data.errors[0], 'error')
      }
    });
  }

  studioCanWork() {
    return System.actions.studioCanWork.request().then(res => {
      return Promise.resolve({
        key: 'studioCanWork',
        data: res.data.data.studios.data
      });
    }).catch(err => {
      return Promise.resolve({
        key: 'studioCanWork',
        data: []
      });
      if(err.response) {
        Toastr(err.response.data.errors[0], 'error')
      }
    });
  }

  listStudio() {
    return System.actions.listStudio.request().then(res => {
      return Promise.resolve({
        key: 'listStudio',
        data: res.data.data.studios.data
      });
    }).catch(err => {
      return Promise.resolve({
        key: 'listStudio',
        data: []
      });
      if(err.response) {
        Toastr(err.response.data.errors[0], 'error')
      }
    });
  }

  listSize() {
    return System.actions.listSize.request().then(res => {
      return Promise.resolve({
        key: 'listSize',
        data: res.data.data.sizes
      });
    }).catch(err => {
      return Promise.resolve({
        key: 'listSize',
        data: []
      });
      if(err.response) {
        Toastr(err.response.data.errors[0], 'error')
      }
    });
  }

  listCategory() {
    return System.actions.listCategory.request().then(res => {
      return Promise.resolve({
        key: 'listCategory',
        data: res.data.data.categories_faq
      });
    }).catch(err => {
      return Promise.resolve({
        key: 'listCategory',
        data: []
      });
      if(err.response) {
        Toastr(err.response.data.errors[0], 'error')
      }
    });
  }

  render() {
    return (
      <div>
        <RenderRoutes routes={this.props.route.routes}/>
      </div>
    );
  }
}

App.defaultProps = {
  defaultPage: "/",
  loadData: false
}

App.contextTypes = {
  router: React.PropTypes.object
};

function bindStateToProps(state) {
  return {
    loadData: state.systemData.loadData
  }
}

export default connect(bindStateToProps)(withRouter(App));