/**
 * After a deploy, an open tab may request route chunks whose hashed file names
 * no longer exist. Reloading once picks up the new index.html and chunk names.
 *
 * To prevent reload loops when the failure persists (blocked chunk, flaky network, slow loads),
 * the page reloads at most once per build per browser session: sessionStorage remembers the build
 * that already reloaded. The build is identified by this module's own URL, which in production is
 * the hashed entry chunk (index-<hash>.js); its hash changes whenever any chunk name changes.
 */
const STORAGE_KEY = 'stella-maris-chunk-reload';
const BUILD_ID = import.meta.url;

const CHUNK_ERROR_PATTERN =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Unable to preload CSS|ChunkLoadError/i;

export const isChunkLoadError = (error: unknown): boolean => {
  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  return CHUNK_ERROR_PATTERN.test(message);
};

/** Reload the page unless this build already did so in this session. Returns true if reloading. */
export const reloadOnceForStaleChunk = (): boolean => {
  try {
    if (window.sessionStorage.getItem(STORAGE_KEY) === BUILD_ID) return false;
    window.sessionStorage.setItem(STORAGE_KEY, BUILD_ID);
  } catch {
    // Without sessionStorage we cannot guard against loops, so don't auto-reload.
    return false;
  }
  window.location.reload();
  return true;
};
