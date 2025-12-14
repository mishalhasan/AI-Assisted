"use client";

import { useState } from "react";

interface Section {
  id: string;
  name: string;
  color: string;
  icon: string;
  _count?: { notes: number };
}

interface SectionManagerProps {
  sections: Section[];
  onSectionCreated: () => void;
  onSectionDeleted: () => void;
}

export default function SectionManager({
  sections,
  onSectionCreated,
  onSectionDeleted,
}: SectionManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionIcon, setNewSectionIcon] = useState("📝");
  const [newSectionColor, setNewSectionColor] = useState("#3B82F6");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const commonIcons = ["📝", "📚", "💼", "🎓", "💡", "🔬", "🎨", "🏠", "💻", "📊"];

  const handleCreate = async () => {
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
        setIsCreating(false);
        onSectionCreated();
      }
    } catch (error) {
      console.error("Error creating section:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/sections/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteConfirm(null);
        onSectionDeleted();
      }
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Sections
        </h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isCreating ? "Cancel" : "+ New Section"}
        </button>
      </div>

      {/* Create Section Form */}
      {isCreating && (
        <div className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="space-y-3">
            <input
              type="text"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="Section name..."
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-zinc-600 dark:text-zinc-400 mb-1 block">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewSectionIcon(icon)}
                      className={`text-2xl p-2 rounded-lg transition-colors ${
                        newSectionIcon === icon
                          ? "bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-600 dark:text-zinc-400 mb-1 block">
                  Color
                </label>
                <input
                  type="color"
                  value={newSectionColor}
                  onChange={(e) => setNewSectionColor(e.target.value)}
                  className="w-16 h-10 rounded border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                />
              </div>
            </div>
            <button
              onClick={handleCreate}
              disabled={!newSectionName.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Create Section
            </button>
          </div>
        </div>
      )}

      {/* Sections List */}
      {sections.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <div
              key={section.id}
              className="group relative flex items-center gap-2 px-3 py-2 rounded-lg border transition-all"
              style={{
                borderColor: section.color,
                backgroundColor: `${section.color}10`,
              }}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                {section.name}
              </span>
              {section._count && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  ({section._count.notes})
                </span>
              )}
              <button
                onClick={() => setDeleteConfirm(section.id)}
                className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-all"
                aria-label="Delete section"
              >
                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-sm p-6 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              Delete Section?
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Notes in this section will not be deleted, just unassigned.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

