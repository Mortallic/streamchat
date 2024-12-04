import { Client, Account, Databases, ID, Query } from 'appwrite';
import { APPWRITE_CONFIG } from '../config/appwrite';

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId);

const account = new Account(client);
const databases = new Databases(client);

// Auth service class
class AuthService {
    // Register new user
    async createAccount(email, password, name) {
        try {
            // Create the user account
            const user = await account.create(
                'unique()',
                email,
                password,
                name
            );

            // Create a profile document
            await databases.createDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.profilesCollectionId,
                ID.unique(),
                {
                    userId: user.$id,
                    name: name,
                    email: email,
                    createdAt: new Date().toISOString(),
                    isMod: false,
                    isAdmin: false,
                    badge: null,
                    color: '#ffffff',
                    bans: 0,
                }
            );

            return user;
        } catch (error) {
            throw error;
        }
    }

    // Login user
    async login(email, password) {
        try {
            const session = await account.createEmailPasswordSession(email, password);
            return session;
        } catch (error) {
            throw error;
        }
    }

    // Logout user
    async logout() {
        try {
            await account.deleteSession('current');
        } catch (error) {
            throw error;
        }
    }

    // Get current user
    async getCurrentUser() {
        try {
            const user = await account.get();
            if (user) {
                // Get the user's profile
                const profile = await this.getUserProfile(user.$id);
                return { ...user, profile };
            }
            return null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    // Check if user is logged in
    async isAuthenticated() {
        try {
            const user = await this.getCurrentUser();
            return !!user;
        } catch (error) {
            return false;
        }
    }

    // Password reset request
    async resetPassword(email) {
        try {
            await account.createRecovery(email, 'YOUR_PASSWORD_RESET_URL');
            return true;
        } catch (error) {
            throw error;
        }
    }

    // Update user name
    async updateName(name) {
        try {
            return await account.updateName(name);
        } catch (error) {
            throw error;
        }
    }

    // Update user email
    async updateEmail(email, password) {
        try {
            return await account.updateEmail(email, password);
        } catch (error) {
            throw error;
        }
    }

    // Update user password
    async updatePassword(newPassword, oldPassword) {
        try {
            return await account.updatePassword(newPassword, oldPassword);
        } catch (error) {
            throw error;
        }
    }

    // Add this method to your AuthService class
    async getUserProfile(userId) {
        try {
            const response = await databases.listDocuments(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.profilesCollectionId,
                [
                    Query.equal('userId', userId)
                ]
            );
            
            if (response.documents.length > 0) {
                return response.documents[0];
            }
            return null;
        } catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    }

    async timeoutUser(userId, minutes) {
        try {
            const profile = await this.getUserProfile(userId);
            if (profile) {
                const timeoutUntil = new Date();
                timeoutUntil.setMinutes(timeoutUntil.getMinutes() + minutes);
                
                await databases.updateDocument(
                    APPWRITE_CONFIG.databaseId,
                    APPWRITE_CONFIG.profilesCollectionId,
                    profile.$id,
                    {
                        timeoutUntil: timeoutUntil.toISOString()
                    }
                );
            }
        } catch (error) {
            throw error;
        }
    }

    async banUser(userId) {
        try {
            const profile = await this.getUserProfile(userId);
            if (profile) {
                await databases.updateDocument(
                    APPWRITE_CONFIG.databaseId,
                    APPWRITE_CONFIG.profilesCollectionId,
                    profile.$id,
                    {
                        isBanned: true,
                        bans: profile.bans + 1
                    }
                );
            }
        } catch (error) {
            throw error;
        }
    }

    async checkUserStatus(userId) {
        try {
            const profile = await this.getUserProfile(userId);
            if (profile) {
                if (profile.isBanned) {
                    throw new Error('User is banned');
                }
                
                if (profile.timeoutUntil) {
                    const timeoutUntil = new Date(profile.timeoutUntil);
                    if (timeoutUntil > new Date()) {
                        throw new Error(`User is timed out until ${timeoutUntil.toLocaleTimeString()}`);
                    }
                }
            }
            return true;
        } catch (error) {
            throw error;
        }
    }
    async modUser(userId) {
        try {
            const profile = await this.getUserProfile(userId);
            if (profile) {
                await databases.updateDocument(
                    APPWRITE_CONFIG.databaseId,
                    APPWRITE_CONFIG.profilesCollectionId,
                    profile.$id,
                    {
                        isMod: true,
                        badge: 'mod'
                    }
                );
            }
        } catch (error) {
            throw error;
        }
    }

    async vipUser(userId) {
        try {
            const profile = await this.getUserProfile(userId);
            if (profile) {
                await databases.updateDocument(
                    APPWRITE_CONFIG.databaseId,
                    APPWRITE_CONFIG.profilesCollectionId,
                    profile.$id,
                    {
                        badge: 'vip'
                    }
                );
            }
        } catch (error) {
            throw error;
        }
    }
    async unmodUser(userId){
        try {
            const profile = await this.getUserProfile(userId);
            if (profile) {
                await databases.updateDocument(
                    APPWRITE_CONFIG.databaseId,
                    APPWRITE_CONFIG.profilesCollectionId,
                    profile.$id,
                    {
                        isMod: false,
                        badge: null
                    }
                );
            }
        } catch (error) {
            throw error;
        }
    }
    async unbanUser(userId){
        try {
            const profile = await this.getUserProfile(userId);
            if (profile) {
                await databases.updateDocument(
                    APPWRITE_CONFIG.databaseId,
                    APPWRITE_CONFIG.profilesCollectionId,
                    profile.$id,
                    {
                        isBanned: false
                    }
                );
            }   
        } catch (error) {
            throw error;
        }   
    }

    async getUserProfileByName(username) {
        try {
            const response = await databases.listDocuments(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.profilesCollectionId,
                [
                    Query.equal('name', username),
                    Query.limit(1)
                ]
            );

            if (response.documents.length > 0) {
                return response.documents[0];
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    async setModComment(userId, comment) {
        try {
            return await databases.updateDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.profilesCollectionId,
                userId,
                {
                    modComment: comment
                }
            );
        } catch (error) {
            throw error;
        }
    }

    async getUserModComment(userId) {
        try {
            const profile = await databases.getDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.profilesCollectionId,
                userId
            );
            return profile.modComment || '';
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService; 