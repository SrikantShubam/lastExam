import Layout from "../components/Layout";
import { withAdminProtection } from "../../utils/adminProtection";

function AdminDashboard() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to the admin dashboard. Only admins can see this page.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">User Management</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View and manage user accounts, roles, and permissions.
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Content Management</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage exams, questions, and syllabus content.
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View platform analytics and user engagement metrics.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAdminProtection(AdminDashboard);
