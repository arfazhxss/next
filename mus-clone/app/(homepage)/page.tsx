" use client"

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Heart, Play } from "lucide-react"
import Image from "next/image";
import { FileWithUrls } from "@/types";
import AudioPLayer from "@/components/audio-player"; 
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

/**
 * The home page component for the MUS Clone app.
 * This component renders the landing page for the app and
 * provides functionality for playing music files.
 */
const Home = () => {
    /**
     * Mutation used to store a user in the database.
     * This is used to store the user's favorite songs in the database.
     */
    const store = useMutation(api.users.store);
    /**
     * Query used to fetch a list of all files in the database.
     */
    const songList = useQuery(api.files.list);
    /**
     * The Id of the currently playing song.
     * This is used to keep track of which song is currently playing.
     */
    const [fileId, setFileId]  = useState<Id<"files"> | null> (null);
    /**
     * The URL of the currently playing song.
     * This is used to play the song in the browser.
     */
    const [currentSong, setCurrentSong] = useState('');
    /**
     * The title of the currently playing song.
     */
    const [title, setTitle] = useState('title');
    /**
     * The name of the artist of the currently playing song.
     */
    const [artist, setArtist] = useState('');
    /**
     * The URL of the cover art of the currently playing song.
     */
    const [coverArt, setCoverArt] = useState<string | null>('');
    /**
     * Whether or not to display only the user's favorite songs.
     */
    const [showFavorites, setShowFavorites] = useState(false);
    /**
     * The index of the currently playing song in the filtered song list.
     */
    const [currentIndex, setCurrentIndex] = useState<number>(-1);

    /**
     * Handles the logic for playing the next song in the filtered song list.
     * If the current index is less than the length of the filtered song list minus 1,
     * it plays the next song and updates the current index.
     * Otherwise, it plays the first song in the filtered song list and resets the current index to 0.
     *
     * @return {void} This function does not return a value.
     */
    const handleNext = () => {
        if (currentIndex < filteredSongList.length - 1) {
            const nextIndex = currentIndex + 1;
            const nextSong = filteredSongList[nextIndex];
            playSong(nextSong);
            setCurrentIndex(nextIndex);
        } else {
            const firstSong = filteredSongList[0];
            playSong(firstSong);
            setCurrentIndex(0);
        }
    };

    
    /**
     * Handles the action of going to the previous song in the filteredSongList.
     * If the currentIndex is greater than 0, it plays the previous song and updates the currentIndex.
     * If the currentIndex is 0, it plays the last song in the filteredSongList and updates the currentIndex.
     *
     * @return {void} This function does not return anything.
     */
    const handlePrevious = () => {
        if (currentIndex > 0) {
            const previousIndex = currentIndex - 1;
            const previousSong = filteredSongList[previousIndex];
            playSong(previousSong);
            setCurrentIndex(previousIndex);
        } else {
            const lastIndex = filteredSongList.length - 1;
            const lastSong = filteredSongList[lastIndex];
            playSong(lastSong);
            setCurrentIndex(lastIndex);
        }
    };

    /**
     * Handles the event of the page mounting.
     * When the page mounts, a user is stored in the database.
     * This is used to store the user's favorite songs in the database.
     */
    useEffect(() => {
        store({});
    },[store]);

    /**
     * Sets the state variables to play a song.
     *
     * @param {FileWithUrls} file - The file object containing song URLs and metadata.
     */
    const playSong = (file: FileWithUrls) => {

export default Home;