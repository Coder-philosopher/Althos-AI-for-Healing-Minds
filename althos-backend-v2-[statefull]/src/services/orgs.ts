import bcrypt from 'bcrypt';
import db from '../db';

export async function ensureOrgPopulated(orgCode: string, signinId: string, signinPassword: string) {
  const existingOrg = await db.orgs.findByOrgCode(orgCode);
  if (existingOrg) return existingOrg;

  // Hash the password before inserting
  const passwordHash = await bcrypt.hash(signinPassword, 10);

  // Insert org
  const result = await db.query(
    `INSERT INTO orgs (org_code, signin_id, signin_password_hash)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [orgCode, signinId, passwordHash]
  );

  return result[0];
}
