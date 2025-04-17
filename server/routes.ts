import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChallengeSchema, insertParticipantSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();

  // User routes
  router.post("/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  router.get("/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await storage.getUser(id);
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    
    res.json(user);
  });

  // Challenge routes
  router.get("/challenges", async (req, res) => {
    try {
      const challenges = await storage.getAllChallenges();
      
      // Get participants for each challenge
      const challengesWithDetails = await Promise.all(challenges.map(async (challenge) => {
        const participants = await storage.getParticipantsByChallenge(challenge.id);
        const creator = await storage.getUser(challenge.creatorId);
        const totalPool = participants.length * challenge.entryFee;
        
        return {
          ...challenge,
          participants,
          creatorName: creator?.username || "Unknown",
          totalPool
        };
      }));
      
      res.json(challengesWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  router.get("/challenges/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const challenge = await storage.getChallengeById(id);
      
      if (!challenge) {
        res.status(404).json({ message: "Challenge not found" });
        return;
      }
      
      const participants = await storage.getParticipantsByChallenge(id);
      const creator = await storage.getUser(challenge.creatorId);
      const totalPool = participants.length * challenge.entryFee;
      
      res.json({
        ...challenge,
        participants,
        creatorName: creator?.username || "Unknown",
        totalPool
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenge" });
    }
  });

  router.post("/challenges", async (req, res) => {
    try {
      // Pre-process the request body to handle date conversions
      const body = { ...req.body };
      
      if (body.startDate && typeof body.startDate === 'string') {
        body.startDate = new Date(body.startDate);
      }
      
      if (body.endDate && typeof body.endDate === 'string') {
        body.endDate = new Date(body.endDate);
      }
      
      const challengeData = insertChallengeSchema.parse(body);
      const challenge = await storage.createChallenge(challengeData);
      res.status(201).json(challenge);
    } catch (error) {
      console.error("Challenge creation error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Failed to create challenge" });
    }
  });

  router.patch("/challenges/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["upcoming", "active", "completed"].includes(status)) {
        res.status(400).json({ message: "Invalid status" });
        return;
      }
      
      const updatedChallenge = await storage.updateChallengeStatus(id, status);
      
      if (!updatedChallenge) {
        res.status(404).json({ message: "Challenge not found" });
        return;
      }
      
      res.json(updatedChallenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to update challenge status" });
    }
  });

  // Participant routes
  router.get("/challenges/:challengeId/participants", async (req, res) => {
    try {
      const challengeId = parseInt(req.params.challengeId);
      const participants = await storage.getParticipantsByChallenge(challengeId);
      
      // Enrich participant data with user information
      const enrichedParticipants = await Promise.all(
        participants.map(async (participant) => {
          const user = await storage.getUser(participant.userId);
          return {
            ...participant,
            username: user?.username || "Unknown"
          };
        })
      );
      
      res.json(enrichedParticipants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch participants" });
    }
  });

  router.post("/challenges/:challengeId/participants", async (req, res) => {
    try {
      const challengeId = parseInt(req.params.challengeId);
      const challenge = await storage.getChallengeById(challengeId);
      
      if (!challenge) {
        res.status(404).json({ message: "Challenge not found" });
        return;
      }
      
      // Check if challenge is still open for joining
      if (challenge.status !== "upcoming" && challenge.status !== "active") {
        res.status(400).json({ message: "Challenge is not open for joining" });
        return;
      }
      
      // Check if max participants limit is reached
      const participants = await storage.getParticipantsByChallenge(challengeId);
      if (participants.length >= challenge.maxParticipants) {
        res.status(400).json({ message: "Challenge has reached maximum participants" });
        return;
      }
      
      const participantData = insertParticipantSchema.parse({
        ...req.body,
        challengeId
      });
      
      const participant = await storage.createParticipant(participantData);
      res.status(201).json(participant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Failed to join challenge" });
    }
  });

  router.patch("/participants/:id/score", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { score } = req.body;
      
      if (score === undefined || isNaN(score)) {
        res.status(400).json({ message: "Invalid score" });
        return;
      }
      
      const updatedParticipant = await storage.updateParticipantScore(id, score);
      
      if (!updatedParticipant) {
        res.status(404).json({ message: "Participant not found" });
        return;
      }
      
      res.json(updatedParticipant);
    } catch (error) {
      res.status(500).json({ message: "Failed to update participant score" });
    }
  });

  router.patch("/participants/:id/winner", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedParticipant = await storage.setWinner(id);
      
      if (!updatedParticipant) {
        res.status(404).json({ message: "Participant not found" });
        return;
      }
      
      // Also update the challenge status to completed
      const challenge = await storage.getChallengeById(updatedParticipant.challengeId);
      if (challenge) {
        await storage.updateChallengeStatus(challenge.id, "completed");
      }
      
      res.json(updatedParticipant);
    } catch (error) {
      res.status(500).json({ message: "Failed to set participant as winner" });
    }
  });

  // Use the router with /api prefix
  app.use("/api", router);

  const httpServer = createServer(app);
  return httpServer;
}
