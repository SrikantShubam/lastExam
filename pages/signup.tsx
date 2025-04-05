"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Layout from "../components/Layout";

// Define the form schema for sign-up using Zod
const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least 1 uppercase letter" })
    .regex(/[0-9!@#$%^&*]/, { message: "Password must contain at least 1 number or special character" }),
});

interface SignupState {
  error: string;
  loading: boolean;
}

const Signup: React.FC = () => {
  const router = useRouter();
  const [state, setState] = useState<SignupState>({
    error: "",
    loading: false,
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const { error, loading } = state;

  // Initialize the sign-up form with react-hook-form and zod
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
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
          router.push("/"); // Redirect to homepage after successful sign-up
        }
      } catch (err: unknown) {
        setState((prev) => ({
          ...prev,
          error: "Failed to sign up with Google. Please try again.",
          loading: false,
        }));
        console.error("Google redirect error:", err);
      }
    };

    handleRedirectResult();
  }, [router]);

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setState((prev) => ({ ...prev, error: "", loading: true }));
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      // Update the user's display name
      await updateProfile(userCredential.user, { displayName: values.name });
      // Optionally store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: values.name,
        email: values.email,
        createdAt: new Date().toISOString(),
      });
      router.push("/");
    } catch (err: unknown) {
      setState((prev) => ({
        ...prev,
        error: "Failed to create account. Please try again.",
        loading: false,
      }));
      console.error("Signup error:", err);
    }
  };

  const handleGoogleSignup = async () => {
    setState((prev) => ({ ...prev, error: "", loading: true }));
    try {
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
        router.push("/");
      }
    } catch (err: unknown) {
      setState((prev) => ({
        ...prev,
        error: "Failed to sign up with Google. Please try again.",
        loading: false,
      }));
      console.error("Google signup error:", err);
    }
  };

  return (
    <Layout>
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-background text-foreground overflow-hidden">
        {/* Left Side: Testimonial Section - Hidden on tablet and mobile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full md:w-1/2 h-screen relative p-10 lg:block hidden"
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
                      ? "https://images.unsplash.com/photo-1736942145358-ff047387450b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      : "https://images.unsplash.com/photo-1604782206219-3b9576575203?q=80&w=1994&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  alt="Background image"
                  fill
                  style={{ objectFit: "cover" }}
                  className="absolute inset-0 rounded-3xl"
                />
                <div className="absolute top-1/2 left-10 transform -translate-y-1/2 w-3/4 max-w-md">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
                    <blockquote className="text-3xl font-semibold text-white mb-6">
                      "ExamRepo made my exam prep so much easier, I aced my last test !"
                    </blockquote>
                    <p className="text-gray-300">
                      u/SwimmingFloat, NEET Aspirant
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Side: Sign-Up Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex items-center justify-center p-6 "
        >
          <div className="max-w-sm w-full p-6">
            <h1 className="text-2xl font-bold mb-2 text-black dark:text-white">
              Create an account
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Join ExamRepo and start your exam preparation journey.
            </p>
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black dark:text-white">Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your name"
                          className="w-full  text-black dark:text-white border-gray-300 dark:border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black dark:text-white">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full  text-black dark:text-white border-gray-300 dark:border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black dark:text-white">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a password"
                          className="w-full  text-black dark:text-white border-gray-300 dark:border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Creating account...
                    </>
                  ) : (
                    "Create account"
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
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing up...
                </>
              ) : (
                <>
                  <FcGoogle className="w-4 h-4" /> Sign up with Google
                </>
              )}
            </Button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Signup;