import QnaModel from "../models/qnaModel.js";

export const addQuestion = async (req, res, next) => {
  try {
    const user = req.user;
    const { courseId, chapterId, questionString } = req.body;
    if (!courseId || !chapterId || !questionString) {
      throw Error("Please provide all information");
    }
    let addQns = await QnaModel.findOne({ courseId: courseId });

    if (addQns) {
      const chapterQna = addQns.chapters.find(
        (chapter) => chapter.chapterId?.toString() === chapterId?.toString()
      );
      if (chapterQna) {
        chapterQna?.questions.unshift({
          userName: user?.name,
          questionString: questionString,
          create: Date.now(),
        });
      } else {
        addQns.chapters.push({
          chapterId: chapterId,
          questions: [
            {
              userName: user?.name,
              questionString: questionString,
              create: Date.now(),
            },
          ],
        });
      }
    } else {
      addQns = await QnaModel.create({
        courseId: courseId,
        chapters: [
          {
            chapterId: chapterId,
            questions: [
              {
                userName: user?.name,
                questionString: questionString,
                create: Date.now(),
              },
            ],
          },
        ],
      });
    }
    await addQns.save();
    const chapterQna = addQns.chapters.find(
      (chapter) => chapter.chapterId?.toString() === chapterId?.toString()
    );

    return res.status(201).json({
      success: true,
      message: "Question added successfully",
      chapterQna,
    });
  } catch (error) {
    next(error);
  }
};

export const addAnswer = async (req, res, next) => {
  try {
    const user = req.user;
    const { courseId, chapterId, answer, questionId } = req.body;
    if (!courseId || !chapterId || !answer || !questionId) {
      throw Error("Please add all information");
    }
    const qnamodel = await QnaModel.findOne({ courseId: courseId });

    if (!qnamodel) {
      throw Error("Something went wrong");
    }
    const chapterQna = qnamodel.chapters.find(
      (chapter) => chapter.chapterId?.toString() === chapterId?.toString()
    );

    if (!chapterQna) {
      throw Error("There is no such content");
    }
    const question = chapterQna.questions.find(
      (question) => question?._id?.toString() === questionId?.toString()
    );

    if (!question) {
      throw Error("There is no such question found!");
    }
    question.answers.push({
      userName: user?.name,
      answer: answer,
      create: Date.now(),
    });

    await qnamodel.save();

    return res.status(200).json({
      success: true,
      message: "Answer added successfully",
      chapterQna,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllQnaOfAChapter = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { chapterId } = req.query;
    const qnamodel = await QnaModel.findOne({ courseId: courseId });

    if (!qnamodel) {
      throw Error("something went wrong");
    }
    const chapterQna = qnamodel.chapters.find(
      (chapter) => chapter.chapterId?.toString() === chapterId?.toString()
    );

    return res.status(200).json({
      success: true,
      message: "all qna returns",
      chapterQna,
    });
  } catch (error) {
    next(error);
  }
};
