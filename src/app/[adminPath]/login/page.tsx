"use client";

import { useParams } from "next/navigation";

export const dynamic = "force-static";

export default function LoginPage() {
  const { adminPath } = useParams() as { adminPath: string };

  async function login(formData: FormData) {
    "use server";

    // dynamically import so this stays server‑only
    const { cookies }  = await import("next/headers");
    const { redirect } = await import("next/navigation");

    const ok =
      formData.get("email")    === process.env.ADMIN_EMAIL &&
      formData.get("password") === process.env.ADMIN_PASSWORD &&
      formData.get("key")      === process.env.ADMIN_PASSKEY;

    if (ok) {
      // 🔑 await cookies() so we get RequestCookies with .set()
      const cookieStore = await cookies();
      cookieStore.set("bd_admin", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      redirect(`/${adminPath}`);
    }

    redirect(`/${adminPath}/login?err=1`);
  }

  return (
    <form
      action={login}
      className="mx-auto mt-20 max-w-sm space-y-4 p-6 bg-charcoal/90 rounded-xl"
    >
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

      {typeof window !== "undefined" && window.location.search.includes("err") && (
        <p className="text-center text-red-500 text-sm">
          Invalid&nbsp;credentials
        </p>
      )}
    </form>
  );
}
