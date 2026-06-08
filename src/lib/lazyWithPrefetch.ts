import { lazy, type ComponentType } from "react";

export interface PrefetchableComponent<T extends object = object>
  extends React.LazyExoticComponent<ComponentType<T>> {
  prefetch: () => void;
}

/**
 * Wraps React.lazy with a `.prefetch()` method.
 * Calling `.prefetch()` fires the dynamic import in the background without rendering
 * the component — so the chunk is already cached when the user navigates.
 *
 * Usage:
 *   const Home = lazyWithPrefetch(() => import("@/pages/Home"));
 *   // On hover: Home.prefetch()
 */
export function lazyWithPrefetch<T extends object = object>(
  factory: () => Promise<{ default: ComponentType<T> }>
): PrefetchableComponent<T> {
  const Component = lazy(factory) as PrefetchableComponent<T>;
  Component.prefetch = () => {
    try {
      factory();
    } catch {
      // fire-and-forget — prefetch failures are silently ignored
    }
  };
  return Component;
}
