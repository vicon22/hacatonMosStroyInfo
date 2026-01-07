"use client";

import React, { memo, useEffect } from "react";
import { MediaPlayer } from "dashjs";
import st from "./player.module.css";

type PlayerProps = {
  source: string;
};

const Player = memo<PlayerProps>(function Player(props) {
  const videoRef = React.useRef(null);

  useEffect(() => {
    const ref = videoRef.current;
    const instanse = MediaPlayer().create();

    instanse.updateSettings({
      streaming: {
        abr: {
          minBitrate: {
            audio: 1,
            video: 1,
          },
          initialBitrate: {
            audio: 1,
            video: 1,
          },
        },
      },
    });

    if (ref) {
      instanse.initialize(ref, props.source, false);
    }

    return () => {
      instanse.destroy();
    };
  }, [videoRef, props.source]);

  return <video className={st.video} ref={videoRef} controls muted />;
});

export default Player;
