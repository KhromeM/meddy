import { createUser, updateUser, getUserById } from "./dbuser.mjs";
import { createMessage, getRecentMessagesByUserId } from "./dbMessages.mjs";
import { createFile, getFileById, updateFile } from "./dbFiles.mjs";
import {
	createDocument,
	getDocumentById,
	getDocumentsByFileId,
	deleteDocumentsByFileId,
} from "./dbDocuments.mjs";

export default {
	createUser,
	getUserById,
	updateUser,
	createMessage,
	createFile,
	getFileById,
	updateFile,
	getRecentMessagesByUserId,
	createDocument,
	getDocumentById,
	getDocumentsByFileId,
	deleteDocumentsByFileId,
};
