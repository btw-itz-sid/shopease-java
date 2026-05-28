import React from 'react';
import { Tag, Layers } from 'lucide-react';

export default function CategoryShowcase({ categories, selectedCategory, onSelectCategory }) {
  // Find top-level parent categories
  const parentCategories = categories.filter(c => c.parent === null);

  // Group sub-categories by parent id
  const getSubcategories = (parentId) => {
    return categories.filter(c => c.parent && c.parent.id === parentId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-500" />
            <span>Interactive Catalog</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Filter by top levels or jump straight to specialized sub-segments.</p>
        </div>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {parentCategories.map(parent => {
          const subs = getSubcategories(parent.id);
          const isParentSelected = selectedCategory?.id === parent.id;

          return (
            <div 
              key={parent.id} 
              className={`relative bg-gradient-to-br from-slate-900/60 to-slate-950/80 border rounded-2xl p-5 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
                isParentSelected 
                  ? 'border-violet-500/80 shadow-lg shadow-violet-500/5' 
                  : 'border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              {/* Blurred background hover glow */}
              <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-violet-600/5 blur-2xl group-hover:bg-violet-600/10 transition-all duration-300 pointer-events-none" />
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-800 flex-shrink-0">
                    <img 
                      src={parent.imageUrl} 
                      alt={parent.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div>
                    <h3 
                      onClick={() => onSelectCategory(parent)}
                      className="font-bold text-slate-100 hover:text-violet-400 transition-colors cursor-pointer text-sm tracking-tight flex items-center gap-1.5"
                    >
                      {parent.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium line-clamp-1">{parent.description}</p>
                  </div>
                </div>

                {/* Subcategories list */}
                {subs.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-900">
                    {subs.map(sub => {
                      const isSubSelected = selectedCategory?.id === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => onSelectCategory(sub)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all duration-200 ${
                            isSubSelected
                              ? 'bg-violet-600 border-violet-500 text-white'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <Tag className="w-2.5 h-2.5" />
                          <span>{sub.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action indicators */}
              <div className="mt-4 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                <span className="text-slate-500">JPA Parent Reference: <code>null</code></span>
                <button 
                  onClick={() => onSelectCategory(parent)}
                  className={`underline transition-all duration-200 ${isParentSelected ? 'text-violet-400' : 'text-slate-400 hover:text-white'}`}
                >
                  {isParentSelected ? 'Viewing Segment' : 'Filter Parent'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
