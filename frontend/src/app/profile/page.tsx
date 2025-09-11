"use client";
import { useState } from "react";
import { motion } from "framer-motion";

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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text)' }}>
      <div className="px-6 sm:px-10 md:px-16 py-16 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            Create Your Web3 Profile
          </h1>
          <div className="flex items-center gap-4">
            <p style={{ color: 'var(--text-muted)' }}>
              Step {step + 1} of {steps.length}: {steps[step]}
            </p>
            <div className="flex gap-1">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx <= step ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                  style={{ 
                    backgroundColor: idx <= step ? 'var(--accent-primary)' : 'var(--bg-secondary)' 
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-8 mb-8"
        >
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  Full Name
                </label>
                <input 
                  className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)', 
                    borderColor: 'var(--border)', 
                    color: 'var(--text)' 
                  }}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                    Current Role
                  </label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none"
                    style={{ 
                      backgroundColor: 'var(--bg-secondary)', 
                      borderColor: 'var(--border)', 
                      color: 'var(--text)' 
                    }}
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                    Company
                  </label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none"
                    style={{ 
                      backgroundColor: 'var(--bg-secondary)', 
                      borderColor: 'var(--border)', 
                      color: 'var(--text)' 
                    }}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="mb-6 text-lg" style={{ color: 'var(--text)' }}>
                Select your technical interests
              </p>
              <div className="flex flex-wrap gap-3">
                {["AI/ML", "Frontend", "Backend", "Web3", "DeFi", "DevOps", "Mobile", "DevRel", "Design", "Security"].map((t) => (
                  <button key={t} className="btn btn-outline text-sm">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="mb-6 text-lg" style={{ color: 'var(--text)' }}>
                What are your networking goals?
              </p>
              <div className="flex flex-wrap gap-3">
                {["General Networking", "Seek Mentorship", "Offer Mentorship", "Find Co-founder", "Learning Opportunities", "Job Opportunities", "Investment/Funding"].map((t) => (
                  <button key={t} className="btn btn-outline text-sm">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="mb-6 text-lg" style={{ color: 'var(--text)' }}>
                What's your experience level?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["Student", "Junior (0-2 years)", "Mid-level (3-5 years)", "Senior (6+ years)", "Tech Lead", "Founder/CEO"].map((t) => (
                  <button key={t} className="btn btn-outline p-4 text-center">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="mb-6 text-lg" style={{ color: 'var(--text)' }}>
                When are you available for networking?
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="card p-6">
                  <p className="font-semibold mb-4" style={{ color: 'var(--text)' }}>
                    Preferred Days
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((t) => (
                      <button key={t} className="btn btn-outline text-sm">
                        {t.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="card p-6">
                  <p className="font-semibold mb-4" style={{ color: 'var(--text)' }}>
                    Preferred Times
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Morning", "Afternoon", "Evening", "Flexible"].map((t) => (
                      <button key={t} className="btn btn-outline text-sm">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <div className="flex justify-between items-center">
          <button 
            onClick={back} 
            className="btn btn-secondary"
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.5 : 1 }}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button onClick={next} className="btn btn-primary">
              Next Step
            </button>
          ) : (
            <button className="btn btn-primary">
              🚀 Complete Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


