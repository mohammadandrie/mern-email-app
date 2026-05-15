import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { contactAPI } from "../services/api";
import Calendar from "../components/Calendar";
import CreateModal from "../components/CreateModal";

interface Contact {
  _id: string;
  email: string;
  date: string;
  description: string;
  emailSent: boolean;
  emailSentAt: string | null;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchContacts = useCallback(async () => {
    try {
      const res = await contactAPI.getAll();
      setContacts(res.data);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleCreate = async (data: { email: string; date: string; description: string }) => {
    setLoading(true);
    try {
      await contactAPI.create(data);
      await fetchContacts();
      setShowCreate(false);
      showToast("Contact created successfully!");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to create contact", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (id: string) => {
    try {
      await contactAPI.sendEmail(id);
      await fetchContacts();
      showToast("Email sent successfully!");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to send email", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    try {
      await contactAPI.delete(id);
      await fetchContacts();
      showToast("Contact deleted");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">MERN Email App</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Contact Calendar</h2>
            <p className="text-gray-500 text-sm mt-1">
              {contacts.length} contact{contacts.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-200 flex items-center gap-2"
          >
            <span className="text-lg">+</span> Create
          </button>
        </div>

        {/* Calendar */}
        {fetching ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <Calendar contacts={contacts} onSendEmail={handleSendEmail} onDelete={handleDelete} />
        )}
      </main>

      {/* Create Modal */}
      <CreateModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        loading={loading}
      />

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg text-white font-medium text-sm z-50 animate-pulse ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
