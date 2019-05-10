import * as React from 'react';
import Hls = require('hls.js');
import './player.css';

interface PlayerProps {
  playbackId: string;
}

class Player extends React.Component<PlayerProps, {}> {
  playerRef: React.RefObject<HTMLVideoElement>;
  hls: Hls;

  constructor(props: PlayerProps) {
    super(props);

    this.playerRef = React.createRef();
    this.hls = new Hls();
  }

  componentDidMount() {
    if (!this.playerRef.current) {
      throw Error('No reference to an existing video element found.');
    }

    if (Hls.isSupported()) {
      this.hls.loadSource(this.playbackUrl());
      this.hls.attachMedia(this.playerRef.current);
    } else if (
      this.playerRef.current.canPlayType('application/vnd.apple.mpegurl')
    ) {
      this.playerRef.current.src = this.playbackUrl();
    }
  }

  playbackUrl = () => `https://stream.mux.com/${this.props.playbackId}.m3u8`;
  posterUrl = () =>
    `https://image.mux.com/${this.props.playbackId}/thumbnail.jpg`;

  render() {
    return (
      <div className="player">
        <video
          ref={this.playerRef}
          poster={this.posterUrl()}
          controls
          width="100%"
        />
      </div>
    );
  }
}

export default Player;
