import axios from "axios";
import type { UseFormSetError, FieldValues } from "react-hook-form";

// Shared by the public registration form and the admin Add/Edit Member
// forms (all three render <MemberFormFields>, whose inputs/selects use
// `id={fieldName}` matching the Zod/react-hook-form field names 1:1) so a
// validation failure — client-side or from the server — scrolls the invalid
// field into view and focuses it instead of leaving the admin to hunt for
// which field an error banner is talking about.
export function scrollToField(fieldName: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(fieldName) as HTMLElement | null;
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  // Focus after the smooth scroll has a frame to start, so the browser
  // doesn't jump-cancel the scroll to satisfy the focus first.
  window.requestAnimationFrame(() => el.focus({ preventScroll: true }));
}

export function scrollToFirstErrorField(errors: Record<string, unknown>) {
  const firstField = Object.keys(errors)[0];
  if (firstField) scrollToField(firstField);
}

// Backend field-level errors (e.g. a duplicate GCC/working-country number)
// arrive as `{ message, errors: [{ field, message }] }` — the same shape the
// Zod `validate` middleware and the Mongoose ValidationError branch both
// produce. When present, push them into react-hook-form so the field shows
// its own inline message (not just the top banner) and scroll/focus the
// first one. Returns whether any field error was found and applied.
export function applyServerFieldErrors<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>
): boolean {
  if (!axios.isAxiosError(error)) return false;

  const data = error.response?.data as { errors?: { field: string; message: string }[] } | undefined;
  const fieldErrors = (data?.errors ?? []).filter((e) => e.field);
  if (!fieldErrors.length) return false;

  fieldErrors.forEach(({ field, message }) => {
    setError(field as never, { type: "server", message });
  });
  scrollToField(fieldErrors[0]!.field);
  return true;
}
