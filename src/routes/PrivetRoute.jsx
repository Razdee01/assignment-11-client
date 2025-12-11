import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Loading from '../loading/Loading';
import { useLocation } from 'react-router';

const PrivetRoute = ({children}) => {
    const {user,loading} = useContext(AuthContext);
    const location = useLocation();
    if(loading){
        return <Loading></Loading>;
    }
    if(!user){
        return <Navigate state={location.pathname} to="/login"></Navigate>;
    }
    return children;
};

export default PrivetRoute;