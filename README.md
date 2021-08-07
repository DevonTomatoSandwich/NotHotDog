# NotHotDog
Cross platform App built with react native to determine whether or not an image is a hotdog

# Store links

 - [Google Play Store](https://play.google.com/store/apps/details?id=com.not_hot_dog&hl=en&gl=US)
 - [Apple App Store](https://apps.apple.com/us/app/not-hot-dog/id1523654226)

# Appearence
 
 - Title: "Not Hot Dog ¿"
 - Icon: 

![icon](https://github.com/DevonTomatoSandwich/NotHotDog/blob/master/github_images/logo_120.png)

 - Screenshots (ios iPh8+ then android A5):

![ios](https://github.com/DevonTomatoSandwich/NotHotDog/blob/master/github_images/screenshot_ios_doghot.png)            ![android](https://github.com/DevonTomatoSandwich/NotHotDog/blob/master/github_images/screenshot_android_hotdog.png)

# Context

Not Hot Dog is inspired by the HBO TV series Silicon Valley, where character Jian Yang makes a very similar app. See
[youtube video of the demo](https://youtu.be/vIci3C4JkL0?t=53) 

Other fans have made similar apps but this app has some differences as outlined below.

# What it does

Not Hot Dog can determine if an image is a hot dog or not a hot dog. 
A hot dog can either be a hotdog (the fast food) or a dog (animal) that is hot. A hot dog (animal) is hot if its tongue is showing.

The hot dog (animal) is really the only diference from character Jian Yang's app. It also uses an image picker so you can select an image from the device or take a photo using the camera.

works for the image types: JPEG, PNG, TIFF, BMP, GIF, WEBP

# Tech involved

I used Clarifai to implement the AI. In their privacy statement “to use Clarifai products, you will be submitting images to Clarifai” and “Clarifai, Inc. will also use the images to improve its technologies”. Also "Clarifai, Inc. will not publicly display the images"

Also thanks to Leonardo Balland who made “seepizz” for his [tutorial](https://codeburst.io/how-to-build-a-visual-recognition-mobile-app-in-2-days-with-react-native-and-clarifai-3801f0901704) which helped me use image-picker and Clarifai. 


# Get started

- Create new react native app
- Download App.js and replace it with the current App.js in the root dir
- Get dependencies:

  - Toast from ['react-native-simple-toast'](https://www.npmjs.com/package/react-native-simple-toast)
  - ImagePicker from ['react-native-image-picker'](https://www.npmjs.com/package/react-native-image-picker)
  - Clarifai from [their website](https://www.clarifai.com/) you will have to make and verify an account to get an api key
  
- Add permissions
  - include these in the android manifest
    ```
     <uses-permission android:name="android.permission.INTERNET" />
     <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
     <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
     <uses-permission android:name="android.permission.CAMERA" />
     <uses-feature android:name="android.hardware.camera" />
     <uses-feature android:name="android.hardware.camera.autofocus" />
    ```
  - the keys you need in the xcode plist are (note these keys need a valid value)
    - Privacy - Photo Library Usage Description
    - Privacy - Camera Usage Description
    
- Add background

  Add an assets folder in the root dir which contains the background png. 
  Note this png will be scaled using `resizeMode: 'contain'` which matches the height or width
  while maintaining aspect ratio so the initial pixel dimentions won't matter.

# TODO
- [ ] For a future update I’m interested in creating my own neural network that will only be as smart as a hotdog :) 
