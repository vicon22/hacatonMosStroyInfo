'use client'

import React, { useEffect } from 'react';
import {MediaPlayer} from 'dashjs';

export const Player = () => {
    const videoRef = React.useRef(null);

    useEffect(() => {
        const player = videoRef.current;

        let url = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";
        let pl = MediaPlayer().create();

        if (player) {
            pl.initialize(player, url, true);
        }

        return () => {
            pl.destroy()
        }
    }, [videoRef]);

    return (
        <video width="100%" ref={videoRef} controls autoPlay muted />
    );
}

export default Player;