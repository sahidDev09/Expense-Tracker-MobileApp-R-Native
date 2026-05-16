import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Automatically detect the host IP if running in Expo Go
const debuggerHost = Constants.expoConfig?.hostUri;
let localhost = debuggerHost?.split(':')[0] || 'localhost';

// Android Emulator uses 10.0.2.2 to access the computer's localhost
if (Platform.OS === 'android' && localhost === 'localhost') {
  localhost = '10.0.2.2';
}

const PORT = '5001';

// Replace this with your actual Render URL after deployment
// Example: https://syndicate-api.onrender.com
const RENDER_API_URL = 'https://expense-tracker-mobileapp-r-native.onrender.com/api';

// On Web, we want to use the Render URL in production, or localhost in dev
// On Mobile, we need the full URL (use your computer's IP for local testing)
export const API_URL = Platform.OS === 'web' 
  ? (process.env.NODE_ENV === 'production' ? RENDER_API_URL : `http://${localhost}:${PORT}/api`)
  : `http://${localhost}:${PORT}/api`;

console.log('API URL set to:', API_URL);
