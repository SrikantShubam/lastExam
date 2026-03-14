"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface Exam {
  id: number;
  exam_id: string;
  name: string;
  exam_date: string;
  category: string;
}

interface ExamList {
  id: string;
  name: string;
  description: string;
  examIds: string[];
  createdAt: string;
}

const AVAILABLE_EXAMS: Exam[] = [
  { id: 1, exam_id: "jee-main", name: "JEE Main", exam_date: "2026-01-24", category: "Engineering" },
  { id: 2, exam_id: "jee-advanced", name: "JEE Advanced", exam_date: "2026-05-18", category: "Engineering" },
  { id: 3, exam_id: "neet", name: "NEET UG", exam_date: "2026-05-04", category: "Medical" },
  { id: 4, exam_id: "cat", name: "CAT", exam_date: "2026-11-24", category: "MBA" },
  { id: 5, exam_id: "gate", name: "GATE", exam_date: "2026-02-01", category: "Engineering" },
  { id: 6, exam_id: "upsc-cse", name: "UPSC CSE", exam_date: "2026-05-26", category: "Civil Services" },
  { id: 7, exam_id: "ibps-po", name: "IBPS PO", exam_date: "2026-10-04", category: "Banking" },
  { id: 8, exam_id: "sbi-po", name: "SBI PO", exam_date: "2026-11-15", category: "Banking" },
  { id: 9, exam_id: "ssc-cgl", name: "SSC CGL", exam_date: "2026-06-09", category: "Government" },
  { id: 10, exam_id: "ugc-net", name: "UGC NET", exam_date: "2026-06-15", category: "Education" },
];

export default function MyExamsPage() {
  const [lists, setLists] = useState<ExamList[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<ExamList | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", examIds: [] as string[] });

  // Load lists from localStorage on mount
  useEffect(() => {
    const savedLists = localStorage.getItem("myExamLists");
    if (savedLists) {
      setLists(JSON.parse(savedLists));
    }
  }, []);

  // Save lists to localStorage whenever they change
  useEffect(() => {
    if (lists.length > 0 || localStorage.getItem("myExamLists")) {
      localStorage.setItem("myExamLists", JSON.stringify(lists));
    }
  }, [lists]);

  const handleOpenCreate = () => {
    setEditingList(null);
    setFormData({ name: "", description: "", examIds: [] });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (list: ExamList) => {
    setEditingList(list);
    setFormData({ name: list.name, description: list.description, examIds: list.examIds });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingList(null);
    setFormData({ name: "", description: "", examIds: [] });
  };

  const handleExamToggle = (examId: string) => {
    setFormData(prev => ({
      ...prev,
      examIds: prev.examIds.includes(examId)
        ? prev.examIds.filter(id => id !== examId)
        : [...prev.examIds, examId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a list name");
      return;
    }

    if (formData.examIds.length === 0) {
      alert("Please select at least one exam");
      return;
    }

    if (editingList) {
      // Update existing list
      setLists(prev => prev.map(list =>
        list.id === editingList.id
          ? { ...list, name: formData.name, description: formData.description, examIds: formData.examIds }
          : list
      ));
    } else {
      // Create new list
      const newList: ExamList = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        examIds: formData.examIds,
        createdAt: new Date().toISOString(),
      };
      setLists(prev => [...prev, newList]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this list?")) {
      setLists(prev => prev.filter(list => list.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Exam Lists</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your custom exam lists
            </p>
          </div>
          <Button onClick={handleOpenCreate}>Create New List</Button>
        </div>

        {lists.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">You haven't created any exam lists yet.</p>
              <Button onClick={handleOpenCreate}>Create Your First List</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => {
              const selectedExams = AVAILABLE_EXAMS.filter(exam => list.examIds.includes(exam.exam_id));
              return (
                <Card key={list.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span>{list.name}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(list)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(list.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </CardTitle>
                    {list.description && (
                      <CardDescription>{list.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{selectedExams.length} exams selected</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedExams.map((exam) => (
                          <Badge key={exam.exam_id} variant="secondary">
                            {exam.name}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Created: {new Date(list.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingList ? "Edit List" : "Create New List"}</CardTitle>
                <CardDescription>
                  {editingList ? "Edit your custom exam list" : "Create a custom list of exams"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">List Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="My JEE Prep List"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your list (optional)"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Select Exams *</label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.examIds.length} exam{formData.examIds.length !== 1 ? "s" : ""} selected
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto border rounded-lg p-4">
                      {AVAILABLE_EXAMS.map((exam) => (
                        <label
                          key={exam.exam_id}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            formData.examIds.includes(exam.exam_id)
                              ? "bg-primary/10 border-primary"
                              : "hover:bg-accent"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.examIds.includes(exam.exam_id)}
                            onChange={() => handleExamToggle(exam.exam_id)}
                            className="w-4 h-4"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{exam.name}</p>
                            <p className="text-xs text-muted-foreground">{exam.category}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingList ? "Update List" : "Create List"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
