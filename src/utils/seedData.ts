import { collection, doc, writeBatch, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const seedDatabase = async () => {
  const batch = writeBatch(db);

  // 1. Create a System Admin
  const adminId = 'seed-admin-1';
  const adminRef = doc(collection(db, 'users'), adminId);
  batch.set(adminRef, {
    uid: adminId,
    email: 'admin@system.local',
    displayName: 'Sistemski Admin',
    role: 'admin',
    createdAt: Timestamp.now(),
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    dob: '01/01/2000',
    weight: 80,
    height: 180,
    setupCompleted: true
  });

  // 2. Create a Coach
  const coachId = 'seed-coach-1';
  const coachRef = doc(collection(db, 'users'), coachId);
  batch.set(coachRef, {
    uid: coachId,
    email: 'coach@aura.fit',
    displayName: 'Trener Marko',
    role: 'coach',
    createdAt: Timestamp.now(),
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marko',
    dob: '01/01/2000',
    weight: 80,
    height: 180,
    setupCompleted: true
  });

  // 3. Create a Main Client
  const mainClientId = 'seed-client-1';
  const mainClientRef = doc(collection(db, 'users'), mainClientId);
  batch.set(mainClientRef, {
    uid: mainClientId,
    email: 'client@aura.fit',
    displayName: 'Glavni Klijent',
    role: 'client',
    coachId: coachId,
    createdAt: Timestamp.now(),
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Client',
    dob: '01/01/2000',
    weight: 80,
    height: 180,
    setupCompleted: true
  });

  // 4. Create additional Clients assigned to the Coach
  const extraClients = [
    { id: 'seed-client-2', name: 'Petar Klijent', email: 'petar@test.local' },
    { id: 'seed-client-3', name: 'Jovan Klijent', email: 'jovan@test.local' }
  ];

  extraClients.forEach((client) => {
    const clientRef = doc(collection(db, 'users'), client.id);
    batch.set(clientRef, {
      uid: client.id,
      email: client.email,
      displayName: client.name,
      role: 'client',
      coachId: coachId,
      createdAt: Timestamp.now(),
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name.replace(' ', '')}`,
      dob: '01/01/2000',
      weight: 80,
      height: 180,
      setupCompleted: true
    });

    // 5. Create Workouts for each client
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

    // 6. Create Meals for each client
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
  });

  // Commit the batch
  await batch.commit();
};

