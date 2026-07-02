import { logout } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        className="h-10 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.08]"
        type="submit"
      >
        Log out
      </button>
    </form>
  );
}
