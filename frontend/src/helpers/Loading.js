import React from 'react';
import loading from '../assets/loading.gif';

export const Loading = () => {
  return (
    <div className="row m-0" style={{ height: '90vh' }}>
      <div className="col-sm-12 my-auto">
        <img src={loading} className='img-fluid m-auto d-block' style={{ opacity: 0.6 }} alt='logo' />
      </div>
    </div>
  );
}