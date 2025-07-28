import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

// Timer utility
function useCountdown(targetDate) {
  const countDownDate = new Date(targetDate).getTime();
  const [timeLeft, setTimeLeft] = useState(countDownDate - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = countDownDate - now;
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return { days, hours, minutes, seconds };
}


function FlashSaleBanner({ endTime }) {
  const { days, hours, minutes, seconds } = useCountdown(endTime);

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-6 px-4 sm:px-10 flex flex-col md:flex-row justify-between items-center rounded-xl shadow-md mt-10 mx-3 sm:mx-0 md:mx-10">
      <div className="mb-4 md:mb-0 text-center md:text-left">
        <h2 className="text-2xl font-bold uppercase">⚡ Flash Sale!</h2>
        <p className="text-sm mt-1">Hurry up! Limited time offers on top products</p>
      </div>
      <div className="flex items-center space-x-3 text-lg font-semibold mt-2 md:mt-0">
        <span className="bg-black/30 px-3 py-1.5 rounded-lg">
          {days.toString().padStart(2, '0')}d
        </span>
        <span className="bg-black/30 px-3 py-1.5 rounded-lg">
          {hours.toString().padStart(2, '0')}h
        </span>
        <span className="bg-black/30 px-3 py-1.5 rounded-lg">
          {minutes.toString().padStart(2, '0')}m
        </span>
        <span className="bg-black/30 px-3 py-1.5 rounded-lg">
          {seconds.toString().padStart(2, '0')}s
        </span>
      </div>
    </div>
  );
}

export default FlashSaleBanner;
