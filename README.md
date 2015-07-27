# pw3

[![Build Status](https://travis-ci.org/ewnd9/pw3.svg?branch=master)](https://travis-ci.org/ewnd9/pw3)

Media Multiplexer in cli

## Installation

```
$ npm install -g pw3
```

## Usage

```
$ pw3 --help

  Examples
    # configure default torrent-tracker and torrent programm
    pw3 --setup

    # search torrents
    pw3 lost s01e01 720p
    pw3 daredevil s01e01-05 720p
    # specify torrent-tracker [tpb|kickass]
    pw3 true detective s01e01 720p --adapter=kickass

    # download subtitles to current dir
    pw3 subtitles daredevil s01e01-05 --lang="en"

    # description, air date of episodes
    pw3 info "sillicon valley"

    # show all watching shows air dates
    pw3 timeline

    # search all unwatched episodes torrents
    pw3 available

  Notes
    You can manually edit your config in /home/ewnd9/.pw3-npm
```

## Roadmap

- [Feature] Download-torrent-file  
- [Feature] Copy-magnet-to-buffer
- [Feature] Tv-show progress confirmation
- [Feature] Relative dates in torrent-table
- [Feature] Air dates with Day of Week
- [Feature] Trakt.tv integration
- [Feature] Show episode status in timeline task
- [WIP] Something about making want-to-watch list
- [Feature] Add tv-networks in timeline
- [WIP] Split info cli and lib packages
- [Bug] Show error message on piratebay down
- [Bug] Fix closing transmission on pw3 exiting
- [Bug] Kickass give torrent link, not magnet
- [Feature] https://github.com/bhagn/simple-shell
- [Feature] eztv
- [Feature] https://github.com/alexbepple/node-transmission

## Similar Projects

- https://github.com/ziacik/lumus auto-loader to transmission, local webservice
- https://github.com/asarode/termflix peerflix wrapper
- https://github.com/arshad/airtv air dates cli
- https://github.com/arshad/subdb-cli subtitles downloader cli
- https://github.com/arshad/kaizoku tpb cli
