import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 transition-colors flex flex-col items-center justify-center p-6">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 size-64 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 size-64 bg-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-pink-300/10 rounded-full blur-3xl" />
      </div>

      <main className="relative flex flex-col items-center gap-8 text-center max-w-2xl">
        {/* Logo */}
        <div className="size-24 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
          <Sparkles className="size-12 text-white" />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent sm:text-6xl">
            Luma
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed">
            Your sanctuary for inner reflection.
            <br />
            A safe space to understand your emotions and find clarity.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
          <Link
            href="/login"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-2xl bg-white/80 backdrop-blur border border-border text-foreground font-semibold hover:bg-white transition-all text-center"
          >
            Continue as Guest
          </Link>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </main>
    </div>
  );
}
