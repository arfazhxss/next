/**
 * This TypeScript module provides functionality to interact with files in a Convex application.
 * It includes queries to list files and a mutation to save a song's storage ID.
 */

import { ConvexError, v } from "convex/values";
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
        /*************  USER CHECK FOR EACH FILES *************/
        const identity = await ctx.auth.getUserIdentity();              // Retrieve the current user's identity from the context's authentication module
        if (!identity) throw new ConvexError("Unauthorized");           // Throw an error if the user is not found or not authorized

        const files = await ctx.db.query("files").collect();            // Retrieves all file entries from the database

        return Promise.all(
            files.map(async (file) => {                                 // Maps over the files to fetch related data and checks for user's favorites
                const songUrl = await ctx.storage.getUrl(file.song);    // Get the URLs for the song and the image from storage
                let imageUrl = file.image ? await ctx.storage.getUrl(file.image) : null;

                const user = await ctx.db                               // Query the 'users' table for the user with the matching token identifier
                    .query("users")
                    .withIndex("by_token", (q) =>
                        q.eq("tokenIdentifier", identity.tokenIdentifier))
                    .unique();
                if (user === null) { throw new ConvexError("User doesn't exist in the database!"); }
                /*************  USER CHECK DONE *************/

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
 * handler function that asynchronously generates an upload URL using the provided context and arguments.
 *
 * @param {object} ctx - the context object
 * @param {type} args - description of args
 * @return {Promise<type>} a Promise that resolves to the generated upload URL
 */
export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx, args) => {
        return await ctx.storage.generateUploadUrl();
    },
});

/**
 * Mutation to save a song's storage ID and title in the files table.
 * It requires an authenticated user and uses their token identifier to find their user record.
 * 
 * @param {ConvexContext} ctx - The mutation context, which includes authentication and database access.
 * @param {object} args - The arguments for this mutation.
 * @param {string} args.songStorageId - The storage ID of the song to be saved.
 * @param {string} args.title - The title of the song.
 * 
 * @returns {Promise<object>} A promise that resolves to the new file record that was inserted into the database.
 * 
 * @throws {ConvexError} Throws an "Unauthorized" error if no authenticated user is found.
 * @throws {ConvexError} Throws a "User not found." error if the authenticated user does not have an entry in the users table.
 */
export const saveSongStorageId = mutation({
    args: {
        songStorageId: v.id("_storage"),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        /*************  USER CHECK *************/
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new ConvexError("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) { throw new ConvexError("User not found."); }
        /************* CHECK DONE *************/

        return await ctx.db.insert("files", {
            song: args.songStorageId,
            ownerId: user._id,
            title: args.title,
        });
    },
});

/**
 * This function...
 *      - is an API mutation that saves an image storage ID to a user's file record
 *      - saves the image storage ID to the corresponding file record for the current user
 *      - handles the request and updates the image storage ID for a user
 * 
 * @param {Object} ctx - The context object.
 * @param {Object} args - The arguments object.
 * @param {string} args.id - The ID of the user.
 * @param {string} args.imageStorageId - The ID of the image storage.
 * @throws {ConvexError} If the user is not authorized or not found.
 * @return {Promise<Object>} The updated user object.
 */
export const saveImageStorageId = mutation({
    args: {
        imageStorageId: v.id("_storage"),                           // Validate the imageStorageId parameter as a storage ID
        id: v.id("files"),                                          // Validate the file record ID parameter as a file ID
    },
    handler: async (ctx, args) => {
        /*************  USER CHECK *************/
        const identity = await ctx.auth.getUserIdentity();          // Retrieve the current user's identity from the context's authentication module
        if (!identity) throw new ConvexError("Unauthorized");       // Throw an error if the user is not found or not authorized

        const user = await ctx.db                                   // Query the 'users' table for the user with the matching token identifier
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) { throw new ConvexError("User not found."); }
        /*************  CHECK DONE *************/

        return await ctx.db.patch(args.id, {                         // Update the file record with the provided ID with the new image storage ID.
            image: args.imageStorageId,
        });
    },
});