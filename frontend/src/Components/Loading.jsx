import { motion } from "framer-motion";

const LoadingScreen = () => {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <motion.div 
          className="flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
        >
          <motion.span 
            className="w-4 h-4 bg-blue-500 rounded-full"
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
          />
          <motion.span 
            className="w-4 h-4 bg-blue-500 rounded-full"
            animate={{ y: [10, -10, 10] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.span 
            className="w-4 h-4 bg-blue-500 rounded-full"
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.4 }}
          />
        </motion.div>
      </div>
    );
  };

  export default LoadingScreen;