import { BotChat } from "@/components/bot/BotChat";
import { Footer } from "@/components/ui/Footer";

export default function DashboardPage() {
  const userId = "u1";
  return (
    <div className="px-6 sm:px-10 md:px-16 py-16 relative">
      <div className="absolute inset-0 gradient-bg" />
      <div className="relative">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Dashboard</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Match Suggestions</h2>
            <p className="text-slate-600 text-sm">Your top connections will appear here during the event.</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Upcoming Meetups</h2>
            <p className="text-slate-600 text-sm">No meetups scheduled. Use the bot to coordinate.</p>
          </div>
        </div>
        <div className="lg:col-span-1">
          <BotChat userId={userId} />
        </div>
              </div>
      </div>
      <Footer />
    </div>
  );
}


