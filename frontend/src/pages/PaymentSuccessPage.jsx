import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { server } from "../server.js";
import { AiOutlineCheckCircle } from "react-icons/ai";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Skeleton from "react-loading-skeleton"; // Optional

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const sessionId = searchParams.get("session_id");

  const handleDownload = async () => {
  setIsGeneratingPdf(true);
  const element = document.getElementById("receipt-content");
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");

  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Create PDF with custom height matching the image
  const pdf = new jsPDF("p", "mm", [imgHeight + 20, imgWidth]);

  pdf.addImage(imgData, "PNG", 10, 10, imgWidth - 20, imgHeight);
  pdf.save(`receipt_${sessionId}.pdf`);

  setIsGeneratingPdf(false);
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${server}/payment/order-details?session_id=${sessionId}`,
          { withCredentials: true }
        );
        setOrderDetails(res.data);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
      }
    };

    if (sessionId) fetchData();
  }, [sessionId]);

  if (!orderDetails)
    return (
      <div className="min-h-screen mt-16 bg-gray-100 flex flex-col items-center justify-start px-4 py-8">
        {/* Skeleton Loader for Receipt */}
        <div className="bg-white border border-gray-300 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
          <Skeleton height={30} width="60%" className="mx-auto" />
          <Skeleton height={20} width="40%" className="mx-auto" />
          
          <div className="flex items-center justify-center space-x-2">
            <Skeleton circle height={30} width={30} />
            <Skeleton height={20} width="30%" />
          </div>

          <Skeleton height={20} width="80%" />
          <Skeleton height={20} width="80%" />
          <Skeleton height={20} width="80%" />
          <Skeleton height={20} width="80%" />
          
          <div className="mt-4">
            <Skeleton height={40} width="50%" className="mx-auto" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen mt-16 bg-gray-100 flex flex-col items-center justify-start px-4 py-8">
      {/* Receipt */}
      <div
        id="receipt-content"
        className="bg-white border border-gray-300 rounded-2xl shadow-xl w-full max-w-lg sm:max-w-md p-6 space-y-4"
      >
        {/* Company Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-extrabold text-green-600 sm:text-2xl">ClassiCustom</h1>
          <p className="text-sm text-gray-500">Thank you for your order!</p>
        </div>

        {/* Success Message */}
        <div className="flex items-center justify-center space-x-2">
          <AiOutlineCheckCircle className="text-green-500" size={26} />
          <h2 className="text-xl font-semibold text-gray-800 sm:text-lg">
            Payment Successful
          </h2>
        </div>

        {/* Order Info */}
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-semibold">Order ID:</span> {orderDetails._id}
          </p>
          <p>
            <span className="font-semibold">Total Paid:</span> ₹
            {orderDetails.totalPrice}
          </p>
          <p>
            <span className="font-semibold">Status:</span> {orderDetails.status}
          </p>
          <p>
            <span className="font-semibold">Paid At:</span>{" "}
            {new Date(orderDetails.paidAt).toLocaleString()}
          </p>
        </div>

        {/* Product List */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2 sm:text-sm">
            Products
          </h3>
          <ul className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 divide-y">
            {orderDetails.cart.map((item, index) => (
              <li key={index} className="py-2 flex justify-between">
                <div>
                  <p className="font-medium">{item.productId.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item?.quantity}</p>
                </div>
                <div className="text-right">
                  <p>₹{item.price}</p>
                  <p className="text-xs text-gray-500">
                    Total: ₹{item?.price * item.quantity}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Shipping Details */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2 sm:text-sm">
            Shipping Details
          </h3>
          <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600 space-y-1">
            <p className="font-semibold">
              {orderDetails.shippingAddress.fullName}
            </p>
            <p>
              {orderDetails.shippingAddress.addressLine1},{" "}
              {orderDetails.shippingAddress.addressLine2}
            </p>
            <p>
              {orderDetails.shippingAddress.city},{" "}
              {orderDetails.shippingAddress.state} -{" "}
              {orderDetails.shippingAddress.postalCode}
            </p>
            <p>{orderDetails.shippingAddress.country}</p>
            <p>📞 {orderDetails.shippingAddress.phoneNumber}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
          Thank you for shopping with{" "}
          <span className="font-medium">ClassiCustom</span>!
        </div>
      </div>

      {/* Download Button OUTSIDE the receipt */}
      <div className="mt-6">
        <button
          onClick={handleDownload}
          disabled={isGeneratingPdf}
          className={`px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition ${
            isGeneratingPdf ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isGeneratingPdf ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
              <span>Generating PDF...</span>
            </div>
          ) : (
            "🧾 Download Receipt (PDF)"
          )}
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
