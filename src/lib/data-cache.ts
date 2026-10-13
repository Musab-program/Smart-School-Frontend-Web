// src/lib/data-cache.ts
// Local cache layer for teacher/specialty data.
// Uses localStorage for persistence, syncs with backend on CRUD operations.

const CACHE_PREFIX = "smart_school_cache_";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// ─── Generic Cache Helpers ───

function getCacheEntry<T>(key: string): CacheEntry<T> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry<T>;
  } catch {
    return null;
  }
}

function setCacheEntry<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // Silently fail (e.g., storage full)
  }
}

function isCacheValid<T>(entry: CacheEntry<T> | null): entry is CacheEntry<T> {
  if (!entry) return false;
  return Date.now() - entry.timestamp < CACHE_TTL_MS;
}

// ─── Public API ───

/**
 * Get cached data if available and not expired.
 * Returns null if cache is stale or missing.
 */
export function getCachedData<T>(key: string): T | null {
  const entry = getCacheEntry<T>(key);
  return isCacheValid(entry) ? entry.data : null;
}

/**
 * Store data in the cache.
 */
export function setCachedData<T>(key: string, data: T): void {
  setCacheEntry(key, data);
}

/**
 * Invalidate (remove) a specific cache entry.
 * Call this after add/update/delete operations to force a fresh fetch.
 */
export function invalidateCache(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CACHE_PREFIX + key);
}

/**
 * Invalidate all cache entries.
 */
export function invalidateAllCache(): void {
  if (typeof window === "undefined") return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

// ─── Cache Keys ───
export const CACHE_KEYS = {
  TEACHERS: "teachers",
  SPECIALTIES: "specialties",
  TEACHER_ANALYTICS: "teacher_analytics",
  SPECIALTY_ANALYTICS: "specialty_analytics_page",
  GUARDIANS: "guardians",
  RELATION_TYPES: "relation_types",
  GRADES: "grades",
  GROUPS: "groups",
  STUDENTS: "students",
  USERS: "users",
  ROLES: "roles",
  SUBJECTS: "subjects",
  SUBJECT_DETAILS: "subject_details",
  TEACHING_SUBJECTS: "teaching_subjects",
  EXAMS: "exams",
  EXAM_TYPES: "exam_types",
  RESULTS: "results",
  ASSIGNMENTS: "assignments",
  SUBMITTED_ASSIGNMENTS: "submitted_assignments",
  TIMETABLES: "timetables",
  STUDENT_ATTENDANCE: "student_attendance",
} as const;
