"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../components/context/AuthContext";

/**
 * Higher-order component to protect admin-only routes.
 * Redirects non-admin users to the dashboard or home page.
 */
export function withAdminProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AdminProtectedComponent(props: P) {
    const { isAdmin, loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push("/login");
        } else if (!isAdmin) {
          router.push("/dashboard");
        }
      }
    }, [isAdmin, loading, user, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      );
    }

    if (!isAdmin) {
      return null; // Will redirect in useEffect
    }

    return <WrappedComponent {...props} />;
  };
}

/**
 * Hook to check if the current user is an admin.
 * Can be used within components to conditionally render admin UI.
 */
export function useAdminCheck() {
  const { isAdmin, loading, user } = useAuth();

  return {
    isAdmin,
    loading,
    canAccessAdmin: !loading && !!user && isAdmin,
  };
}
