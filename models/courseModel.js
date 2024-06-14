import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "user is required"],
    },
  },
  { timestamps: true }
);

const quizSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  options: [String],
  answerIndex: {
    type: Number,
  },
});
const chapterModel = new mongoose.Schema({
  isPublished: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: [true, "Course Title is required"],
  },
  content: {
    type: String,
  },
  isFree: {
    type: Boolean,
    default: false,
  },
  video: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
    duration: {
      type: String,
    },
  },
  quiz: [quizSchema],
  output: {
    type: String,
  },
});
const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    banner: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    time: {
      type: String,
      default: "00:00",
    },
    price: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
    },
    courseLevel: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
    },
    chapter: [chapterModel],
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Course = mongoose.model("Courses", courseSchema);

export default Course;
