import { ConvexError } from "convex/values";
import { query } from "./_generated/server";

/**
 * Retrieves a list of files from the Convex database.
 * 
 * This query function requires the user to be authenticated.
 * It fetches the user identity using `ctx.auth.getUserIdentity()`.
 * If the identity is not found, it throws a `ConvexError` with the message "Unauthorized".
 * 
 * The function then queries the Convex database to collect all the files using `ctx.db.query("files").collect()`.
 * 
 * For each file, it performs the following operations:
 * 1. Retrieves the URL of the song file using `ctx.storage.getUrl(file.song)`.
 * 2. If the file has an image, it retrieves the URL of the image file using `ctx.storage.getUrl(file.image)`.
 * 
 * It checks if the user exists in the database by querying the "users" collection using the user's token identifier.
 * If the user is not found, it throws a `ConvexError` with the message "User doesn't exist in the database!".
 * 
 * It checks if the user has favorited the current file by querying the "userfavorites" collection using the user's ID and the file's ID.
 * 
 * It retrieves the owner of the file using `ctx.db.get(file.ownerId)`.
 * 
 * Finally, it constructs an object with the file's data, including the song URL, image URL, and favorite status.
 * 
 * The function returns an array of these objects using `Promise.all()` to handle the asynchronous processing of each file.
 * 
 * @returns {Promise<Array<{
 *   _id: string,
 *   name: string,
 *   song: string,
 *   image: string | null,
 *   ownerId: string,
 *   songUrl: string,
 *   imageUrl: string | null,
 *   favorite: boolean
 * }>>}  - A promise that resolves to an array of objects representing the files with their associated data.
 * @throws {ConvexError} - If the user is not authenticated or if the user doesn't exist in the database.
 */
export const list = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) { throw new ConvexError("Unauthorized"); }

        const files = await ctx.db  
                            .query("files")
                            .collect();

        return Promise.all(
            files.map( async (file) => { 
                const songUrl = await ctx.storage.getUrl(file.song); 
                let imageUrl: string | null = null;
                if (file.image) { imageUrl = await ctx.storage.getUrl(file.image); }

                // check if user is already in the database
                const user = await ctx.db
                    .query("users")
                    .withIndex("by_token", 
                        (q) => q
                        .eq("tokenIdentifier", identity.tokenIdentifier)
                    )
                    .unique();

                // if user exists, return the userId
                if (user === null) { throw new ConvexError("User doesn't exist in the database!"); }

                // check if the user has favorite 
                const favorite = await ctx.db
                                        .query("userfavorites")
                                        .withIndex("by_user_file", 
                                            (q) => q
                                            .eq("userId", user._id)
                                            .eq("fileId", file._id)
                                        )
                                        .unique() 

                const owner = await ctx.db.get(file.ownerId)

                return {
                    ...file,
                    songUrl,
                    imageUrl,
                    favorite: favorite? true : false,
                }
            })
        )
    }
})

export const saveSongStorageId = mutation({
    args: {
        saveSongStorageId: v.id("_storage"),
        title: v.string(),
    },
})