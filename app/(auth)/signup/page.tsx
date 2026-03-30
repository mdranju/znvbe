"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "@/src/store/slices/authSlice";
import { RootState, AppDispatch } from "@/src/store/store";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

type ValidationErrors = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
};

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      toast.error("Registration Failed", {
        description: error,
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, phone, password, confirmPassword } = formData;
    const errors: ValidationErrors = {};

    if (!name) errors.name = "Full name is required";
    if (!email) errors.email = "Email address is required";
    if (!phone) errors.phone = "Phone number is required";

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const resultAction = await dispatch(
      register({ name, email, phone, password }),
    );
    if (register.fulfilled.match(resultAction)) {
      toast.success("Account Created! ✅", {
        description: "Your account has been created successfully. Welcome!",
      });
      router.push("/");
    }
  };

  const renderError = (error?: string) => (
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-red-500 text-[9px] font-bold uppercase tracking-widest ml-4 mt-1"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );

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
                src="/signup.png"
                alt="Avlora Wear New Journey"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 p-8">
                <p className="text-blue-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4">
                  Join Us
                </p>
                <h2 className="hero-display text-[#0B1221] text-5xl mb-2">
                  Join <br /> Avlora Wear.
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Light Form */}
        <div className="w-full md:w-1/2 max-w-lg">
          <div className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-black/5 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] backdrop-blur-3xl">
            <div className="text-center mb-10">
              <p className="text-blue-600 text-[10px] font-black tracking-[0.3em] uppercase mb-4">
                Sign Up
              </p>
              <h1 className="hero-display text-[#0B1221] text-4xl mb-3 tracking-tighter">
                Create Account.
              </h1>
              <p className="text-[#0B1221]/40 text-sm font-medium">
                Already part of the community?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-bold underline-offset-4 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div className="group space-y-1.5 sm:col-span-2 overflow-hidden">
                <label
                  className={`text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${validationErrors.name ? "text-red-500" : "text-[#0B1221]/40 group-focus-within:text-blue-600"}`}
                >
                  Full Name
                </label>
                <div
                  className={`flex items-center bg-gray-50 border rounded-2xl px-5 py-4 transition-all duration-300 ${validationErrors.name ? "border-red-500 bg-red-50/20" : "border-black/5 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-blue-500/5"}`}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="w-full bg-transparent outline-none text-[#0B1221] text-sm placeholder:text-[#0B1221]/20 font-medium"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {validationErrors.name && (
                    <AlertCircle size={18} className="text-red-500" />
                  )}
                </div>
                {renderError(validationErrors.name)}
              </div>

              <div className="group space-y-1.5 overflow-hidden">
                <label
                  className={`text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${validationErrors.phone ? "text-red-500" : "text-[#0B1221]/40 group-focus-within:text-blue-600"}`}
                >
                  Mobile Number
                </label>
                <div
                  className={`flex items-center bg-gray-50 border rounded-2xl px-5 py-4 transition-all duration-300 ${validationErrors.phone ? "border-red-500 bg-red-50/20" : "border-black/5 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-blue-500/5"}`}
                >
                  <input
                    type="text"
                    name="phone"
                    placeholder="017XXXXXXXX"
                    className="w-full bg-transparent outline-none text-[#0B1221] text-sm placeholder:text-[#0B1221]/20 font-medium"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {validationErrors.phone && (
                    <AlertCircle size={18} className="text-red-500" />
                  )}
                </div>
                {renderError(validationErrors.phone)}
              </div>

              <div className="group space-y-1.5 overflow-hidden">
                <label
                  className={`text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${validationErrors.email ? "text-red-500" : "text-[#0B1221]/40 group-focus-within:text-blue-600"}`}
                >
                  Email Address
                </label>
                <div
                  className={`flex items-center bg-gray-50 border rounded-2xl px-5 py-4 transition-all duration-300 ${validationErrors.email ? "border-red-500 bg-red-50/20" : "border-black/5 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-blue-500/5"}`}
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className="w-full bg-transparent outline-none text-[#0B1221] text-sm placeholder:text-[#0B1221]/20 font-medium"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {validationErrors.email && (
                    <AlertCircle size={18} className="text-red-500" />
                  )}
                </div>
                {renderError(validationErrors.email)}
              </div>

              <div className="group space-y-1.5 overflow-hidden">
                <label
                  className={`text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${validationErrors.password ? "text-red-500" : "text-[#0B1221]/40 group-focus-within:text-blue-600"}`}
                >
                  Password
                </label>
                <div
                  className={`flex items-center bg-gray-50 border rounded-2xl px-5 py-4 transition-all duration-300 ${validationErrors.password ? "border-red-500 bg-red-50/20" : "border-black/5 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-blue-500/5"}`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="********"
                    className="w-full bg-transparent outline-none text-[#0B1221] text-sm placeholder:text-[#0B1221]/20 font-medium"
                    value={formData.password}
                    onChange={handleChange}
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
                {renderError(validationErrors.password)}
              </div>

              <div className="group space-y-1.5 overflow-hidden">
                <label
                  className={`text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${validationErrors.confirmPassword ? "text-red-500" : "text-[#0B1221]/40 group-focus-within:text-blue-600"}`}
                >
                  Confirm Password
                </label>
                <div
                  className={`flex items-center bg-gray-50 border rounded-2xl px-5 py-4 transition-all duration-300 ${validationErrors.confirmPassword ? "border-red-500 bg-red-50/20" : "border-black/5 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-blue-500/5"}`}
                >
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="********"
                    className="w-full bg-transparent outline-none text-[#0B1221] text-sm placeholder:text-[#0B1221]/20 font-medium"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-black/10 hover:text-[#0B1221] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {renderError(validationErrors.confirmPassword)}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="sm:col-span-2 w-full bg-[#0B1221] text-white h-16 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/10 active:scale-[0.98] mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
