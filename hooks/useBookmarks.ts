import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface BookmarkedQuestion {
  id: string;
  examId: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  subject: string;
  explanation?: string;
  createdAt: string;
}

export function useBookmarks(userId: string | undefined) {
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Load bookmarks from localStorage on mount or userId change
  useEffect(() => {
    if (userId) {
      setLoading(true);
      try {
        const savedBookmarks = localStorage.getItem(`bookmarks_${userId}`);
        if (savedBookmarks) {
          const parsed = JSON.parse(savedBookmarks) as BookmarkedQuestion[];
          setBookmarks(parsed);
        }
      } catch (error) {
        console.error("Error loading bookmarks:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [userId]);

  // Check if a question is bookmarked
  const isBookmarked = (questionId: string) => {
    return bookmarks.some((b) => b.id === questionId);
  };

  // Add a bookmark
  const addBookmark = (bookmark: Omit<BookmarkedQuestion, "createdAt">) => {
    if (!userId) return false;

    const newBookmark: BookmarkedQuestion = {
      ...bookmark,
      createdAt: new Date().toISOString(),
    };

    setBookmarks((prev) => {
      const updated = [newBookmark, ...prev];
      try {
        localStorage.setItem(`bookmarks_${userId}`, JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving bookmark:", error);
      }
      return updated;
    });
    return true;
  };

  // Remove a bookmark
  const removeBookmark = (questionId: string) => {
    if (!userId) return false;

    setBookmarks((prev) => {
      const updated = prev.filter((b) => b.id !== questionId);
      try {
        localStorage.setItem(`bookmarks_${userId}`, JSON.stringify(updated));
      } catch (error) {
        console.error("Error removing bookmark:", error);
      }
      return updated;
    });
    return true;
  };

  // Toggle bookmark status
  const toggleBookmark = (bookmarkData: Omit<BookmarkedQuestion, "createdAt">) => {
    if (isBookmarked(bookmarkData.id)) {
      return removeBookmark(bookmarkData.id);
    } else {
      return addBookmark(bookmarkData);
    }
  };

  // Get unique subjects from bookmarks
  const getSubjects = () => {
    const subjects = new Set(bookmarks.map((b) => b.subject));
    return Array.from(subjects).sort();
  };

  // Filter bookmarks by subject
  const filterBySubject = (subject: string) => {
    if (subject === "all") return bookmarks;
    return bookmarks.filter((b) => b.subject === subject);
  };

  return {
    bookmarks,
    loading,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    getSubjects,
    filterBySubject,
  };
}

// Component for bookmark button
import { useAuth } from "../components/context/AuthContext";

interface BookmarkButtonProps {
  questionId: string;
  examId: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  subject: string;
  explanation?: string;
  className?: string;
  size?: "small" | "medium";
}

export function BookmarkButton({
  questionId,
  examId,
  questionText,
  options,
  correctAnswer,
  subject,
  explanation,
  className = "",
  size = "medium",
}: BookmarkButtonProps) {
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks(user?.uid);
  const bookmarked = isBookmarked(questionId);

  const sizeClasses = {
    small: "p-1.5 rounded-md",
    medium: "p-2 rounded-lg",
  };

  const iconSize = { small: 16, medium: 20 }[size];

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark({
      id: questionId,
      examId,
      questionText,
      options,
      correctAnswer,
      subject,
      explanation,
    });
  };

  return (
    <button
      onClick={handleToggleBookmark}
      className={`transition-all duration-200 hover:scale-110 ${
        bookmarked
          ? "text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-900/30"
          : "text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30"
      } ${sizeClasses[size]} ${className}`}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      title={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {bookmarked ? (
        <BookmarkCheck size={iconSize} />
      ) : (
        <Bookmark size={iconSize} />
      )}
    </button>
  );
}
