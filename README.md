# pw3

[![Build Status](https://travis-ci.org/ewnd9/pw3.svg?branch=master)](https://travis-ci.org/ewnd9/pw3)

> powerstreaming - watching several episodes of a TV show in a row, usually from an online streaming service. This can be done over several evenings, or a marathon weekend.

Air dates, search on tpb, eztv or kickass, check watched episodes from cli

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

    # range query
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

    # check watched episodes
    pw3 progress

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
- [WIP] Something about making want-to-watch list
- [Feature] Add tv-networks in timeline
- [WIP] Split info cli and lib packages
- [Bug] Show error message on piratebay down
- [Bug] Fix closing transmission on pw3 exiting
- [Bug] Kickass give torrent link, not magnet
- [Feature] https://github.com/bhagn/simple-shell
- [Feature] https://github.com/alexbepple/node-transmission

## Similar Projects

- https://github.com/ziacik/lumus auto-loader to transmission, local webservice
- https://github.com/asarode/termflix peerflix wrapper
- https://github.com/arshad/airtv air dates cli
- https://github.com/arshad/subdb-cli subtitles downloader cli
- https://github.com/arshad/kaizoku tpb cli
- https://github.com/Munter/ezflix stream eztv to peerflix
