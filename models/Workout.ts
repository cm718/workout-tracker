import mongoose, { Schema, models } from "mongoose"

const WorkoutExerciseSchema = new Schema({
  exercise: {
    type: Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  sets: {
    type: Number,
    default: 1,
  },
  reps: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  duration: {
    type: Number, // in seconds
  },
  distance: {
    type: Number,
  },
  notes: {
    type: String,
  },
})

const WorkoutSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    exercises: [WorkoutExerciseSchema],
    notes: {
      type: String,
    },
    duration: {
      type: Number, // in minutes
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

const Workout = models.Workout || mongoose.model("Workout", WorkoutSchema)

export default Workout
