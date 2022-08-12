import { StoreStatus } from "../stores.nodel";

export class GetStoreQueryDto {
  name?: string;
  location?: string;
  likes?: number;
  followers?: number;
  isFollowed?: boolean;
  status?: StoreStatus;
  isNew?: boolean;
  userId?: string;
}

export class MongooseStoreQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  location?: string;
  status?: StoreStatus;
}
