import { useState } from "react";
import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900 bg-cover bg-center bg-no-repeat"
      style={{
       
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.75)), url('assets/background.jpg')`,
      }}
    >
      <div className="w-full max-w-112.5 p-8 bg-[#1f1f1f] rounded-lg shadow-2xl text-white">
        {/* Persistent Logo Section */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-emerald-500 rounded-full flex items-center justify-center relative">
                <div className="w-2 h-2 bg-emerald-500 rounded-full absolute -top-0.5 -right-0.5"></div>
                <div className="w-0 h-0 border-l-4 border-l-transparent border-b-8 border-b-emerald-500 border-r-4 border-r-transparent transform rotate-45"></div>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-wide">
                JobTrackr.com
              </h1>
              <p className="text-[10px] text-emerald-500 leading-tight">
                Apply.track.succeed
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Form Rendering */}
        {isLogin ? (
          <LoginForm onToggleForm={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleForm={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};
