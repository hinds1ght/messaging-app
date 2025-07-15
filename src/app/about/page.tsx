'use client';
import LayoutWrapper from '../LayoutWrapper';

export default function AboutPage() {
  return (
    <LayoutWrapper>
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl w-full text-left">
          <h1 className="text-2xl font-bold mb-6 text-center">👨‍💻 About Me</h1>
          <div className="space-y-4 text-gray-800 leading-relaxed">
            <p>
              Hi! I'm a <strong>self-taught web developer</strong> with a Bachelor's degree in
              Computer Engineering. I’m passionate about transforming ideas into functional,
              real-world digital products that are clean, fast, and user-friendly.
            </p>
            <p>
              My stack includes{' '}
              <strong>
                HTML, CSS, JavaScript, TypeScript, React, Next.js, Node.js, and Express
              </strong>
              . I manage data using both <strong>PostgreSQL and MongoDB</strong>, depending on
              project requirements.
            </p>
            <p>
              I'm also familiar with SEO tools like <strong>Ahrefs</strong>, and I strive to build
              websites that not only look great but also perform well in search engine rankings.
            </p>
            <p>
              Whether it's front-end or back-end development, I enjoy problem-solving and crafting
              digital experiences that people love using. I'm continuously learning and love
              collaborating on meaningful projects.
            </p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
