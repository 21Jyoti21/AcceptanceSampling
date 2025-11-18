import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function Background() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 bg-blue-950 overflow-hidden">
      {/* 🔹 Animated grid overlay */}
      <div className="absolute inset-0 bg-grid animate-sweep"></div>

      {/* 🔹 Particles for flowing dots */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
            },
            modes: { repulse: { distance: 80 } },
          },
          particles: {
            color: { value: "#00bfff" },
            links: { enable: false },
            move: { enable: true, speed: 0.5 },
            size: { value: { min: 1, max: 2 } },
            opacity: { value: 0.6 },
          },
        }}
      />
    </div>
  );
}
