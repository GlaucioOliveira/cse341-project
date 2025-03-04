import { Movie } from "./movie";

export interface Playlist extends Document {
    movies: Movie[];
  }