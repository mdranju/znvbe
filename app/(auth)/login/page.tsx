"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "@/src/store/slices/authSlice";
import { RootState, AppDispatch } from "@/src/store/store";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { Eye, EyeOff, Smartphone, AlertCircle } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(""); // Email or Phone
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      toast.error("Login Failed", {
        description: error,
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { identifier?: string; password?: string } = {};
    if (!identifier) errors.identifier = "Identification is required";
    if (!password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const resultAction = await dispatch(login({ identifier, password }));
    if (login.fulfilled.match(resultAction)) {
      toast.success("Welcome Back! 👋", {
        description: "You have successfully logged into your account.",
      });
      router.push("/");
    }
  };

  const handleInputChange = (
    field: "identifier" | "password",
    value: string,
  ) => {
    if (field === "identifier") setIdentifier(value);
    else setPassword(value);

    // Clear specific error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden bg-[#F8FAFC]">
      {/* Soft Ambient Glow Elements */}
      <div className="absolute top-0 right-0 w-[1000px] h-[700px] bg-blue-500/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-16 relative z-10">
        {/* Left Side: Brand Visual */}
        <div className="hidden md:block w-1/2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[3rem] blur-xl opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-black/5 shadow-2xl">
              <Image
                src="/login.png"
                alt="Avlora Wear Authentication"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 p-8">
                <p className="text-blue-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4">
                  User Login
                </p>
                <h2 className="hero-display text-[#0B1221] text-5xl mb-2">
                  Welcome to <br /> Avlora Wear.
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Light Form */}
        <div className="w-full md:w-1/2 max-w-md">
          <div className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-black/5 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] backdrop-blur-3xl">
            <div className="text-center mb-10">
              <p className="text-blue-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4">
                Welcome Back
              </p>
              <h1 className="hero-display text-[#0B1221] text-4xl mb-3 tracking-tighter">
                Login to Account.
              </h1>
              <p className="text-[#0B1221]/40 text-sm font-medium">
                New to the collection?{" "}
                <Link
                  href="/signup"
                  className="text-blue-600 hover:text-blue-700 font-bold underline-offset-4 hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>

            <div className="relative mb-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-black/5"></div>
              <span className="text-[9px] uppercase tracking-[0.4em] text-black/20 font-black">
                Secure Access
              </span>
              <div className="h-px flex-1 bg-black/5"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group space-y-1.5 overflow-hidden">
                <label
                  className={`text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${validationErrors.identifier ? "text-red-500" : "text-[#0B1221]/40 group-focus-within:text-blue-600"}`}
                >
                  Mobile Number / Email
                </label>
                <div
                  className={`flex items-center bg-gray-50 border rounded-2xl px-5 py-4 transition-all duration-300 ${validationErrors.identifier ? "border-red-500 bg-red-50/20" : "border-black/5 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-blue-500/5"}`}
                >
                  <input
                    type="text"
                    placeholder="017XXXXXXXX / name@example.com"
                    className="w-full bg-transparent outline-none text-[#0B1221] text-sm placeholder:text-[#0B1221]/20 font-medium"
                    value={identifier}
                    onChange={(e) =>
                      handleInputChange("identifier", e.target.value)
                    }
                    disabled={isLoading}
                  />
                  {validationErrors.identifier ? (
                    <AlertCircle
                      size={18}
                      className="text-red-500 transition-colors"
                    />
                  ) : (
                    <Smartphone
                      size={18}
                      className="text-black/10 group-focus-within:text-blue-600/30 transition-colors"
                    />
                  )}
                </div>
                <AnimatePresence>
                  {validationErrors.identifier && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-[9px] font-bold uppercase tracking-widest ml-5 mt-1"
                    >
                      {validationErrors.identifier}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="group space-y-1.5 overflow-hidden">
                <div className="flex justify-between items-center px-4">
                  <label
                    className={`text-[10px] font-black uppercase tracking-widest transition-colors ${validationErrors.password ? "text-red-500" : "text-[#0B1221]/40 group-focus-within:text-blue-600"}`}
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[9px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div
                  className={`flex items-center bg-gray-50 border rounded-2xl px-5 py-4 transition-all duration-300 ${validationErrors.password ? "border-red-500 bg-red-50/20" : "border-black/5 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-blue-500/5"}`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="******"
                    className="w-full bg-transparent outline-none text-[#0B1221] text-sm placeholder:text-[#0B1221]/20 font-medium tracking-widest"
                    value={password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-black/10 hover:text-[#0B1221] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <AnimatePresence>
                  {validationErrors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-[9px] font-bold uppercase tracking-widest ml-5 mt-1"
                    >
                      {validationErrors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0B1221] text-white h-16 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/10 active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Initiate Login"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
