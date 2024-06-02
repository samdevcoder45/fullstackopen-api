import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const url = process.env.MONGO_URI;

mongoose
  .connect(url!)
  .then((result) => {
    console.log("connected to MONGODB");
  })
  .catch((error) => {
    console.log("error connecting to MONGODB:", error.message);
  });

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Note = mongoose.model("Note", noteSchema);

export default Note;
