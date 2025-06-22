'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Basic Chat' },
    { href: '/completion', label: 'Completion' },
    { href: '/multi-modal', label: 'Multi-Modal' },
    { href: '/generative', label: 'Generative UI' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex space-x-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`py-4 px-2 border-b-2 ${
                pathname === href
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}