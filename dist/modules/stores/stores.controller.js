"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const throw_exception_1 = require("../../exceptions/throw-exception");
const utils_1 = require("../../utils");
const stores_service_1 = require("./stores.service");
// handler for POST /stores
const createStore = async (req, res) => {
    const createstoreDto = req.body;
    const store = await stores_service_1.StoreService.createStore(createstoreDto);
    res.status(201).json(store);
};
// handler for GET /stores
const getAllStores = async (req, res) => {
    const stores = await stores_service_1.StoreService.getAllStores();
    res.status(200).json({
        count: stores.length,
        stores,
    });
};
// handler for GET /stores/search
const searchStores = async (req, res) => {
    const query = req.query;
    const stores = await stores_service_1.StoreService.searchStores(query, req);
    res.status(200).json({
        count: stores.length,
        search: query,
        stores,
    });
};
// handler for GET /stores/:id
const getStoreById = async (req, res) => {
    const id = req.params.id;
    const store = await stores_service_1.StoreService.getStoreById(id);
    res.status(200).json(store);
};
// handler for PATCH /stores/:id
const updateStore = async (req, res) => {
    const id = req.params.id;
    const updateStoreDto = req.body;
    const isEmptyBody = utils_1.Utils.isEmpty(updateStoreDto);
    if (isEmptyBody) {
        throw_exception_1.ThrowException.badRequest("provide data to update");
    }
    const updatedStore = await stores_service_1.StoreService.updateStore(id, updateStoreDto, req);
    res.status(200).json(updatedStore);
};
// handler for delete /stores/:id
const deleteStore = async (req, res) => {
    const id = req.params.id;
    await stores_service_1.StoreService.deleteStore(id, req);
    res.status(200).send();
};
// handler for PATCH /stores/:id/status
const changeStoreStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    if (!status) {
        throw_exception_1.ThrowException.badRequest("provide status to update");
    }
    const changedStore = await stores_service_1.StoreService.changeStoreStatus(id, status);
    res.status(200).json(changedStore);
};
// handler for POSt /stores/:id/likes
const addLike = async (req, res) => {
    const id = req.params.id;
    await stores_service_1.StoreService.likeStore(id, req);
    res.status(200).send();
};
// handler for DELETE /stores/:id/likes
const removeLike = async (req, res) => {
    const id = req.params.id;
    await stores_service_1.StoreService.unLikeStore(id, req);
    res.status(200).send();
};
// handler for POST /stores/:id/followers
const addFollower = async (req, res) => {
    const id = req.params.id;
    await stores_service_1.StoreService.followStore(id, req);
    res.status(200).send();
};
// handler for DELETE /stores/:id/followers
const removeFollower = async (req, res) => {
    const id = req.params.id;
    await stores_service_1.StoreService.unFollowStore(id, req);
    res.status(200).send();
};
exports.default = {
    getAllStores,
    createStore,
    getStoreById,
    updateStore,
    deleteStore,
    searchStores,
    changeStoreStatus,
    addLike,
    removeLike,
    addFollower,
    removeFollower,
};
