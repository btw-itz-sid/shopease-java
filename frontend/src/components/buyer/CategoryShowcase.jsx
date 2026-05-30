import React from 'react';

export default function CategoryShowcase({ categories, selectedCategory, onSelectCategory }) {
  const parentCategories = categories.filter(c => c.parent === null);
  const getSubcategories = (parentId) => categories.filter(c => c.parent && c.parent.id === parentId);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-[#4A6741] uppercase tracking-widest mb-2">Collections</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">Shop by Category</h2>
        </div>
        {selectedCategory && (
          <button onClick={() => onSelectCategory(null)} className="text-xs font-medium text-[#78716C] hover:text-[#1C1917] transition-colors flex items-center gap-1.5 group">
            View All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {parentCategories.map(parent => {
          const subs = getSubcategories(parent.id);
          const isActive = selectedCategory?.id === parent.id;

          return (
            <div
              key={parent.id}
              onClick={() => onSelectCategory(isActive ? null : parent)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 h-[200px] ${
                isActive ? 'ring-2 ring-[#4A6741] ring-offset-2 ring-offset-[#FAF8F4]' : 'hover:shadow-xl hover:shadow-black/8'
              }`}
            >
              <img src={parent.imageUrl} alt={parent.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10 group-hover:from-black/80 transition-all duration-500" />

              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight mb-1">{parent.name}</h3>
                  <p className="text-[12px] text-white/60 line-clamp-1">{parent.description}</p>
                </div>
                {subs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {subs.map(sub => {
                      const isSubActive = selectedCategory?.id === sub.id;
                      return (
                        <button key={sub.id}
                          onClick={(e) => { e.stopPropagation(); onSelectCategory(isSubActive ? null : sub); }}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-medium border transition-all duration-300 ${
                            isSubActive
                              ? 'bg-[#4A6741] border-[#4A6741] text-white'
                              : 'bg-white/15 border-white/20 text-white/80 hover:bg-white/25 hover:text-white backdrop-blur-sm'
                          }`}>
                          {sub.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 translate-x-2 group-hover:translate-x-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
