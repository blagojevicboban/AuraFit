import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

const recipes = [
  {
    title: 'Fruit Smoothie',
    category: 'Breakfast',
    calories: 120,
    protein: 5,
    carbs: 25,
    fat: 2,
    prepTime: '12 Minutes',
    isRecipeOfDay: false,
    imageUrl: '/assets/breakfast.png'
  },
  {
    title: 'Salads With Quinoa',
    category: 'Lunch',
    calories: 320,
    protein: 12,
    carbs: 45,
    fat: 10,
    prepTime: '20 Minutes',
    isRecipeOfDay: false,
    imageUrl: '/assets/nutrition-hero.png'
  },
  {
    title: 'Carrot and Orange Smoothie',
    category: 'Snack',
    calories: 70,
    protein: 2,
    carbs: 15,
    fat: 0.5,
    prepTime: '10 Minutes',
    isRecipeOfDay: true,
    imageUrl: '/assets/nutrition-hero.png'
  }
];

const challenges = [
  {
    title: 'Cycling Challenge',
    intensity: 'Medium',
    duration: '15 Minutes',
    participantsCount: 1250,
    image: '/assets/cycling.png'
  },
  {
    title: 'Summer Yoga Quest',
    intensity: 'Low',
    duration: '20 Minutes',
    participantsCount: 850,
    image: '/assets/yoga.png'
  },
  {
    title: '30 Day Plank',
    intensity: 'High',
    duration: '5 Minutes',
    participantsCount: 3200,
    image: '/assets/plank.png'
  }
];

const forumCategories = [
  {
    title: 'Strength Training Techniques',
    description: 'Discussion on training methods',
    postCount: 156
  },
  {
    title: 'Nutrition and Diet Strategies',
    description: 'Meal planning, supplementation preferences',
    postCount: 243
  },
  {
    title: 'Cardiovascular Fitness',
    description: 'About different types of cardio workouts',
    postCount: 89
  }
];

const mealPlans = [
  {
    title: 'Weight Loss Plan',
    description: 'Low carb, high protein plan for fat loss',
    durationDays: 30,
    recipeIds: []
  },
  {
    title: 'Muscle Gain',
    description: 'High calorie, balanced macros for building muscle',
    durationDays: 60,
    recipeIds: []
  }
];

export async function seedDatabase() {
  console.log('Starting seed process...');
  let count = 0;

  try {
    for (const recipe of recipes) {
      await addDoc(collection(db, 'recipes'), recipe);
      count++;
    }
    for (const challenge of challenges) {
      await addDoc(collection(db, 'challenges'), challenge);
      count++;
    }
    for (const category of forumCategories) {
      await addDoc(collection(db, 'forumCategories'), category);
      count++;
    }
    for (const plan of mealPlans) {
      await addDoc(collection(db, 'mealPlans'), plan);
      count++;
    }
    console.log(`Seed completed! Added ${count} documents.`);
    return { success: true, count };
  } catch (error) {
    console.error('Seed error:', error);
    return { success: false, error: (error as Error).message };
  }
}
