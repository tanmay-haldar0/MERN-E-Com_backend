import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {server} from "../server.js"

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${server}/stripe/order-details?session_id=${sessionId}`);
        const data = await res.json();
        setOrderDetails(data);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
      }
    };

    if (sessionId) fetchData();
  }, [sessionId]);

  if (!orderDetails) return <p className="mt-18">Loading...</p>;

  return (
    <div>
      <h2>✅ Payment Successful</h2>
      <p>Order ID: {orderDetails._id}</p>
      <p>Total Paid: ₹{orderDetails.totalPrice}</p>
      <p>Paid At: {new Date(orderDetails.paidAt).toLocaleString()}</p>
      {/* Add more details here */}
      <button onClick={() => window.print()}>🧾 Download Receipt as PDF</button>
    </div>
  );
}

export default PaymentSuccessPage;