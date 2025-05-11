import axios from "axios";
import { loadAdminSuccess, logout, setLoading } from "../adminSlice";
import { server } from "../../server";

export const loadAdminUser = () => async (dispatch) => {
  try {
    dispatch(setLoading()); // Start loading

    const { data } = await axios.get(`${server}/admin/get-admin`, {
      withCredentials: true,
    });

    if (data.success) {
      dispatch(loadAdminSuccess(data.user)); // Load user data if success
    } else {
      dispatch(logout()); // Logout if the response is not successful
    }
  } catch (error) {
    console.error("Error loading admin user:", error); // Log error to console
    dispatch(logout()); // Logout if there's an error
  }
};
