'use client';

export default function Editor() {
  return (
    <main className="flex-1 p-6 flex flex-col gap-6">
      <div className="bg-[#1e1e1e] rounded-md px-4 py-2 inline-flex items-center gap-2 w-fit text-sm">
        <span>react.js</span>
        <button className="text-gray-400 hover:text-white">×</button>
      </div>

      <div className="bg-[#2a2a2a] flex-1 rounded-xl p-4 h-[300px]">
        {/* Code Editor Area */}
      </div>

      <div className="bg-[#2a2a2a] rounded-xl p-4 h-[200px]">
        <p className="text-sm text-white">Terminal</p>
        {/* Terminal Output */}
      </div>
    </main>
  );
}
