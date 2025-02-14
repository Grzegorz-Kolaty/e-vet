/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {HttpsError, onCall, onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {getAuth} from "firebase-admin/auth";
import {initializeApp} from 'firebase-admin/app';

initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript


export const setCustomClaims = onRequest(
  {cors: "https://e-vet-szczecin.web.app"},

  (request, response) => {

    try {

      if (request.method === 'OPTIONS') {
        response.status(204).send('');
        return;
      }

      const {idToken, role} = request.body.data;

      if (!idToken || !role) {
        response.status(400).send({error: 'Missing idToken or role'});
        return;
      }

      response.status(204).send("");

    } catch (error) {
      logger.error('Error setting custom claims', error);
      response.status(500).send({error: 'Internal server error', details: error});
    }
  });

export const onRoleSelect = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("failed-precondition", "The function must be called while authenticated.");
  }

  const authorizationHeader = request.rawRequest.headers.authorization;

  if (!authorizationHeader) {
    throw new HttpsError("unauthenticated", "Missing Authorization header.");
  }

  const token = authorizationHeader.replace("Bearer ", "").trim();
  return await getAuth().verifyIdToken(token)
})
  // const name = request.auth.token.name || null;
  // const picture = request.auth.token.picture || null;
  // const email = request.auth.token.email || null;
  //
  // try {
  //   const token = request.app.token.toString()
  //
  //   if (!token) {
  //     return new HttpsError("failed-precondition", "notoken", token);
  //   }
  //   return await getAuth().verifyIdToken(token)
  // } catch (error) {
  //    logger.error('Error setting custom claims', error);
  //    return  error
  // }

  // try {
  //
  //   // if (request.method === 'OPTIONS') {
  //   //   response.status(204).send('');
  //   //   return;
  //   // }
  //
  //   const {idToken, role} = request.data;
  //
  //   if (!idToken || !role) {
  //     return false
  //     // return response = "error"
  //     // response.send({error: 'Missing idToken or role'});
  //     // return;
  //   }
  //
  //   return true
  //   // response.status(204).send("");
  //
  // } catch (error) {
  //   logger.error('Error setting custom claims', error);
  //   return false
  //   // response.status(500).send({error: 'Internal server error', details: error});
  // }
