import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  rules: text("rules").notNull(),
  category: text("category").notNull(),
  verificationMethod: text("verification_method").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  maxParticipants: integer("max_participants").notNull(),
  cryptoType: text("crypto_type").notNull(),
  entryFee: doublePrecision("entry_fee").notNull(),
  status: text("status").notNull().default("upcoming"),
  imageUrl: text("image_url"),
});

export const participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  userId: integer("user_id").notNull().references(() => users.id),
  walletAddress: text("wallet_address").notNull(),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  isWinner: boolean("is_winner").notNull().default(false),
  score: doublePrecision("score"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  creatorId: true,
  name: true,
  description: true,
  rules: true,
  category: true,
  verificationMethod: true,
  startDate: true,
  endDate: true,
  maxParticipants: true,
  cryptoType: true,
  entryFee: true,
  status: true,
  imageUrl: true,
});

export const insertParticipantSchema = createInsertSchema(participants).pick({
  challengeId: true,
  userId: true,
  walletAddress: true,
  score: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
export type Participant = typeof participants.$inferSelect;

// Custom types for frontend use
export type ChallengeWithParticipants = Challenge & {
  participants: Participant[];
  creatorName: string;
  totalPool: number;
};
