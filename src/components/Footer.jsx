import React from "react";

export default function Footer() {
  return (
    <footer className=" border-t border-neutral-200/70">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="py-8 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} StudySpotPH Philippines, Midterm Project
        </div>
      </div>
    </footer>
  );
}
