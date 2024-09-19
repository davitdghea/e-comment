import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const WithRase = (WrappedComponent) => {

  const HOCComponent = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    return <WrappedComponent {...props} dispatch={dispatch} navigate={navigate} location={location} />;
  };

  return HOCComponent;
};

export default WithRase;
