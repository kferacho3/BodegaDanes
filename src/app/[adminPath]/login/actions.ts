import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  "use server";

  const ok =
    formData.get("email")    === process.env.ADMIN_EMAIL &&
    formData.get("password") === process.env.ADMIN_PASSWORD &&
    formData.get("key")      === process.env.ADMIN_PASSKEY;

  const adminPath = formData.get("adminPath") as string;

  if (ok) {
    // Await here so .set() is available
    const cookieStore = await cookies();
    cookieStore.set("bd_admin", "true", {
      httpOnly : true,
      secure   : process.env.NODE_ENV === "production",
      sameSite : "lax",
      path     : "/",
    });
    redirect(`/${adminPath}`);
  }

  redirect(`/${adminPath}/login?err=1`);
}
