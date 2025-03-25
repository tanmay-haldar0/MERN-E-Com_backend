import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { server } from "../../server";
import { toast } from "react-toastify";

const ActivationPage = () => {
  const { activation_token } = useParams(); // Extract from URL parameters
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // State for messages

  useEffect(() => {
    if (activation_token) {
      const activateAccount = async () => {
        try {
          const res = await axios.post(`${server}/user/activation`, {
            activationToken: activation_token, // Ensure key matches backend
          });

          const data = res.data;
          // console.log(res.data);
          setLoading(false);

          if (data.success) {
            setError(false);
            setMessage("Your account has been activated successfully."); // Update message on success
            toast.success("Your account has been activated successfully.");
            // console.log("Message set to: Your account has been activated successfully."); // Log message for debugging
            // navigate('/login');
          } else {
            setError(true);
            setMessage(data.message || "Activation could not be completed. Please try again."); // Set error message
            toast.error(data.message || "Activation could not be completed. Please try again.");
            // console.log("Message set to:", data.message || "Activation could not be completed. Please try again."); // Log message for debugging
          }
        } catch (error) {
          setLoading(false);
          setError(true);
          setMessage(error.response?.data?.message || "An error occurred. Please try again."); // Set error message on catch
          toast.error(error.response?.data?.message || "An error occurred. Please try again."); // Log message for debugging
        }
      };

      activateAccount();
    }
  }, [activation_token]); // Dependency added to prevent unnecessary calls

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {loading ? (
        <p className="text-lg">Loading...</p>
      ) : error ? (
        <div className="flex flex-col text-center">
          <p className="text-lg text-red-600">{message}</p>
          <Link to={"/signup"}>
            <button className="btn bg-primary text-white px-3 p-1 font-semibold rounded-md">SignUp</button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col text-center">
          <p className="text-lg text-green-600">{message}</p>
          <Link to={"/login"}>
            <button className="btn bg-primary text-white px-3 p-1 font-semibold rounded-md">Login</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ActivationPage;
