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

    # show all watching shows air dates in report style
    pw3 schedule

    # search all unwatched episodes torrents
    pw3 available

    # check watched episodes
    pw3 progress

  Notes
    You can manually edit your config in /home/ewnd9/.pw3-npm
```

## Similar Projects

- https://github.com/ziacik/lumus auto-loader to transmission, local webservice
- https://github.com/asarode/termflix peerflix wrapper
- https://github.com/arshad/airtv air dates cli
- https://github.com/arshad/subdb-cli subtitles downloader cli
- https://github.com/arshad/kaizoku tpb cli
- https://github.com/Munter/ezflix stream eztv to peerflix
- https://github.com/maxogden/torrent download torrents with node from the CLI
- https://github.com/SeekTheError/tbb-transmission
- https://github.com/schizoduckie/DuckieTV/ nw.js based desktop app with trakt and utorrent integrations

## License

MIT © [ewnd9](http://ewnd9.com)
