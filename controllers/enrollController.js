import EnrollMent from "../models/enrolledModel.js";
import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
export const createEnrollMent = async (req, res, next) => {
  try {
    const user = req.user;

    const { courseId, courseName, course, price, paymentMode, paymentId } =
      req.body;

    if (!courseId || !courseName || !course) {
      throw Error("Please Provide all information");
    }
    const checkEnrollment = await EnrollMent.findOne({
      userId: user.id,
    });
    const isEnrolled = checkEnrollment?.courseList?.find(
      (item) => item.courseId.toString() === courseId.toString()
    );
    if (isEnrolled) {
      throw Error("Course is Already Enrolled");
    }

    const paymentInfo = {
      price,
      paymentMode,
      paymentId,
    };
    if (checkEnrollment) {
      checkEnrollment.courseList.push({
        courseId: courseId,
        course: course,
        courseName: courseName,
        paymentInfo: paymentInfo,
      });

      await checkEnrollment.save();

      return res.status(201).json({
        success: true,
        message: "Course Enrolled Successfully",
        checkEnrollment,
      });
    }
    const enrollment = await EnrollMent.create({
      userId: user.id,
      userEmail: user.email,
      courseList: [
        {
          courseId: courseId,
          course: course,
          courseName: courseName,
          paymentInfo: paymentInfo,
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Course Enrolled Successfully",
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

export const checkEnroll = async (req, res, next) => {
  try {
    const user = req.user;
    const { courseId } = req.query;

    const isEnrolled = await EnrollMent.findOne({
      userId: user.id,
    });
    if (!isEnrolled) {
      return res.status(400).json({
        success: false,
        message: "Course not enrolled",
      });
    }
    const isExists = isEnrolled?.courseList.some(
      (item) => item?.courseId?.toString() === courseId.toString()
    );

    if (isExists) {
      return res.status(201).json({
        success: true,
        message: "Course was already enrolled",
        enroll: isExists,
      });
    }
    return res.status(201).json({
      success: true,
      message: "Course is not enrolled",
      enroll: isExists,
    });
  } catch (error) {
    next(error);
  }
};

export const chapterCompleteController = async (req, res, next) => {
  try {
    const user = req.user;
    const { courseId } = req.query;
    const { chapterID, chapterTitle } = req.body;

    const getCourse = await Course.findById(courseId);
    if (!getCourse) {
      throw Error("Course not found with this ID");
    }
    const isEnrolled = await EnrollMent.findOne({
      userId: user.id,
    });
    if (!isEnrolled) {
      return res.status(400).json({
        success: false,
        message: "Course not enrolled",
      });
    }
    const course = isEnrolled.courseList.find(
      (item) => item?.courseId.toString() === courseId.toString()
    );
    if (!course) {
      throw Error("Course not found");
    }
    const isComplete = course?.completedChapter?.some(
      (item) => item?.chapterID.toString() === chapterID?.toString()
    );
    if (isComplete) {
      throw Error("You already completed this chapter");
    }

    course.completedChapter.push({
      chapterID: chapterID,
      chapterTitle: chapterTitle,
    });

    const getUser = await User.findById(user?.id);
    if (course?.completedChapter?.length === getCourse?.chapter?.length) {
      if (getCourse?.courseLevel === "easy") {
        getUser.point = 50;
      } else if (getCourse?.courseLevel === "medium") {
        getUser.point = 100;
      } else {
        getUser.point = 150;
      }
    }

    await isEnrolled.save();
    await getUser.save();
    return res.status(201).json({
      success: true,
      message: "Chapter completed",
      chapterLength: course.completedChapter.length,
      user: getUser,
    });
  } catch (error) {
    next(error);
  }
};

export const checkChapterCompleted = async (req, res, next) => {
  try {
    const user = req.user;
    const { courseId, chapterID } = req.query;

    const isEnrolled = await EnrollMent.findOne({
      userId: user.id,
    });
    if (!isEnrolled) {
      return res.status(400).json({
        success: false,
        message: "You not enrolled this course",
      });
    }
    const course = isEnrolled.courseList.find(
      (item) => item?.courseId.toString() === courseId.toString()
    );
    if (!course) {
      throw Error("Course not enrolled");
    }
    const isComplete = course?.completedChapter?.some(
      (item) => item?.chapterID?.toString() === chapterID.toString()
    );

    return res.status(201).json({
      success: true,
      isComplete,
    });
  } catch (error) {
    next(error);
  }
};

export const getEnrollCourses = async (req, res, next) => {
  try {
    const user = req.user;

    const isEnrolled = await EnrollMent.findOne({
      userId: user.id,
    });
    if (!isEnrolled) {
      throw Error("You dont have any Enrolled Course now");
    }

    return res.status(201).json({
      success: true,
      enrolledCourses: isEnrolled.courseList,
    });
  } catch (error) {
    next(error);
  }
};
