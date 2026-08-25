import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sortByOrder<T extends { order: number }>(data: T[]): T[] {
  return data.sort((prev, next) => prev.order - next.order) ?? [];
}

export function parseTags(tags: string) {
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}
