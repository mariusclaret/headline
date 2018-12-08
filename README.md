# Headline

Get live headlines from over 40 sources including Bloomberg, The New York Times, TechCrunch, The Verge, The Washington Post and many more. Try it out: https://headline.tooo.io/

## API

All the data displayed in the app comes from the https://newsapi.org  
```Endpoint: https://newsapi.org/v1/articles```  
```Version: v1```

## Touch Gestures (/script.js L112)

The app contains many gestures to give the user a natural feeling for navigation, which he is used to when interacting with native mobile applications. The gestures include: Swiping left and right on the article area to switch sources in the tab navigation (```element.content.ontouchstart element.content.ontouchmove```), then dragging the side navigation from the far left edge to right and back again (```element.blocker.ontouchstart element.blocker.ontouchmove element.blocker.ontouchend element.blocker.ontouchcancel```)

## Rendering of News Sources (/script.js L194)

On the initial load of the website, the sources in the side navigation are rendered. It takes a predefined data object of news sources and a list of excluded (by the user) news sources. After every change of the sources (user checking/unchecking a source in the side nav) the "excluded" list gets updated and saved to the local storage.

## Rendering of Navigation Tabs (/script.js L240)

The navigation tabs are rendered once based on the sources a user has selected. On every click the tab indicator goes through a complex transformation which calculates the new length and x position to match the underlying tab name element. Also, is the tab bar scrolled smoothly to the center of the screen if necessary.

## Articles Fetching and Rendering (/script.js L273)

On every request, the function checks if the client is offline. If so, the articles list will be fetched from the local storage and displayed. If the client is online, the request goes to the API. The response is then saved to the local storage for future use. Then the data is processed and rendered.

## Service Worker and Local Storage

A service worker is running in the background and is fetching the source files and the images. The API responses are saved to the local storage. This means, once the page is loaded, the full app is available for offline use, even after the browser is closed completely and opened again.

## Author

Marius Claret (@mariusclaret || https://twitter.com/mariusclaret)