class CameraService {
  constructor() {
    this.currentStream = null;
    this.constraints = {
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: 'environment'
      }
    };
  }

  async startCamera(facingMode = 'environment') {
    try {
      // Stop any existing stream
      this.stopCamera();

      // Check for camera support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      // Update constraints
      this.constraints.video.facingMode = facingMode;

      // Request camera access
      this.currentStream = await navigator.mediaDevices.getUserMedia(this.constraints);

      return this.currentStream;
    } catch (error) {
      console.error('Camera access failed:', error);
      throw new Error(`Camera access failed: ${error.message}`);
    }
  }

  stopCamera() {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => {
        track.stop();
      });
      this.currentStream = null;
    }
  }

  async getDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('Failed to get camera devices:', error);
      return [];
    }
  }

  async hasMultipleCameras() {
    const devices = await this.getDevices();
    return devices.length > 1;
  }

  captureImage(videoElement) {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(videoElement, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to capture image'));
          }
        }, 'image/jpeg', 0.9);
      } catch (error) {
        reject(error);
      }
    });
  }

  async requestPermissions() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      // Stop the stream immediately - we just wanted permission
      stream.getTracks().forEach(track => track.stop());

      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      return false;
    }
  }
}

export const cameraService = new CameraService();