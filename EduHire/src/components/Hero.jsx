import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import { motion } from 'framer-motion';
import Button from './ui/Button';

// 3D Graduation Hat Component
const GraduationHat = () => {
  return (
    <group>
      <Box args={[2, 0.2, 2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#2C5F34" />
      </Box>
      <Box args={[1.5, 0.8, 1.5]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#2C5F34" />
      </Box>
      <Box args={[0.1, 1, 0.1]} position={[0.8, 0.4, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Box>
      <Box args={[0.2, 0.2, 0.2]} position={[0.8, -0.1, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Box>
    </group>
  );
};

const Hero = ({ onGetStarted }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-left lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-green leading-tight"
            >
              EduHire
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-700 max-w-xl leading-relaxed"
            >
              Where Students Meet Opportunities. Build. Upload. Get Hired.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button onClick={onGetStarted} size="lg">Get Started</Button>
                <button onClick={() => onGetStarted && onGetStarted('learn')} className="px-6 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 hover:shadow-md transition">Learn More</button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - 3D Model */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-80 md:h-96 lg:h-[500px] w-full rounded-xl overflow-hidden"
          >
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, -10, -5]} intensity={0.5} />

              <Suspense fallback={null}>
                <GraduationHat />
              </Suspense>

              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={2}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
              />
            </Canvas>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;