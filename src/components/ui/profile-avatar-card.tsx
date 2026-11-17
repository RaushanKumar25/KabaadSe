"use client";

import React, { useRef, useState } from "react";
import { Camera, Upload, Trash2 } from "lucide-react";

export interface ProfileAvatarCardProps {
  name: string;
  subCaption?: string;
  photoUrl?: string | null;
  onPhotoUpload: (file: File) => void;
  onPhotoRemove?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function ProfileAvatarCard({
  name,
  subCaption = "Personal Account",
  photoUrl,
  onPhotoUpload,
  onPhotoRemove,
  isLoading = false,
  className = "",
}: ProfileAvatarCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onPhotoUpload(e.dataTransfer.files[0]);
    }
  };

  const initial = name ? name.trim().charAt(0).toUpperCase() : "U";

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm p-6 sm:p-7 flex flex-col items-center text-center transition-all ${
        dragActive ? "border-emerald-500 ring-2 ring-emerald-500/20" : ""
      } ${className}`}
    >
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Avatar Container with Overlapping Bottom-Right Camera Button */}
      <div className="relative mb-3.5">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-1 ring-black/5 dark:ring-white/10 shadow-xs flex items-center justify-center cursor-pointer select-none group"
          title="Click to choose a photo"
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="w-full h-full object-cover transition duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-2xl sm:text-3xl font-semibold">
              {initial}
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center text-white">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Tiny camera button overlapping bottom-right corner */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 shadow-sm flex items-center justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition"
          aria-label="Upload photo"
          title="Upload photo"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Typography: Plus Jakarta Sans font, standard text */}
      <div className="space-y-0.5 mb-2">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
          {name}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
          {subCaption}
        </p>
      </div>

      {/* Helper text */}
      <span className="text-[11px] text-zinc-400 dark:text-zinc-500 block mb-3.5">
        JPG, PNG or GIF. Max 5MB.
      </span>

      {/* Standard Actions Row: Minimal, clean, natural */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/90 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 text-xs font-medium text-zinc-700 dark:text-zinc-200 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <span>{photoUrl ? "Change Photo" : "Upload Photo"}</span>
        </button>

        {photoUrl && onPhotoRemove && (
          <button
            type="button"
            onClick={onPhotoRemove}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer flex items-center gap-1"
            title="Remove photo"
          >
            <Trash2 className="w-3 h-3" />
            <span>Remove</span>
          </button>
        )}
      </div>
    </div>
  );
}

