export default function Footer() {
  return (
    <footer className="text-center py-4 text-sm text-gray-500 border-t bg-white">
      &copy; {new Date().getFullYear()}{' '}
      <a
        href="https://github.com/hinds1ght"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-gray-700"
      >
        Hinds1ght
      </a>
      . All rights reserved.
    </footer>
  );
}
