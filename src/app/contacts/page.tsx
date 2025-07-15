'use client';

import { FaEnvelope, FaGithub, FaLinkedin, FaFileDownload } from 'react-icons/fa';
import LayoutWrapper from '../LayoutWrapper';

export default function ContactsPage() {
  return (
    <LayoutWrapper>
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-6">📇 Contact Me</h1>
          <ul className="space-y-4 text-left">
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-blue-600" />
              <a href="mailto:gilyu619@gmail.com" className="hover:underline">
                gilyu619@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaGithub className="text-gray-800" />
              <a
                href="https://github.com/hinds1ght"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                github.com/hinds1ght
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaLinkedin className="text-blue-700" />
              <a
                href="https://linkedin.com/in/mark-gil-yu-274721273"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                linkedin.com/in/mark-gil-yu-274721273
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaFileDownload className="text-green-600" />
              <a href="/resume.pdf" download className="hover:underline">
                Download Resume
              </a>
            </li>
          </ul>
        </div>
      </div>
    </LayoutWrapper>
  );
}
