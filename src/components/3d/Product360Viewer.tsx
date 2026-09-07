"use client";

import { useState, useEffect, useRef, MouseEvent, TouchEvent } from "react";
import Image from "next/image";
import { RotateCw, MoveHorizontal, Play, Pause, RefreshCw } from "lucide-react";

interface Product360ViewerProps {
  images?: string[];
  productName?: string;
}

export default function Product360Viewer({ images = [], productName = "Product" }: Product360ViewerProps) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);

  // Fallback image source if images array is empty
  const primaryImage = images && images.length > 0 ? images[0] : "/placeholder.png";

  // Auto-Spin 360 Effect
  useEffect(() => {
    let animationFrame: number;
    if (isPlaying && !isDragging) {
      const spin = () => {
        setRotationAngle((prev) => (prev + 1.5) % 360);
        animationFrame = requestAnimationFrame(spin);
      };
      animationFrame = requestAnimationFrame(spin);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, isDragging]);

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setIsPlaying(false);
    startXRef.current = e.clientX;
    startAngleRef.current = rotationAngle;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    const newAngle = (startAngleRef.current + deltaX * 1.2) % 360;
    setRotationAngle(newAngle < 0 ? newAngle + 360 : newAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
    setIsPlaying(false);
    startXRef.current = e.touches[0].clientX;
    startAngleRef.current = rotationAngle;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    const newAngle = (startAngleRef.current + deltaX * 1.2) % 360;
    setRotationAngle(newAngle < 0 ? newAngle + 360 : newAngle);
  };

  // If discrete multi-frame images are provided (more than 4 frames)
  const isMultiFrame = images && images.length >= 4;
  const frameIndex = isMultiFrame ? Math.floor((rotationAngle / 360) * images.length) % images.length : 0;
  const activeImage = isMultiFrame ? images[frameIndex] : primaryImage;

  return (
    <div
      className="relative w-full aspect-square bg-slate-100 dark:bg-zinc-900 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing select-none border border-zinc-200 dark:border-zinc-800 shadow-xl group perspective-1000"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* 360 Rotation Container */}
      <div
        className="w-full h-full flex items-center justify-center p-8 transition-transform duration-75 ease-out"
        style={{
          transform: isMultiFrame ? "none" : `rotateY(${rotationAngle}deg) scale(${1 + Math.sin((rotationAngle * Math.PI) / 180) * 0.05})`,
          transformStyle: "preserve-3d",
        }}
      >
        <Image
          src={activeImage}
          alt={`${productName} 360 Degree View`}
          fill
          className="object-contain p-8 drop-shadow-2xl"
          priority
        />
      </div>

      {/* Top 360 Live Badge */}
      <div className="absolute top-4 left-4 bg-zinc-900/90 dark:bg-white/90 text-white dark:text-zinc-950 text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md">
        <RotateCw className={`w-3.5 h-3.5 ${isPlaying ? "animate-spin text-amber-500" : ""}`} />
        <span>360° Interactive View</span>
      </div>

      {/* Auto Spin Toggle Controls */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-4 right-4 p-2.5 rounded-2xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-amber-500 hover:text-black transition-all shadow-md font-bold flex items-center gap-1 text-xs"
        title={isPlaying ? "Pause 360 Spin" : "Auto Spin 360°"}
      >
        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
        <span className="hidden sm:inline">{isPlaying ? "Pause" : "Auto Spin"}</span>
      </button>

      {/* Bottom Drag Instruction Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 shadow-xl whitespace-nowrap">
        <MoveHorizontal className="w-4 h-4 text-amber-500 animate-pulse" />
        <span>Drag horizontally to rotate 360° ({Math.round(rotationAngle)}°)</span>
        <button
          onClick={() => {
            setRotationAngle(0);
            setIsPlaying(false);
          }}
          className="ml-2 text-zinc-400 hover:text-amber-500"
          title="Reset Angle"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
