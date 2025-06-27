import { Button } from '@/components/ui/button';
import './Auth.css';
import Signup from './Signup';
import { useLocation, useNavigate } from 'react-router-dom';
import ForgotPasswordForm from './ForgotPasswordForm';
import Signin from './Signin';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="h-screen relative authContainer">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#030712] bg-opacity-50">
        {/* Centered Auth Box */}
        <div className="bgBlure absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          flex flex-col justify-center items-center h-[35rem] w-[30rem] rounded-md z-50
          bg-black bg-opacity-50 shadow-2xl shadow-white"
        >
          <h1 className='text-4xl pb-8 font-bold text-white'>Ajay Treading</h1>

          {path === "/signup" ? (
            <>
              <Signup />
              <div className='flex gap-2 items-center justify-center mt-4 text-sm text-white'>
                <span>Already have an account?</span>
                <Button
                  className="bg-white text-black hover:bg-gray-200 rounded px-4 py-2 transition-all duration-200"
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </Button>
              </div>
            </>
          ) : path === "/forgot-password" ? (
            <>
              <ForgotPasswordForm />
              <div className='flex gap-2 items-center justify-center mt-4 text-sm text-white'>
                <span>Remember your password?</span>
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-600 rounded px-4 py-2 transition-all duration-200"
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </Button>
              </div>
            </>
          ) : (
            // Default: Signin
            <>
              <Signin />
              <div className='flex flex-col gap-2 items-center justify-center mt-4 text-sm text-white'>
                <div className="flex gap-2 items-center">
                  <span>Don’t have an account?</span>
                  <Button
                    className="bg-white text-black hover:bg-gray-200 rounded px-4 py-2 transition-all duration-200"
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </Button>
                </div>
                <div>
                  <Button
                    className="border border-white text-white hover:bg-white hover:text-black rounded px-4 py-2 transition-all duration-200"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot Password?
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
