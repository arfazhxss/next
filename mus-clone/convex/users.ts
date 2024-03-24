import { ConvexError } from "convex/values";
import { mutation } from "./_generated/server"

/**
 * Handles user-related operations in the Convex database.
 * 
 * This module provides functions for managing user registration, login, and retrieval of user information.
 * 
 * ## User Registration
 * 
 * The `register` function allows users to create a new account by providing their email and password.
 * It generates a unique token identifier for the user and stores their email and password hash in the "users" collection.
 * 
 * ### Arguments
 * 
 * The `register` function accepts an object with the following properties:
 * 
 * - `email` (string): The email address of the user.
 * - `password` (string): The password for the user's account.
 * 
 * ### Return Value
 * 
 * The `register` function returns a Promise that resolves to an object containing the following properties:
 * 
 * - `tokenIdentifier` (string): The unique token identifier generated for the user.
 * - `user` (object): The user object stored in the "users" collection, including the user's ID, email, and password hash.
 * 
 * ## User Login
 * 
 * The `login` function allows users to authenticate using their email and password.
 * It checks if the provided email and password match the stored credentials in the "users" collection.
 * If the credentials are valid, it generates a new token identifier for the user and returns it along with the user's ID.
 */
// ctx.db is context database (???)

export const store = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) { throw new ConvexError("Called storeUser without an authenticated User")};
        
        // check if user is already in the database
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();
        
        // if user exists, return the userId
        if (user !== null) { return user._id; }

        const userId = await ctx.db.insert("users", {
            tokenIdentifier: identity.tokenIdentifier,
            email: identity.email!,
            fullName: identity.name!,
            imageUrl: identity.profileUrl,
        })
        return userId;
    }
})