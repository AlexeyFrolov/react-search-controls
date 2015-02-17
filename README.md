## Installation:
```
npm install browserify -g
npm install watchify -g
npm install static-server -g (or you can use any static server to serve "build" directory)
npm install
```

## Development 
```
cd ./build && static-server
watchify --debug index.js -o build/bundle.js
```
## TODO
Setup webpack, add frontend staff to npm.
