"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureOrgPopulated = ensureOrgPopulated;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../db"));
async function ensureOrgPopulated(orgCode, signinId, signinPassword) {
    const existingOrg = await db_1.default.orgs.findByOrgCode(orgCode);
    if (existingOrg)
        return existingOrg;
    // Hash the password before inserting
    const passwordHash = await bcrypt_1.default.hash(signinPassword, 10);
    // Insert org
    const result = await db_1.default.query(`INSERT INTO orgs (org_code, signin_id, signin_password_hash)
     VALUES ($1, $2, $3)
     RETURNING *`, [orgCode, signinId, passwordHash]);
    return result[0];
}
