import cloudinary from "cloudinary";
import { getDataUri } from "../utils/fileHandler.js";
import Course from "../models/courseModel.js";
import { durationToMinute, minutesToDuration } from "../utils/timeHandler.js";

export const courseOnboarding = async (req, res, next) => {
  try {
    const user = req.user;
    const { name } = req.body;
    if (!name) {
      throw Error("Please provide a name of your course");
    }

    const course = await Course.create({
      name: name,
      author: user?.name,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    next(error);
  }
};
export const publisedCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      throw Error("Course not found");
    }
    const { isPublished } = req.body;
    if (
      !course.name ||
      !course.description ||
      !course.banner ||
      !course.category ||
      course.price === undefined ||
      !course.courseLevel ||
      course.tags.length === 0 ||
      course.chapter.length === 0
    ) {
      throw Error("Missing required fields");
    }
    if (isPublished !== undefined) {
      course.isPublished = isPublished;
    }
    await course.save();
    return res.status(201).json({
      success: true,
      message: course?.isPublished ? "Course published" : "Course unpublished",
      course,
    });
  } catch (error) {
    next(error);
  }
};
export const getCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      throw Error("Course not found with this ID");
    }
    // filter chapters to include only published course
    course.chapter = course.chapter.filter((ch) => ch.isPublished === true);
    return res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    next(error);
  }
};

export const addChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const course = await Course.findById(id);

    if (!course) {
      throw Error("Course not found with this ID");
    }

    if (!title) {
      throw Error("Please provide chapter title");
    }

    course.chapter.push({ title: title });

    await course.save();

    return res.status(201).json({
      success: true,
      message: "new chapter added in Course",
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const getChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      throw Error("Course not found");
    }
    const { chapterId } = req.query;
    if (!chapterId) {
      throw Error("Chapter Id not found");
    }
    const chapter = course.chapter.find(
      (chp) => chp._id.toString() === chapterId.toString()
    );

    if (!chapter) {
      throw Error("Chapter not found");
    }
    return res.status(201).json({
      success: true,
      message: "Chapter get successfully",
      chapter,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    next(error);
  }
};

export const deleteChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      throw Error("Course not found");
    }
    const { chapterId } = req.query;
    if (!chapterId) {
      throw Error("Chapter Id not found");
    }

    const chapterIndex = course.chapter.findIndex(
      (chp) => chp._id.toString() === chapterId.toString()
    );
    const chapter = course.chapter[chapterIndex];
    if (!chapter) {
      throw Error("No chapter found");
    }
    if (chapter.video.public_id) {
      // delete video from cloudinary
      await cloudinary.v2.uploader.destroy(chapter.video.public_id, {
        resource_type: "video",
      });
      // removing video duration from total course duration
      const duration =
        durationToMinute(course?.time) -
        durationToMinute(chapter.video.duration);
      course.time = minutesToDuration(duration);
    }
    if (chapter.isPublished) {
      throw Error("Please unpublish the chapter before deleting");
    }
    course.chapter.splice(chapterIndex, 1);

    await course.save();

    return res.status(201).json({
      success: true,
      message: "Chapter deleted successfully",
      course,
    });
  } catch (error) {
    next(error);
  }
};
export const addQuize = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      throw Error("Course not found with this ID");
    }
    const { chapterId } = req.query;
    if (!chapterId) {
      throw Error("Chapter Id not found");
    }
    const chapter = course.chapter.find(
      (chp) => chp._id.toString() === chapterId.toString()
    );
    if (!chapter) {
      throw Error("Chapter not found");
    }
    const { question, options, answerIndex } = req.body;
    if (!question || answerIndex === undefined || options.length === 0) {
      throw Error("Please provide quiz information");
    }
    const quiz = {
      question: question,
      options: options,
      answerIndex: answerIndex,
    };
    chapter.quiz.push(quiz);

    await course.save();

    return res.status(201).json({
      success: true,
      message: "quiz are added",
      chapter,
    });
  } catch (error) {
    next(error);
  }
};

export const removeQuize = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      throw Error("Course not found");
    }
    const { chapterId } = req.query;
    if (!chapterId) {
      throw Error("Chapter Id not found");
    }
    const chapter = course.chapter.find(
      (chp) => chp._id.toString() === chapterId.toString()
    );
    if (!chapter) {
      throw Error("Chapter not found");
    }
    const { index } = req.body;

    chapter.quiz.splice(index, 1);

    await course.save();

    return res.status(201).json({
      success: true,
      message: "quize removed successfully",
      chapter,
    });
  } catch (error) {
    next(error);
  }
};

export const editCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      throw Error("Course not found");
    }
    const { name, description, price, courseLevel, tags, category } = req.body;
    if (name) {
      course.name = name;
    }
    if (description) {
      course.description = description;
    }
    if (category) {
      course.category = category;
    }
    if (tags) {
      course.tags.push(tags);
    }
    if (price) {
      course.price = price;
    }
    if (courseLevel) {
      course.courseLevel = courseLevel;
    }

    if (req.file) {
      if (course.banner.public_id) {
        await cloudinary.v2.uploader.destroy(course.banner.public_id);
      }
      const file = getDataUri(req.file);

      const myCloude = await cloudinary.v2.uploader.upload(file.content, {
        folder: "LMS-React-native",
      });
      const banner = {
        public_id: myCloude.public_id,
        url: myCloude.secure_url,
      };
      course.banner = banner;
    }

    await course.save();

    return res.status(201).json({
      success: true,
      message: `(${course.name}) Course updated successfully`,
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTags = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      throw Error("Course not found");
    }
    const { index } = req.body;
    course.tags.splice(index, 1);
    await course.save();

    return res.status(201).json({
      success: true,
      message: `Tags deleted successfully`,
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const editChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      throw Error("Course not found");
    }
    const { chapterId } = req.query;
    if (!chapterId) {
      throw Error("Chapter not found");
    }
    const { title, content, output, isFree, duration } = req.body;
    const chapter = course.chapter.find(
      (chp) => chp._id.toString() === chapterId.toString()
    );

    if (!chapter) {
      throw Error("Chapter not found");
    }
    if (isFree !== undefined) {
      chapter.isFree = isFree;
    }
    if (title) {
      chapter.title = title;
    }
    if (content) {
      chapter.content = content;
    }
    if (output) {
      chapter.output = output;
    }

    if (req.file) {
      let oldVideoDuration = 0;
      if (chapter.video.public_id) {
        await cloudinary.v2.uploader.destroy(chapter.video.public_id, {
          resource_type: "video",
        });
        oldVideoDuration = durationToMinute(chapter.video.duration);
      }
      const file = getDataUri(req.file);
      const myCloude = await cloudinary.v2.uploader.upload(file.content, {
        resource_type: "video",
        folder: "LMS-React-native",
      });
      if (!duration) {
        throw Error("Video duration is required");
      }

      const video = {
        public_id: myCloude.public_id,
        url: myCloude.secure_url,
        duration: duration,
      };

      chapter.video = video;
      const totalDurationMinutes =
        durationToMinute(course.time) -
        oldVideoDuration +
        durationToMinute(duration);

      course.time = minutesToDuration(totalDurationMinutes);
    }

    await course.save();

    return res.status(201).json({
      success: true,
      message: "Chapter updated",
      chapter,
    });
  } catch (error) {
    next(error);
  }
};
export const publisedOrUnpublished = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      throw Error("Course not found");
    }
    const { chapterId } = req.query;
    if (!chapterId) {
      throw Error("Chapter not found");
    }
    const { isPublished } = req.body;
    const chapter = course.chapter.find(
      (chp) => chp._id.toString() === chapterId.toString()
    );
    if (
      !chapter.title ||
      !chapter.content ||
      !chapter.output ||
      !chapter.video
    ) {
      throw Error("Missing required fields");
    }
    chapter.isPublished = isPublished;

    if (course.isPublished) {
      const atleastOnePublishedChapter = course.chapter.findIndex(
        (item) => item.isPublished === true
      );
      if (atleastOnePublishedChapter === -1) {
        course.isPublished = false;
      }
    }

    await course.save();
    return res.status(201).json({
      success: true,
      message: chapter?.isPublished
        ? "Chapter published"
        : "Chapter unpublished",
      chapter,
    });
  } catch (error) {
    next(error);
  }
};
export const reOrderChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      throw Error("Course not found");
    }
    const { index, newPosition } = req.body;

    const chapter = course.chapter[index];

    course.chapter.splice(index, 1);

    course.chapter.splice(newPosition, 0, chapter);

    await course.save();

    return res.status(201).json({
      success: true,
      message: "Chapter reorderd successfully",
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user = req.user;
    const course = await Course.findById(id);
    if (!course) {
      throw Error("course not found");
    }
    if (!rating || !comment) {
      throw Error("Plase add reaview and rating");
    }
    // check already reviewd or not?
    const reviewExists = course.reviews.find(
      (review) => review.userId.toString() === user._id.toString()
    );
    if (reviewExists) {
      return res.status(400).send({
        success: false,
        message: "Course already reviewd",
      });
    }
    const review = {
      name: user.name,
      rating: Number(rating),
      comment: comment,
      userId: user._id,
      avatar: user?.avatar?.url,
    };
    // add review also
    course.reviews.push(review);
    // update rating
    course.rating =
      course.reviews.reduce((acc, item) => item.rating + acc, 0) /
      course.reviews.length;

    await course.save();

    course.chapter = course.chapter.filter((ch) => ch.isPublished === true);

    return res.status(201).json({
      success: true,
      message: "review added successfully",
      course,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllCourseForAdmin = async (req, res, next) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });

    return res.status(201).json({
      success: true,
      message: "All Courses are return successfully",
      courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCourse = async (req, res, next) => {
  try {
    const { keyWord, category, tags, courseLevel } = req.query;
    const courses = await Course.find({
      name: {
        $regex: keyWord ? keyWord : "",
        $options: "i",
      },
      category: {
        $regex: category ? category : "",
        $options: "i",
      },
      tags: {
        $regex: tags ? tags : "",
        $options: "i",
      },
      courseLevel: {
        $regex: courseLevel ? courseLevel : "",
        $options: "i",
      },
      isPublished: true,
    }).sort({ createdAt: -1 });
    courses.forEach(
      (course) =>
        (course.chapter = course.chapter.filter(
          (chapter) => chapter.isPublished === true
        ))
    );
    return res.status(201).json({
      success: true,
      message: "All Courses are return successfully",
      courses,
    });
  } catch (error) {
    next(error);
  }
};
export const getTopCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .sort({ rating: -1 })
      .limit(10);
    courses.forEach(
      (course) =>
        (course.chapter = course.chapter.filter(
          (chapter) => chapter.isPublished === true
        ))
    );
    return res.status(201).json({
      success: true,
      message: "Top 4 courses",
      courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getFreeCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({
      price: 0,
      isPublished: true,
    }).sort({ createdAt: -1 });

    if (courses.length === 0) {
      throw Error("No free courses availabel");
    }
    courses.forEach(
      (course) =>
        (course.chapter = course.chapter.filter(
          (chapter) => chapter.isPublished === true
        ))
    );
    return res.status(201).json({
      success: true,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      throw Error("Course not found");
    }
    if (course.isPublished) {
      throw Error("Please unpublish the course before deleting");
    }
    if (course.banner.public_id) {
      await cloudinary.v2.uploader.destroy(course.banner.public_id);
    }

    for (let i = 0; i < course.chapter.length; i++) {
      const chapter = course.chapter[i];
      if (chapter.video.public_id) {
        await cloudinary.v2.uploader.destroy(chapter.video.public_id, {
          resource_type: "video",
        });
      }
    }

    await course.deleteOne();

    return res.status(201).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
