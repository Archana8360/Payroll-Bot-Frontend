// src/components/QuestionsTable.tsx
import { useEffect, useState } from "react";
import api, { type Question } from "../api/app";
import toast from "react-hot-toast";

export default function QuestionsTable() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      const res = await api.get<Question[]>("/questions");
      setQuestions(res.data);
    } catch {
      toast.error("Failed to load questions");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAddOrUpdate = async () => {
    if (!q.trim() || !a.trim()) return toast.error("Both fields are required");

    if (editingId) {
      // Update existing question
      try {
        const res = await api.put<Question>(
          `/questions/${editingId}`,
          { question: q, answer: a }
        );
        setQuestions(
          questions.map((item) => (item._id === editingId ? res.data : item))
        );
        setEditingId(null);
        setQ("");
        setA("");
        toast.success("Question updated");
      } catch {
        toast.error("Failed to update question");
      }
    } else {
      // Add new question
      try {
        const res = await api.post<Question>("/questions", { question: q, answer: a });
        setQuestions([...questions, res.data]);
        setQ("");
        setA("");
        toast.success("Question added");
      } catch {
        toast.error("Failed to add question");
      }
    }
  };

  const handleEdit = (item: Question) => {
    setQ(item.question);
    setA(item.answer);
    setEditingId(item._id);
  };

  const handleRemove = async (id: string) => {
    try {
      await api.delete(`/questions/${id}`);
      setQuestions(questions.filter((item) => item._id !== id));
      toast.success("Question removed");
    } catch {
      toast.error("Failed to remove question");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setQ("");
    setA("");
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Predefined Questions</h2>

      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="Question"
          className="border p-2 rounded flex-1"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <input
          type="text"
          placeholder="Answer"
          className="border p-2 rounded flex-1"
          value={a}
          onChange={(e) => setA(e.target.value)}
        />
        <button
          className={`px-4 rounded text-white ${editingId ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}`}
          onClick={handleAddOrUpdate}
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            className="bg-gray-400 text-white px-4 rounded hover:bg-gray-500"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Question</th>
            <th className="border p-2">Answer</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.length ? (
            questions.map((item) => (
              <tr key={item._id}>
                <td className="border p-2">{item.question}</td>
                <td className="border p-2">{item.answer}</td>
                <td className="border p-2 text-center flex justify-center gap-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="border p-2 text-center text-gray-500">
                No questions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
