import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CreateContactModal from '../components/CreateContactModal';
import SendEmailModal from '../components/SendEmailModal';
import { contactsAPI } from '../services/api';
import { Contact } from '../types';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const fetchContacts = async () => {
    try {
      const res = await contactsAPI.getAll();
      setContacts(res.data);
    } catch (error: any) {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      await contactsAPI.delete(id);
      toast.success('Contact deleted');
      fetchContacts();
    } catch (error: any) {
      toast.error('Failed to delete contact');
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setEditName(contact.name);
    setEditEmail(contact.email);
    setEditPhone(contact.phone || '');
  };

  const handleUpdate = async () => {
    if (!editingContact) return;

    try {
      await contactsAPI.update(editingContact._id, {
        name: editName,
        email: editEmail,
        phone: editPhone,
      });
      toast.success('Contact updated');
      setEditingContact(null);
      fetchContacts();
    } catch (error: any) {
      toast.error('Failed to update contact');
    }
  };

  const handleSendEmail = (contact: Contact) => {
    setSelectedContact(contact);
    setShowEmailModal(true);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Contacts</h2>
          <p className="text-sm text-gray-500">{contacts.length} contact(s)</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          + Add Contact
        </button>
      </div>

      {/* Contact List - Email Only View */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading contacts...</p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-400 text-lg">No contacts yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Click "+ Add Contact" to get started
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.map((contact) => (
                <tr key={contact._id} className="hover:bg-gray-50 transition">
                  {editingContact?._id === contact._id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="px-2 py-1 border rounded text-sm w-full"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-2 py-1 border rounded text-sm w-full"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="px-2 py-1 border rounded text-sm w-full"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={handleUpdate}
                          className="text-green-600 hover:text-green-800 text-sm font-medium mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingContact(null)}
                          className="text-gray-400 hover:text-gray-600 text-sm"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-800">
                          {contact.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {contact.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {contact.phone || '-'}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleSendEmail(contact)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          📧 Send
                        </button>
                        <button
                          onClick={() => handleEdit(contact)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <CreateContactModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchContacts}
      />

      <SendEmailModal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
      />
    </Layout>
  );
};

export default DashboardPage;
