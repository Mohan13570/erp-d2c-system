import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ArrowLeft, ShieldCheck, User as UserIcon, Users, ShoppingBag } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState<string | null>(null); // null means showing portal selection
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type: loginType }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        navigate('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePortalSelect = (type: string) => {
    if (type === 'Customer') {
      window.location.href = '/'; // Go to the storefront
    } else {
      setLoginType(type);
      if (type === 'Admin') {
        setEmail('admin@aura.com');
        setPassword('admin123');
      } else {
        setEmail('employee@aura.com');
        setPassword('employee123');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px] bg-indigo-600/30 transition-transform duration-1000 ease-out"
          style={{ transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)` }}
        />
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        {!loginType ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/50 mx-auto mb-8 animate-pulse">
                <span className="text-4xl font-black text-white tracking-tighter">A</span>
              </div>
              <h2 className="text-5xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Aura Platform
              </h2>
              <p className="text-lg text-gray-400 font-medium">Select your portal to continue</p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => handlePortalSelect('Customer')}
                className="group relative bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all duration-300 flex items-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center shrink-0 mr-6 group-hover:scale-110 transition-transform">
                  <ShoppingBag size={28} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">Customer Storefront</h3>
                  <p className="text-gray-400 text-sm">Browse products, track orders & loyalty points</p>
                </div>
                <ArrowRight className="text-gray-500 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => handlePortalSelect('Employee')}
                className="group relative bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all duration-300 flex items-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center shrink-0 mr-6 group-hover:scale-110 transition-transform">
                  <Users size={28} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">Employee Workspace</h3>
                  <p className="text-gray-400 text-sm">Manage inventory, orders, and daily operations</p>
                </div>
                <ArrowRight className="text-gray-500 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => handlePortalSelect('Admin')}
                className="group relative bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all duration-300 flex items-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 mr-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={28} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">System Admin</h3>
                  <p className="text-gray-400 text-sm">Full ERP control, configuration & RBAC</p>
                </div>
                <ArrowRight className="text-gray-500 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <button 
              onClick={() => setLoginType(null)}
              className="mb-8 flex items-center text-sm font-bold text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portals
            </button>
            
            <div className="bg-white/5 backdrop-blur-2xl py-10 px-6 sm:px-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div className="mb-10">
                <h2 className="text-3xl font-bold mb-2">Sign in to <span className="text-indigo-400">{loginType}</span></h2>
                <p className="text-gray-400">Enter your credentials to access your workspace</p>
              </div>

              <form className="space-y-6" onSubmit={handleLogin}>
                {error && (
                  <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm font-medium border border-red-500/20 flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 px-4 py-4 bg-black/20 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500 transition-all outline-none"
                      placeholder="name@aura.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 px-4 py-4 bg-black/20 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500 transition-all outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-4 px-4 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0B] focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 mt-8 shadow-lg shadow-indigo-500/25"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Access Workspace <ArrowRight className="ml-2 w-5 h-5" /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
