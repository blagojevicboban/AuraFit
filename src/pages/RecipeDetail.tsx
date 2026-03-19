import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ChevronLeft, Clock, Flame, Users, Heart, CheckCircle2, ChefHat,
  Beef, Wheat, Droplets, Play
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

// Recipe data keyed by id — can be extended or fetched from Firestore later
const recipes: Record<number, {
  name: string;
  icon: string;
  time: string;
  kcal: string;
  servings: string;
  protein: string;
  carbs: string;
  fat: string;
  description: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
}> = {
  1: {
    name: 'Delights With Greek Yogurt',
    icon: '🥣',
    time: '6 Minutes',
    kcal: '200 Cal',
    servings: '1',
    protein: '18g',
    carbs: '22g',
    fat: '4g',
    description: 'A protein-packed breakfast bowl that keeps you full and energized throughout the morning.',
    ingredients: [
      '200g Greek yogurt (full fat or low fat)',
      '1 tbsp honey',
      '30g granola',
      '1 handful of mixed berries',
      '1 tsp chia seeds',
      'Fresh mint (optional)',
    ],
    steps: [
      'Spoon Greek yogurt into a bowl and spread evenly.',
      'Drizzle honey evenly over the yogurt.',
      'Sprinkle granola for crunch and texture.',
      'Add a generous handful of mixed berries on top.',
      'Sprinkle chia seeds and garnish with fresh mint if desired.',
      'Serve immediately and enjoy!',
    ],
    tags: ['High Protein', 'Quick', 'Breakfast'],
  },
  2: {
    name: 'Spinach And Tomato Omelette',
    icon: '🍳',
    time: '10 Minutes',
    kcal: '220 Cal',
    servings: '1',
    protein: '20g',
    carbs: '6g',
    fat: '14g',
    description: 'A classic protein-rich omelette loaded with vegetables to kickstart your day right.',
    ingredients: [
      '3 large eggs',
      '1 cup fresh spinach',
      '1 medium tomato, diced',
      '1 tbsp olive oil',
      'Salt and pepper to taste',
      '30g feta cheese (optional)',
    ],
    steps: [
      'Beat the eggs with salt and pepper in a bowl until frothy.',
      'Heat olive oil in a non-stick pan over medium heat.',
      'Add spinach and cook until wilted, about 1-2 minutes.',
      'Add diced tomatoes and stir briefly.',
      'Pour the egg mixture over the vegetables evenly.',
      'When edges set, fold omelette in half and cook 1 more minute.',
      'Crumble feta on top before serving.',
    ],
    tags: ['Low Carb', 'High Protein', 'Breakfast'],
  },
  3: {
    name: 'Avocado And Egg Toast',
    icon: '🥑',
    time: '15 Minutes',
    kcal: '150 Cal',
    servings: '1',
    protein: '10g',
    carbs: '18g',
    fat: '9g',
    description: 'A trendy, nutrient-dense breakfast with healthy fats and protein to fuel your workout.',
    ingredients: [
      '2 slices whole grain bread',
      '1 ripe avocado',
      '2 eggs (poached or fried)',
      'Juice of ½ lemon',
      'Red pepper flakes',
      'Salt and pepper to taste',
      'Everything bagel seasoning (optional)',
    ],
    steps: [
      'Toast the bread slices until golden and crispy.',
      'Halve the avocado, remove pit, and scoop flesh into a bowl.',
      'Mash with lemon juice, salt and pepper.',
      'Spread the avocado mixture evenly on toast.',
      'Poach or fry eggs to your preference.',
      'Place egg on top of avocado toast.',
      'Garnish with red pepper flakes and seasoning.',
    ],
    tags: ['Healthy Fats', 'Balanced', 'Breakfast'],
  },
  4: {
    name: 'Protein Shake With Fruits',
    icon: '🥤',
    time: '9 Minutes',
    kcal: '180 Cal',
    servings: '1',
    protein: '28g',
    carbs: '24g',
    fat: '3g',
    description: 'A quick post-workout shake packed with protein and natural fruit sugars for fast recovery.',
    ingredients: [
      '1 scoop vanilla protein powder',
      '250ml almond milk (or regular milk)',
      '1 banana',
      '100g frozen mixed berries',
      '1 tbsp peanut butter',
      'Ice cubes (optional)',
    ],
    steps: [
      'Add almond milk to the blender first.',
      'Add protein powder and peanut butter.',
      'Break the banana into pieces and add.',
      'Add the frozen berries and ice if using.',
      'Blend on high for 45-60 seconds until smooth.',
      'Pour into a chilled glass and serve immediately.',
    ],
    tags: ['Post-Workout', 'High Protein', 'Quick'],
  },
};

const RecipeDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [liked, setLiked] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const recipeId = (location.state as any)?.recipeId ?? 3;
  const recipe = recipes[recipeId] ?? recipes[3];

  const toggleStep = (index: number) => {
    setCompletedSteps(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const progress = completedSteps.length / recipe.steps.length;

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans flex flex-col pb-24">

      {/* ── Hero Banner ── */}
      <div className="relative bg-gradient-to-br from-zinc-800 to-zinc-900 pt-14 pb-10 px-6 rounded-b-[3rem] overflow-hidden shadow-2xl">
        {/* Decorative blobs */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#d6ff3e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-[#afa3ff]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Back + Like */}
        <div className="relative z-10 flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-300 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => setLiked(!liked)}
            className={`p-2.5 rounded-2xl transition-all ${liked ? 'bg-rose-500/20 text-rose-400' : 'bg-white/10 text-zinc-400 hover:bg-white/20'}`}
          >
            <Heart size={22} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Emoji + Title */}
        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl drop-shadow-2xl"
          >
            {recipe.icon}
          </motion.div>
          <div>
            <h1 className="text-2xl font-black text-white mb-2 leading-tight">{recipe.name}</h1>
            <div className="flex flex-wrap justify-center gap-2">
              {recipe.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-[#d6ff3e]/10 border border-[#d6ff3e]/20 text-[#d6ff3e] text-xs font-bold rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 flex items-center justify-around mt-8 bg-white/5 border border-white/10 rounded-2xl py-4 px-2">
          {[
            { icon: Clock, label: 'Time', value: recipe.time },
            { icon: Flame, label: 'Calories', value: recipe.kcal },
            { icon: Users, label: 'Servings', value: recipe.servings },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon size={18} className="text-[#afa3ff]" />
              <p className="text-white font-black text-base">{value}</p>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pt-6 space-y-6">

        {/* Description */}
        <p className="text-zinc-400 text-sm leading-relaxed">{recipe.description}</p>

        {/* Macros */}
        <div>
          <h2 className="text-base font-black text-white mb-3 flex items-center gap-2">
            <ChefHat size={18} className="text-[#d6ff3e]" /> Macros per serving
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Beef, label: 'Protein', value: recipe.protein, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
              { icon: Wheat, label: 'Carbs', value: recipe.carbs, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
              { icon: Droplets, label: 'Fat', value: recipe.fat, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className={`${bg} border rounded-2xl p-3 flex flex-col items-center gap-1`}>
                <Icon size={18} className={color} />
                <p className="text-white font-black text-lg">{value}</p>
                <p className={`${color} text-[10px] font-bold uppercase tracking-wider`}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <h2 className="text-base font-black text-white mb-3">🛒 Ingredients</h2>
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 divide-y divide-zinc-800 overflow-hidden">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="w-2 h-2 rounded-full bg-[#d6ff3e] shrink-0" />
                <p className="text-zinc-300 text-sm">{ing}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps with progress */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Play size={18} className="text-[#afa3ff]" /> Instructions
            </h2>
            <span className="text-xs text-zinc-500 font-semibold">{completedSteps.length}/{recipe.steps.length} done</span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-zinc-800 rounded-full mb-4 overflow-hidden">
            <motion.div
              className="h-full bg-[#d6ff3e] rounded-full"
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: 'spring', stiffness: 120 }}
            />
          </div>

          <div className="space-y-3">
            {recipe.steps.map((step, i) => {
              const done = completedSteps.includes(i);
              return (
                <motion.button
                  key={i}
                  onClick={() => toggleStep(i)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all ${
                    done
                      ? 'bg-[#d6ff3e]/10 border-[#d6ff3e]/30'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                    done ? 'bg-[#d6ff3e] border-[#d6ff3e]' : 'border-zinc-600'
                  }`}>
                    {done
                      ? <CheckCircle2 size={16} className="text-[#1c1c1c]" />
                      : <span className="text-xs font-black text-zinc-400">{i + 1}</span>
                    }
                  </div>
                  <p className={`text-sm leading-relaxed ${done ? 'text-zinc-400 line-through' : 'text-zinc-200'}`}>
                    {step}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* All done CTA */}
        {completedSteps.length === recipe.steps.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#d6ff3e]/10 border border-[#d6ff3e]/30 rounded-3xl p-6 text-center space-y-2"
          >
            <p className="text-4xl">🎉</p>
            <p className="text-[#d6ff3e] font-black text-lg">Meal Complete!</p>
            <p className="text-zinc-400 text-sm">Great job! You've completed all the steps.</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-3 px-6 py-3 bg-[#d6ff3e] text-[#1c1c1c] font-black rounded-2xl text-sm uppercase tracking-widest"
            >
              Back to Meal Plan
            </button>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default RecipeDetail;
