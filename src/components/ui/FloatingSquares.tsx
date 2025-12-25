import { motion } from "framer-motion";

export function FloatingSquares() {
  const squares = [
    { size: 24, top: "15%", left: "8%", duration: 6, delay: 0, rotate: 180 },
    { size: 16, top: "25%", right: "12%", duration: 8, delay: 1, rotate: -180 },
    { size: 20, bottom: "30%", left: "15%", duration: 7, delay: 0.5, rotate: 90 },
    { size: 12, top: "60%", right: "8%", duration: 9, delay: 2, rotate: -90 },
    { size: 18, bottom: "20%", right: "20%", duration: 6.5, delay: 1.5, rotate: 180 },
    { size: 14, top: "40%", left: "5%", duration: 7.5, delay: 0.8, rotate: -180 },
  ];

  return (
    <>
      {squares.map((sq, i) => (
        <motion.div
          key={i}
          className="absolute rounded-md bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/30 backdrop-blur-sm pointer-events-none"
          style={{
            width: sq.size,
            height: sq.size,
            top: sq.top,
            bottom: sq.bottom,
            left: sq.left,
            right: sq.right,
          }}
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0],
            rotate: [0, sq.rotate, 0],
          }}
          transition={{
            duration: sq.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: sq.delay,
          }}
        />
      ))}
    </>
  );
}
