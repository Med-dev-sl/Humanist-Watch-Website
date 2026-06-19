import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-50 px-4 py-20">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <div className="mb-8 flex flex-col items-center gap-4">
            <Image
              src="/Huwasal%20Logo.png"
              alt="Humanist Watch Salone"
              width={72}
              height={72}
              className="h-16 w-16 object-contain"
              priority
            />
            <div className="text-center">
              <h1 className="text-xl font-semibold text-primary">Sign In</h1>
              <p className="mt-1 text-sm text-zinc-500">
                Welcome back to Humanist Watch Salone
              </p>
            </div>
          </div>

          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zinc-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary"
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-primary transition-colors hover:text-primary-light"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
