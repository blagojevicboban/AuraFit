import { collection, doc, writeBatch, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const seedDatabase = async () => {
  const batch = writeBatch(db);

  // 1. Create a Coach
  const coachId = 'seed-coach-1';
  const coachRef = doc(collection(db, 'users'), coachId);
  batch.set(coachRef, {
    uid: coachId,
    email: 'trener@test.local',
    displayName: 'Trener Marko',
    role: 'coach',
    createdAt: Timestamp.now(),
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marko'
  });

  // 2. Create Clients assigned to the Coach
  const clients = [
    { id: 'seed-client-1', name: 'Ana Klijent', email: 'ana@test.local' },
    { id: 'seed-client-2', name: 'Petar Klijent', email: 'petar@test.local' },
    { id: 'seed-client-3', name: 'Jovan Klijent', email: 'jovan@test.local' }
  ];

  clients.forEach((client, index) => {
    const clientRef = doc(collection(db, 'users'), client.id);
    batch.set(clientRef, {
      uid: client.id,
      email: client.email,
      displayName: client.name,
      role: 'client',
      coachId: coachId,
      createdAt: Timestamp.now(),
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name.replace(' ', '')}`
    });

    // 3. Create Workouts for each client
    const workoutRef1 = doc(collection(db, 'workouts'));
    batch.set(workoutRef1, {
      userId: client.id,
      title: 'Trening Snage - Gornji deo',
      duration: 45,
      exercises: [
        { name: 'Sklekovi', sets: 3, reps: 15 },
        { name: 'Zgibovi', sets: 3, reps: 8 },
        { name: 'Plank', sets: 3, reps: 60 }
      ],
      createdAt: Timestamp.now()
    });

    const workoutRef2 = doc(collection(db, 'workouts'));
    batch.set(workoutRef2, {
      userId: client.id,
      title: 'Kardio Trening',
      duration: 30,
      exercises: [
        { name: 'Trčanje na traci', sets: 1, reps: 30 }
      ],
      createdAt: Timestamp.now()
    });

    // 4. Create Meals for each client
    const mealRef1 = doc(collection(db, 'meals'));
    batch.set(mealRef1, {
      userId: client.id,
      description: 'Doručak: Ovseni pahuljice sa šumskim voćem i mericom proteina.',
      calories: 450,
      protein: 30,
      carbs: 55,
      fat: 12,
      createdAt: Timestamp.now()
    });

    const mealRef2 = doc(collection(db, 'meals'));
    batch.set(mealRef2, {
      userId: client.id,
      description: 'Ručak: Piletina na žaru sa pirinčem i brokolijem.',
      calories: 600,
      protein: 50,
      carbs: 70,
      fat: 15,
      createdAt: Timestamp.now()
    });
  });

  // Commit the batch
  await batch.commit();
};
