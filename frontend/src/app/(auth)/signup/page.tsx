export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="relative w-full max-w-md glass-card rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Create your account</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-white mb-1">Name</label>
            <input className="w-full bg-slate-200 border-secondary text-slate-900 px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Email</label>
            <input type="email" className="w-full bg-slate-200 border-secondary text-slate-900 px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Password</label>
            <input type="password" className="w-full bg-slate-200 border-secondary text-slate-900 px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-400 outline-none" />
          </div>
          <button className="w-full btn-primary text-white py-2 rounded-lg font-medium hover:opacity-90 transition-all">Sign up</button>
        </form>
        <div className="my-6 text-center text-white text-sm">or</div>
        <button className="w-full btn-secondary py-2 rounded-lg font-medium hover:opacity-90 transition-all">Connect Wallet</button>
      </div>
    </div>
  );
}


