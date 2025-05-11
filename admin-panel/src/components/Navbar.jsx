const Navbar = () => {
  return (
    <div className="sticky top-0 z-40 h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 backdrop-blur-md">
      <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-500 text-sm font-medium">Hello, Admin</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="Admin"
          className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-400 transition duration-200 object-cover"
        />
      </div>
    </div>
  );
};

export default Navbar;
