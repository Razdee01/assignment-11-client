import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Loading from '../loading/Loading';

const PrivetRoute = ({children}) => {
    const {user,loading} = useContext(AuthContext);
    if(loading){
        return <Loading></Loading>;
    }
    if(!user){
        return <Navigate to="/login" replace></Navigate>;
    }
    return children;
};

export default PrivetRoute;