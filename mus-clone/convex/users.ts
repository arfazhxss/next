/**
 * This file defines a mutation for storing user data 
 * into a database using the Convex server framework.
 * The mutation checks the identity of the user and inserts 
 * their information into the "users" table, if the user doesn't 
 * already exist in the database.
 */

import { ConvexError } from "convex/values";  // Importing ConvexError from the Convex package
import { mutation } from "./_generated/server" // Importing the `mutation` helper from the Convex-generated server code

/**
 * Creates a `store` mutation function that is exported for use elsewhere.
 * This mutation doesn't take any arguments.
 */
export const store = mutation({
    args: {},  // The mutation takes no arguments
    handler: async (ctx) => {  // The handler is an async function with context `ctx`
        const identity = await ctx.auth.getUserIdentity(); // Retrieves the user's identity
        if (!identity) {
            // Throws an error if there is no valid authenticated user calling this mutation
            throw new ConvexError("Called storeUser without an authenticated User");
        };

        // Queries the `users` table to check if the user already exists based on their token identifier
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();  // Ensures there is only one unique user for the token

        // If user already exists, returns their unique `_id`
        if (user !== null) { return user._id; }

        // If user doesn't exist, a new entry is created in the `users` table
        const userId = await ctx.db.insert("users", {
            tokenIdentifier: identity.tokenIdentifier, // The token identifier from the user's identity
            email: identity.email!, // The user's email, asserting it exists with `!`
            fullName: identity.name!, // The user's name, asserting it exists with `!`
            imageUrl: identity.profileUrl, // The user's profile image URL
        });

        return userId; // Returns the new user's unique `_id`
    }
});
