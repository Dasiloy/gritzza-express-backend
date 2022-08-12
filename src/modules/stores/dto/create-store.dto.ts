import mongoose from "mongoose";

export class CreateStoreDto {
  owner!: mongoose.Types.ObjectId;
  name!: string;
  description!: string;
  location!: string;
}
