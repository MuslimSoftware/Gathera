#!/bin/bash

# Set eas.json build to local
# Increment app.json Android versionCode
npx eas build --local --platform android --profile production

# Find the first ".aab" file in the current directory
aab_file=$(find . -maxdepth 1 -type f -name "*.aab" -print -quit)

if [ -n "$aab_file" ]; then
  # Rename the file to "Gathera.aab"
  mv -f "$aab_file" ./build/Gathera.aab
  echo "Renamed '$aab_file' to './build/Gathera.aab'"
else
  echo "No '.aab' file found in the current directory."
  exit 1
fi

cd build
rm -f *.apks

deviceId=$(adb devices | grep device | awk 'NR > 1 {print $1; exit}')

java -jar bundletool.jar build-apks --bundle=./Gathera.aab --output=./Gathera.apks --ks=./keystore.jks --ks-pass=file:./keystore.pwd --ks-key-alias=key0 --key-pass=file:./keystore.pwd --mode=universal
java -jar bundletool.jar install-apks --apks=Gathera.apks --device-id=$deviceId
