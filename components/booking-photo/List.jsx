import React from 'react';
import {Link} from 'react-router-dom';
import {ShowIf} from 'components/utils';
import {connect} from 'react-redux';
import {ReactUploadMultipleImage} from 'components/inputform';
import {BookingPhoto, System} from 'api';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";
import { withRouter } from 'react-router';

class List extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      countFileUpload: 0,
      numberFileUpload: 0,
      dataImage: [],
      dataImageChange: [],
      dataImageDelete: [],
      params: [],
      booking_code: '',
      customer_id: '',
      customer_last_name: '',
      customer_first_name: '',
      customer_email: '',
      customer_tel1: '',
      customer_tel2: '',
      customer_tel3: '',
      type: ''
    }
  }

  componentDidMount() {
    if(this.props.isStaff == true) {
      this.getStaffBookingDetail()
    } else {
      this.getDetail();
    }
    if(this.props.params.id) {
      this.props.dispatch({type: 'BOOKING_PHOTO', idBooking: this.props.params.id});
    }
  }

  getDetail() {
    BookingPhoto.actions.get.request({booking_id: this.props.params.id}).then(res => {
      if(res.data) {
        let Data = res.data.data;
        let DataDetail = res.data.data.booking;
        this.state.dataImage = Data.booking_photos || [];
        this.state.booking_code = DataDetail.booking_code || '';
        this.state.customer_id = DataDetail.customer_id || '';
        this.state.customer_last_name = DataDetail.customer_last_name || '';
        this.state.customer_first_name = DataDetail.customer_first_name || '';
        this.state.customer_email = DataDetail.customer_email || '';
        this.state.customer_tel1 = DataDetail.customer_tel1 || '';
        this.state.customer_tel2 = DataDetail.customer_tel2 || '';
        this.state.customer_tel3 = DataDetail.customer_tel3 || '';
        this.setState({...this.state})
      }
    }).catch( err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
    })
  }

  getStaffBookingDetail() {
    BookingPhoto.actions.staffList.request({booking_id: this.props.params.id}).then(res => {
      if(res.data) {
        let Data = res.data.data;
        let DataDetail = res.data.data.booking;
        this.state.dataImage = Data.booking_photos || [];
        this.state.booking_code = DataDetail.booking_code || '';
        this.state.customer_id = DataDetail.customer_id || '';
        this.state.customer_last_name = DataDetail.customer_last_name || '';
        this.state.customer_first_name = DataDetail.customer_first_name || '';
        this.setState({...this.state})
      }
    }).catch( err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
    })
  }

  onChangeData(data) {
    this.state.dataImageChange = data;
  }

  onDeleteItem(id) {
    this.state.dataImageDelete.push(id)
  }

  updateData(type) {
    this.state.type = type;
    this.state.loading = true;
    let data = [...this.state.dataImageChange];
    this.setState({...this.state});
    this.state.dataImageChange.map((item, index) => {
      let newItem = {
        id: item.id,
        URL: item.URL,
        origin_file_name: item.origin_file_name,
        public: item.public,
        recommend: item.recommend
      }
      this.state.params.push(newItem);
    })
    this.setState({...this.state});
    this.checkPrams(type);
  }

  checkPrams(type) {
    if(this.state.countFileUpload == this.state.numberFileUpload) {
      let newParams = {
        booking_id: this.props.params.id,
        type: this.state.type,
        edit_photos: [],
        delete_photos: []
      }
      if(this.state.dataImageDelete.length > 0) {
        newParams.delete_photos = [...newParams.delete_photos, ...this.state.dataImageDelete]
      }
      if(this.state.params.length > 0) {
        this.state.params.map(item => {
          if(item.id && !item.URL) {
            newParams.delete_photos.push(item.id);
          } else {
            newParams.edit_photos.push(item)
          }
        })
      }
      if(this.state.params.length > 0) {
        if(this.props.isStaff == true) {
          BookingPhoto.actions.staffEdit.request('', newParams).then(res => {
            Toastr(msg.updateBookingPhoto, 'success')
            this.state.loading = false;
            this.setState({...this.state});
            this.goBack();
          }).catch(err => {
            if(err.response && err.response.data.errors.length > 0) {
              err.response.data.errors.map((errors, i) => {
                Toastr(errors, 'error');
              })
            } else {
              Toastr(msg.systemFail, 'error');
            }
            this.state.loading = false;
            this.setState({...this.state});
          })
        } else {
          BookingPhoto.actions.edit.request('', newParams).then(res => {
            Toastr(msg.updateBookingPhoto, 'success')
            this.state.loading = false;
            this.setState({...this.state});
            this.goBack();
          }).catch(err => {
            if(err.response && err.response.data.errors.length > 0) {
              err.response.data.errors.map((errors, i) => {
                Toastr(errors, 'error');
              })
            } else {
              Toastr(msg.systemFail, 'error');
            }
            this.state.loading = false;
            this.setState({...this.state});
          })
        }
      } else {
        newParams.edit_photos = []
        this.state.dataImage.map(item => {
          let newItem = {
            id: item.id,
            URL: item.URL,
            origin_file_name: item.origin_file_name
          }
          newParams.edit_photos.push(newItem)
        })
        if(this.props.isStaff == true) {
          BookingPhoto.actions.staffEdit.request('', newParams).then(res => {
            Toastr(msg.updateBookingPhoto, 'success')
            this.state.loading = false;
            this.setState({...this.state});
            this.goBack();
          }).catch(err => {
            if(err.response && err.response.data.errors.length > 0) {
              err.response.data.errors.map((errors, i) => {
                Toastr(errors, 'error');
              })
            } else {
              Toastr(msg.systemFail, 'error');
            }
            this.state.loading = false;
            this.setState({...this.state});
          })
        } else {
          BookingPhoto.actions.edit.request('', newParams).then(res => {
            Toastr(msg.updateBookingPhoto, 'success')
            this.state.loading = false;
            this.setState({...this.state});
            this.goBack();
          }).catch(err => {
            if(err.response && err.response.data.errors.length > 0) {
              err.response.data.errors.map((errors, i) => {
                Toastr(errors, 'error');
              })
            } else {
              Toastr(msg.systemFail, 'error');
            }
            this.state.loading = false;
            this.setState({...this.state});
          })
        }
      }
    }
  }

  goBack() {
    if (this.props.isStaff == true) {
      this.props.dispatch({type: 'STAFF_BOOKING_GO_BACK'});
      this.props.history.push('/staff/bookings');
    } else {
      this.props.dispatch({type: 'BOOKING_GO_BACK'});
      this.props.history.push('/bookings');
    }
  }

  disableAction() {
    this.state.loading = true;
    this.setState({...this.state});
  }

  enableAction() {
    this.state.loading = false;
    this.setState({...this.state});
  }

  render() {
    return (
      <div>
        <div className='title-block mb20'>
          <h2 className='heading-2'>写真情報 <small>一覧</small></h2>
          <div>
            <Link className='btn-addnew btn-red mr20' to={`${this.props.isStaff == true ? '/staff/bookings/' : /bookings/}${this.props.params.id}/photos/delete`}>選択削除</Link>
            <Link className='btn-addnew' to={`${this.props.isStaff == true ? '/staff/bookings/' : /bookings/}${this.props.params.id}/photos/download`}>選択ダウンロード</Link>
          </div>
        </div>
        <div className="table-container mb20" style={{position: 'relative'}}>
          <table className="data-table">
            <thead>
              <ShowIf condition={this.props.isStaff != true}>
                <tr>
                  <th className="table-header-col " style={{width: 170}}>予約情報コード</th>
                  <th className="table-header-col " style={{width: 170}}>会員ID</th>
                  <th className="table-header-col " style={{minWidth: 200}}>会員名</th>
                  <th className="table-header-col " style={{minWidth: 200}}>会員メールアドレス</th>
                  <th className="table-header-col " style={{minWidth: 200}}>会員電話番号</th>
                </tr>
              </ShowIf>
              <ShowIf condition={this.props.isStaff == true}>
                <tr>
                  <th className="table-header-col ">予約情報コード</th>
                  <th className="table-header-col ">会員ID</th>
                  <th className="table-header-col ">会員名</th>
                </tr>
              </ShowIf>
            </thead>
            <tbody className="table-body">
              <ShowIf condition={this.props.isStaff != true}>
                <tr>
                  <td>{this.state.booking_code}</td>
                  <td>{this.state.customer_id}</td>
                  <td>{this.state.customer_last_name} {this.state.customer_first_name}</td>
                  <td>{this.state.customer_email}</td>
                  <td>
                    {this.state.customer_tel1 ? this.state.customer_tel1 : ''}
                    {this.state.customer_tel2 ? '-' + this.state.customer_tel2 : ''}
                    {this.state.customer_tel3 ? '-' + this.state.customer_tel3 : ''}
                  </td>
                </tr>
              </ShowIf>
              <ShowIf condition={this.props.isStaff == true}>
                <tr>
                  <td>{this.state.booking_code}</td>
                  <td>{this.state.customer_id}</td>
                  <td>{this.state.customer_last_name} {this.state.customer_first_name}</td>
                </tr>
              </ShowIf>
            </tbody>
          </table>
        </div>
        <div className={`pt20 list-booking-photo ${this.state.loading ? 'form-disable' : ''}`} disabled={this.state.loading}>
          <ReactUploadMultipleImage editBookingPhoto={true} disableAction={this.disableAction.bind(this)} enableAction={this.enableAction.bind(this)} data={this.state.dataImage} onChange={this.onChangeData.bind(this)} onDeleteItem={this.onDeleteItem.bind(this)}/>
        </div>
        <div className='pt20'>
          <button className={`btn-confirm mr20 btn-red ${this.state.type == 'DRAFT' ? 'has-loading' : ''}`} disabled={this.state.loading} onClick={this.updateData.bind(this, 'DRAFT')}>未公開保存</button>
          <button className={`btn-confirm mr20 ${this.state.type == 'PUBLIC' ? 'has-loading' : ''}`} disabled={this.state.loading} onClick={this.updateData.bind(this, 'PUBLIC')}>公開保存</button>
          <button className='btn-close-confirm' disabled={this.state.loading} onClick={this.goBack.bind(this)}>キャンセル</button>
        </div>
      </div>
    );
  }
}

List.defaultProps = {
  isStaff: false
}

export default connect()(withRouter(List));