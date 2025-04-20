import { loginAction } from "./actions";

export const dynamic = "force-static";

interface Props {
  params: { adminPath: string };
  searchParams: { err?: string };
}

export default function LoginPage({ params, searchParams }: Props) {
  const { adminPath } = params;

  return (
    <form
      action={loginAction}
      className="mx-auto mt-20 max-w-sm space-y-4 p-6 bg-charcoal/90 rounded-xl"
    >
      <input type="hidden" name="adminPath" value={adminPath} />

      <h1 className="text-center text-2xl font-header text-silver-light">
        Provider&nbsp;Login
      </h1>

      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full rounded bg-silver-light/10 p-2 text-charcoal"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="w-full rounded bg-silver-light/10 p-2 text-charcoal"
        required
      />
      <input
        name="key"
        placeholder="Passkey"
        className="w-full rounded bg-silver-light/10 p-2 text-charcoal"
        required
      />

      <button className="w-full rounded bg-chalk-red py-2 text-silver-light">
        Sign&nbsp;in
      </button>

      {searchParams.err && (
        <p className="text-center text-red-500 text-sm">
          Invalid&nbsp;credentials
        </p>
      )}
    </form>
  );
}
