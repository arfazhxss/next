import {defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        tokenIdentifier: v.string(),
        email: v.string(),
        fullname: v.string(),
        imageUrl: v.optional(v.string()),
    })  
        .index("by_token", ["tokenIdentifier"]),

    files: defineTable({
        song: v.id("_storage"),
        image: v.optional(v.id("storage")),
        ownerId: v.id("users"),
        title: v.string(),
    })  
        .index("by_ownerId", ["ownerId"])
        .index("by_song", ["song"]),
    
    userfavorites: defineTable({
        userId: v.id("users"),
        fileId: v.id("files"),
    })  
        .index("by_file", ["fileId"])
        .index("by_user", ["userId"])
        .index("by_user_file", ["userId", "fileId"])

})
