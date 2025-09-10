"use client";
import { useState } from "react";
import { Footer } from "@/components/ui/Footer";

const steps = [
  "Basic Info",
  "Tech Interests",
  "Goals",
  "Experience Level",
  "Availability",
] as const;

export default function ProfileOnboarding() {
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="px-6 sm:px-10 md:px-16 py-16 max-w-3xl mx-auto relative">
      <div className="absolute inset-0 gradient-bg" />
      <div className="relative">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your profile</h1>
      <p className="text-slate-600 mb-6">Step {step + 1} of {steps.length}: {steps[step]}</p>

      <div className="glass-card rounded-2xl p-6 mb-6">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Name</label>
              <input className="w-full bg-white text-slate-900 px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-400 outline-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Role</label>
                <input className="w-full bg-white text-slate-900 px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-400 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Company</label>
                <input className="w-full bg-white text-slate-900 px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-400 outline-none" />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="text-slate-600 mb-3 text-sm">Select your interests</p>
            <div className="flex flex-wrap gap-2">
              {["AI", "Frontend", "Web3", "DeFi", "Infra", "DevRel"].map((t) => (
                <button key={t} className="px-3 py-1 rounded-full text-sm interest-tag hover:opacity-90">{t}</button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-slate-600 mb-3 text-sm">Select your goals</p>
            <div className="flex flex-wrap gap-2">
              {["networking", "seek mentorship", "offer mentorship", "find co-founder", "learning opportunities"].map((t) => (
                <button key={t} className="px-3 py-1 rounded-full text-sm btn-accent text-white hover:opacity-90">{t}</button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="text-slate-600 mb-3 text-sm">Experience level</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["student", "junior", "mid", "senior", "founder"].map((t) => (
                <button key={t} className="px-3 py-2 rounded-lg text-sm btn-secondary hover:opacity-90 text-slate-700 capitalize">{t}</button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <p className="text-slate-600 mb-3 text-sm">When are you available?</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="glass-card rounded-xl p-4">
                <p className="text-slate-900 font-medium mb-2">Days</p>
                <div className="flex flex-wrap gap-2">
                  {["Thu", "Fri", "Sat", "Sun"].map((t) => (
                    <button key={t} className="px-3 py-1 rounded-full text-sm btn-secondary hover:opacity-90">{t}</button>
                  ))}
                </div>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-slate-900 font-medium mb-2">Times</p>
                <div className="flex flex-wrap gap-2">
                  {["AM", "PM", "Evening"].map((t) => (
                    <button key={t} className="px-3 py-1 rounded-full text-sm btn-secondary hover:opacity-90">{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button onClick={back} className="btn-secondary px-6 py-2 rounded-lg text-slate-700 disabled:opacity-50" disabled={step === 0}>Back</button>
        {step < steps.length - 1 ? (
          <button onClick={next} className="btn-primary px-6 py-2 rounded-lg text-white">Next</button>
        ) : (
          <button className="btn-primary px-6 py-2 rounded-lg text-white">Finish</button>
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
}


