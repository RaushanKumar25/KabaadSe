"use client";

import React, { useRef } from "react";
import { Camera, Trash2 } from "lucide-react";

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
  photoUrl,
  onPhotoUpload,
  onPhotoRemove,
  isLoading = false,
  className = "",
}: ProfileAvatarCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoUpload(file);
    }
  };

  const initial = name ? name.trim().charAt(0).toUpperCase() : "U";

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Normal Circular Avatar */}
      <div className="relative group">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white dark:bg-zinc-800 ring-2 ring-emerald-500/20 dark:ring-emerald-400/20 shadow-md flex items-center justify-center cursor-pointer select-none transition-transform hover:scale-105"
          title="Click to update profile photo"
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-2xl sm:text-3xl font-bold">
              {initial}
            </div>
          )}

          {/* Hover Overlay with Camera Icon */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
            <Camera className="w-6 h-6 drop-shadow" />
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center text-white">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Camera Action Button Overlapping Bottom-Right Corner */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 shadow-sm flex items-center justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition hover:scale-110 active:scale-95"
          aria-label="Upload photo"
          title="Upload photo"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Discreet Remove Button if photo is uploaded */}
        {photoUrl && onPhotoRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPhotoRemove();
            }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 shadow-xs flex items-center justify-center cursor-pointer transition opacity-0 group-hover:opacity-100"
            title="Remove photo"
            aria-label="Remove photo"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfileAvatarCard;
