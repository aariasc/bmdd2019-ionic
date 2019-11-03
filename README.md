# The Meme Cellar

Sample code of the presentation "Let's build a small mobile application with Ionic and Firebase" from the [Big Mountain Data &amp; Dev 2019](https://www.utahgeekevents.com/events/big-mountain-data-dev-2019/)

![The Meme Cellar](slides/the-meme-cellar.jpg?raw=true "Title")

## Requeriments

- [NodeJS](https://nodejs.org/)
- Install [Ionic](https://ionicframework.com/docs/installation/cli) with NPM

```shell
npm install -g ionic

# if you get errors in Mac/Linux, try
sudo npm install -g ionic
```

## Run the code!

Go to https://firebase.google.com/pricing and create a free `Spark` plan. Follow the wizard to set your account.

In your new Firebase project, enable the following services:

- Authorization (email/password)
- Storage
- Database => Realtime Database

Then, in your new Firebase project, add a `Web Application`. This is required to get access to all Firebase services. Under `Project Settings` copy your `config` block.

Open the file `the-meme-cellar/src/app/app.component.ts` and update the firebase config block with the settings from your newly created firebase project:

```javascript
const firebaseConfig = {
  apiKey: "your api key",
  authDomain: "your auth domain",
  databaseURL: "https://your-database-url",
  projectId: "your project id",
  storageBucket: "your storage bucket",
  messagingSenderId: "your messaging sender ir",
  appId: "your app id"
};
```

```shell
cd the-meme-cellar/
npm install
ionic serve
```

This will open your browser to http://localhost:4200/ to see your app.

## Add Android support

You need to have Android Studio in order to build the Android native app, use the emaulators and even create the binary to upload to the PlayStore.

You first need to build the Angular/Ionic project, to be embedded afterwards into the native App. This needs to be done everytime you need to update a application application.

```shell
ng build

# use --prod when you are ready to distribute your app
ng build --prod
```

Then add Android support

```shell
# this needs to be done only once
# this command may take a few minutes to finish
npx cap add android
```

Then open the new project in Android Studio

```shell
npx cap open android
```

## Add iOS support

You need a Mac with XCode installed. You can't build an iOS app without a Mac :broken_heart:

You first need to build the Angular/Ionic project, to be embedded afterwards into the native App. This needs to be done everytime you need to update a application application.

```shell
ng build

# use --prod when you are ready to distribute your app
ng build --prod
```

Then add iOS support

```shell
# this needs to be done only once
# this command may take a few minutes to finish
npx cap add ios
```

Then open the new project in XCode

```shell
npx cap open ios
```

## Ionic Documentation

https://ionicframework.com/docs
