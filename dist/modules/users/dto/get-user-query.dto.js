"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetuserQueryDtoMongo = exports.GetUserQueryDto = void 0;
class GetUserQueryDto {
    constructor(username, active, role) {
        this.username = username;
        this.active = active;
        this.role = role;
    }
}
exports.GetUserQueryDto = GetUserQueryDto;
class GetuserQueryDtoMongo {
}
exports.GetuserQueryDtoMongo = GetuserQueryDtoMongo;
