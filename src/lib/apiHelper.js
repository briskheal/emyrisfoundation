// Shared helper: decode JWT token from Authorization header and return payload
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGEME_JWT_SECRET';

/**
 * Extracts and verifies the JWT from an Authorization header.
 * Returns decoded payload { id, username, role } or throws on invalid token.
 */
export function getTokenPayload(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  return jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
}

/**
 * Checks for edit conflict.
 * If the record's updatedAt is newer than what the client loaded, it's a conflict.
 * Returns conflict info object or null if no conflict.
 */
export function checkConflict(record, lastKnownUpdatedAt) {
  if (!lastKnownUpdatedAt) return null;
  const dbTime = new Date(record.updatedAt).getTime();
  const clientTime = new Date(lastKnownUpdatedAt).getTime();
  if (dbTime > clientTime) {
    return {
      conflict: true,
      updatedBy: record.updatedBy || 'unknown',
      updatedAt: record.updatedAt,
    };
  }
  return null;
}
