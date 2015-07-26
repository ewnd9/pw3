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

  Usage
    pw3 --setup
    pw3 lost s01e01 720p
    pw3 daredevil s01e01-05 720p # range queries

    pw3 info "sillicon valley" # description, air date of episodes
    pw3 timeline # all watching shows air dates
    pw3 available # all watching shows available episodes
```

### Command-line flags/options

[--adapter]  torrent tracker ('tpb' - thepiratebay.se, 'kickass' - kickass.to), default is 'tpb'

[--c] substring which name of torrent should contains

### Default config

```json
{
  "preferences": {

  },
  "adapters": [
    "tpb",
    "kickass"
  ],
  "available-programs": [
    {
      "name": "transmission-gtk",
      "script": "transmission-gtk \"$arg\"",
      "description": "Default ubuntu app",
      "type": "exec"
    },
    {
      "name": "peerflix",
      "script": "peerflix \"$arg\" --vlc",
      "description": "Torrent-streaming https://github.com/mafintosh/peerflix",
      "type": "replace"
    }
  ]
}
```

## Roadmap

- Subtitles Loader
- Confirmation of checking tv-show progress
- Dates in torrent-trackers
- Dates with Day of Week
- Trakt.tv integration
- `overview` command, list of all remembered shows with seasons beginning and end dates
- `--help` command, also show if no input
- Something about making want-to-watch list
- Add tv-networks in timeline
- Split info cli and lib packages
- https://github.com/sindresorhus/pretty-bytes for formatting bytes
- Edit npm scripts (https://iamstarkov.com/fav-npm-scripts/)
- Show error message on piratebay down

## Alternatives

- [lumus](https://github.com/ziacik/lumus)
- [termflix](https://github.com/asarode/termflix)
