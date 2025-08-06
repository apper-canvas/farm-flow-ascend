import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import Farms from "@/components/pages/Farms";
import Crops from "@/components/pages/Crops";
import Tasks from "@/components/pages/Tasks";
import Weather from "@/components/pages/Weather";
import Finances from "@/components/pages/Finances";
import Inventory from "@/components/pages/Inventory";
// Redux slice for user management
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = JSON.parse(JSON.stringify(action.payload));
      state.isAuthenticated = !!action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

const { setUser, clearUser } = userSlice.actions;

// Redux store
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

// Auth context
export const AuthContext = createContext(null);

// Login component
const Login = () => {
  const { isInitialized } = React.useContext(AuthContext);
  
  React.useEffect(() => {
    if (isInitialized) {
      const { ApperUI } = window.ApperSDK;
      ApperUI.showLogin("#authentication");
    }
  }, [isInitialized]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-sage">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-forest to-leaf text-white text-2xl font-bold">
            F
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold">
              Sign in to FarmFlow
            </div>
            <div className="text-center text-sm text-gray-500">
              Welcome back, please sign in to continue
            </div>
          </div>
        </div>
        <div id="authentication" />
      </div>
    </div>
  );
};

// Signup component
const Signup = () => {
  const { isInitialized } = React.useContext(AuthContext);
  
  React.useEffect(() => {
    if (isInitialized) {
      const { ApperUI } = window.ApperSDK;
      ApperUI.showSignup("#authentication");
    }
  }, [isInitialized]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-sage">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-forest to-leaf text-white text-2xl font-bold">
            F
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold">
              Create Account
            </div>
            <div className="text-center text-sm text-gray-500">
              Please create an account to continue
            </div>
          </div>
        </div>
        <div id="authentication" />
      </div>
    </div>
  );
};

// Callback component
const Callback = () => {
  React.useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showSSOVerify("#authentication-callback");
  }, []);
  
  return <div id="authentication-callback"></div>;
};

// Error page component
const ErrorPage = () => {
  const [searchParams] = new URLSearchParams(window.location.search);
  const errorMessage = searchParams.get('message') || 'An error occurred';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-sage">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-700 mb-6">{errorMessage}</p>
        <a href="/login" className="inline-block px-6 py-3 bg-forest text-white rounded-md hover:bg-forest/90 transition-colors">
          Return to Login
        </a>
      </div>
    </div>
  );
};

// Reset password component
const ResetPassword = () => {
  React.useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showResetPassword('#authentication-reset-password');
  }, []);

  return (
    <div className="flex-1 py-12 px-5 flex justify-center items-center">
      <div id="authentication-reset-password" className="bg-white mx-auto w-[400px] max-w-full p-10 rounded-2xl"></div>
    </div>
  );
};

// Prompt password component
const PromptPassword = () => {
  React.useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showPromptPassword('#authentication-prompt-password');
  }, []);

  return (
    <div className="flex-1 py-12 px-5 flex justify-center items-center">
      <div id="authentication-prompt-password" className="bg-white mx-auto w-[400px] max-w-full p-10 rounded-2xl"></div>
    </div>
  );
};

// Main app component
function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, []);

const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/": return "Dashboard";
      case "/farms": return "Farms";
      case "/crops": return "Crops";
      case "/tasks": return "Tasks";
      case "/weather": return "Weather";
      case "/finances": return "Finances";
      case "/inventory": return "Inventory";
      default: return "FarmFlow";
    }
  };

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return (
      <div className="loading flex items-center justify-center p-6 h-screen w-screen bg-sage">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
        <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
        <Route path="/*" element={
          isAuthenticated ? (
            <div className="min-h-screen bg-sage">
              <div className="flex">
                <Sidebar 
                  isOpen={sidebarOpen} 
                  onClose={() => setSidebarOpen(false)} 
                />
                
                <div className="flex-1 flex flex-col lg:ml-0">
                  <Header 
                    title={getPageTitle(window.location.pathname)}
                    onMenuClick={() => setSidebarOpen(true)}
                  />
                  
                  <main className="flex-1">
<Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/farms" element={<Farms />} />
                      <Route path="/crops" element={<Crops />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/weather" element={<Weather />} />
                      <Route path="/finances" element={<Finances />} />
                      <Route path="/inventory" element={<Inventory />} />
                    </Routes>
                  </main>
                </div>
              </div>
              
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                style={{ zIndex: 9999 }}
              />
            </div>
          ) : (
            <Login />
          )
        } />
      </Routes>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;