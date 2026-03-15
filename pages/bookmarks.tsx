import { useState } from "react";
import { useAuth } from "../components/context/AuthContext";
import { useBookmarks } from "../hooks/useBookmarks";
import Layout from "../components/Layout";
import { Bookmark, Filter, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth();
  const { bookmarks, loading: bookmarksLoading, removeBookmark, getSubjects, filterBySubject } =
    useBookmarks(user?.uid);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (authLoading || bookmarksLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading bookmarks...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please log in to view your bookmarks.
            </p>
            <a
              href="/login"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  const subjects = getSubjects();
  const filteredBookmarks = selectedSubject === "all" ? bookmarks : filterBySubject(selectedSubject);

  const handleRemoveBookmark = async (questionId: string, questionText: string) => {
    setDeletingId(questionId);
    try {
      await removeBookmark(questionId);
      toast.success("Bookmark removed successfully!");
    } catch (error) {
      toast.error("Failed to remove bookmark");
      console.error("Error removing bookmark:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const truncateText = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bookmark size={28} className="text-amber-500" />
            <h1 className="text-3xl font-bold">My Bookmarks</h1>
            <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 px-3 py-1 rounded-full text-sm font-semibold">
              {bookmarks.length} saved
            </span>
          </div>

          {subjects.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No bookmarks yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Start bookmarking questions to review them later!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-xs font-medium">
                        {bookmark.subject}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(bookmark.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {truncateText(bookmark.questionText, 200)}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {bookmark.options.slice(0, 2).map((option, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="font-medium min-w-[20px]">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <span>{truncateText(option, 100)}</span>
                        </div>
                      ))}
                      {bookmark.options.length > 2 && (
                        <span className="text-gray-400 text-xs">
                          +{bookmark.options.length - 2} more options
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveBookmark(bookmark.id, bookmark.questionText)}
                    disabled={deletingId === bookmark.id}
                    className="flex-shrink-0 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                    title="Remove bookmark"
                  >
                    {deletingId === bookmark.id ? (
                      <div className="animate-spin h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
