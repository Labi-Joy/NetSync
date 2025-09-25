'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Don't render anything during SSR
  }

  // Generate predetermined positions to avoid hydration issues
  const particlePositions = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: (i * 23.7 + 12) % 100, // Pseudo-random but deterministic
    top: (i * 47.3 + 25) % 100,
    xOffset: (i * 13) % 40 - 20,
    duration: 4 + (i % 3),
    delay: (i * 0.5) % 3,
  }));

  const orbPositions = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: (i * 31.4 + 15) % 100,
    top: (i * 41.7 + 20) % 100,
    duration: 8 + (i % 4),
    delay: (i * 0.8) % 4,
    xOffset: (i * 11) % 30 - 15,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Floating Particles with Network Connections */}
      {particlePositions.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            filter: 'blur(0.5px)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.xOffset, 0],
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}

      {/* Large Gradient Orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Smaller Geometric Shapes */}
      {orbPositions.map((orb) => (
        <motion.div
          key={`orb-${orb.id}`}
          className={`absolute ${
            orb.id % 3 === 0 ? 'w-4 h-4 rounded-full bg-gradient-to-r from-blue-400/40 to-purple-500/40' :
            orb.id % 3 === 1 ? 'w-3 h-3 rounded-sm rotate-45 bg-gradient-to-r from-blue-400/40 to-purple-500/40' :
            'w-2 h-6 rounded-full bg-gradient-to-r from-blue-400/40 to-purple-500/40'
          }`}
          style={{
            left: `${orb.left}%`,
            top: `${orb.top}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, orb.xOffset, 0],
            rotate: orb.id % 3 === 1 ? [0, 180, 360] : [0, 0, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}