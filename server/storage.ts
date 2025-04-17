import { users, type User, type InsertUser, challenges, type Challenge, type InsertChallenge, participants, type Participant, type InsertParticipant } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Challenge operations
  getAllChallenges(): Promise<Challenge[]>;
  getChallengeById(id: number): Promise<Challenge | undefined>;
  getChallengesByUser(userId: number): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallengeStatus(id: number, status: string): Promise<Challenge | undefined>;
  deleteChallenge(id: number): Promise<boolean>;
  
  // Participant operations
  getAllParticipants(): Promise<Participant[]>;
  getParticipantsByChallenge(challengeId: number): Promise<Participant[]>;
  getParticipantsByUser(userId: number): Promise<Participant[]>;
  createParticipant(participant: InsertParticipant): Promise<Participant>;
  updateParticipantScore(id: number, score: number): Promise<Participant | undefined>;
  setWinner(id: number): Promise<Participant | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAllChallenges(): Promise<Challenge[]> {
    return await db.select().from(challenges);
  }

  async getChallengeById(id: number): Promise<Challenge | undefined> {
    const result = await db.select().from(challenges).where(eq(challenges.id, id));
    return result[0];
  }

  async getChallengesByUser(userId: number): Promise<Challenge[]> {
    return await db.select().from(challenges).where(eq(challenges.creatorId, userId));
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const result = await db.insert(challenges).values(insertChallenge).returning();
    return result[0];
  }

  async updateChallengeStatus(id: number, status: string): Promise<Challenge | undefined> {
    const result = await db
      .update(challenges)
      .set({ status })
      .where(eq(challenges.id, id))
      .returning();
    return result[0];
  }
  
  async deleteChallenge(id: number): Promise<boolean> {
    try {
      // First, delete all participants
      await db.delete(participants).where(eq(participants.challengeId, id));
      
      // Then delete the challenge
      const result = await db.delete(challenges).where(eq(challenges.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting challenge:', error);
      return false;
    }
  }

  async getAllParticipants(): Promise<Participant[]> {
    return await db.select().from(participants);
  }

  async getParticipantsByChallenge(challengeId: number): Promise<Participant[]> {
    return await db.select().from(participants).where(eq(participants.challengeId, challengeId));
  }

  async getParticipantsByUser(userId: number): Promise<Participant[]> {
    return await db.select().from(participants).where(eq(participants.userId, userId));
  }

  async createParticipant(insertParticipant: InsertParticipant): Promise<Participant> {
    const result = await db.insert(participants).values({
      ...insertParticipant,
      joinedAt: new Date(),
      isWinner: false
    }).returning();
    return result[0];
  }

  async updateParticipantScore(id: number, score: number): Promise<Participant | undefined> {
    const result = await db
      .update(participants)
      .set({ score })
      .where(eq(participants.id, id))
      .returning();
    return result[0];
  }

  async setWinner(id: number): Promise<Participant | undefined> {
    // First, get the participant to find the challenge
    const participant = await this.getParticipantById(id);
    if (!participant) return undefined;

    // Reset any existing winners for this challenge
    await db
      .update(participants)
      .set({ isWinner: false })
      .where(eq(participants.challengeId, participant.challengeId));

    // Set this participant as the winner
    const result = await db
      .update(participants)
      .set({ isWinner: true })
      .where(eq(participants.id, id))
      .returning();
    return result[0];
  }

  private async getParticipantById(id: number): Promise<Participant | undefined> {
    const result = await db.select().from(participants).where(eq(participants.id, id));
    return result[0];
  }
}

export const storage = new DatabaseStorage();