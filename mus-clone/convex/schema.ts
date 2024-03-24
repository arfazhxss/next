import {defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    /**
     * @typedef {Object} User - Represents a user in the application.
     * @property {string} tokenIdentifier - The unique token identifier for the user.
     * @property {string} email - The email address of the user.
     * @property {string} fullName - The full name of the user.
     * @property {string} imageUrl - The URL of the user's profile image.
     */
    users: defineTable({
        tokenIdentifier: v.string(),
        email: v.string(),
        fullName: v.string(),
        imageUrl: v.optional(v.string()),
    })  
        .index("by_token", ["tokenIdentifier"]),

    /**
     * @typedef {Object} File - Represents a file in the application.
     * @property {string} songId - The ID of the song file.
     * @property {string} imageId - The ID of the image file.
     * @property {string} ownerId - The ID of the owner of the file.
     * @property {string} title - The title of the file.
     */
    files: defineTable({
        song: v.id("_storage"),
        image: v.optional(v.id("_storage")),
        ownerId: v.id("users"),
        title: v.string(),
    })  
        .index("by_ownerId", ["ownerId"])
        .index("by_song", ["song"]),

    /**
     * @typedef {Object} UserFavorite - Represents a user favorite in the application.
     * @property {string} userId - The ID of the user who favorited the file.
     * @property {string} fileId - The ID of the favorite file.
     */
    userfavorites: defineTable({
        userId: v.id("users"),
        fileId: v.id("files"),
    })  
        .index("by_file", ["fileId"])
        .index("by_user", ["userId"])
        .index("by_user_file", ["userId", "fileId"])
})
