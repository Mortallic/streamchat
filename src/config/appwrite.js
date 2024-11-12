export const APPWRITE_CONFIG = {
    endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    profilesCollectionId: import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID,
    messagesCollectionId: import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID,
}; 