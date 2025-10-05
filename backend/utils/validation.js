import mongoose from "mongoose";
const validateObjectId = (string) => {
  return mongoose.Types.ObjectId.isValid(string);
}

export default validateObjectId;