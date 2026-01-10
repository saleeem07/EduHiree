import React from 'react';
import Button from './ui/Button';
import Card from './ui/Card';

const StyleGuide = ({ onSectionChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-12">
      <div className="site-container">
        <h1 className="text-3xl font-extrabold text-[#1E293B] mb-6">Style Guide</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Buttons</h2>
          <div className="flex items-center gap-4 flex-wrap">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h3 className="font-semibold text-lg">Card Title</h3>
              <p className="text-gray-600 mt-2">Use `Card` for consistent content blocks with padding, border, and shadow.</p>
            </Card>
            <Card className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Accent</h3>
                <p className="text-sm text-gray-500">Accent stripe and shadows</p>
              </div>
              <div className="w-12 h-12 rounded bg-gradient-to-br from-brand-green to-brand-light flex items-center justify-center text-white">EH</div>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Typography & Colors</h2>
          <div className="space-y-3">
            <p className="text-2xl font-bold text-[#2C5F34]">Heading 2 — Brand Green</p>
            <p className="text-lg text-gray-700">Body text — Gray 700</p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-brand-green" />
              <div className="w-10 h-10 rounded bg-brand-light" />
              <div className="w-10 h-10 rounded bg-[#FFD700]" />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default StyleGuide;
