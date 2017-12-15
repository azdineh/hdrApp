This repository contains the code of 7odoor application, this mobile application "7odoor" is a new way to take students attendance by teacher (Morocco) in classrooms


### Links

In google play : https://goo.gl/z33iyN

### Quick Setup

    npm install -g ionic
    npm install -g cordova
    git clone https://github.com/azdineh/hdrApp.git
    cd hdrApp
    sudo bower --allow-root install
    mv -T bower_components www/lib
    ionic hooks add
    ionic serve
    
### Add Cordova plugins

    cordova-plugin-compat 1.1.0 "Compat"
    cordova-plugin-crosswalk-webview 2.3.0 "Crosswalk WebView Engine"
    cordova-plugin-file 4.3.1 "File"
    cordova-plugin-splashscreen 4.0.1 "Splashscreen"
    cordova-plugin-whitelist 1.3.3 "Whitelist"
    cordova-sqlite-storage 2.1.2 "Cordova sqlite storage plugin"
    uk.co.workingedge.cordova.plugin.sqliteporter 1.0.2 "sqlite porter"

### Todo
    Add aditional mark to a student
    Mark student whom needs support