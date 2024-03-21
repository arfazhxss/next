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

                const favorite = await ctx.db
                                        .query("userfavorites")
                                        .withIndex("by_user_file", 
                                        (q) => q
                                            .eq("userId", file.ownerId)
                                            .eq("fileId", file._id)
                                        )
                                        .unique()
            })
        )
    }
})