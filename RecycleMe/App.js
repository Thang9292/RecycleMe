import { Camera, CameraType } from 'expo-camera';
import React, { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import axios from "axios";

export default function App() {

  // For Camera Photo Taking
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [screen, setScreen] = useState(0)
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  // For saving the image?
  const [val, setVal] = useState("Guessing the Object");

  // For ChatGPT
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const cameraRef = useRef(null);

  const processImage = async () => {
    // Use Expo's ImagePicker to select an image from your device
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      if (result != null) {
        const uri = result.assets[0].uri;
        classifyImage(uri);
      }
      else {
        console.log("Image Not Picked")
      }
    }
  };

  // Change the ip-address to your local machine
    const classifyImage = (imageURI) => {

      const formData = new FormData();
      formData.append('file', {
        uri: imageURI,
        type: 'image/jpeg', // Adjust the type based on your image format
        name: 'image.jpg', // You can customize the filename
      });

      try {
        axios.post("http://143.215.85.237:3000/post", formData).then((res) => {
          console.log(res.data.message);
          setVal(res.data.message);
          setPrompt(res.data.prompt);
        });
        console.log("File uploaded successfully");
      } catch (error) {
        console.error(error);
      }
    }


  // Start Screen at screen == 0
  if (screen == 0) {
    return (    
      <View style={styles.container}>
        <Button onPress={() => setScreen(1)} title="Camera" />
      </View>);
  }

  // Camera Screen
  if (screen == 1) {
    if (!permission) {
      // Camera permissions are still loading
      return <View />;
    }
  
    if (!permission.granted) {
      // Camera permissions are not granted yet
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }

    // Displaying the camera
    return (
      <View style={styles.container}>
        <Camera style={styles.camera} ref={cameraRef}>
          {/* Take Picture Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={{ fontSize: 18, color: 'white' }}>Take Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Display Photo Taken */}
          {capturedPhoto && (
          <View>
            <Image source={{ uri: capturedPhoto.uri }} style={{ width: 200, height: 200 }} />
            <Text>Image saved to media library</Text>
          </View>
          )}
          
          {/* Back, See Pic, and Backend Buttons */}
          <Button onPress={() => setScreen(0)} title="Back" />
          <Button onPress={() => setScreen(3)} title="BackEnd" />
        </Camera>
      </View>
    );
  }

  // BackEnd Screen
  if (screen == 3) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 18, textAlign: 'center' }}> {val} </Text>
        {/* Back Button */}
        <Button onPress={() => setScreen(0)} title="Back" />
        <Button onPress={processImage} title='classifyImage'/>
        <Button onPress={ChatGPT} title='How To Recycle'/>
        <Text style={{ fontSize: 18, textAlign: 'center' }}> {response} </Text>
      </View>
    );
  }


  // Handles Taking a Picture
  async function takePicture() {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync();

      // Check if a photo was successfully taken
      if (photo) {
        // Save the captured photo to the device's media library
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        setCapturedPhoto(asset);
        
      } else {
        // Handle the case where the photo capture was unsuccessful
        console.log("Failed to capture a photo");
      }
    }
  }

  // Handles ChatGPT
  async function ChatGPT() {
    const apiKey = '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';
    console.log(prompt)
      try {
        const requestBody = {
          model: "gpt-3.5-turbo",
          messages: [
            { role: 'user', content: prompt },
          ],
        };
  
        const response = await axios.post('https://api.openai.com/v1/chat/completions', requestBody, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        setResponse(response.data.choices[0].message.content)
        console.log(response.data.choices[0].message.content)
      } catch (error) {
        console.error('Error sending prompt:', error);
      };

  }

}

  












const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  capturedImageContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capturedImage: {
    width: 300,
    height: 400,
  },
});
