import mongoose, { Schema, models } from "mongoose"

const ExerciseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["strength", "cardio", "flexibility", "balance"],
    },
    description: {
      type: String,
    },
    muscleGroups: {
      type: [String],
    },
    instructions: {
      type: String,
    },
  },
  { timestamps: true },
)

const Exercise = models.Exercise || mongoose.model("Exercise", ExerciseSchema)

export default Exercise
