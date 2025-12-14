"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import NoteCard from "@/components/dashboard/NoteCard";
import NoteDialog from "@/components/dashboard/NoteDialog";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  sectionId: string | null;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  section?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  } | null;
}

interface Section {
  id: string;
  name: string;
  color: string;
  icon: string;
  _count?: { notes: number };
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionIcon, setNewSectionIcon] = useState("📝");
  const [newSectionColor, setNewSectionColor] = useState("#3B82F6");
  const [deleteSectionConfirm, setDeleteSectionConfirm] = useState<string | null>(null);

  const commonIcons = ["📝", "📚", "💼", "🎓", "💡", "🔬", "🎨", "🏠", "💻", "📊"];

  // Fetch notes
  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/notes");
      
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch sections
  const fetchSections = async () => {
    try {
      const response = await fetch("/api/sections");
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      }
    } catch (err) {
      console.error("Error fetching sections:", err);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchNotes();
      fetchSections();
    }
  }, [isLoaded]);

  // Create section
  const handleCreateSection = async () => {
    if (!newSectionName.trim()) return;

    try {
      const response = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSectionName,
          icon: newSectionIcon,
          color: newSectionColor,
        }),
      });

      if (response.ok) {
        setNewSectionName("");
        setNewSectionIcon("📝");
        setNewSectionColor("#3B82F6");
        setIsCreatingSection(false);
        fetchSections();
      }
    } catch (error) {
      console.error("Error creating section:", error);
    }
  };

  // Create section from note dialog
  const handleCreateSectionFromNote = async (data: {
    name: string;
    icon: string;
    color: string;
  }): Promise<{ id: string }> => {
    const response = await fetch("/api/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create section");
    }

    const newSection = await response.json();
    await fetchSections();
    return { id: newSection.id };
  };

  // Delete section
  const handleDeleteSection = async (id: string) => {
    try {
      const response = await fetch(`/api/sections/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteSectionConfirm(null);
        if (selectedSection === id) {
          setSelectedSection(null);
        }
        fetchSections();
        fetchNotes();
      }
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  // Create note
  const handleCreateNote = async (data: {
    title: string;
    content: string;
    sectionId?: string | null;
    fontFamily: string;
    fontSize: number;
    fontColor: string;
  }) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      await fetchNotes();
      await fetchSections();
    } catch (err) {
      console.error("Error creating note:", err);
      throw err;
    }
  };

  // Update note
  const handleUpdateNote = async (data: {
    title: string;
    content: string;
    sectionId?: string | null;
    fontFamily: string;
    fontSize: number;
    fontColor: string;
  }) => {
    if (!editingNote) return;

    try {
      const response = await fetch(`/api/notes/${editingNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      await fetchNotes();
      await fetchSections();
      setEditingNote(null);
    } catch (err) {
      console.error("Error updating note:", err);
      throw err;
    }
  };

  // Delete note
  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      await fetchNotes();
      await fetchSections();
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  // Open edit dialog
  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setIsDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingNote(null);
  };

  // Filter notes by section
  const filteredNotes = selectedSection
    ? notes.filter((note) => note.sectionId === selectedSection)
    : notes;

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-zinc-600 dark:text-zinc-400">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pt-16 flex">
      {/* Sidebar - Subjects/Sections */}
      <div className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 fixed left-0 top-16 bottom-0 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Subjects</h2>
            <button
              onClick={() => setIsCreatingSection(!isCreatingSection)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
              title="Add subject"
            >
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Create Section Form */}
          {isCreatingSection && (
            <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg space-y-2">
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Subject name..."
                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-wrap gap-1">
                {commonIcons.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewSectionIcon(icon)}
                    className={`text-xl p-1.5 rounded transition-colors ${
                      newSectionIcon === icon
                        ? "bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <input
                type="color"
                value={newSectionColor}
                onChange={(e) => setNewSectionColor(e.target.value)}
                className="w-full h-8 rounded border border-zinc-200 dark:border-zinc-700 cursor-pointer"
              />
              <button
                onClick={handleCreateSection}
                disabled={!newSectionName.trim()}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
              >
                Add Subject
              </button>
            </div>
          )}

          {/* All Notes Button */}
          <button
            onClick={() => setSelectedSection(null)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2 transition-colors ${
              selectedSection === null
                ? "bg-blue-600 text-white"
                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <span className="text-xl">📋</span>
            <span className="flex-1 text-left font-medium">All Notes</span>
            <span className="text-sm opacity-75">({notes.length})</span>
          </button>

          {/* Sections List */}
          <div className="space-y-1">
            {sections.map((section) => (
              <div key={section.id} className="group relative">
                <button
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    selectedSection === section.id
                      ? "text-white"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                  style={{
                    backgroundColor: selectedSection === section.id ? section.color : undefined,
                  }}
                >
                  <span className="text-xl">{section.icon}</span>
                  <span className="flex-1 text-left font-medium truncate">{section.name}</span>
                  <span className="text-sm opacity-75">({section._count?.notes || 0})</span>
                </button>
                <button
                  onClick={() => setDeleteSectionConfirm(section.id)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-all"
                  title="Delete subject"
                >
                  <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8">
        {/* Header with New Note Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
              {selectedSection
                ? sections.find((s) => s.id === selectedSection)?.name || "Notes"
                : "All Notes"}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
            </p>
          </div>
          <button
            onClick={() => {
              setEditingNote(null);
              setIsDialogOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 4v16m8-8H4" />
            </svg>
            New Note
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredNotes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-zinc-400 dark:text-zinc-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">
              {selectedSection ? "No notes in this subject" : "No notes yet"}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">
              {selectedSection
                ? "Create a note and assign it to this subject to get started."
                : "Start capturing your ideas by creating your first note."}
            </p>
            <button
              onClick={() => {
                setEditingNote(null);
                setIsDialogOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Note
            </button>
          </div>
        )}

        {/* Notes grid */}
        {!isLoading && filteredNotes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                {...note}
                section={note.section}
                onEdit={() => handleEditClick(note)}
                onDelete={() => setDeleteConfirm(note.id)}
              />
            ))}
          </div>
        )}

        {/* Note Dialog */}
        <NoteDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onSave={editingNote ? handleUpdateNote : handleCreateNote}
          onCreateSection={handleCreateSectionFromNote}
          initialTitle={editingNote?.title}
          initialContent={editingNote?.content}
          initialSectionId={editingNote?.sectionId || selectedSection}
          initialFontFamily={editingNote?.fontFamily}
          initialFontSize={editingNote?.fontSize}
          initialFontColor={editingNote?.fontColor}
          mode={editingNote ? "edit" : "create"}
          sections={sections}
        />

        {/* Delete Note Confirmation */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Delete Note
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 mb-6">
                Are you sure you want to delete this note?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteNote(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Section Confirmation */}
        {deleteSectionConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-sm p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Delete Subject?
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Notes in this subject will not be deleted, just unassigned.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteSectionConfirm(null)}
                  className="flex-1 px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteSection(deleteSectionConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
