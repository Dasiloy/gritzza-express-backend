import { Request } from "express";
import { ThrowException } from "../../exceptions/throw-exception";
import { IUser, UserRole } from "../users/users.model";
import { CreateStoreDto } from "./dto/create-store.dto";
import {
  GetStoreQueryDto,
  MongooseStoreQuery,
} from "./dto/get-store-query.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";
import { storeModel, StoreStatus } from "./stores.nodel";

export class StoreService {
  private static StoreModel = storeModel;
  private static DUE_TIME = 7 * 24 * 60 * 60 * 1000; //  7 days after the store is created, the store will be considered old

  // get all stores
  static async getAllStores() {
    return await this.StoreModel.find({}).populate(
      "owner",
      "username active"
    );
  }

  // search stores
  static async searchStores(
    query: GetStoreQueryDto,
    req: Request
  ) {
    const storeQuery: Partial<MongooseStoreQuery> = {};
    if (query.name) {
      storeQuery.name = {
        $regex: query.name,
        $options: "i",
      };
    }
    if (query.location) {
      storeQuery.location = query.location;
    }

    if (query.status) {
      storeQuery.status = query.status;
    }

    let stores = await this.StoreModel.find(storeQuery);

    if (query.isNew) {
      stores = stores.filter(store => {
        const createdAt = new Date(store.createdAt);
        const now = new Date();
        const diff = now.getTime() - createdAt.getTime();
        return diff < this.DUE_TIME;
      });
    }

    if (query.isFollowed) {
      stores = stores.filter(store => {
        const loggedInUser = req.user! as IUser;
        const isFollowed = store.followers
          .map(toString)
          .includes(loggedInUser._id.toString());
        return isFollowed;
      });
    }

    if (query.likes) {
      stores = stores.filter(store => {
        const likes: number = store.likes.length;
        return likes >= Number(query.likes)!;
      });
    }

    if (query.followers) {
      stores = stores.filter(store => {
        const followers: number = store.followers.length;
        return followers >= Number(query.followers)!;
      });
    }

    return stores;
  }

  // create store
  static async createStore(store: CreateStoreDto) {
    return await storeModel.create({
      owner: store.owner,
      name: store.name,
      description: store.description,
      location: store.location,
    });
  }

  // get store by id
  static async getStoreById(id: string) {
    const store = await this.StoreModel.findById(id);
    if (!store) {
      ThrowException.notFound("Store not found");
    }
    return store;
  }

  // get store by owner
  static async getStoreByOwner(owner: string) {
    const store = await this.StoreModel.findOne({ owner });
    if (!store) {
      ThrowException.notFound("Store not found");
    }
    return store;
  }

  // get store by name
  static async getStoreByName(name: string) {
    const store = await this.StoreModel.findOne({ name });
    if (!store) {
      ThrowException.notFound("Store not found");
    }
    return store;
  }

  static async checkStore(id: string, req: Request) {
    const store = await this.getStoreById(id);
    const loggedInUser = req.user! as IUser;

    if (!store) {
      ThrowException.notFound("Store not found");
    }

    if (
      loggedInUser.role !== UserRole.ADMIN &&
      loggedInUser._id.toString() !==
        store?.owner?.toHexString()
    ) {
      console.log(
        loggedInUser._id,
        store?.owner?.toHexString()
      );
      ThrowException.notFound(
        "You are not the owner of this store,"
      );
    }
    return store;
  }

  // update store
  static async updateStore(
    id: string,
    updateStoreDto: UpdateStoreDto,
    req: Request
  ) {
    const store = await this.checkStore(id, req);

    if (store) {
      const {
        name,
        description,
        location,
        contact,
        displayPic,
      } = updateStoreDto;
      if (name) {
        store.name = name;
      }
      if (description) {
        store.description = description;
      }
      if (location) {
        store.location = location;
      }
      if (contact) {
        store.contact = contact;
      }
      if (displayPic) {
        store.displayPic = displayPic;
      }
      await store.save();
    }

    return store;
  }

  // change store status
  static async changeStoreStatus(
    id: string,
    status: StoreStatus
  ) {
    const store = await this.getStoreById(id);

    if (!store) {
      ThrowException.notFound("Store not found");
    }

    if (store) {
      store.status = status;
      await store.save();
    }

    return store;
  }

  //like store
  static async likeStore(id: string, req: Request) {
    const store = await this.getStoreById(id);
    const loggedInUser = req.user! as IUser;

    if (!store) {
      ThrowException.notFound("Store not found");
    }

    if (store) {
      const transformedUserid = loggedInUser._id.toString();
      // check `likes` array if userId is already in it
      if (
        !store.likes.map(String).includes(transformedUserid)
      ) {
        store.likes.push(loggedInUser._id);
        await store.save();
      }
    }

    return store;
  }

  //unlike store
  static async unLikeStore(id: string, req: Request) {
    const store = await this.getStoreById(id);
    const loggedInUser = req.user! as IUser;

    if (!store) {
      ThrowException.notFound("Store not found");
    }

    if (store) {
      const transformedUserid = loggedInUser._id.toString();
      if (
        store.likes.map(String).includes(transformedUserid)
      ) {
        store.likes = store.likes.filter(
          userId => userId.toString() !== transformedUserid
        );
        await store.save();
      }
    }

    return store;
  }

  // follow store
  static async followStore(id: string, req: Request) {
    const store = await this.getStoreById(id);
    const loggedInUser = req.user! as IUser;

    if (!store) {
      ThrowException.notFound("Store not found");
    }

    if (store) {
      const transformedUserid = loggedInUser._id.toString();
      // check `followers` array if userId is already in it
      if (
        !store.followers
          .map(String)
          .includes(transformedUserid)
      ) {
        store.followers.push(loggedInUser._id);
        await store.save();
      }
    }
  }

  // unhallow store
  static async unFollowStore(id: string, req: Request) {
    const store = await this.getStoreById(id);
    const loggedInUser = req.user! as IUser;

    if (!store) {
      ThrowException.notFound("Store not found");
    }

    if (store) {
      const transformedUserid = loggedInUser._id.toString();
      if (
        store.followers
          .map(String)
          .includes(transformedUserid)
      ) {
        store.followers = store.followers.filter(
          userId => userId.toString() !== transformedUserid
        );
         await store.save();
      }
    }
  }

  // delete store
  static async deleteStore(id: string, req: Request) {
    const store = await this.checkStore(id, req);

    if (store) {
      await store.remove();
    }
    return store;
  }
}
