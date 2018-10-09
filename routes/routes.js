import App from 'components/app';
import {PageNotFound} from 'components/page-not-found';

import {StaffForgotPasswordPage, StaffResetPassword, StaffCreatePassword, StaffLogin, Login, ListUser, CreateUser, EditUser, ListStudio, CreateStudio, ResetPassword, CreatePassword, EditStudio, ForgotPasswordPage, ListStaff, CreateStaff, EditStaff, ListPlans, CreatePlans, EditPlans, ListPlanOptions, CreatePlanOptions, EditPlanOptions, ListCostume, CreateCostume, EditCostume, ListStaffSchedule, EditStaffSchedule, ListCoupon, CreateCoupon, EditCoupon, ListBooking, EditBooking, ListFAQ, CreateFAQ, EditFAQ, ListCostumeLocks, CreateCostumeLocks, EditCostumeLocks, ListNews, CreateNews, EditNews, ListCustomer, EditCustomer, ListBookingPhoto, DeleteBookingPhoto, DownloadBookingPhoto, ListStaffPay, EditStaffPay, ListReview, CreateReview, EditReview, ListProduct, CreateProduct, EditProduct, ListOrder, CreateOrder, EditOrder, ListEarning, Dashboard} from "components/pages";
import {ListStaffBooking, DetailStaffBooking, ListStaffBookingPhoto, DeleteStaffBookingPhoto, DownloadStaffBookingPhoto, ListStaffPayForStaff, DetailStaffPayForStaff, StaffDashboard} from "components/pages";


const routes = [
  {
    component: App,
    routes: [
      {
        component: Dashboard,
        exact: true,
        path: '/',
      },{
        component: Login,
        exact: true,
        path: '/login',
      },{
        component: StaffLogin,
        exact: true,
        path: '/staff/login',
      },{
        component: ListUser,
        exact: true,
        path: '/users',
      },{
        component: CreateUser,
        exact: true,
        path: '/users/create',
      },{
        component: EditUser,
        exact: true,
        path: '/users/:id',
      },{
        component: ListStudio,
        exact: true,
        path: '/studios',
      },{
        component: CreateStudio,
        exact: true,
        path: '/studios/create',
      },{
        component: EditStudio,
        exact: true,
        path: '/studios/:id',
      },{
        component: ListStaff,
        exact: true,
        path: '/staffs',
      },{
        component: CreateStaff,
        exact: true,
        path: '/staffs/create',
      },{
        component: EditStaff,
        exact: true,
        path: '/staffs/:id',
      },{
        component: ListStaffSchedule,
        exact: true,
        path: '/staff-schedules',
      },{
        component: EditStaffSchedule,
        exact: true,
        path: '/staff-schedules/:studioId/:staffId/:staffType/:date',
      },{
        component: ListCoupon,
        exact: true,
        path: '/coupons',
      },{
        component: CreateCoupon,
        exact: true,
        path: '/coupons/create',
      },{
        component: EditCoupon,
        exact: true,
        path: '/coupons/:id'
      },{
        component: ForgotPasswordPage,
        exact: true,
        path: '/forgot-password',
      },{
        component: ResetPassword,
        exact: true,
        path: '/password',
      },{
        component: CreatePassword,
        exact: true,
        path: '/password/create',
      },{
        component: ListPlans,
        exact: true,
        path: '/plans',
      },{
        component: CreatePlans,
        exact: true,
        path: '/plans/create',
      },{
        component: EditPlans,
        exact: true,
        path: '/plans/:id',
      },{
        component: ListPlanOptions,
        exact: true,
        path: '/planOptions',
      },{
        component: CreatePlanOptions,
        exact: true,
        path: '/planOptions/create',
      },{
        component: EditPlanOptions,
        exact: true,
        path: '/planOptions/:id',
      },{
        component: ListCostume,
        exact: true,
        path: '/costumes',
      },{
        component: CreateCostume,
        exact: true,
        path: '/costumes/create',
      },{
        component: EditCostume,
        exact: true,
        path: '/costumes/:id',
      },{
        component: ListNews,
        exact: true,
        path: '/news',
      },{
        component: CreateNews,
        exact: true,
        path: '/news/create',
      },{
        component: EditNews,
        exact: true,
        path: '/news/:id',
      },{
        component: StaffForgotPasswordPage,
        exact: true,
        path: '/staff/forgot-password',
      },{
        component: StaffResetPassword,
        exact: true,
        path: '/staff/password',
      },{
        component: StaffCreatePassword,
        exact: true,
        path: '/staff/password/create'
      },{
        component: ListCostumeLocks,
        exact: true,
        path: '/costumeLocks',
      },{
        component: CreateCostumeLocks,
        exact: true,
        path: '/costumeLocks/create',
      },{
        component: EditCostumeLocks,
        exact: true,
        path: '/costumeLocks/:id',
      },{
        component: ListBooking,
        exact: true,
        path: '/bookings',
      },{
        component: EditBooking,
        exact: true,
        path: '/bookings/:id',
      },{
        component: ListFAQ,
        exact: true,
        path: '/faqs',
      },{
        component: CreateFAQ,
        exact: true,
        path: '/faqs/create',
      },{
        component: EditFAQ,
        exact: true,
        path: '/faqs/:id',
      },{
        component: ListReview,
        exact: true,
        path: '/reviews',
      },{
        component: CreateReview,
        exact: true,
        path: '/reviews/create',
      },{
        component: EditReview,
        exact: true,
        path: '/reviews/:id',
      },{
        component: ListCustomer,
        exact: true,
        path: '/customers',
      },{
        component: EditCustomer,
        exact: true,
        path: '/customers/:id',
      },{
        component: ListBookingPhoto,
        exact: true,
        path: '/bookings/:id/photos',
      },{
        component: DeleteBookingPhoto,
        exact: true,
        path: '/bookings/:id/photos/delete',
      },{
        component: DownloadBookingPhoto,
        exact: true,
        path: '/bookings/:id/photos/download',
      },{
        component: ListStaffPay,
        exact: true,
        path: '/staffPays',
      },{
        component: EditStaffPay,
        exact: true,
        path: '/staffPays/:id',
      },{
        component: ListOrder,
        exact: true,
        path: '/orders',
      },{
        component: CreateOrder,
        exact: true,
        path: '/orders/create',
      },{
        component: EditOrder,
        exact: true,
        path: '/orders/:id',
      },{
        component: ListEarning,
        exact: true,
        path: '/earnings',
      },{
        component: ListProduct,
        exact: true,
        path: '/products',
      },{
        component: CreateProduct,
        exact: true,
        path: '/products/create',
      },{
        component: EditProduct,
        exact: true,
        path: '/products/:id',
      },
      //Staff
      {
        component: StaffDashboard,
        exact: true,
        path: '/staff/home'
      },{
        component: ListStaffBooking,
        exact: true,
        path: '/staff/bookings'
      },{
        component: DetailStaffBooking,
        exact: true,
        path: '/staff/bookings/:id',
      },{
        component: ListStaffBookingPhoto,
        exact: true,
        path: '/staff/bookings/:id/photos',
      },{
        component: DeleteStaffBookingPhoto,
        exact: true,
        path: '/staff/bookings/:id/photos/delete',
      },{
        component: DownloadStaffBookingPhoto,
        exact: true,
        path: '/staff/bookings/:id/photos/download',
      },{
        component: ListStaffPayForStaff,
        exact: true,
        path: '/staff/staffPays',
      },{
        component: DetailStaffPayForStaff,
        exact: true,
        path: '/staff/staffPays/:id',
      },
      //end Staff
      {
        component: PageNotFound,
        exact: true,
        path: '/page-not-found',
      },{
        component: PageNotFound,
        exact: true,
        path: '*',
      }
    ]
  }
];

export default routes;
