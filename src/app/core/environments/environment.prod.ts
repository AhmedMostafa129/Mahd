// Function to generate a unique device ID
function generateDeviceId(): string {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = 'device-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api', // Update with your production API URL
  deviceId: generateDeviceId()
};

