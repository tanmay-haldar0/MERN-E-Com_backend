import axios from "axios";
import { server } from "../../server.js"


export const loadUser = () => async (dispatch) => {
    try {
        dispatch({
            type: "LoadUserRequest",
        });
        const {data} = await axios.get(`${server}/user/get-user`,{withCredentials:true});
        dispatch({
            type: "LoadUserSuccess",
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type: "LoadUserFail",
            payload: error.response.data.message,
        });
    }
}

export const loadSeller = () => async (dispatch) => {
    try {
        dispatch({
            type: "LoadSellerRequest",
        });
        const {data} = await axios.get(`${server}/seller/get-user`,{withCredentials:true});
        dispatch({
            type: "LoadSellerSuccess",
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type: "LoadSellerFail",
            payload: error.response.data.message,
        });
    }
}