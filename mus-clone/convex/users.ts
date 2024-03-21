import { ConvexError } from "convex/values";
import { mutation } from "./_generated/server"

// ctx.db is context database (???)

export const store = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) { throw new ConvexError("Called storeUser without authenticated User")};
        
        // check if user is already in the database
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();
        
        if (user !== null) { return user._id; }
        const userId = await ctx.db.insert("users", {
            
        })
        return userId;
    }
})