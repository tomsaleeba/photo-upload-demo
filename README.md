A demo using [Uppy.io](https://uppy.io) to offer a bandwith and human-time-saving way of uploading files. These photos are from a [camera trap](https://en.wikipedia.org/wiki/Camera_trap) and may contain false positives, which are very time consuming to have a human sort through. It's also a waste of bandwith to upload all the images at full size, when only some of them are useful. This demo simulates uploading thumbnails of all photos to a server that can use AI to classify the images. The server responds with a list of photos that contain something of interest. The user can then verify the selection and upload full sized images of that subset of photos.

The high level flow is:

 1. user adds a whole directory of photos to be uploaded
 1. client (web browser) resizes the photos to thumbnails
 1. user uploads thumbnails to server
 1. server performs classification on thumbnails and responds with a list of images to upload at full size
 1. client automatically prepares all the requested full size images
 1. user verifies list of images and starts upload

This demo doesn't let the user add photos back in that the server rejected but actaully need to be uploaded. This can be done in the final solution though. There are also a number of human *touch points* but the whole process can be automated so the user only needs to select a directory. From there, everything else can happen automatically.

# Quickstart
```bash
docker-compose up
# open your browser to http://localhost:5000/
# drag a directory of photos onto the drop target
# note that the photos have been thumbnailed
# click 'Upload'
# click 'Prepare to upload full-size photos', this simulates the autoclassify process (poorly)
# note that the photos are full size
# click 'Upload'
```
Then, to clean up:
```bash
docker-compose rm -f
```

For extra effect with your audience, throttle your network connection so they can see how much faster the thumbnails are: https://developers.google.com/web/tools/chrome-devtools/network-performance/network-conditions.

## TODO
Server:
 - make sure we can pipe the output of the tus server to where we want it, maybe with https://github.com/tus/tus-node-server#events if it supports multiple files
 - write some server-side logic to simulate the autoclassifying process
Client
 - look at disabling the edit function because we need filenames to match on the response
 - can we use websockets to get the autoclassification results back, or do we have to poll?
 - hide uppy window after upload, focus the results window
 - get webpack build working
 - look at an image compressor that doesn't use so much memory
