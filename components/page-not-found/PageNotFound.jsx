import React from 'react';

class PageNotFound extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className='page-not-found'>
        <h1 className='header-title'>Photo Studio</h1>
        <div className='content-page-not-found'>
          <h2>404</h2>
          <p>ページが見つかりません</p>
        </div>
      </div>
    )
  }
}

export default PageNotFound;
