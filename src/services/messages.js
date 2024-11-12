import { Client, Databases, ID, Query } from 'appwrite';
import { APPWRITE_CONFIG } from '../config/appwrite';

const client = new Client()
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId);

const databases = new Databases(client);

class MessagesService {
    constructor() {
        this.client = client;
        this.databases = databases;
    }

    subscribe(callback) {
        return this.client.subscribe(
            [`databases.${APPWRITE_CONFIG.databaseId}.collections.${APPWRITE_CONFIG.messagesCollectionId}.documents`],
            callback
        );
    }

    async sendMessage(content, userId, username, userColor) {
        try {
            return await this.databases.createDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.messagesCollectionId,
                ID.unique(),
                {
                    content,
                    userId,
                    username,
                    timestamp: new Date().toISOString()
                }
            );
        } catch (error) {
            throw error;
        }
    }

    async getMessages() {
        try {
            const response = await this.databases.listDocuments(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.messagesCollectionId,
                [
                    Query.orderAsc('timestamp'),
                    Query.limit(50)
                ]
            );
            return response.documents;
        } catch (error) {
            throw error;
        }
    }

    async updateUserColor(userId, color) {
        try {
            const response = await databases.listDocuments(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.profilesCollectionId,
                [Query.equal('userId', userId)]
            );
            
            if (response.documents.length > 0) {
                const profile = response.documents[0];
                await databases.updateDocument(
                    APPWRITE_CONFIG.databaseId,
                    APPWRITE_CONFIG.profilesCollectionId,
                    profile.$id,
                    {
                        color: color
                    }
                );
            }
        } catch (error) {
            throw error;
        }
    }

    async updateMessage(messageId, updates) {
        try {
            return await this.databases.updateDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.messagesCollectionId,
                messageId,
                updates
            );
        } catch (error) {
            throw error;
        }
    }

    async censorMessage(messageId) {
        try {
            return await this.databases.updateDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.messagesCollectionId,
                messageId,
                {
                    isCensored: true
                }
            );
        } catch (error) {
            throw error;
        }
    }
}

const messagesService = new MessagesService();
export default messagesService; 