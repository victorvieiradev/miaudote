import React from 'react';

const InstagramPost = ({ cat, onAdopt }) => (
  <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
    <div className="p-3 flex items-center gap-2 font-bold">
      <img src={cat.photo} className="w-8 h-8 rounded-full object-cover" />
      {cat.name}
    </div>
    <img src={cat.photo} className="w-full aspect-square object-cover" />
    <div className="p-4 space-y-2">
      <button
        onClick={onAdopt}
        className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors"
      >
        QUERO ADOTAR
      </button>
      <p className="text-sm">
        <span className="font-bold">{cat.name}</span> {cat.description}
      </p>
    </div>
  </div>
);

export default InstagramPost;