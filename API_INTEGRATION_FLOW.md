# TribalShaadi - Frontend UI flow with API integration

## App package
**Android:** `com.tribalshaadi`  
**iOS:** `com.tribalshaadi`

---

## 1. Authentication flow

### Welcome screen
- User lands on welcome screen
- Options: Login or Register

### Login screen
**UI flow:**
1. User enters 10-digit phone number
2. Phone number validation (starts with 6/7/8/9)
3. Click "Verify" button
4. If user not found → Show "User not found. Please register first" with Register button

**API:**
- `admin/users/sendOTPForLogin` - Send OTP to phone

### Register screen
**UI flow:**
1. User enters 10-digit phone number
2. Phone number validation
3. Click "Verify" button
4. OTP sent via SMS

**API:**
- `admin/users/sendOTPForRegistration` - Send OTP for new user

### OTP screen
**UI flow:**
1. User enters 6-digit OTP
2. Auto-verify when 6 digits entered
3. If incorrect → Show error message
4. If correct → Navigate to profile completion

**API:**
- `admin/users/verifyOTP` - Verify OTP and get user token

---

## 2. Profile completion flow

After successful OTP verification, user goes through profile setup:

### Gender selection screen
**UI flow:**
- User selects: Male or Female
- Click "Continue"

**API:**
- `app/users/completeUserProfileV2` - Update gender

### Name screen
**UI flow:**
- Enter first name (required)
- Enter last name (optional)
- Click "Continue"

**API:**
- `app/users/completeUserProfileV2` - Update name

### Birth date screen
**UI flow:**
- Select date of birth using date picker
- Age automatically calculated
- Minimum age: 18 years
- Click "Continue"

**API:**
- `app/users/completeUserProfileV2` - Update birth date

### Religion screen
**UI flow:**
1. Select religion from dropdown
2. Select community/caste from dropdown (filtered by religion)
3. Select mother tongue from dropdown
4. Click "Continue"

**APIs:**
- `admin/religion/getReligion` - Get religion list
- `admin/community/getCommunity` - Get community list

### Address screen
**UI flow:**
1. Select state from dropdown
2. Select city/district from dropdown (filtered by state)
3. Select "Planning to settle" timeline
4. Click "Continue"

**APIs:**
- `admin/states/getStates` - Get states list
- `admin/districts/getDistricts` - Get cities by state
- `admin/districts/getDistrictsV2` - Search cities

### Qualification screen
**UI flow:**
1. Select employment type (Private, Government, Self-employed, etc.)
2. Select occupation (filtered by employment type)
3. Select occupation category
4. Enter company/organization name
5. Select education type
6. Enter college name
7. Select annual income range
8. Click "Continue"

**APIs:**
- `admin/employmentType/getEmploymentType` - Get employment types
- `admin/occupation/getOccupationByEmploymentType` - Get occupations
- `admin/occupationcategory/getOccupationCategoryByOccupationId` - Get categories
- `admin/education/getEducationType` - Get education types
- `admin/annualIncome/getAnnualIncome` - Get income ranges

### Physical attributes screen
**UI flow:**
1. Select height from picker
2. Select diet preference (Veg, Non-veg, Eggetarian, Vegan)
3. Select drinking habits (No, Socially, Occasionally, etc.)
4. Select smoking habits (No, Yes, Planning to quit)
5. If married before → Select number of kids
6. Click "Continue"

**APIs:**
- `admin/height/getHeight` - Get height options
- `admin/diet/getDiet` - Get diet options
- `admin/maritalStatus/getMaritalStatus` - Get marital status

### About screen
**UI flow:**
- Write about yourself (minimum 50 characters)
- Text area with character counter
- Click "Continue"

**API:**
- `app/users/completeUserProfileV2` - Update about me

### About partner screen
**UI flow:**
- Write about your life partner expectations (minimum 50 characters)
- Text area with character counter
- Click "Continue"

**API:**
- `app/users/completeUserProfileV2` - Update partner preferences

### Upload image screen
**UI flow:**
1. Upload profile picture (required)
2. Upload additional gallery images (optional, max 5)
3. Images shown in grid layout
4. Can remove uploaded images
5. Click "Continue"

**APIs:**
- `app/users/updateUserProfilePic` - Upload profile picture
- `app/users/addEditGalleryImageList` - Upload gallery images

### Select interests screen
**UI flow:**
- Select interests from predefined list (Cooking, Singing, Photography, etc.)
- Minimum 3 interests required
- Click "Continue"
- Profile completion done → Navigate to Welcome Home

**API:**
- `app/users/completeUserProfileV2` - Update interests

### Welcome home screen
**UI flow:**
- Congratulations message
- App tour/introduction
- Click "Let's Go" → Navigate to Home

---

## 3. Main app (after profile completion)

### Bottom navigation
- **Home** - Discover matches
- **Interest** - Sent/received proposals
- **Chat** - Conversations with matches
- **Account** - Profile & settings

---

## 4. Home screen (Discover)

**UI flow:**
1. Shows matched user profiles in card format
2. Profile card displays:
   - Profile picture with gallery (swipeable)
   - Name (hidden until premium or mutual interest)
   - Age, height, religion, caste
   - Location (city, state)
   - About me
   - Partner expectations
   - Education, occupation
   - Lifestyle (diet, drinking, smoking)
   - Interests
   - Verified badge (if verified)
   - Premium badge (if premium user)

3. User actions:
   - **Decline button** → Skip this profile
   - **Connect button** → Send proposal
   - **Report icon** → Report profile

4. After action → Card slides away → Next profile shown

5. When no more matches → "All matches exhausted" message

**APIs:**
- `app/users/getAllUsers` - Get matched profiles
- `app/proposals/sendProposal` - Send proposal on Connect
- `app/proposals/passUser` - Pass/skip user on Decline
- `app/users/viewUserDetail` - Get detailed user info
- `app/users/getGalleryImageList` - Get user gallery images
- `app/package/getPackageByUserId` - Check if user is premium
- `app/notifications/insertUserNotifications` - Send notification to other user

---

## 5. Interest screen

### Three tabs

#### Tab 1: Received proposals
**UI flow:**
- List of users who sent you proposals
- Each card shows:
  - Profile picture
  - Name
  - Age, location
  - "New" badge if unread
- Actions:
  - **Accept** → Match created → Can chat
  - **Reject** → Proposal declined

**API:**
- `app/proposals/getProposalsGotByMe` - Get received proposals
- `app/proposals/acceptRejectProposal` - Accept or reject

#### Tab 2: Recent passes
**UI flow:**
- List of profiles you skipped
- Can review skipped profiles
- No action buttons (just for reference)

**API:**
- `app/proposals/getPassedUsers` - Get passed/skipped users

#### Tab 3: Sent proposals
**UI flow:**
- List of proposals you sent
- Each card shows proposal status:
  - Pending (waiting for response)
  - Accepted (can chat now)
  - Rejected (no action possible)
- Action:
  - **Cancel** → Cancel pending proposal

**APIs:**
- `app/proposals/getProposalsSendByMe` - Get sent proposals
- `app/proposals/cancelProposalRequest` - Cancel sent proposal

---

## 6. Chat screen (Conversations)

### Conversation list
**UI flow:**
- List of all accepted matches
- Each conversation shows:
  - Profile picture
  - Name
  - Last message preview
  - Timestamp
  - Unread message count badge
  - Online/offline status
- Sorted by most recent message

**APIs:**
- `app/proposals/getAcceptedProposalById` - Get all matches
- `app/userChat/getAllChatHistoryByUserId` - Get chat history for unread count

### Chat detail screen
**UI flow:**
1. Header shows:
   - Back button
   - Profile picture
   - Name
   - Online/offline status

2. Message list:
   - Own messages on right (purple background)
   - Other's messages on left (grey background)
   - Timestamp below each message
   - Date headers (Today, Yesterday, DD/MM/YYYY)

3. Input area:
   - Text input field
   - Send button

4. Real-time messaging (instant delivery)

**APIs:**
- `app/userChat/getAllChatHistoryByUserId` - Load chat history
- Socket.io events - Real-time messaging
- `app/userChat/updateChatIsRead` - Mark messages as read

---

## 7. Account screen

**UI sections:**

### Profile overview
- Profile picture
- Name
- Age, location
- Premium badge (if applicable)
- "Edit Profile" button

### Menu options
1. **Edit Profile** → Navigate to edit screens
2. **Upgrade to Premium** → Navigate to upgrade screen
3. **Preferences** → Set partner preferences
4. **Settings** → App settings
5. **Help & Support** → Support options
6. **About Us** → App information
7. **Invite Friends** → Share app
8. **Logout** → Sign out
9. **Delete Account** → Permanent deletion

**APIs:**
- `app/users/viewUserDetail` - Get user profile
- `app/package/getPackageByUserId` - Check premium status
- `admin/users/deleteUser` - Delete account

---

## 8. Edit profile screens

### Edit profile (main)
**UI flow:**
- View-only mode showing all profile details
- Sections:
  - Personal details
  - Lifestyle
  - Education & career
  - About me & partner preferences
  - Interests
- Each section has "Edit" button

**API:**
- `app/users/viewUserDetail` - Get current profile data

### Edit personal details
**UI flow:**
- Edit: Name, DOB, Religion, Community, Mother tongue
- State, City, Planning to settle
- Save button

**API:**
- `app/users/completeUserProfileV2` - Update personal details

### Edit lifestyle
**UI flow:**
- Edit: Height, Diet, Drinking, Smoking
- Marital status, Kids
- Save button

**API:**
- `app/users/completeUserProfileV2` - Update lifestyle

### Edit education & career
**UI flow:**
- Edit: Employment type, Occupation, Company
- Education type, College, Annual income
- Save button

**API:**
- `app/users/completeUserProfileV2` - Update career details

### Edit personality
**UI flow:**
- Edit: About me text
- Partner expectations text
- Select/deselect interests
- Save button

**API:**
- `app/users/completeUserProfileV2` - Update personality

### Manage photos
**UI flow:**
- Profile picture with edit button
- Gallery images (max 5)
- Add/remove photos
- Drag to reorder

**APIs:**
- `app/users/getGalleryImageList` - Get current images
- `app/users/updateUserProfilePic` - Update profile picture
- `app/users/addEditGalleryImageList` - Add/edit gallery

---

## 9. Preference screen

**UI flow:**
1. Set partner preferences:
   - Age range (from-to)
   - Height range
   - Religion (multiple select)
   - Community (multiple select)
   - State (multiple select)
   - City (multiple select)
   - Marital status
   - Education type
   - Occupation
   - Annual income range
   - Diet preference
   - Drinking habits
   - Smoking habits

2. Bottom buttons:
   - **Reset Preferences** → Clear all filters
   - **Apply** → Save preferences

**APIs:**
- Master data APIs (same as registration)
- `app/users/completeUserProfileV2` - Save preferences
- `app/users/resetPartnerPreferences` - Reset to default

---

## 10. Upgrade screen (Premium)

**UI flow:**
1. Premium benefits section:
   - Unlimited proposals
   - See who liked you
   - Advanced filters
   - Profile boost
   - Ad-free experience
   - Priority support

2. Package cards:
   - **3 Months** - ₹449 (₹149/month)
   - **6 Months** - ₹749 (₹125/month) [Most Popular]
   - **Till Marriage** - ₹1499 [Best Value]

3. Select package → Click "Continue"

4. Payment gateway opens (Razorpay)

5. Complete payment

6. Success screen → Premium activated

**APIs:**
- `admin/package/getpackage` - Get package list
- `admin/timeDuration/getTimeDuration` - Get duration options
- `app/paymentGateways/getPaymentgatewaysForPackage` - Get Razorpay config
- `app/paymentGateways/generateRazorPayOrderId` - Create payment order
- `app/paymentGateways/verifyPayment` - Verify payment after success
- `app/payment/insertPayment` - Save payment record
- `app/package/savePremiumAccount` - Activate premium features

---

## 11. Selfie verification screen

**UI flow:**
1. Instructions screen:
   - "Verify it's really you"
   - Requirements: Good lighting, face clearly visible
   - Click "Take Selfie"

2. Camera opens

3. Capture selfie

4. AI verification in progress (loading)

5. Result:
   - **Success** → Profile verified badge added
   - **Failed** → Retry with better photo

**API:**
- `app/verify-selfie` - Upload & verify selfie with AI

---

## 12. Settings screen

**UI sections:**

### Account settings
- Change phone number
- Email verification
- Privacy settings

### Notification settings
- Push notifications toggle
- Message notifications toggle
- Match notifications toggle

### App settings
- Language preference
- Theme (Light/Dark)

### Legal
- Terms & Conditions
- Privacy Policy
- Refund Policy

**APIs:**
- Various update APIs for settings changes

---

## 13. Help & Support screen

**UI flow:**

### FAQ section
- Expandable accordion with common questions
- Categories: Account, Matching, Premium, Payments, Privacy

### Contact support
- Support form with:
  - Subject dropdown
  - Message textarea
  - Submit button

### Other options
- Call support
- Email support
- Live chat

**API:**
- `app/support/submitTicket` - Submit support request

---

## 14. About Us screen

**UI flow:**
- Hero section with app logo
- Mission & vision
- Core values cards:
  - Member-centric
  - Privacy by design
  - AI with purpose
  - Culture-rooted
  - Always evolving
- Team section
- Contact information

---

## 15. Invite friends screen

**UI flow:**
- Referral code displayed
- Share options:
  - WhatsApp
  - SMS
  - Email
  - Copy link
- Benefits of referral program

**API:**
- `app/referral/generateCode` - Generate referral code

---

## User journey summary

### New user journey
1. Welcome → Login/Register
2. Enter phone → Verify OTP
3. Complete 11 profile steps
4. Welcome home
5. Start discovering matches

### Existing user journey
1. App opens → Auto-login
2. Home screen (Discover)
3. View profiles → Send proposals
4. Check Interest tab for responses
5. Accept proposals → Start chatting
6. Edit profile as needed
7. Upgrade to premium for more features

### Premium user journey
- Same as regular + enhanced features
- See all profile names immediately
- Unlimited proposals
- Advanced preference filters
- Priority support

---

## Navigation structure

```
Root
├── Welcome Stack (Not logged in)
│   ├── Welcome Screen
│   ├── Login Screen
│   ├── Register Screen
│   ├── OTP Screen
│   └── Profile Completion Flow (11 screens)
│       └── Welcome Home Screen
│
└── Main Tabs (Logged in)
    ├── Home Tab
    │   └── Discover Screen
    │
    ├── Interest Tab
    │   └── Proposals Screen (3 tabs)
    │
    ├── Chat Tab
    │   ├── Conversations List
    │   └── Chat Detail Screen
    │
    └── Account Tab
        ├── Account Screen
        ├── Edit Profile Stack
        │   ├── Edit Profile
        │   ├── Edit Personal
        │   ├── Edit Lifestyle
        │   ├── Edit Education
        │   └── Edit Personality
        ├── Preference Screen
        ├── Upgrade Screen
        ├── Settings Screen
        ├── Help & Support Screen
        ├── About Us Screen
        └── Invite Friends Screen
```

---

## App features summary

### Free features
✓ Create profile  
✓ Discover matches  
✓ Send limited proposals per day  
✓ Receive unlimited proposals  
✓ Accept/reject proposals  
✓ Chat with matches  
✓ Basic filters  
✓ View gallery images  

### Premium features
✓ Unlimited proposals  
✓ See all profile names  
✓ Advanced filters  
✓ Profile boost  
✓ Ad-free experience  
✓ Priority support  
✓ Read receipts  
✓ Online status visibility  

---

## Push notification scenarios

1. **Proposal received** → "Congrats 🎉 new request received! [Name] wants to connect with you"
2. **Proposal accepted** → "Good news! [Name] accepted your proposal"
3. **New message** → "[Name]: [Message preview]"
4. **Profile viewed** → "[Name] viewed your profile" (Premium only)
5. **New match** → "New match found for you!"
6. **Payment success** → "Payment successful! You're now a premium member"

---

This document provides a complete overview of the app's UI flow with API endpoints, focusing on user experience and screen-by-screen navigation.
