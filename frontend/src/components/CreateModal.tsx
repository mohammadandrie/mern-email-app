import React, { useState } from "react";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; date: string; description: string }) => void;
  loading: boolean;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onSubmit, loading }) => {
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, date, description });
  };

  const handleClose = () => {
    setEmail("");
    setDate("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Create</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Email Field */}
          <div className="flex items-center gap-4">
            <label className="w-24 text-sm font-medium text-gray-700 text-right shrink-0">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="email@example.com"
              required
            />
          </div>

          {/* Date Field */}
          <div className="flex items-center gap-4">
            <label className="w-24 text-sm font-medium text-gray-700 text-right shrink-0">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Description Field */}
          <div className="flex items-start gap-4">
            <label className="w-24 text-sm font-medium text-gray-700 text-right shrink-0 pt-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              rows={4}
              placeholder="Enter description..."
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
