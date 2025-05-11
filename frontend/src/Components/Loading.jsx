import { motion } from "framer-motion";

const LoadingScreen = () => {
  const bounceTransition = {
    y: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
    scale: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-white to-gray-100">
      <motion.div
        className="flex space-x-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-lg"
            animate={{
              y: ["0%", "-50%", "0%"],
              scale: [1, 1.2, 1],
            }}
            transition={{
              ...bounceTransition,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
