/**
 * This TypeScript module provides functionality to interact with files in a Convex application.
 * It includes queries to list files and a mutation to save a song's storage ID.
 */

import { ConvexError } from "convex/values";
import { query, mutation } from "./_generated/server"; // Importing the `query` and `mutation` helper from the Convex-generated server code
import { FileWithUrls } from "../types/index";

/**
 * Defines a query named `list` that retrieves and processes information about files.
 * 
 * @returns {Promise} A promise that resolves to an array of file objects with additional
 *          metadata such as songUrl, imageUrl, and favorite status.
 * @throws {ConvexError} Throws an error if the user is unauthorized or doesn't exist in the database.
 */
export const list = query({
    args: {},
    handler: async (ctx) => {
        // Verifies the user's identity. Throws an error if identity is not found (Unauthorized).
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) { throw new ConvexError("Unauthorized"); }

        // Retrieves all file entries from the database.
        const files = await ctx.db.query("files").collect();

        // Maps over the files to fetch related data and checks for user's favorites.
        return Promise.all(
            files.map(async (file) => {
                // Get the URLs for the song and the image from storage.
                const songUrl = await ctx.storage.getUrl(file.song);
                let imageUrl = file.image ? await ctx.storage.getUrl(file.image) : null;

                // Check for user existence in the database using their token identifier.
                const user = await ctx.db
                    .query("users")
                    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
                    .unique();
                if (user === null) { throw new ConvexError("User doesn't exist in the database!"); }

                // Check if the current file is a favorite of the user.
                const favorite = await ctx.db
                    .query("userfavorites")
                    .withIndex("by_user_file", (q) => q.eq("userId", user._id).eq("fileId", file._id))
                    .unique()

                // Get additional details about the file's owner.
                const owner = await ctx.db.get(file.ownerId)

                // Constructs the final file object with URLs and favorite status.
                return {
                    ...file,
                    songUrl,
                    imageUrl,
                    favorite: favorite !== null,
                } as FileWithUrls;
            })
        )
    }
})

/**
 * Defines a mutation named `saveSongStorageId` to save a song's storage ID with its title.
 * 
 * @param {v.id} saveSongStorageId The ID of the storage where the song is saved.
 * @param {v.string()} title The title of the song.
 * 
 * @note The `args` object is defined with `saveSongStorageId` and `title` as its properties,
 * but the mutation handler definition is incomplete in this provided code.
 */
// export const saveSongStorageId = mutation({
//     args: {
//         saveSongStorageId: v.id("_storage"),
//         title: v.string(),
//     },
//     // The handler function for the mutation should be defined here.
// })
