"use client";

import { useTransition } from "react";
import { toast } from "sonner";

/**
 * Drop-in replacement for a plain `<form action={serverAction}>` for
 * forms whose action does NOT call redirect() on success (add/update
 * forms that stay on the same page — profile, settings, philosophy,
 * metrics, social links, skills, gallery). It calls the action
 * manually so it can catch a thrown Error and show it as a Sonner
 * toast instead of letting it bubble to the nearest error boundary,
 * and shows a success toast when the action resolves without
 * throwing. The action's signature and behavior are unchanged.
 *
 * Deliberately NOT used for actions that call redirect() on success
 * (createProject, updateProject, createExperience, updateExperience,
 * deleteProject, deleteExperience) — invoking those manually here
 * instead of through the form's native `action` prop risks breaking
 * Next's built-in redirect handling for server actions. Those keep
 * their existing `<form action={fn}>` usage and rely on the
 * `/admin/dashboard/error.tsx` boundary for error display.
 */
export function CmsForm({
  action,
  successMessage = "Saved.",
  className,
  resetOnSuccess = true,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  successMessage?: string;
  className?: string;
  resetOnSuccess?: boolean;
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      try {
        await action(formData);
        toast.success(successMessage);
        if (resetOnSuccess) form.reset();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {/* display: contents keeps the fieldset invisible to CSS grid/flex
          layout on the form's children, while still letting `disabled`
          gray out every input during submission. */}
      <fieldset disabled={isPending} style={{ display: "contents" }}>
        {children}
      </fieldset>
    </form>
  );
}
