import routes from "@/routes";
import { logout } from "@/store/session";
import { parseJwt } from "@/util/jwt";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { store } from "../store/store";

function useTokenExpirationChecker(checkIntervalInMinutes: number): void {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Function to check token expiration status
    const checkTokenExpiration = () => {
      const token = store.getState().session.authToken;
      if (token) {
        try {
          const decodedToken = parseJwt(token);
          const expirationTimestamp = decodedToken.exp * 1000; // Convert to milliseconds
          const currentTime = Date.now();

          if (currentTime >= expirationTimestamp) {
            // Token is expired, dispatch logout action and navigate to /login
            dispatch(logout()); // Replace with your logout action
            navigate(routes.LOGIN);
          }
        } catch (error) {
          // Handle token decoding errors
          // In case of decoding errors, you can also dispatch a logout action and navigate to /login
          dispatch(logout()); // Replace with your logout action
          navigate(routes.LOGIN);
        }
      }
    };

    // Initial token check
    checkTokenExpiration();

    // Set up an interval to periodically check the token
    const intervalId = setInterval(
      checkTokenExpiration,
      checkIntervalInMinutes * 60 * 1000
    );

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, history, checkIntervalInMinutes]);
}

export default useTokenExpirationChecker;
