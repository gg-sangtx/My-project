import React from 'react';
import {Link} from 'react-router-dom';
import {ShowIf} from 'components/utils';
import {connect} from 'react-redux';
import {ReactUploadMultipleImage} from 'components/inputform';
import {BookingPhoto, System} from 'api';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";
import { withRouter } from 'react-router';
import Modal from 'react-modal';
import cookie from 'react-cookie';
import { API_URL } from 'constants/config';

class Edit extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      modalIsOpen: false,
      deleteLoading: false,
      getDetail: false,
      dataImage: [],
      dataImageSelect: [],
      booking_code: '',
      customer_id: '',
      customer_last_name: '',
      customer_first_name: '',
      customer_email: '',
      customer_tel1: '',
      customer_tel2: '',
      customer_tel3: '',
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

  componentWillMount() {
    Modal.setAppElement('body');
  }

  getDetail() {
    this.state.getDetail = true;
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
    this.state.getDetail = true;
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

  getListImage() {
    BookingPhoto.actions.get.request({booking_id: this.props.params.id}).then(res => {
      if(res.data) {
        let Data = res.data.data;
        this.state.dataImage = Data.booking_photos || [];
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

  deleteImage() {
    this.state.modalIsOpen = false;
    this.state.deleteLoading = true;
    this.setState({
      ...this.state
    })
    let params = {
      booking_id: this.props.params.id,
      delete_photos: this.state.dataImageSelect
    }
    if(this.props.isStaff == true) {
      BookingPhoto.actions.staffDelete.request('', params).then(res => {
        this.state.deleteLoading = false;
        this.setState({...this.state})
        Toastr(msg.deleteBookingPhoto, 'success');
        this.goBack();
      }).catch(err => {
        if(err.response && err.response.data.errors.length > 0) {
          err.response.data.errors.map((errors, i) => {
            Toastr(errors, 'error');
          })
        } else {
          Toastr(msg.systemFail, 'error');
        }
        this.state.deleteLoading = false;
        this.setState({...this.state})
      })
    } else {
      BookingPhoto.actions.delete.request('', params).then(res => {
        this.state.deleteLoading = false;
        this.setState({...this.state})
        Toastr(msg.deleteBookingPhoto, 'success');
        this.goBack();
      }).catch(err => {
        if(err.response && err.response.data.errors.length > 0) {
          err.response.data.errors.map((errors, i) => {
            Toastr(errors, 'error');
          })
        } else {
          Toastr(msg.systemFail, 'error');
        }
        this.state.deleteLoading = false;
        this.setState({...this.state})
      })
    }
  }

  downloadImage(type) {
    if (type != 'all' && this.state.dataImageSelect.length == 0) {
      Toastr(msg.noImageSelect, 'warning');
    } else if (this.props.isStaff == true) {
      if(type == 'all') {
        let token = cookie.load('accessToken');
        let URL = String(API_URL) + "/staff/booking-photos/download?token=" + token + "&booking_id=" + this.props.params.id;
        this.state.dataImage.map((item, index)=> {
          URL = URL + "&ids["+index+"]=" + item.id
        })
        this.state.linkDownLoad = URL;
        this.setState({...this.state}, () => {
          this.downloadItem.click();
        });
      } else {
        let token = cookie.load('accessToken');
        let URL = String(API_URL) + "/staff/booking-photos/download?token=" + token + "&booking_id=" + this.props.params.id;
        this.state.dataImageSelect.map((item, index)=> {
          URL = URL + "&ids["+index+"]=" + item
        })
        this.state.linkDownLoad = URL;
        this.setState({...this.state}, () => {
          this.downloadItem.click();
        });
      }
    } else {
      if(type == 'all') {
        let token = cookie.load('accessToken');
        let URL = String(API_URL) + "/booking-photos/download?token=" + token + "&booking_id=" + this.props.params.id;
        this.state.dataImage.map((item, index)=> {
          URL = URL + "&ids["+index+"]=" + item.id
        })
        this.state.linkDownLoad = URL;
        this.setState({...this.state}, () => {
          this.downloadItem.click();
        });
      } else {
        let token = cookie.load('accessToken');
        let URL = String(API_URL) + "/booking-photos/download?token=" + token + "&booking_id=" + this.props.params.id;
        this.state.dataImageSelect.map((item, index)=> {
          URL = URL + "&ids["+index+"]=" + item
        })
        this.state.linkDownLoad = URL;
        this.setState({...this.state}, () => {
          this.downloadItem.click();
        });
      }
    }
  }

  goBack() {
    if (this.props.isStaff == true) {
      this.props.history.push(`/staff/bookings/${this.props.params.id}/photos`);
    } else {
      this.props.history.push(`/bookings/${this.props.params.id}/photos`);
    }
  }

  checkImageSelect(id) {
    let result = '';
    if(this.state.dataImageSelect.indexOf(id) != -1) {
      result = 'active'
    }
    return result
  }

  checkImage(id) {
    if(this.state.dataImageSelect.indexOf(id) != -1) {
      this.state.dataImageSelect.splice(this.state.dataImageSelect.indexOf(id), 1);
    } else {
      this.state.dataImageSelect.push(id);
    }
    this.setState({...this.state})
  }

  openModal() {
    if (this.state.dataImageSelect.length > 0) {
      this.state.modalIsOpen = true;
      this.setState({
        ...this.state
      })
    } else {
      Toastr(msg.noImageSelect, 'warning');
    }
  }

  closeModal() {
    this.state.modalIsOpen = false;
    this.setState({
      ...this.state
    })
  }

  render() {
    return (
      <div>
        <div className='title-block mb20'>
          <h2 className='heading-2'>写真情報 <small>一覧</small></h2>
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
        <div className='pt20'>
          <div className='upload-list-item'>
            {
              this.state.dataImage.map((Item, index) => {
                return(
                  <div className='item-upload-image mb20' style={{position: 'relative'}}>
                    <div className={`wrap wrap-select-image ${this.checkImageSelect(Item.id)}`}>
                        <div className='wrap-input-file' onClick={this.checkImage.bind(this, Item.id)}>
                          <div className='index-item'>{index + 1}</div>
                          <div className='check-mark'></div>
                          <img className='img-result' src={Item.URL}/>
                        </div>
                    </div>
                  </div>
                )
              })
            }
            <ShowIf condition={this.state.dataImage.length == 0 && this.state.getDetail == true}>
              <span className='col-xs-12 pb15'>データなし</span>
            </ShowIf>
          </div>
        </div>
        <div className='pt20'>
          <ShowIf condition={this.props.isDownload != true}>
            <button className='btn-confirm mr20' disabled={this.state.loading} onClick={this.openModal.bind(this)}>削除</button>
          </ShowIf>
          <ShowIf condition={this.props.isDownload == true}>
            <button className='btn-confirm mr20' disabled={this.state.loading} onClick={this.downloadImage.bind(this)}>ダウンロード</button>
          </ShowIf>
          <ShowIf condition={this.props.isDownload == true}>
            <button className='btn-confirm mr20 btn-green' disabled={this.state.loading} onClick={this.downloadImage.bind(this, 'all')}>全てダウンロード</button>
          </ShowIf>
          <button className='btn-close-confirm' disabled={this.state.loading} onClick={this.goBack.bind(this)}>キャンセル</button>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          className="model-confirm-delete"
        >
          <div className='title-block'>
            <h3 className='heading-3'>確認</h3>
            <button className='btn-close' onClick={this.closeModal.bind(this)}></button>
          </div>
          <div className='wrap-content-modal'>
            <p className='p-14'>{msg.confirmDeleteBookingPhoto}</p>
            <div className='wrap-button'>
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.deleteImage.bind(this)}>OK</button>
              <button className='btn-close-confirm' disabled={this.state.deleteLoading ? true : false} onClick={this.closeModal.bind(this)}>閉じる</button>
            </div>
          </div>
        </Modal>
        <a ref={(downloadItem) => {this.downloadItem = downloadItem}} href={this.state.linkDownLoad} target='_blank' download style={{display: 'none'}}/>
      </div>
    );
  }
}

Edit.defaultProps = {
  isDownload: false,
  isStaff: false
}

export default connect()(withRouter(Edit));