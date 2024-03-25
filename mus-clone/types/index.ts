import { Doc } from "../convex/_generated/dataModel";

/**
 * An extension of the {@link Doc} type for the `files` collection.
 *
 * This type adds some convenience properties that are not part of the default
 * Convex generated types. These are:
 *
 * - `songUrl`: A URL to the song file.
 * - `imageUrl`: A URL to the image file, or null if there is no image.
 * - `owner`: The user who uploaded the file.
 * - `favorite`: A boolean indicating whether the current user has favorited
 *   this file.
 */
export type FileWithUrls = Doc<"files"> & {
    songUrl: string;            // The URL to download the song file
    imageUrl: string | null;    // The URL to the image file, or null if there is no image
    owner: Doc<"users">;        // The user who uploaded the file
    favorite: boolean;          // Whether the current user has favorited this file
};