# pw3

simple torrent trackers and imdb cli

## Installation

```
$ npm install -g pw3
```

There is setup dialog on first run (setting up default tracker and torrent client), later can be run again by

```
$ pw3 --setup
```

## Usage

```
$ pw3 <search_query>
```

### Range queries

Combines responses from `daredevil s01e01 720p`, `daredevil s01e02 720p`, ..., `daredevil s01e05 720p`

```
$ pw3 daredevil s01e01-05 720p
```

### Search info on imdb

Shows rating, description, seasons with dates.

```
$ pw3 info daredevil
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

## Similar Projects

- [lumus](https://github.com/ziacik/lumus)
- [termflix](https://github.com/asarode/termflix)
