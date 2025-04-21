export function getOrCreateDeviceId() {
    let deviceId = localStorage.getItem('device-id');
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('device-id', deviceId);
    }
    return deviceId;
  }
  