import { Navigate } from "react-router-dom";

const PublicRoute = ({children}) => {
    if (localStorage.getItem('access_token')) {
        return <Navigate to="/dashboard" replace />;
      }
      return children;
}

export default PublicRoute;