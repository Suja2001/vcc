import mongoose from "mongoose";
import { NextResponse } from "next/server";

// MongoDB Connection
const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    return; // Already connected
  }

  try {
    await mongoose.connect('mongodb+srv://suja:sujayuvaraj@cluster0.yebe6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Could not connect to MongoDB");
  }
};

// Score Schema and Model
const ScoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  marks: { type: Number, required: true },
});

const getScoreModel = async () => {
  await connectMongo();
  return mongoose.models.Score || mongoose.model("Score", ScoreSchema);
};

// API Route for getting and posting scores
export async function GET() {
  const Score = await getScoreModel();
  const scores = await Score.find();
  return NextResponse.json({ scores });
}

export async function POST(request) {
  const Score = await getScoreModel();
  const { name, marks } = await request.json();
  const newScore = new Score({ name, marks });
  await newScore.save();
  return NextResponse.json({ score: newScore });
}
