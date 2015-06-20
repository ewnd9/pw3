# pw3

simple torrent trackers cli

## Installation

```
$ npm install -g pw3
```

## Usage

```
$ pw3 <search_query>
```

__Range queries:__

```
$ pw3 daredevil s01e01-05 720p
```

Current query combines responses from `daredevil s01e01 720p`, `daredevil s01e02 720p`, ..., `daredevil s01e05 720p`

__Command-line flags/options:__

[--adapter]  torrent tracker ('tpb' - thepiratebay.se, 'kickass' - kickass.to), default is 'tpb'

[--c] substring which name of torrent should contains

__Setting up torrent client:__

To change program which should open magnet-link edit config file `~/.pw3-npm`

Default is `transmission-gtk \"$torrent\"`

## Similar Projects

- [lumus](https://github.com/ziacik/lumus)
- [termflix](https://github.com/asarode/termflix)
