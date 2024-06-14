import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  chapters: [
    {
      chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
      },
      questions: [
        {
          userName: {
            type: String,
            required: [true, "Name is required"],
          },
          questionString: {
            type: String,
            trim: true,
          },
          answers: [
            {
              userName: {
                type: String,
              },
              answer: {
                type: String,
                trim: true,
              },
              create: {
                type: Date,
              },
            },
          ],
          create: {
            type: Date,
          },
        },
      ],
    },
  ],
});

const QnaModel = mongoose.model("Questions", questionSchema);

export default QnaModel;
