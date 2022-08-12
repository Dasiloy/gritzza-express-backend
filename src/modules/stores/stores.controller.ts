import { Response, Request } from "express";
import { ThrowException } from "../../exceptions/throw-exception";
import { Utils } from "../../utils";
import { CreateStoreDto } from "./dto/create-store.dto";
import { GetStoreQueryDto } from "./dto/get-store-query.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";
import { StoreStatus } from "./stores.nodel";
import { StoreService } from "./stores.service";

// handler for POST /stores
const createStore = async (req: Request, res: Response) => {
  const createstoreDto = req.body as CreateStoreDto;
  const store = await StoreService.createStore(
    createstoreDto
  );
  res.status(201).json(store);
};

// handler for GET /stores
const getAllStores = async (
  req: Request,
  res: Response
) => {
  const stores = await StoreService.getAllStores();
  res.status(200).json({
    count: stores.length,
    stores,
  });
};

// handler for GET /stores/search
const searchStores = async (
  req: Request,
  res: Response
) => {
  const query = req.query as GetStoreQueryDto;
  const stores = await StoreService.searchStores(
    query,
    req
  );
  res.status(200).json({
    count: stores.length,
    search: query,
    stores,
  });
};

// handler for GET /stores/:id
const getStoreById = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  const store = await StoreService.getStoreById(id);
  res.status(200).json(store);
};

// handler for PATCH /stores/:id
const updateStore = async (req: Request, res: Response) => {
  const id = req.params.id;
  const updateStoreDto: UpdateStoreDto = req.body;

  const isEmptyBody = Utils.isEmpty(updateStoreDto);

  if (isEmptyBody) {
    ThrowException.badRequest("provide data to update");
  }

  const updatedStore = await StoreService.updateStore(
    id,
    updateStoreDto,
    req
  );
  res.status(200).json(updatedStore);
};

// handler for delete /stores/:id
const deleteStore = async (req: Request, res: Response) => {
  const id = req.params.id;
  await StoreService.deleteStore(id, req);
  res.status(200).send();
};

// handler for PATCH /stores/:id/status
const changeStoreStatus = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  const status = req.body.status as StoreStatus;

  if (!status) {
    ThrowException.badRequest("provide status to update");
  }

  const changedStore = await StoreService.changeStoreStatus(
    id,
    status
  );
  res.status(200).json(changedStore);
};

// handler for POSt /stores/:id/likes
const addLike = async (req: Request, res: Response) => {
  const id = req.params.id;
  await StoreService.likeStore(id, req);
  res.status(200).send();
};

// handler for DELETE /stores/:id/likes
const removeLike = async (req: Request, res: Response) => {
  const id = req.params.id;
  await StoreService.unLikeStore(id, req);
  res.status(200).send();
};

// handler for POST /stores/:id/followers
const addFollower = async (req: Request, res: Response) => {
  const id = req.params.id;
  await StoreService.followStore(id, req);
  res.status(200).send();
};

// handler for DELETE /stores/:id/followers
const removeFollower = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;
  await StoreService.unFollowStore(id, req);
  res.status(200).send();
};

export default {
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
