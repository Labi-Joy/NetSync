import Footer from "@/components/ui/Footer";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="relative w-full max-w-md glass-card rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Welcome back</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Email</label>
            <input type="email" className="w-full bg-white text-slate-900 px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Password</label>
            <input type="password" className="w-full bg-white text-slate-900 px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-400 outline-none" />
          </div>
          <button className="w-full btn-primary text-white py-2 rounded-lg font-medium hover:opacity-90 transition-all">Sign in</button>
        </form>
        <div className="my-6 text-center text-slate-600 text-sm">or</div>
        <button className="w-full btn-secondary py-2 rounded-lg font-medium hover:opacity-90 transition-all">Connect Wallet</button>
      </div>
      <Footer />
    </div>
  );
}


