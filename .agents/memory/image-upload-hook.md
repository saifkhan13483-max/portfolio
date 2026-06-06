---
name: Image upload hook pattern
description: useImageUpload returns both the mutation and a handleFileChange helper — callers should use the helper, not mutateAsync directly.
---

## Rule
Use `imageUpload.handleFileChange(e, onSuccess)` in admin file inputs.
Do NOT write inline `handleFileUpload` functions or import `validateImageFile` in page components.

**Why:** The pattern was duplicated identically in Projects.tsx and Services.tsx. Centralising it in `use-image-upload.ts` ensures validation, error toasting, and success toasting are consistent and only change in one place.

**How to apply:** Any admin page with a `<input type="file">` should call `useImageUpload()` and use `handleFileChange`. The hook owns: file validation, upload call, error toast (via `onError`), and success toast. The caller only supplies the `onSuccess` callback to update local form state.
