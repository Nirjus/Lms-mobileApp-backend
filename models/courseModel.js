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
const questionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    question: {
      type: String,
    },
    answers: [
      {
        userName: {
          type: String,
        },
        answer: {
          type: String,
        },
        create: {
          type: Date,
        },
      },
    ],
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
      required: [true, "Description is required"],
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
      required: [true, "Time is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
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
      required: [true, "Level is required"],
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    tags: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    chapter: [
      {
        title: {
          type: String,
          required: [true, "Course Title is required"],
        },
        content: {
          type: String,
        },
        video: {
          public_id: {
            type: String,
          },
          url: {
            type: String,
          },
        },
        quiz: [quizSchema],
        output: {
          type: String,
        },
        qna: [questionSchema],
      },
    ],
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Course = mongoose.model("Courses", courseSchema);

export default Course;
