import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";

const ActivationPage = () => {
  const { activation_token } = useParams(); // Extract from URL parameters

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (activation_token) {
      const activateAccount = async () => {
        try {
          const res = await axios.post(`${server}/user/activation`, {
            activationToken: activation_token, // Ensure key matches backend
          });

          const data = res.data;
          console.log(res);
          setLoading(false);

          // if (data.success) {
          // setMessage("Your account has been activated successfully.");

          // } else {
          //   setError(true);
          // setMessage(data.message || "Activation could not be completed. Please try again.");

          // }
        } catch (error) {
          setLoading(false);
          setError(true);
          setMessage(error.response?.data?.message || "An error occurred. Please try again.");
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
        <p className="text-lg text-red-600">{message}</p>
      ) : (
        <p className="text-lg text-green-600">{message}</p>
      )}
    </div>
  );
};

export default ActivationPage;
