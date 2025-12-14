"use client";

import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is there a free plan available?",
      answer: "Yes! We offer a generous free plan that includes all core features. You can create unlimited notes and sync across all your devices without paying a cent.",
    },
    {
      question: "How does the AI note-taking work?",
      answer: "Our AI analyzes your writing patterns and provides intelligent suggestions, auto-completion, and smart organization. It learns from your style to help you write faster and more effectively.",
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. We use end-to-end encryption to protect your notes. Your data is encrypted before it leaves your device, and only you have the keys to decrypt it.",
    },
    {
      question: "Can I use it offline?",
      answer: "Yes! All your notes are available offline. Any changes you make will automatically sync when you're back online.",
    },
    {
      question: "What devices are supported?",
      answer: "We support all major platforms including Windows, macOS, Linux, iOS, Android, and web browsers. Your notes sync seamlessly across all devices.",
    },
    {
      question: "Can I export my notes?",
      answer: "Yes, you can export your notes in multiple formats including Markdown, PDF, and plain text. You own your data and can take it with you anytime.",
    },
  ];

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Everything you need to know about our AI note-taking app.
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <span className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-zinc-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA at bottom */}
        <div className="mt-16 text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a
            href="mailto:support@notes.app"
            className="inline-block px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}

