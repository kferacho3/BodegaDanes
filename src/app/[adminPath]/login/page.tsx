import { loginAction } from './actions';

/** This page must run per-request so the “?err=1” flag is reactive */
// This ensures the page is rendered dynamically on each request,
// allowing the error message to be shown based on the search parameter.
export const dynamic = 'force-dynamic';

// Props for the LoginPage component, including dynamic route params and search params.
export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ adminPath: string }>;
  searchParams: Promise<{ err?: string }>;
}) {
  /* 🔸  Resolve the Promises that Next passes in  */
  // Destructure and await the promises for adminPath and err search parameter.
  const { adminPath } = await params;
  const { err }       = await searchParams;

  return (
    // The form element that will trigger the server action on submission.
    // The 'action' attribute points to the loginAction server function.
    <form action={loginAction} className="flex flex-col items-center gap-4 p-4 max-w-sm mx-auto bg-white rounded-lg shadow-md">
      {/* Hidden input to pass the dynamic adminPath to the server action */}
      <input type="hidden" name="adminPath" value={adminPath} />

      <h1 className="text-center text-2xl font-header text-silver-light">
        Provider&nbsp;Login
      </h1>

      {/* Email input field */}
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full rounded bg-silver-light/10 p-2 text-charcoal border border-gray-300 focus:outline-none focus:ring-2 focus:ring-chalk-red"
        required
      />
      {/* Password input field */}
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="w-full rounded bg-silver-light/10 p-2 text-charcoal border border-gray-300 focus:outline-none focus:ring-2 focus:ring-chalk-red"
        required
      />
      {/* Passkey input field */}
      <input
        name="key"
        placeholder="Passkey"
        className="w-full rounded bg-silver-light/10 p-2 text-charcoal border border-gray-300 focus:outline-none focus:ring-2 focus:ring-chalk-red"
        required
      />

      {/* Submit button for the form */}
      <button
        type="submit" // Explicitly set type to submit
        className="w-full rounded bg-chalk-red py-2 text-silver-light font-semibold hover:bg-chalk-red/90 transition duration-200"
      >
        Sign&nbsp;in
      </button>

      {/* Display error message if 'err' search parameter is present */}
      {err && (
        <p className="text-center text-red-500 text-sm">
          Invalid&nbsp;credentials
        </p>
      )}
    </form>
  );
}
