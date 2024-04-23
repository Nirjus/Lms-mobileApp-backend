import cloudinary from "cloudinary";
import { getDataUri } from "../utils/fileHandler.js";
import Course from "../models/courseModel.js";
export const createCourse = async (req, res, next) => {
  try {
    if (!req.file) {
      throw Error("File upload banner is required");
    }
    const {
      name,
      description,
      time,
      price,
      author,
      courseLevel,
      tags,
      category,
    } = req.body;

    if (
      !name ||
      !description ||
      !time ||
      !price ||
      !author ||
      !courseLevel ||
      !tags ||
      !category
    ) {
      throw Error("Please field all field");
    }
    const file = getDataUri(req.file);
    const myCloude = await cloudinary.v2.uploader.upload(file.content, {
      folder: "LMS-React-native",
    });

    const image = {
      public_id: myCloude.public_id,
      url: myCloude.secure_url,
    };

    const course = await Course.create({
      name: name,
      description: description,
      time: time,
      price: price,
      author: author,
      banner: image,
      category: category,
      courseLevel: courseLevel,
      tags: tags,
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

export const addChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, output } = req.body;
    const course = await Course.findById(id);

    if (!course) {
      throw Error("Course not found with this ID");
    }

    if (!title || !content || !output) {
      throw Error("Please provide all information");
    }
    if (!req.file) {
      throw Error("Video is required");
    }
    const file = getDataUri(req.file);
    const myCloude = await cloudinary.v2.uploader.upload(file.content, {
      resource_type: "video",
      folder: "LMS-React-native",
    });
    const chapter = {
      title: title,
      content: content,
      video: {
        public_id: myCloude.public_id,
        url: myCloude.secure_url,
      },
      output: output,
    };
    course.chapter.push(chapter);

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

export const editCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      throw Error("Course not found");
    }
    const {
      name,
      description,
      time,
      price,
      author,
      courseLevel,
      tags,
      category,
    } = req.body;
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
      course.tags = tags;
    }
    if (time) {
      course.time = time;
    }
    if (price) {
      course.price = price;
    }
    if (author) {
      course.author = author;
    }
    if (courseLevel) {
      course.courseLevel = courseLevel;
    }

    if (req.file) {
      await cloudinary.v2.uploader.destroy(course.banner.public_id);
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
    const { title, content, output } = req.body;
    const chapter = course.chapter.find(
      (chp) => chp._id.toString() === chapterId.toString()
    );

    if (!chapter) {
      throw Error("Chapter not found");
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
      await cloudinary.v2.uploader.destroy(chapter.video.public_id);

      const file = getDataUri(req.file);
      const myCloude = await cloudinary.v2.uploader.upload(file.content, {
        resource_type: "video",
        folder: "LMS-React-native",
      });

      const video = {
        public_id: myCloude.public_id,
        url: myCloude.secure_url,
      };

      chapter.video = video;
    }

    await course.save();

    return res.status(201).json({
      success: true,
      message: "Chapter updated",
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

    return res.status(201).json({
      success: true,
      message: "review added successfully",
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
    }).sort({ createdAt: -1 });

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
    const courses = await Course.find({}).sort({ rating: -1 }).limit(4);

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
    }).sort({ createdAt: -1 });

    if (courses.length === 0) {
      throw Error("No free courses availabel");
    }

    return res.status(201).json({
      success: true,
      courses,
    });
  } catch (error) {
    next(error);
  }
};
