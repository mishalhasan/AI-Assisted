"use client";

import { useState, useEffect, useRef } from "react";

// Helper function to check if formatting is active at cursor
const checkFormatting = (command: string): boolean => {
  try {
    return document.queryCommandState(command);
  } catch {
    return false;
  }
};

// Rich text editor helper functions
const formatText = (command: string, value?: string) => {
  const editor = document.getElementById('content-editor');
  if (!editor) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    editor.focus();
    return;
  }

  const range = selection.getRangeAt(0);
  
  // Check if selection is within the editor
  if (!editor.contains(range.commonAncestorContainer)) {
    editor.focus();
    return;
  }

  const selectedText = selection.toString();
  
  if (selectedText.trim()) {
    // Apply formatting to selected text only
    document.execCommand(command, false, value);
  } else {
    // No text selected - prepare formatting for next typed character
    // Insert a zero-width space, format it, then position cursor after it
    const textNode = document.createTextNode('\u200B');
    range.insertNode(textNode);
    
    // Select the zero-width space
    const newRange = document.createRange();
    newRange.setStartBefore(textNode);
    newRange.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(newRange);
    
    // Apply formatting to the zero-width space
    document.execCommand(command, false, value);
    
    // Move cursor to after the formatted zero-width space
    const finalRange = document.createRange();
    finalRange.setStartAfter(textNode);
    finalRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(finalRange);
  }
  
  editor.focus();
};

// Apply font formatting to selected text or prepare for new text
const applyFontFormatting = (property: 'fontFamily' | 'fontSize' | 'fontColor', value: string) => {
  const editor = document.getElementById('content-editor');
  if (!editor) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    editor.focus();
    return;
  }

  const range = selection.getRangeAt(0);
  
  if (!editor.contains(range.commonAncestorContainer)) {
    editor.focus();
    return;
  }

  const selectedText = selection.toString();
  
  if (selectedText.trim()) {
    // Apply to selected text
    if (property === 'fontColor') {
      // Use execCommand for color as it works better
      document.execCommand('foreColor', false, value);
    } else {
      const span = document.createElement('span');
      if (property === 'fontFamily') {
        span.style.fontFamily = value;
      } else if (property === 'fontSize') {
        span.style.fontSize = value;
      }
      span.textContent = selectedText;
      range.deleteContents();
      range.insertNode(span);
      
      // Position cursor after the formatted text
      const newRange = document.createRange();
      newRange.setStartAfter(span);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  } else {
    // Prepare formatting for next typed character
    if (property === 'fontColor') {
      // Use execCommand for color - insert zero-width space, format it, position cursor
      const textNode = document.createTextNode('\u200B');
      range.insertNode(textNode);
      
      const newRange = document.createRange();
      newRange.setStartBefore(textNode);
      newRange.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(newRange);
      
      // Apply color formatting
      document.execCommand('foreColor', false, value);
      
      // Position cursor after the formatted marker
      const finalRange = document.createRange();
      finalRange.setStartAfter(textNode);
      finalRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(finalRange);
    } else {
      const span = document.createElement('span');
      if (property === 'fontFamily') {
        span.style.fontFamily = value;
      } else if (property === 'fontSize') {
        span.style.fontSize = value;
      }
      // Insert empty span - cursor will be positioned inside it
      range.insertNode(span);
      
      // Position cursor inside the span so new text will be formatted
      const newRange = document.createRange();
      newRange.setStart(span, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  }
  
  editor.focus();
};

const insertChecklist = () => {
  const editor = document.getElementById('content-editor');
  if (!editor) return;

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    
    if (selectedText) {
      // Convert selected lines to checklist items
      const lines = selectedText.split('\n');
      const checklist = lines
        .map(line => line.trim())
        .filter(line => line)
        .map(line => `<li style="list-style: none;"><input type="checkbox" style="margin-right: 8px;">${line}</li>`)
        .join('');
      
      const list = `<ul style="list-style: none; padding-left: 0;">${checklist}</ul>`;
      range.deleteContents();
      const fragment = document.createRange().createContextualFragment(list);
      range.insertNode(fragment);
      
      // Set cursor after the inserted content
      const newRange = document.createRange();
      newRange.setStartAfter(fragment.lastChild || fragment);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      // Insert single checklist item with editable content after checkbox
      const listItem = document.createElement('li');
      listItem.style.listStyle = 'none';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.style.marginRight = '8px';
      
      // Create a text node for editable content after checkbox
      const textNode = document.createTextNode('');
      
      listItem.appendChild(checkbox);
      listItem.appendChild(textNode);
      
      const ul = document.createElement('ul');
      ul.style.listStyle = 'none';
      ul.style.paddingLeft = '0';
      ul.appendChild(listItem);
      
      range.insertNode(ul);
      
      // Set cursor after checkbox, in the text node
      const newRange = document.createRange();
      newRange.setStart(textNode, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  } else {
    // Insert at cursor position
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    const listItem = document.createElement('li');
    listItem.style.listStyle = 'none';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.marginRight = '8px';
    
      // Create a text node for editable content after checkbox
      const textNode = document.createTextNode('');
      
      listItem.appendChild(checkbox);
      listItem.appendChild(textNode);
      
      const ul = document.createElement('ul');
      ul.style.listStyle = 'none';
      ul.style.paddingLeft = '0';
      ul.appendChild(listItem);
      
      range.insertNode(ul);
      
      // Set cursor after checkbox, in the text node
      const newRange = document.createRange();
      newRange.setStart(textNode, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
  }
  
  editor.focus();
};

// TypeScript types for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface NoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    content: string;
    sectionId?: string | null;
    fontFamily: string;
    fontSize: number;
    fontColor: string;
  }) => Promise<void>;
  onCreateSection?: (data: { name: string; icon: string; color: string }) => Promise<{ id: string }>;
  initialTitle?: string;
  initialContent?: string;
  initialSectionId?: string | null;
  initialFontFamily?: string;
  initialFontSize?: number;
  initialFontColor?: string;
  mode: "create" | "edit";
  sections: Array<{ id: string; name: string; color: string; icon: string }>;
}

export default function NoteDialog({
  isOpen,
  onClose,
  onSave,
  onCreateSection,
  initialTitle = "",
  initialContent = "",
  initialSectionId = null,
  initialFontFamily = "sans-serif",
  initialFontSize = 16,
  initialFontColor = "#FFFFFF",
  mode,
  sections,
}: NoteDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [sectionId, setSectionId] = useState<string | null>(initialSectionId);
  const [fontFamily, setFontFamily] = useState(initialFontFamily);
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [fontColor, setFontColor] = useState(initialFontColor);
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionIcon, setNewSectionIcon] = useState("📝");
  const [newSectionColor, setNewSectionColor] = useState("#3B82F6");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const contentEditorRef = useRef<HTMLDivElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = "en-US";

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " ";
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript((prev) => prev + finalTranscript);
        };

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
          // Handle different error types
          if (event.error === 'no-speech') {
            // This is normal - user didn't speak or stopped recording without speaking
            // Don't log as error, just stop recording
            setIsRecording(false);
          } else if (event.error === 'aborted') {
            // Recording was stopped manually - this is expected
            setIsRecording(false);
          } else {
            // Log actual errors (network, permission, etc.)
            console.error("Speech recognition error:", event.error);
            setIsRecording(false);
          }
        };

        recognitionInstance.onend = () => {
          setIsRecording(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  // Keyboard shortcuts for formatting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when editor is focused
      const editor = document.getElementById('content-editor');
      if (!editor || !editor.contains(document.activeElement)) return;

      // Ctrl/Cmd + B for Bold
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        formatText('bold');
      }
      // Ctrl/Cmd + I for Italic
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        formatText('italic');
      }
      // Ctrl/Cmd + U for Underline
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        formatText('underline');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle checklist clicks and update formatting state
  useEffect(() => {
    const editor = contentEditorRef.current;
    if (!editor) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.type === 'checkbox') {
        // Prevent default behavior and let checkbox work normally
        e.stopPropagation();
      }
    };

    const updateFormattingState = () => {
      setIsBold(checkFormatting('bold'));
      setIsItalic(checkFormatting('italic'));
      setIsUnderline(checkFormatting('underline'));
    };

    const handleSelectionChange = () => {
      if (editor.contains(document.activeElement)) {
        updateFormattingState();
      }
    };

    editor.addEventListener('click', handleClick);
    document.addEventListener('selectionchange', handleSelectionChange);
    editor.addEventListener('keyup', updateFormattingState);
    editor.addEventListener('mouseup', updateFormattingState);
    
    return () => {
      editor.removeEventListener('click', handleClick);
      document.removeEventListener('selectionchange', handleSelectionChange);
      editor.removeEventListener('keyup', updateFormattingState);
      editor.removeEventListener('mouseup', updateFormattingState);
    };
  }, [isOpen]);

  // Update section when dialog opens in create mode
  useEffect(() => {
    if (mode === "create" && initialSectionId) {
      setSectionId(initialSectionId);
    }
  }, [mode, initialSectionId, isOpen]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setSectionId(initialSectionId);
    setFontFamily(initialFontFamily);
    setFontSize(initialFontSize);
    setFontColor(initialFontColor);
    
    // Update contentEditable div when content changes externally
    if (contentEditorRef.current && isOpen) {
      // Check if content is HTML or plain text
      const isHTML = initialContent.includes('<') && initialContent.includes('>');
      if (isHTML) {
        contentEditorRef.current.innerHTML = initialContent;
      } else {
        contentEditorRef.current.innerHTML = initialContent.replace(/\n/g, '<br>');
      }
    }
  }, [initialTitle, initialContent, initialSectionId, initialFontFamily, initialFontSize, initialFontColor, isOpen]);

  const handleSave = async () => {
    // Get HTML content from editor
    const editorContent = contentEditorRef.current?.innerHTML || content;
    const textContent = contentEditorRef.current?.innerText || contentEditorRef.current?.textContent || content;
    
    if (!title.trim() || !textContent.trim()) {
      return;
    }

    // Stop recording if active
    if (isRecording && recognition) {
      recognition.stop();
    }

    setIsSaving(true);
    try {
      await onSave({
        title,
        content: editorContent, // Save HTML content to preserve formatting
        sectionId,
        fontFamily,
        fontSize,
        fontColor,
      });
      setTitle("");
      setContent("");
      if (contentEditorRef.current) {
        contentEditorRef.current.innerHTML = '';
      }
      setSectionId(null);
      setFontFamily("sans-serif");
      setFontSize(16);
      setFontColor("#FFFFFF");
      setIsRecording(false);
      setTranscript("");
      setAiPrompt("");
      setShowAIPrompt(false);
      onClose();
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    // Stop recording if active
    if (isRecording && recognition) {
      recognition.stop();
    }
    
    setTitle("");
    setContent("");
    setSectionId(null);
    setFontFamily("sans-serif");
    setFontSize(16);
    setFontColor("#FFFFFF");
    setIsCreatingSection(false);
    setNewSectionName("");
    setNewSectionIcon("📝");
    setNewSectionColor("#3B82F6");
    setIsRecording(false);
    setTranscript("");
    setAiPrompt("");
    setShowAIPrompt(false);
    onClose();
  };

  const handleCreateSection = async () => {
    if (!newSectionName.trim() || !onCreateSection) return;

    try {
      const newSection = await onCreateSection({
        name: newSectionName,
        icon: newSectionIcon,
        color: newSectionColor,
      });
      setSectionId(newSection.id);
      setIsCreatingSection(false);
      setNewSectionName("");
      setNewSectionIcon("📝");
      setNewSectionColor("#3B82F6");
    } catch (error) {
      console.error("Error creating section:", error);
    }
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;

    setIsGeneratingAI(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          title: title || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      
      // Set the generated content
      if (data.content) {
        setContent(data.content);
        if (contentEditorRef.current) {
          contentEditorRef.current.innerHTML = data.content.replace(/\n/g, '<br>');
        }
      }
      
      // Set title if not already set
      if (!title && data.title) {
        setTitle(data.title);
      }

      setAiPrompt("");
      setShowAIPrompt(false);
    } catch (error) {
      console.error("Error generating AI content:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Start/Stop voice recording
  const handleToggleRecording = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setTranscript("");
      recognition.start();
      setIsRecording(true);
    }
  };

  // Process transcript and generate summary
  const handleProcessTranscript = async () => {
    if (!transcript.trim()) return;

    setIsTranscribing(true);
    setIsSummarizing(true);

    try {
      // First, set the transcript as content
      setContent(transcript);

      // Then generate summary using OpenAI
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: transcript,
          title: title || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add summary at the top of the content
        const summarySection = `<h2>Summary</h2><p>${data.summary}</p><hr><h2>Full Transcript</h2><p>${transcript.replace(/\n/g, '<br>')}</p>`;
        setContent(summarySection);
        if (contentEditorRef.current) {
          contentEditorRef.current.innerHTML = summarySection;
        }

        // Set title if not already set
        if (!title && data.title) {
          setTitle(data.title);
        }
      }
    } catch (error) {
      console.error("Error processing transcript:", error);
      // If summarization fails, just use the transcript
      setContent(transcript);
    } finally {
      setIsTranscribing(false);
      setIsSummarizing(false);
      setTranscript("");
    }
  };

  if (!isOpen) return null;

  const fontFamilies = [
    { value: "sans-serif", label: "Sans Serif" },
    { value: "serif", label: "Serif" },
    { value: "monospace", label: "Monospace" },
    { value: "cursive", label: "Cursive" },
  ];

  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32];
  const commonIcons = ["📝", "📚", "💼", "🎓", "💡", "🔬", "🎨", "🏠", "💻", "📊"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {mode === "create" ? "Create New Note" : "Edit Note"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Section Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="section" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Subject (Optional)
              </label>
              {onCreateSection && (
                <button
                  onClick={() => setIsCreatingSection(!isCreatingSection)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  {isCreatingSection ? "Cancel" : "+ New Subject"}
                </button>
              )}
            </div>

            {isCreatingSection ? (
              <div className="space-y-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Subject name..."
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-zinc-600 dark:text-zinc-400 mb-1 block">Icon</label>
                    <div className="flex flex-wrap gap-1">
                      {commonIcons.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setNewSectionIcon(icon)}
                          type="button"
                          className={`text-lg p-1.5 rounded transition-colors ${
                            newSectionIcon === icon
                              ? "bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500"
                              : "hover:bg-zinc-100 dark:hover:bg-zinc-700"
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-600 dark:text-zinc-400 mb-1 block">Color</label>
                    <input
                      type="color"
                      value={newSectionColor}
                      onChange={(e) => setNewSectionColor(e.target.value)}
                      className="w-12 h-10 rounded border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                    />
                  </div>
                </div>
                <button
                  onClick={handleCreateSection}
                  disabled={!newSectionName.trim()}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Create Subject
                </button>
              </div>
            ) : (
              <select
                id="section"
                value={sectionId || ""}
                onChange={(e) => setSectionId(e.target.value || null)}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
              >
                <option value="">No Subject</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.icon} {section.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Title
              </label>
              {mode === "create" && (
                <button
                  onClick={() => setShowAIPrompt(!showAIPrompt)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium shadow-sm hover:shadow-md"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  {showAIPrompt ? "Hide AI" : "✨ Generate with AI"}
                </button>
              )}
            </div>

            {/* AI Prompt Input */}
            {showAIPrompt && (
              <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerateAI();
                      }
                    }}
                    placeholder="Describe what you want to write about..."
                    className="flex-1 px-3 py-2 bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isGeneratingAI}
                  />
                  <button
                    onClick={handleGenerateAI}
                    disabled={!aiPrompt.trim() || isGeneratingAI}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    {isGeneratingAI ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
                  💡 Example: "Write a summary of machine learning basics" or "Create meeting notes about project planning"
                </p>
              </div>
            )}

            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
              autoFocus={!showAIPrompt}
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="content" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Content
              </label>
              {/* Voice Recording Button - Moved to top right */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleRecording}
                  disabled={!recognition}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isRecording
                      ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
                      : "bg-green-600 text-white hover:bg-green-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  type="button"
                  title={recognition ? (isRecording ? "Stop recording" : "Start voice recording") : "Speech recognition not supported"}
                >
                  {isRecording ? (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 6h12v12H6z" />
                      </svg>
                      Recording...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      Voice Note
                    </>
                  )}
                </button>

                {/* Process Transcript Button */}
                {transcript && !isRecording && (
                  <button
                    onClick={handleProcessTranscript}
                    disabled={isSummarizing}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    type="button"
                  >
                    {isSummarizing ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Process & Summarize
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            
            {/* Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 mb-3">
              {/* Font Family */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                  Font:
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => {
                    setFontFamily(e.target.value);
                    applyFontFormatting('fontFamily', e.target.value);
                  }}
                  className="px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {fontFamilies.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                  Size:
                </label>
                <select
                  value={fontSize}
                  onChange={(e) => {
                    const size = Number(e.target.value);
                    setFontSize(size);
                    applyFontFormatting('fontSize', `${size}px`);
                  }}
                  className="px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {fontSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}px
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Color */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                  Color:
                </label>
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => {
                    setFontColor(e.target.value);
                    applyFontFormatting('fontColor', e.target.value);
                  }}
                  className="w-9 h-8 rounded border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                />
                <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">{fontColor}</span>
              </div>

              <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600" />

              {/* Text Formatting Buttons Group */}
              <div className="flex items-center gap-1">
                {/* Bold */}
                <button
                  type="button"
                  onClick={() => formatText('bold')}
                  className={`px-2.5 py-1.5 border rounded-lg transition-colors text-sm font-bold min-w-[2rem] ${
                    isBold
                      ? 'bg-blue-600 dark:bg-blue-600 border-blue-600 dark:border-blue-600 text-white'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                  title="Bold (Ctrl+B)"
                >
                  B
                </button>
                {/* Italic */}
                <button
                  type="button"
                  onClick={() => formatText('italic')}
                  className={`px-2.5 py-1.5 border rounded-lg transition-colors text-sm italic min-w-[2rem] ${
                    isItalic
                      ? 'bg-blue-600 dark:bg-blue-600 border-blue-600 dark:border-blue-600 text-white'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                  title="Italic (Ctrl+I)"
                >
                  I
                </button>
                {/* Underline */}
                <button
                  type="button"
                  onClick={() => formatText('underline')}
                  className={`px-2.5 py-1.5 border rounded-lg transition-colors text-sm underline min-w-[2rem] ${
                    isUnderline
                      ? 'bg-blue-600 dark:bg-blue-600 border-blue-600 dark:border-blue-600 text-white'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                  title="Underline (Ctrl+U)"
                >
                  U
                </button>
              </div>

              <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600" />

              {/* List Buttons Group */}
              <div className="flex items-center gap-1">
                {/* Bullet List */}
                <button
                  type="button"
                  onClick={() => formatText('insertUnorderedList')}
                  className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  title="Bullet List"
                >
                  <svg className="w-4 h-4 text-zinc-700 dark:text-zinc-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                  </svg>
                </button>
                {/* Numbered List */}
                <button
                  type="button"
                  onClick={() => formatText('insertOrderedList')}
                  className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  title="Numbered List"
                >
                  <svg className="w-4 h-4 text-zinc-700 dark:text-zinc-300" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <text x="1" y="7" fontSize="8" fill="currentColor" fontWeight="bold" fontFamily="Arial, sans-serif">1</text>
                    <text x="1" y="12" fontSize="8" fill="currentColor" fontWeight="bold" fontFamily="Arial, sans-serif">2</text>
                    <text x="1" y="17" fontSize="8" fill="currentColor" fontWeight="bold" fontFamily="Arial, sans-serif">3</text>
                  </svg>
                </button>
                {/* Checklist */}
                <button
                  type="button"
                  onClick={insertChecklist}
                  className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  title="Checklist"
                >
                  <svg className="w-4 h-4 text-zinc-700 dark:text-zinc-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Live Transcript Display */}
            {isRecording && (
              <div className="mb-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">Recording...</span>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">
                  {transcript || "Speak now..."}
                </p>
              </div>
            )}

            {/* Transcript Preview (when stopped) */}
            {transcript && !isRecording && (
              <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Transcript Preview</span>
                  <button
                    onClick={() => setTranscript("")}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    type="button"
                  >
                    Clear
                  </button>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                  {transcript}
                </p>
              </div>
            )}

            <div className="relative">
              <div
                ref={contentEditorRef}
                id="content-editor"
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => {
                  const target = e.currentTarget;
                  const text = target.innerText || target.textContent || '';
                  setContent(text);
                }}
                onBlur={(e) => {
                  const text = e.currentTarget.innerText || e.currentTarget.textContent || '';
                  setContent(text);
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const text = e.clipboardData.getData('text/plain');
                  document.execCommand('insertText', false, text);
                }}
                style={{
                  minHeight: '300px',
                }}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all overflow-y-auto prose prose-sm dark:prose-invert max-w-none"
                data-placeholder="Write your note here or use voice recording..."
              />
              <style dangerouslySetInnerHTML={{
                __html: `
                  #content-editor:empty:before {
                    content: attr(data-placeholder);
                    color: #71717a;
                    pointer-events: none;
                  }
                  #content-editor:focus {
                    outline: none;
                  }
                  #content-editor ul:not([style]) {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin: 0.5rem 0;
                  }
                  #content-editor ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    margin: 0.5rem 0;
                  }
                  #content-editor ul[style*='list-style: none'] {
                    list-style: none !important;
                    padding-left: 0;
                  }
                  #content-editor ul[style*='list-style: none'] li {
                    display: flex;
                    align-items: flex-start;
                    margin: 0.25rem 0;
                    min-height: 1.5rem;
                    line-height: 1.5;
                  }
                  #content-editor ul[style*='list-style: none'] input[type='checkbox'] {
                    margin-right: 0.5rem;
                    margin-top: 0.125rem;
                    margin-bottom: 0;
                    cursor: pointer;
                    flex-shrink: 0;
                    align-self: flex-start;
                  }
                  #content-editor ul[style*='list-style: none'] li > *:not(input) {
                    flex: 1;
                    min-width: 0;
                    white-space: normal;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                  }
                  #content-editor ul[style*='list-style: none'] li span {
                    display: inline !important;
                    white-space: normal !important;
                    word-wrap: normal !important;
                    line-height: inherit;
                  }
                  #content-editor ul[style*='list-style: none'] li span * {
                    display: inline !important;
                    white-space: normal !important;
                  }
                  #content-editor ul[style*='list-style: none'] li br {
                    display: inline;
                  }
                  #content-editor h1 {
                    font-size: 2em;
                    font-weight: bold;
                    margin: 0.5rem 0;
                  }
                  #content-editor h2 {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin: 0.5rem 0;
                  }
                  #content-editor h3 {
                    font-size: 1.17em;
                    font-weight: bold;
                    margin: 0.5rem 0;
                  }
                  #content-editor h4 {
                    font-size: 1em;
                    font-weight: bold;
                    margin: 0.5rem 0;
                  }
                  #content-editor h5 {
                    font-size: 0.83em;
                    font-weight: bold;
                    margin: 0.5rem 0;
                  }
                  #content-editor h6 {
                    font-size: 0.67em;
                    font-weight: bold;
                    margin: 0.5rem 0;
                  }
                  #content-editor u {
                    text-decoration: underline;
                  }
                  #content-editor strong {
                    font-weight: bold;
                  }
                  #content-editor em {
                    font-style: italic;
                  }
                `
              }} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors font-medium"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim() || isSaving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                {mode === "create" ? "Create Note" : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
