" use client"

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

const Home = () => {
    const store = useMutation(api.users.store);
    const songList = useQuery(api.files.list);
    const [fileId, setFileId]  = useState<Id<"files"> | null> (null);
    const [currentSong, setCurrentSong] = useState('');
    const [title, setTitle] = useState('title');
    const [artist, setArtist] = useState('');
    const [coverArt, setCoverArt] = useState<string | null>('');
    const [showFavorites, setShowFavorites] = useState(false);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);

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

    useEffect(() => {
        store({});
    },[store]);

    const playSong = (file: FileWithUrls) => {
        setFileId(file._id);
        setCurrentSong(file.songUrl)
        setArtist(file.owner.fullName);
        setCoverArt(file.image ? file.image.imageUrl : null);
        setTitle(file.title);

    };

}

export default Home;