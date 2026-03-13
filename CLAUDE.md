# NegativePoints

A fun React Native app for tracking negative points in a game where participants get points deducted for silly or funny actions!

## Features

- **Authentication**: Secure login/signup with email and password
- **Group Management**: Create multiple independent groups of users
- **User Management**: Add and manage users within groups
- **Give Points**: Quick buttons (-5, -10, -30, -50) to give negative points with custom reasons
- **Scoreboard**: Real-time leaderboard showing users ranked by total points (most negative wins!)
- **History**: Full event log showing all point deductions with reasons and timestamps
- **Real-time Updates**: Changes sync instantly across all devices

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: React Context API

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- A Supabase account (free tier works great)
