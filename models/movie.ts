import { ObjectId } from "mongodb";

export interface Movie extends Document{
    movieId: ObjectId;
  }
  