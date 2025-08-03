import { Link, redirect } from "react-router";
import { loginWithGoogle } from '~/appwrite/auth';
import { account } from '~/appwrite/client';
import * as Buttons from '@syncfusion/ej2-react-buttons';

export async function clientLoader() {
  try {
    const user = await account.get();
    if (user.$id) return redirect('/dashboard');
    return null;
  } catch (error) {
    console.log('Error fetching user:', error);
    return null;
  }
}

const SignIn = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Main Container */}
      <div className="relative w-full max-w-md">
        {/* Glass Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full translate-y-12 -translate-x-12"></div>
          
          {/* Header */}
          <header className="text-center mb-8 relative z-10">
            <Link to="/" className="inline-block mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                <img 
                  src="/assets/icons/logo.svg"
                  alt="TripWise Logo"
                  className="w-8 h-8 filter brightness-0 invert"
                />
              </div>
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TripWise
            </h1>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-2"></div>
          </header>

          {/* Content */}
          <article className="text-center mb-8 relative z-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Welcome!
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Your next adventure awaits. Sign in to explore destinations, 
              create personalized itineraries, and manage your travel dreams.
            </p>
            
            {/* Features List */}
            <div className="grid grid-cols-1 gap-3 mb-6 text-sm">
              <div className="flex items-center justify-center text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                AI-powered trip planning
              </div>
              <div className="flex items-center justify-center text-gray-600">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                Personalized recommendations
              </div>
              <div className="flex items-center justify-center text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Seamless travel management
              </div>
            </div>
          </article>

          {/* Sign In Button */}
          <div className="relative z-10">
            <Buttons.ButtonComponent
              type="button"
              className="w-full h-14 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
              onClick={loginWithGoogle}
            >
              <div className="flex items-center justify-center space-x-3">
                <img
                  src="/assets/icons/google.svg"
                  className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                  alt="Google"
                />
                <span className="text-gray-700 font-semibold text-lg group-hover:text-gray-900 transition-colors duration-200">
                  Continue with Google
                </span>
              </div>
            </Buttons.ButtonComponent>
          </div>

          {/* Footer */}
          <footer className="text-center mt-8 relative z-10">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </footer>
        </div>

        {/* Bottom Decoration */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <div className="w-8 h-px bg-gray-300"></div>
            <span className="text-sm">Secure Authentication</span>
            <div className="w-8 h-px bg-gray-300"></div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
