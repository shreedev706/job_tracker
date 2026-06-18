import React from "react";
import Signup from "../components/auth/Signup";

const Register: React.FC = () => {
  return (
    <main
      className="w-full h-screen flex flex-col bg-neutral-950 text-neutral-300 bg-cover bg-center"
      style={{ backgroundImage: 'url("/asset/background/bg.jpg")' }}
    >
      <div className="max-w-2xl mx-auto p-5 md:px-10 xl:px-0 w-[90%] flex flex-col bg-neutral-900/90 backdrop-blur-sm items-center rounded-lg shadow-xl mt-20 border border-neutral-800">
        <div className="mb-6">
          <img
            src="/asset/logo/logo-no-background.png"
            alt="logo"
            width={240}
            height={240}
            className="object-contain"
          />
        </div>
        
        <div className="w-full flex items-center justify-center">
          <Signup />
        </div>
      </div>
    </main>
  );
};

export default Register;