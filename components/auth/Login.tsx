"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Layout from "../Layout";

// Define the form schema for login using Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least 1 uppercase letter" })
    .regex(/[0-9!@#$%^&*]/, { message: "Password must contain at least 1 number or special character" }),
});

// Define the form schema for forgot password using Zod
const resetPasswordSchema = z.object({
  resetEmail: z.string().email({ message: "Please enter a valid email address" }),
});

// Define types for state
interface LoginState {
  error: string;
  loading: boolean;
  isResetModalOpen: boolean;
}

const Login: React.FC = () => {
  const router = useRouter();
  const [state, setState] = useState<LoginState>({
    error: "",
    loading: false,
    isResetModalOpen: false,
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const { error, loading, isResetModalOpen } = state;

  // Initialize the login form with react-hook-form and zod
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Initialize the reset password form with react-hook-form and zod
  const resetForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      resetEmail: "",
    },
  });

  // Detect theme changes by observing the `dark` class on the <html> element
  useEffect(() => {
    const root = document.documentElement;
    setIsDarkMode(root.classList.contains("dark"));

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          setIsDarkMode(root.classList.contains("dark"));
        }
      });
    });

    observer.observe(root, { attributes: true });

    return () => observer.disconnect();
  }, []);

  // Detect mobile device
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    setIsMobile(isMobileDevice);
  }, []);

  // Handle redirect result after signInWithRedirect
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          router.push("/"); // Redirect to homepage after successful login
        }
      } catch (err: unknown) {
        setState((prev) => ({
          ...prev,
          error: "Failed to sign in with Google. Please try again.",
          loading: false,
        }));
        console.error("Google redirect error:", err);
      }
    };

    handleRedirectResult();
  }, [router]);

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setState((prev) => ({ ...prev, error: "", loading: true }));
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push("/");
    } catch (err: unknown) {
      setState((prev) => ({
        ...prev,
        error: "Invalid email or password. Please try again.",
        loading: false,
      }));
      console.error("Login error:", err);
    }
  };

  const handleGoogleLogin = async () => {
    setState((prev) => ({ ...prev, error: "", loading: true }));
    try {
      if (isMobile) {
        // Use signInWithRedirect for mobile devices
        await signInWithRedirect(auth, googleProvider);
      } else {
        // Use signInWithPopup for desktop devices
        await signInWithPopup(auth, googleProvider);
        router.push("/"); // Redirect immediately after popup login
      }
    } catch (err: unknown) {
      setState((prev) => ({
        ...prev,
        error: "Failed to sign in with Google. Please try again.",
        loading: false,
      }));
      console.error("Google login error:", err);
    }
  };

  const handleForgotPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
    setState((prev) => ({ ...prev, error: "", loading: true }));
    try {
      await sendPasswordResetEmail(auth, values.resetEmail);
      setState((prev) => ({
        ...prev,
        error: "",
        loading: false,
      }));
      resetForm.setError("resetEmail", {
        type: "manual",
        message: "Password reset email sent! Check your inbox.",
      });
    } catch (err: unknown) {
      setState((prev) => ({
        ...prev,
        error: "Failed to send reset email. Please try again.",
        loading: false,
      }));
      console.error("Password reset error:", err);
    }
  };

  return (
    <Layout>
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-background text-foreground overflow-hidden">
        {/* Left Side: Login Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full md:w-1/2 flex items-center justify-center p-6 "
        >
          <div className="max-w-sm w-full p-6">
            <h1 className="text-2xl font-bold mb-2 text-black dark:text-white">
              Welcome Back 🖐️
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Hey login now and access bunch of free stuff to excel your exams .
            </p>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black dark:text-white">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Example@email.com"
                          className="w-full "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black dark:text-white">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="At least 8 characters"
                          className="w-full "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setState((prev) => ({ ...prev, isResetModalOpen: true }))}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
              <span className="mx-4 text-gray-500 dark:text-gray-400">Or</span>
              <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
            </div>
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full  hover:bg-gray-500 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                 <FcGoogle className="w-4 h-4" /> Sign in with Google
                </>
              )}
            </Button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Don’t you have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>

   
     {/* Right Side: Image */}
     <motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  className="hidden md:block w-1/2 h-screen relative p-10"
>
  <div className="relative w-full h-full rounded-3xl overflow-hidden">
    <AnimatePresence mode="wait">
      <motion.div
        key={isDarkMode ? "dark" : "light"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <Image
          src={
            isDarkMode
              ? "https://images.unsplash.com/photo-1558929639-4313d40b1a49?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              : "https://images.unsplash.com/photo-1663331324037-3f9acdc26ff5?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt="Decorative image"
          fill
          style={{ objectFit: "cover" }}
          className="absolute inset-0 rounded-3xl"
        />
        {/* Text Section with Glassmorphism */}
        <div className="absolute top-1/2 left-10 transform -translate-y-1/2 w-3/4 max-w-md">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <h2 className="text-4xl font-bold text-white mb-2">
              Unlock Your Path to Success
            </h2>
            <p className="text-base text-white">
              Login to access 50+ PYQs for free and excel in your exams today!
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
</motion.div>

        {/* Forgot Password Modal */}
        <Transition show={isResetModalOpen}>
          <Dialog onClose={() => setState((prev) => ({ ...prev, isResetModalOpen: false }))} className="relative z-50">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            </Transition.Child>

            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-lg shadow-lg p-6 max-w-sm w-full">
                <DialogTitle className="text-lg font-semibold mb-4">
                  Reset Password
                </DialogTitle>
                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                    <FormField
                      control={resetForm.control}
                      name="resetEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                        </>
                      ) : (
                          "Send Reset Email"
                      )}
                    </Button>
                  </form>
                </Form>
              </DialogPanel>
            </Transition.Child>
          </Dialog>
        </Transition>
      </section>
    </Layout>
  );
};

export default Login;