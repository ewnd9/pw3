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

__Command-line flags/options:__

[--adapter]  torrent tracker ('tpb' - thepiratebay.se, 'kickass' - kickass.to), default is 'tpb'

[--c] substring which name of torrent should contains

__Setting up torrent client:__

To change program which should open magnet-link edit config file `~/.pw3-npm`
