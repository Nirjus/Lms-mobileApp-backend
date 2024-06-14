import mongoose from "mongoose";

const enrollSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: [true, "User Email is required field"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "User Id is required"],
    },
    courseList: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Courses",
          required: [true, "CourseID is required"],
        },
        paymentInfo: {
          price: {
            type: Number,
          },
          paymentMode: {
            type: String,
          },
          paymentId: {
            type: String,
          },
        },
        completedChapter: [
          {
            chapterID: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Courses",
            },
            chapterTitle: {
              type: String,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const EnrollMent = mongoose.model("Enrollments", enrollSchema);

export default EnrollMent;
