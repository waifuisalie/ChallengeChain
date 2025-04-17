import { users, type User, type InsertUser, challenges, type Challenge, type InsertChallenge, participants, type Participant, type InsertParticipant } from "@shared/schema";

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
  
  // Participant operations
  getAllParticipants(): Promise<Participant[]>;
  getParticipantsByChallenge(challengeId: number): Promise<Participant[]>;
  getParticipantsByUser(userId: number): Promise<Participant[]>;
  createParticipant(participant: InsertParticipant): Promise<Participant>;
  updateParticipantScore(id: number, score: number): Promise<Participant | undefined>;
  setWinner(id: number): Promise<Participant | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private challenges: Map<number, Challenge>;
  private participants: Map<number, Participant>;
  private userCurrentId: number;
  private challengeCurrentId: number;
  private participantCurrentId: number;

  constructor() {
    this.users = new Map();
    this.challenges = new Map();
    this.participants = new Map();
    this.userCurrentId = 1;
    this.challengeCurrentId = 1;
    this.participantCurrentId = 1;
    
    // Add some initial data
    this.seedData();
  }

  private seedData(): void {
    // Create sample users
    const user1 = this.createUser({
      username: "johndoe",
      password: "password123",
      walletAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b"
    });
    
    const user2 = this.createUser({
      username: "janedoe",
      password: "password456",
      walletAddress: "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2"
    });
    
    // Create sample challenges
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + 7);
    
    const challenge1 = this.createChallenge({
      creatorId: user1.id,
      name: "10,000 Steps Challenge",
      description: "Who can walk the most steps in a week! Track with your favorite fitness app.",
      rules: "Track your steps using any fitness app. Submit screenshots daily.",
      category: "Fitness",
      verificationMethod: "app",
      startDate: currentDate,
      endDate: futureDate,
      maxParticipants: 20,
      cryptoType: "SOL",
      entryFee: 0.5,
      status: "active"
    });
    
    const challenge2 = this.createChallenge({
      creatorId: user2.id,
      name: "Coding Streak Challenge",
      description: "Most consecutive days with GitHub contributions. Let's build together!",
      rules: "One contribution per day on GitHub counts as a streak day.",
      category: "Learning",
      verificationMethod: "app",
      startDate: new Date(futureDate.getTime() + 86400000 * 2),
      endDate: new Date(futureDate.getTime() + 86400000 * 14),
      maxParticipants: 15,
      cryptoType: "SOL",
      entryFee: 0.2,
      status: "upcoming"
    });
    
    // Create sample participants
    this.createParticipant({
      challengeId: challenge1.id,
      userId: user1.id,
      walletAddress: user1.walletAddress!,
      score: 5000
    });
    
    this.createParticipant({
      challengeId: challenge1.id,
      userId: user2.id,
      walletAddress: user2.walletAddress!,
      score: 8000
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Challenge methods
  async getAllChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async getChallengeById(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async getChallengesByUser(userId: number): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(
      (challenge) => challenge.creatorId === userId
    );
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = this.challengeCurrentId++;
    const challenge: Challenge = { ...insertChallenge, id };
    this.challenges.set(id, challenge);
    return challenge;
  }

  async updateChallengeStatus(id: number, status: string): Promise<Challenge | undefined> {
    const challenge = this.challenges.get(id);
    if (!challenge) return undefined;
    
    const updatedChallenge = { ...challenge, status };
    this.challenges.set(id, updatedChallenge);
    return updatedChallenge;
  }

  // Participant methods
  async getAllParticipants(): Promise<Participant[]> {
    return Array.from(this.participants.values());
  }

  async getParticipantsByChallenge(challengeId: number): Promise<Participant[]> {
    return Array.from(this.participants.values()).filter(
      (participant) => participant.challengeId === challengeId
    );
  }

  async getParticipantsByUser(userId: number): Promise<Participant[]> {
    return Array.from(this.participants.values()).filter(
      (participant) => participant.userId === userId
    );
  }

  async createParticipant(insertParticipant: InsertParticipant): Promise<Participant> {
    const id = this.participantCurrentId++;
    const joinedAt = new Date();
    const isWinner = false;
    const participant: Participant = { ...insertParticipant, id, joinedAt, isWinner };
    this.participants.set(id, participant);
    return participant;
  }

  async updateParticipantScore(id: number, score: number): Promise<Participant | undefined> {
    const participant = this.participants.get(id);
    if (!participant) return undefined;
    
    const updatedParticipant = { ...participant, score };
    this.participants.set(id, updatedParticipant);
    return updatedParticipant;
  }

  async setWinner(id: number): Promise<Participant | undefined> {
    const participant = this.participants.get(id);
    if (!participant) return undefined;
    
    const updatedParticipant = { ...participant, isWinner: true };
    this.participants.set(id, updatedParticipant);
    return updatedParticipant;
  }
}

export const storage = new MemStorage();
