"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreService = void 0;
const throw_exception_1 = require("../../exceptions/throw-exception");
const users_model_1 = require("../users/users.model");
const stores_nodel_1 = require("./stores.nodel");
class StoreService {
    // get all stores
    static async getAllStores() {
        return await this.StoreModel.find({}).populate("owner", "username active");
    }
    // search stores
    static async searchStores(query, req) {
        const storeQuery = {};
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
                const loggedInUser = req.user;
                const isFollowed = store.followers
                    .map(toString)
                    .includes(loggedInUser._id.toString());
                return isFollowed;
            });
        }
        if (query.likes) {
            stores = stores.filter(store => {
                const likes = store.likes.length;
                return likes >= Number(query.likes);
            });
        }
        if (query.followers) {
            stores = stores.filter(store => {
                const followers = store.followers.length;
                return followers >= Number(query.followers);
            });
        }
        return stores;
    }
    // create store
    static async createStore(store) {
        return await stores_nodel_1.storeModel.create({
            owner: store.owner,
            name: store.name,
            description: store.description,
            location: store.location,
        });
    }
    // get store by id
    static async getStoreById(id) {
        const store = await this.StoreModel.findById(id);
        if (!store) {
            throw_exception_1.ThrowException.notFound("Store not found");
        }
        return store;
    }
    // get store by owner
    static async getStoreByOwner(owner) {
        const store = await this.StoreModel.findOne({ owner });
        if (!store) {
            throw_exception_1.ThrowException.notFound("Store not found");
        }
        return store;
    }
    // get store by name
    static async getStoreByName(name) {
        const store = await this.StoreModel.findOne({ name });
        if (!store) {
            throw_exception_1.ThrowException.notFound("Store not found");
        }
        return store;
    }
    static async checkStore(id, req) {
        var _a, _b;
        const store = await this.getStoreById(id);
        const loggedInUser = req.user;
        if (!store) {
            throw_exception_1.ThrowException.notFound("Store not found");
        }
        if (loggedInUser.role !== users_model_1.UserRole.ADMIN &&
            loggedInUser._id.toString() !==
                ((_a = store === null || store === void 0 ? void 0 : store.owner) === null || _a === void 0 ? void 0 : _a.toHexString())) {
            console.log(loggedInUser._id, (_b = store === null || store === void 0 ? void 0 : store.owner) === null || _b === void 0 ? void 0 : _b.toHexString());
            throw_exception_1.ThrowException.notFound("You are not the owner of this store,");
        }
        return store;
    }
    // update store
    static async updateStore(id, updateStoreDto, req) {
        const store = await this.checkStore(id, req);
        if (store) {
            const { name, description, location, contact, displayPic, } = updateStoreDto;
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
    static async changeStoreStatus(id, status) {
        const store = await this.getStoreById(id);
        if (!store) {
            throw_exception_1.ThrowException.notFound("Store not found");
        }
        if (store) {
            store.status = status;
            await store.save();
        }
        return store;
    }
    //like store
    static async likeStore(id, req) {
        const store = await this.getStoreById(id);
        const loggedInUser = req.user;
        if (!store) {
            throw_exception_1.ThrowException.notFound("Store not found");
        }
        if (store) {
            const transformedUserid = loggedInUser._id.toString();
            // check `likes` array if userId is already in it
            if (!store.likes.map(String).includes(transformedUserid)) {
                store.likes.push(loggedInUser._id);
                await store.save();
            }
        }
        return store;
    }
    //unlike store
    static async unLikeStore(id, req) {
        const store = await this.getStoreById(id);
        const loggedInUser = req.user;
        if (!store) {
            throw_exception_1.ThrowException.notFound("Store not found");
        }
        if (store) {
            const transformedUserid = loggedInUser._id.toString();
            if (store.likes.map(String).includes(transformedUserid)) {
                store.likes = store.likes.filter(userId => userId.toString() !== transformedUserid);
                await store.save();
            }
        }
        return store;
    }
    // follow store
    static async followStore(id, req) {
        const store = await this.getStoreById(id);
        const loggedInUser = req.user;
        if (!store) {
            throw_exception_1.ThrowException.notFound("Store not found");
        }
        if (store) {
            const transformedUserid = loggedInUser._id.toString();
            // check `followers` array if userId is already in it
            if (!store.followers
                .map(String)
                .includes(transformedUserid)) {
                store.followers.push(loggedInUser._id);
                await store.save();
            }
        }
    }
    // unhallow store
    static async unFollowStore(id, req) {
        const store = await this.getStoreById(id);
        const loggedInUser = req.user;
        if (!store) {
            throw_exception_1.ThrowException.notFound("Store not found");
        }
        if (store) {
            const transformedUserid = loggedInUser._id.toString();
            if (store.followers
                .map(String)
                .includes(transformedUserid)) {
                store.followers = store.followers.filter(userId => userId.toString() !== transformedUserid);
                await store.save();
            }
        }
    }
    // delete store
    static async deleteStore(id, req) {
        const store = await this.checkStore(id, req);
        if (store) {
            await store.remove();
        }
        return store;
    }
}
exports.StoreService = StoreService;
StoreService.StoreModel = stores_nodel_1.storeModel;
StoreService.DUE_TIME = 7 * 24 * 60 * 60 * 1000; //  7 days after the store is created, the store will be considered old
