import { db } from './db';
import { users, challenges, participants } from '../shared/schema';

async function seed() {
  console.log('🌱 Seeding database...');
  
  // Check if we already have users
  const existingUsers = await db.select().from(users);
  
  if (existingUsers.length > 0) {
    console.log('Database already has data, skipping seed');
    return;
  }
  
  // Insert users
  const [user1] = await db.insert(users).values([
    {
      username: 'johndoe',
      password: 'password123',
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    }
  ]).returning();
  
  // Insert challenges
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  
  const [challenge1] = await db.insert(challenges).values([
    {
      creatorId: user1.id,
      name: '10,000 Steps Challenge',
      description: 'Walk 10,000 steps every day for a week',
      rules: 'You must upload a screenshot of your step counter each day',
      category: 'fitness',
      verificationMethod: 'app',
      startDate: now,
      endDate: oneWeekFromNow,
      maxParticipants: 20,
      cryptoType: 'SOL',
      entryFee: 0.5,
      status: 'active'
    }
  ]).returning();
  
  const [challenge2] = await db.insert(challenges).values([
    {
      creatorId: user1.id,
      name: 'No Sugar Challenge',
      description: 'Avoid all added sugar for two weeks',
      rules: 'No foods with added sugar. Natural sugars in fruits are allowed.',
      category: 'health',
      verificationMethod: 'photo',
      startDate: now,
      endDate: twoWeeksFromNow,
      maxParticipants: 15,
      cryptoType: 'DOT',
      entryFee: 1.0,
      status: 'active'
    }
  ]).returning();
  
  const [challenge3] = await db.insert(challenges).values([
    {
      creatorId: user1.id,
      name: 'Coding Streak',
      description: 'Code for at least 1 hour every day',
      rules: 'Submit a screenshot of your GitHub contribution graph daily',
      category: 'learning',
      verificationMethod: 'app',
      startDate: now,
      endDate: twoWeeksFromNow,
      maxParticipants: 10,
      cryptoType: 'SOL',
      entryFee: 0.75,
      status: 'upcoming'
    }
  ]).returning();
  
  console.log('✅ Seed completed successfully!');
}

seed().catch(err => {
  console.error('❌ Seed failed:');
  console.error(err);
  process.exit(1);
});