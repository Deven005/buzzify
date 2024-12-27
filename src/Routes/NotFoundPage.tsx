import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col items-center justify-center bg-gradient-to-b from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden relative">
      {/* Animated Error Section */}
      <div className="relative text-center">
        <div className="text-8xl sm:text-9xl font-extrabold tracking-widest drop-shadow-lg animate-bounce">
          404
        </div>
        <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-purple-400 animate-pulse"></div>
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-blue-300 animate-ping"></div>
      </div>

      {/* Main Message */}
      <div className="text-center mt-6 px-4 max-w-lg">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg font-medium leading-relaxed">
          It seems you've hit a dead end. Don't worry, let's guide you back to
          familiar territory!
        </p>
      </div>

      {/* Navigation Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 px-4">
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg transform transition hover:scale-110 p-5 rounded-lg text-center"
        >
          <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
            🏠 Back to Home
          </h2>
        </Link>
      </div>

      {/* Bottom Waves */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 320"
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            fillOpacity="0.1"
            d="M0,224L48,192C96,160,192,96,288,96C384,96,480,160,576,160C672,160,768,96,864,96C960,96,1056,160,1152,186.7C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default NotFoundPage;
