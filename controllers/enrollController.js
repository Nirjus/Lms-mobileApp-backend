import EnrollMent from "../models/enrolledModel.js";

export const createEnrollMent = async (req, res, next) => {
  try {
    const user = req.user;

    const { courseId, courseName, price, paymentMode, paymentId } = req.body;

    if (!courseId || !courseName) {
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
      (item) => item.courseId.toString() === courseId.toString()
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
