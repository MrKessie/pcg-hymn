// src/utils/helpers.js
export const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const formatFileSize = (bytes) => {
  if (!bytes) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

export const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const getFirstVerse = (lyrics) => {
  if (!lyrics) return "";
  const lines = lyrics.split("\n").filter((line) => line.trim() !== "");
  const startIndex = lines[0]?.toLowerCase().includes("verse") ? 1 : 0;
  return lines.slice(startIndex, startIndex + 2).join("\n");
};
