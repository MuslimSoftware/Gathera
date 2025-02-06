# Gathera Backend

A Node.js/Express backend service for the Gathera application, providing API endpoints for user management, authentication, gatherings, conversations, and more.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Required Services](#required-services)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Libraries and Dependencies](#libraries-and-dependencies)

## Prerequisites

- Node.js (v14 or higher recommended)
- MongoDB
- AWS Account (for S3 storage)
- Twilio Account
- Google Maps API Key
- RevenueCat Account

## Required Services

### 1. MongoDB

- Database service for storing application data
- Requires a MongoDB URI for connection

### 2. AWS S3

- Used for storing profile pictures and gathering images
- Requires:
  - AWS Region configuration
  - S3 bucket for profile pictures
  - S3 bucket for gathering pictures

### 3. Twilio

- Used for phone number verification and SMS services
- Requires:
  - Account SID
  - Auth Token
  - Verify Service SID
  - Messaging Service SID

### 4. Google Maps

- Used for location services
- Requires Google Maps API Key

### 5. RevenueCat

- Used for subscription management
- Requires RevenueCat Auth Key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
PRODUCTION=false
MONGODB_URI=your_mongodb_uri
ADMIN_SECRET_KEY=your_admin_secret
JWT_SECRET_KEY=your_jwt_secret
METRICS_AUTH_KEY_BASE64=your_metrics_auth_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_VERIFY_SERVICE_SID=your_twilio_verify_sid
TWILIO_MESSAGING_SERVICE_SID=your_twilio_messaging_sid
AWS_REGION=your_aws_region
AWS_S3_PROFILE_PICTURES_BUCKET_NAME=your_profile_pictures_bucket
AWS_S3_GATHERING_PICTURES_BUCKET_NAME=your_gathering_pictures_bucket
REVENUE_CAT_AUTH_KEY=your_revenue_cat_key
```

## Installation

```bash
# Install dependencies
npm install

# Build the application
npm run build
```

## Running the Application

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run prod

# Build Docker image
npm run build-image
```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /login` - User login
- `POST /signup` - User registration
- `POST /user-exists` - Check if user exists
- `POST /request-otp` - Request OTP for phone verification
- `POST /validate-otp` - Validate OTP code
- `POST /refresh` - Refresh authentication token
- `POST /logout` - User logout

### User Routes (`/api/user`)

- `GET /` - Get authenticated user profile
- `DELETE /delete` - Delete authenticated user account
- `GET /all-users` - Get all user profiles
- `PATCH /profile/update` - Update user profile
- `GET /profile/get/:id` - Get user profile by ID
- `GET /profile/followers/:id` - Get user's followers
- `GET /profile/following/:id` - Get users being followed
- `GET /profile/liked-places/:id` - Get places liked by user
- `POST /follow/:idToFollow` - Follow a user
- `POST /unfollow/:idToUnfollow` - Unfollow a user
- `POST /respond-to-follow-request/:notification_id` - Accept/reject follow request
- `POST /cancel-follow-request/:userIdToCancel` - Cancel a sent follow request
- `PATCH /interests` - Update user interests
- `POST /details/upsert` - Update user details
- `GET /borders/:user_id` - Get user's profile border styles
- `POST /report/:user_reported_id` - Report a user
- `POST /block/:user_to_block_id` - Block a user
- `POST /unblock/:user_to_unblock_id` - Unblock a user
- `GET /settings` - Get user settings
- `PATCH /settings` - Update user settings
- `POST /push-token` - Save push notification token
- `GET /pre-signed-url` - Get pre-signed URL for profile picture upload
- `POST /pre-signed-url` - Save profile picture using pre-signed URL
- `GET /profile-views-details/:userId` - Get profile view statistics (requires subscription)
- `POST /feedback` - Submit user feedback
- `GET /trending` - Get trending users (cached for 30 minutes)

### Gathering Routes (`/api/gathering`)

- `GET /` - Get all gatherings (cached for 1 minute)
- `POST /create` - Create a new gathering
- `GET /suggested` - Get suggested gatherings
- `GET /get/:gathering_id` - Get full gathering details
- `GET /place/:place_id` - Get all future gatherings at a place (cached for 15 seconds)
- `GET /user/:user_id` - Get gatherings by user ID
- `POST /join/:gathering_id` - Join a gathering
- `POST /invite/:gathering_id` - Invite user to gathering
- `GET /invited-users/:gathering_id` - Get list of invited users
- `POST /respond-invite/:notification_id` - Respond to gathering invitation
- `POST /respond-to-request/:gathering_id` - Respond to join request
- `POST /remove-user/:gathering_id` - Remove user from gathering
- `PATCH /update/:gathering_id` - Update gathering details
- `DELETE /delete/:gathering_id` - Delete gathering
- `GET /pre-signed-url/:gathering_id` - Get pre-signed URL for gathering picture upload
- `POST /pre-signed-url/:gathering_id` - Save gathering picture using pre-signed URL
- `GET /views-details/:gathering_id` - Get gathering view statistics (requires subscription)

### Place Routes (`/api/place`)

- `GET /` - Get all places (cached for 5 minutes)
- `GET /get/:place_id` - Get place details
- `GET /photos/:place_id` - Get place photos (cached)
- `GET /interested-users/:place_id` - Get users interested in place
- `POST /toggle-interest/:place_id` - Toggle interest in place
- `GET /trending` - Get trending places (cached for 30 minutes)
- `GET /views-details/:placeId` - Get place view statistics (requires subscription)

### Conversation Routes (`/api/conversation`)

- `GET /` - Get all conversations for authenticated user
- `GET /get/:conversation_id` - Get conversation by ID
- `POST /create` - Create a new conversation
- `PATCH /update/:conversation_id` - Update conversation details
- `POST /add-users/:conversation_id` - Add users to conversation
- `POST /leave/:conversation_id` - Leave conversation
- `POST /send-message/:conversation_id` - Send a message
- `GET /messages/:conversation_id` - Get conversation messages
- `POST /hide/:conversation_id` - Hide conversation for authenticated user

### Notification Routes (`/api/notification`)

- `GET /` - Get all notifications for authenticated user
- `GET /unread` - Get count of unread notifications
- `DELETE /delete/:notification_id` - Delete a notification

### Admin Routes (`/api/admin`)

> Note: All admin routes require admin authentication

#### Data Management

- `GET /search/:query` - Search across the database
- `PATCH /update-field` - Update field across collections
- `PATCH /update-field-manual` - Manual field updates
- `DELETE /delete-places` - Delete places from database
- `DELETE /user/delete/:user_id` - Delete specific user

#### Place Management

- `POST /add-new-places` - Add new places to the database
- `PATCH /update-place-photos` - Update default photos for places
- `POST /store-place-photos` - Store new place photos

#### Scoring and Algorithms

- `POST /users/calculate-trending-score` - Calculate user trending scores
- `POST /places/calculate-trending-score` - Calculate place trending scores
- `POST /gatherings/calculate-suggested-gatherings` - Generate gathering suggestions

#### Feature Management

- `POST /interest/create/:interest_name` - Create new interest category
- `POST /interest/create-many` - Bulk create interest categories
- `POST /borders/unlock/:user_id/:border` - Grant new profile border style to user
- `POST /send-push-notification-to-all-users` - Send global push notification

#### Maintenance

- `POST /script` - Run maintenance scripts

## Algorithms

### Trending Scores

The application uses several algorithms to calculate trending scores:

#### Places

- Factors in total visits
- Weighs recent gatherings more heavily
- Considers user engagement and interactions
- Adjusts for time decay

#### Users

- Based on follower growth rate
- Considers gathering participation
- Weighs content engagement
- Factors in profile visits

### Suggestion Engine

Gathering suggestions are generated using:

- User interests and preferences
- Location proximity
- Past gathering history
- Social graph connections
- Time-based availability

### Location Clustering

- Uses MongoDB geospatial queries
- Implements map marker clustering
- Optimizes for viewport performance

### Webhook Routes (`/api/webhook`)

- RevenueCat subscription webhooks
- Other third-party service integrations

## Libraries and Dependencies

### Core Dependencies

- `express` - Web framework for Node.js
- `mongoose` - MongoDB object modeling
- `socket.io` - Real-time bidirectional event-based communication
- `jsonwebtoken` - JWT implementation for Node.js
- `twilio` - Twilio API client
- `@aws-sdk/client-s3` - AWS S3 client
- `@aws-sdk/s3-request-presigner` - AWS S3 presigned URLs
- `expo-server-sdk` - Expo push notifications

### Utility Libraries

- `axios` - HTTP client
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `express-prometheus-middleware` - Prometheus metrics
- `express-rate-limit` - Rate limiting middleware
- `libphonenumber-js` - Phone number parsing and validation
- `validator` - String validation and sanitization
- `morgan` - HTTP request logger

### Development Dependencies

- `typescript` - TypeScript support
- `ts-node` - TypeScript execution environment
- `nodemon` - Development auto-reload
- `tsc-alias` - TypeScript path alias resolution
- Various TypeScript type definitions (@types/\*)

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
