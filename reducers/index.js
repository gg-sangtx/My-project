import {createStore, combineReducers, applyMiddleware} from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from "redux-thunk";
import * as API from 'api';
import {listUsers} from 'base/reducers/users';
import {listStudios} from 'base/reducers/studios';
import {listStaff} from 'base/reducers/staff';
import {listStaffSchedule} from 'base/reducers/staff-schedule';
import {systemData} from 'base/reducers/systemData';
import {listPlans} from 'base/reducers/plans';
import {listPlanOptions} from 'base/reducers/planOptions';
import {listCostumes} from 'base/reducers/costumes';
import {booking} from 'base/reducers/booking';
import {listFAQ} from 'base/reducers/faq';
import {listCustomer} from 'base/reducers/listCustomer';
import {listCoupons} from 'base/reducers/coupons';
import {listNews} from 'base/reducers/news';
import {staffPays} from 'base/reducers/staffPays';
import {listCostumeLocks} from 'base/reducers/costumeLocks';
import {listReviews} from 'base/reducers/reviews';
import {staffBooking} from 'base/reducers/staff-booking';
import {order} from 'base/reducers/order';
import {listProduct} from 'base/reducers/listProduct';
import {staffPayForStaff} from 'base/reducers/staff-pay-for-staff';
import {reducer as toastrReducer} from 'react-redux-toastr';

let rootReducer = combineReducers({
  listUsers: listUsers,
  listStudios: listStudios,
  systemData: systemData,
  listStaff: listStaff,
  listStaffSchedule: listStaffSchedule,
  listPlans: listPlans,
  listPlanOptions: listPlanOptions,
  listCostumes: listCostumes,
  listFAQ: listFAQ,
  listCustomer: listCustomer,
  listCoupons: listCoupons,
  listNews: listNews,
  listCostumeLocks: listCostumeLocks,
  staffBooking: staffBooking,
  staffPayForStaff: staffPayForStaff,
  booking: booking,
  listProduct: listProduct,
  listReviews: listReviews,
  staffPays: staffPays,
  order: order,
  routing: routerReducer,
  toastr: toastrReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export {store, rootReducer};
