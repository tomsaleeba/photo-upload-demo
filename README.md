# Quickstart
```bash
npm i
npm start # uses python to start an HTTP server in src/
# open your browser to http://localhost:5000/
```
If `npm start` fails, just launch a web server in the `src/` directory. Currently uploading will fail, watch this space for a server to accept the uploads.

## TODO
Server:
 - swap from XHR client to TUS so we can use the TUS server
 - make sure we can pipe the output of the tus server to where we want it, maybe with https://github.com/tus/tus-node-server#events if it supports multiple files
Client
 - add theme to the uploader page
 - look at disabling the edit function because we need filenames to match on the response
 - can we use websockets or do we have to poll?
 - hide uppy window after upload, focus the results window
 - get webpack build working
