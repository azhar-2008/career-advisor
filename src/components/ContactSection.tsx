import React, { useState } from 'react';
import { Mail, Copy, Check, Send } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const team = [
    {
      name: 'Maz Ghunio',
      role: 'Project Lead',
      email: 'maz.ghunio@gmail.com'
    },
    {
      name: 'Afzal Maqbool',
      role: 'Career Mentor',
      email: 'afzalmaqbool26@gmail.com'
    },
    {
      name: 'Faisal S.',
      role: 'Technical Advisor',
      email: 'faisals.it007@gmail.com'
    }
  ];

  const handleCopy = (email: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(email);
      } else {
        const input = document.createElement('input');
        input.value = email;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
      }
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  return (
    <section id="contact" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Title & Short Text */}
      <div className="pb-4 mb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            <span>Need Help or Have Questions?</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Feel free to email any of our team members directly. We usually reply within 24 hours.
          </p>
        </div>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {team.map((person) => (
          <div
            key={person.email}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900">{person.name}</span>
                <span className="text-[10px] text-slate-400 font-medium">{person.role}</span>
              </div>
              <a
                href={`mailto:${person.email}`}
                className="text-xs font-mono text-indigo-600 hover:text-indigo-800 hover:underline block truncate mt-1"
                title={`Send email to ${person.email}`}
              >
                {person.email}
              </a>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
              <a
                href={`mailto:${person.email}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>

              <button
                onClick={() => handleCopy(person.email)}
                className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer flex items-center gap-1"
              >
                {copiedEmail === person.email ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
