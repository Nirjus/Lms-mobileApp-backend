import EnrollMent from "../models/enrolledModel.js";
import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
import { sendEmail } from "../config/Nodemailer.js";
export const createEnrollMent = async (req, res, next) => {
  try {
    const user = req.user;

    const { courseId, price, paymentMode, paymentId } = req.body;

    if (!courseId) {
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
        paymentInfo: paymentInfo,
      });
      const emailData = {
        email: user?.email,
        subject: "New Course Enrolled ",
        html: `
          <div style="background-color: #f9f9f9; padding: 40px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
      <h2 style="color: #2a7ae2; text-align: center;">Dear ${user?.name},</h2>
      <p style="color: #333; font-size: 16px; text-align: center;">You have successfully enrolled in a new course.</p>
      <div style="background-color: #fff; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0; margin: 20px 0;">
        <h3 style="color: #2a7ae2; text-align: center;">Course Details</h3>
        <p style="color: #333; font-size: 16px; text-align: center;">Thank you for purchasing our course. We are excited to have you onboard!</p>
      </div>
      <p style="color: #333; font-size: 16px; text-align: center;">Enjoy your learning journey with us.</p>
      <p style="color: #333; font-size: 14px; text-align: center; margin-top: 20px;">Best regards,<br>The ELearner Team</p>
    </div>
        `,
      };
      await sendEmail(emailData);
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
    });
    enrollment.courseList.push({
      courseId: courseId,
      paymentInfo: paymentInfo,
    });
    const emailData = {
      email: user?.email,
      subject: "New Course Enrolled ",
      html: `
       <div style="background-color: #f9f9f9; padding: 40px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
      <h2 style="color: #2a7ae2; text-align: center;">Dear ${user?.name},</h2>
      <p style="color: #333; font-size: 16px; text-align: center;">You have successfully enrolled in a new course.</p>
      <div style="background-color: #fff; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0; margin: 20px 0;">
        <h3 style="color: #2a7ae2; text-align: center;">Course Details</h3>
        <p style="color: #333; font-size: 16px; text-align: center;">Thank you for purchasing our course. We are excited to have you onboard!</p>
      </div>
      <p style="color: #333; font-size: 16px; text-align: center;">Enjoy your learning journey with us.</p>
      <p style="color: #333; font-size: 14px; text-align: center; margin-top: 20px;">Best regards,<br>The ELearner Team</p>
    </div>
      `,
    };
    await sendEmail(emailData);
    await enrollment.save();
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

    return res.status(201).json({
      success: true,
      message: isExists
        ? "Course was already enrolled"
        : "Course is not enrolled",
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
      throw Error("This Course is not enrolled");
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
        getUser.point += 50;
      } else if (getCourse?.courseLevel === "medium") {
        getUser.point += 100;
      } else {
        getUser.point += 150;
      }
      const emailData = {
        email: user?.email,
        subject: "Course Completed 🎉 - Congratulations! ",
        html: `
         <div style="background-color: #f5f5f5; padding: 40px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
      <h2 style="color: #2a7ae2; text-align: center; margin-bottom: 20px;">Congratulations, ${user?.name}! 🎉</h2>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #d9d9d9; margin-bottom: 20px;">
        <h3 style="color: #2a7ae2; text-align: center; margin-bottom: 10px;">Course Completed: ${getCourse?.name}</h3>
        <p style="color: #333; font-size: 16px; text-align: center;">You have successfully completed the course <strong>${getCourse?.name}</strong>.</p>
        <p style="color: #333; font-size: 16px; text-align: center;">You earned <strong>${getUser.point} points</strong> for completing this course.</p>
      </div>
      <p style="color: #333; font-size: 16px; text-align: center;">Now you can download your course completion certificate from the Achievements section.</p>
      <div style="text-align: center; margin-top: 20px; background-color: #2a7ae2; padding: 15px 0; border-radius: 5px;">
        <span style="color: white; font-size: 18px; cursor: pointer; display: inline-block; padding: 15px 30px;">Go to Achievements</span>
      </div>
      <p style="color: #333; font-size: 14px; text-align: center; margin-top: 20px;">Celebrate your achievement and continue learning with us! 🌟</p>
      <p style="color: #333; font-size: 14px; text-align: center;">Best regards,<br>The ELearner Team</p>
    </div>
        `,
      };
      await sendEmail(emailData);
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
    const { courseId } = req.params;

    const isEnrolled = await EnrollMent.findOne({
      userId: user.id,
    });
    if (!isEnrolled) {
      return res
        .status(404)
        .json({ success: false, message: "Course not enrolled" });
    }
    const course = isEnrolled.courseList.find(
      (item) => item?.courseId.toString() === courseId.toString()
    );
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "This Course is not enrolled" });
    }

    return res.status(200).json({
      success: true,
      enrolledCours: course,
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
    const courses = await Course.find({ isPublished: true });
    const enrolledCourse = [];
    courses.forEach((ch) =>
      isEnrolled.courseList.forEach((enr) => {
        if (enr.courseId.toString() === ch._id.toString()) {
          ch.chapter = ch.chapter.filter((ch) => ch.isPublished === true);
          enrolledCourse.push({
            course: ch,
            completedChapter: enr.completedChapter,
            paymentInfo: enr.paymentInfo,
          });
        }
      })
    );

    return res.status(201).json({
      success: true,
      enrolledCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const checkCourseComplete = async (req, res, next) => {
  try {
    const user = req.user;

    const isEnroll = await EnrollMent.findOne({
      userId: user?.id,
    });
    if (!isEnroll) {
      throw Error("You dont have any enrolled course");
    }
    const allcourses = await Course.find({ isPublished: true });
    allcourses?.forEach(
      (course) =>
        (course.chapter = course.chapter?.filter(
          (chapter) => chapter.isPublished === true
        ))
    );
    const completedCourses = [];
    // for(let i=0; i<allcourses.length; i++){}
    isEnroll?.courseList?.forEach((item) => {
      allcourses.forEach((course) => {
        if (course?._id?.toString() === item?.courseId?.toString()) {
          if (course?.chapter?.length === item?.completedChapter?.length) {
            completedCourses.push(course);
          }
        }
      });
    });
    if (completedCourses.length === 0) {
      throw Error("You did not have any completed course");
    }

    return res.status(201).json({
      success: true,
      completedCourses,
    });
  } catch (error) {
    next(error);
  }
};
