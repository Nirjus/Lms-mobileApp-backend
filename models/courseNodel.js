import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Course name is required"]
    },
      description:{
        type: String,
        required: [true, "Description is required"]
      },

      banner:{
        type: String,
        required: [true, "Banner is required"]
      },
      time:{
        type: String,
        required: [true, "Time is required"]
      },
      price:{
        type: Number,
        required: [true, "Price is required"]
      },
      author:{
        type: String,
      },
      courseLevel:{
        type: String,
        required:[true, "Level is required"]
      },
      tags:{
        type: String
      },
      chapter:[
        {
            title:{
                type: String,
                required:[true, "Course Title is required"],
            },
            content:{
                type: String,
                required: [true, "Content is required"],
            },
            video:{
                public_id:String,
                url: String
            },
            output:{
                type: String
            }
        }
      ]
},{timestamps: true})

const Course = mongoose.model("Courses", courseSchema);

export default Course