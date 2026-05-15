import React, { useState, useMemo } from "react";

interface Contact {
  _id: string;
  email: string;
  date: string;
  description: string;
  emailSent: boolean;
}

interface CalendarProps {
  contacts: Contact[];
  onSendEmail: (id: string) => void;
  onDelete: (id: string) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const Calendar: React.FC<CalendarProps> = ({ contacts, onSendEmail, onDelete }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and total days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Group contacts by date
  const contactsByDate = useMemo(() => {
    const map: Record<string, Contact[]> = {};
    contacts.forEach((c) => {
      const d = new Date(c.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!map[key]) map[key] = [];
      map[key].push(c);
    });
    return map;
  }, [contacts]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Build calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  // Get selected date contacts
  const selectedContacts = selectedDate ? contactsByDate[selectedDate] || [] : [];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Calendar Grid */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition text-xl">&lt;</button>
          <h2 className="text-xl font-bold text-gray-800">
            {MONTHS[month]} {year}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition text-xl">&gt;</button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">{day}</div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            if (day === null) return <div key={idx} className="p-2" />;

            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const hasContacts = contactsByDate[dateStr]?.length > 0;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(dateStr)}
                className={`relative p-2 min-h-[60px] rounded-xl text-sm transition-all
                  ${isSelected ? "bg-blue-600 text-white shadow-md" : ""}
                  ${isToday && !isSelected ? "bg-blue-50 border-2 border-blue-400" : ""}
                  ${!isSelected && !isToday ? "hover:bg-gray-50" : ""}
                `}
              >
                <span className={`font-medium ${isSelected ? "text-white" : isToday ? "text-blue-600" : "text-gray-700"}`}>
                  {day}
                </span>
                {hasContacts && (
                  <div className={`flex gap-0.5 mt-1 justify-center flex-wrap`}>
                    {contactsByDate[dateStr].slice(0, 3).map((_, i) => (
                      <span key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-blue-500"}`} />
                    ))}
                    {contactsByDate[dateStr].length > 3 && (
                      <span className={`text-[10px] ${isSelected ? "text-white" : "text-blue-500"}`}>+{contactsByDate[dateStr].length - 3}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Detail */}
      <div className="w-full lg:w-96 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {selectedDate
            ? `📅 ${new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`
            : "Select a date"}
        </h3>

        {selectedDate && selectedContacts.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">No contacts on this date</p>
        )}

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {selectedContacts.map((contact) => (
            <div key={contact._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-blue-600 truncate">{contact.email}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{contact.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {contact.emailSent ? (
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✉ Sent</span>
                    ) : (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Not sent</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => onSendEmail(contact._id)}
                  disabled={contact.emailSent}
                  className="flex-1 text-xs bg-blue-600 text-white py-1.5 px-3 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
                >
                  {contact.emailSent ? "Email Sent ✓" : "Send Email"}
                </button>
                <button
                  onClick={() => onDelete(contact._id)}
                  className="text-xs bg-red-50 text-red-600 py-1.5 px-3 rounded-lg hover:bg-red-100 transition font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
