import { ConvexError } from "convex/values";
import { query } from "./_generated/server"

// ctx.db is context database (???)

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
                                            .eq("userId", file.ownerId)
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