import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState([
    { id: 1, paymentId: "PAY123", customerName: "Alice Smith", customerEmail: "alice@example.com", amount: "$120.00", status: "Completed", gateway: "Stripe" },
    { id: 2, paymentId: "PAY124", customerName: "Bob Johnson", customerEmail: "bob@example.com", amount: "$80.00", status: "Pending", gateway: "PayPal" },
    { id: 3, paymentId: "PAY125", customerName: "Charlie Brown", customerEmail: "charlie@example.com", amount: "$200.00", status: "Completed", gateway: "Razorpay" },
  ]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this payment?")) {
      setPayments(payments.filter(payment => payment.id !== id));
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Failed":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.gateway.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pl-64 pr-8 py-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Payment Gateway Management</h1>

      <input
        type="text"
        placeholder="🔍 Search payments by payment ID, customer name, email, or gateway..."
        className="w-full mb-6 px-5 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-700 placeholder-gray-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="w-full bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-blue-50 text-gray-700 text-left">
            <tr>
              <th className="px-6 py-4 font-semibold">Payment ID</th>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Gateway</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPayments.map((payment, index) => (
              <tr
                key={payment.id}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} transition hover:bg-blue-50`}
              >
                <td className="px-6 py-4 text-gray-800 font-medium">{payment.paymentId}</td>
                <td className="px-6 py-4 text-gray-600">{payment.customerName}</td>
                <td className="px-6 py-4 text-gray-600">{payment.customerEmail}</td>
                <td className="px-6 py-4 text-gray-600">{payment.amount}</td>
                <td className="px-6 py-4 text-gray-600">{payment.gateway}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full font-semibold text-xs ${getStatusStyle(payment.status)}`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center space-x-4">
                  <button
                    className="text-blue-500 hover:text-blue-700 transition transform hover:scale-110"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(payment.id)}
                    className="text-red-500 hover:text-red-700 transition transform hover:scale-110"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-6 text-center text-gray-500 italic">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
