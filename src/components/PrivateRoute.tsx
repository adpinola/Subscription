import React, { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface IPrivateRoute {
  authCondition: boolean;
}

const PrivateRoute: FC<IPrivateRoute> = (props: IPrivateRoute) => {
  return props.authCondition ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
