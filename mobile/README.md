# Gathera Mobile App

A React Native mobile application built with Expo for the Gathera platform, providing a seamless mobile experience for managing gatherings, social interactions, and location-based features.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)

## Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac users) or Android Studio (for Android development)
- Expo Go app on your physical device (for testing)

## Features

- User authentication with phone number verification
- Real-time chat and messaging
- Location-based gathering discovery
- Interactive maps with clustering
- Push notifications
- Profile management
- Social features (following, blocking)
- Subscription management through RevenueCat
- Image upload and management
- Real-time updates using WebSocket

## Technology Stack

- React Native (using Expo)
- TypeScript
- Socket.IO for real-time communication
- React Navigation for routing
- Expo modules for native functionality
- RevenueCat for in-app purchases
- Firebase Analytics
- React Native Maps with clustering

## Installation

```bash
# Install dependencies
npm install

# Install Expo CLI globally
npm install -g expo-cli

# Install Expo Go on your mobile device
# Available on App Store and Play Store
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
EXPO_PUBLIC_API_HOSTNAME=your_api_hostname
EXPO_PUBLIC_HOSTNAME=your_app_hostname
EXPO_PUBLIC_EXPO_PROJECT_ID=your_expo_project_id
EXPO_PUBLIC_REVENUE_CAT_API_KEY_IOS=your_revenue_cat_ios_key
EXPO_PUBLIC_REVENUE_CAT_API_KEY_ANDROID=your_revenue_cat_android_key
```

## Running the Application

```bash
# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Build development Android APK
npm run build-dev-android
```

## Project Structure

```
mobile/
├── assets/            # Static assets (images, fonts)
├── features/          # Feature-specific components and logic
├── gathera-lib/       # Shared library code
├── screens/           # Screen components
├── shared/           # Shared components and utilities
├── types/            # TypeScript type definitions
└── App.tsx           # Application entry point
```

## Dependencies

### Core Dependencies

- `expo` - Expo framework and core functionality
- `react-native` - React Native framework
- `@react-navigation/*` - Navigation libraries
- `socket.io-client` - WebSocket client
- `react-native-maps` - Maps integration
- `@gorhom/bottom-sheet` - Bottom sheet component

### UI and Interaction

- `expo-blur` - Blur effects
- `expo-haptics` - Haptic feedback
- `expo-linear-gradient` - Gradient effects
- `react-native-gesture-handler` - Gesture handling
- `react-native-reanimated` - Animations
- `react-native-svg` - SVG support

### Device Features

- `expo-location` - Location services
- `expo-image-picker` - Image selection
- `expo-notifications` - Push notifications
- `expo-secure-store` - Secure storage
- `expo-tracking-transparency` - iOS tracking transparency

### Data Management

- `@react-native-async-storage/async-storage` - Local storage
- `react-native-purchases` - In-app purchases
- `validator` - Data validation

### Development Dependencies

- `typescript` - TypeScript support
- `@babel/core` - Babel compiler
- Various type definitions (@types/\*)

## License

Copyright (c) 2025 Younes Benketira

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
