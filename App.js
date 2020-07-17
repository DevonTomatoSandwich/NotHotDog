import React, { Component } from 'react'

import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-picker'

import Clarifai from 'clarifai'

class App extends Component {

  constructor() {
    super()
    
    this._onClick = this._onClick.bind(this)
       
    this.options = {
      title: 'Not hot dog from ...',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    this.state = {
      isLoading: false,
      isResult: false,
      isHotDog: false,
      currentPath: null,
      accuracy: 0.0,
    }

  }

  _onClick() {
    
    ImagePicker.showImagePicker(this.options, (response) => {
      
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error); // todo real device ios permissions
      } else {
        this.setState({ isLoading: true, result: false, isHotDog: false })
        
        this.setState({
          currentPath: Platform.OS === 'android' ? response.path : response.uri,
        });
        
        this.analyseIsHotdog(response.data, response.type);
      }
    });
  }

  analyseIsHotdog(data, type) {
    console.log('analyseIsHotdog');
    console.log('type = ' + type);
    
    // check for JPEG, PNG, TIFF, BMP, GIF, WEBP
    type = type.toLowerCase();
    if(
      !(type.includes('jpeg') ||
      type.includes('png') ||
      type.includes('tiff') ||
      type.includes('bmp') ||
      type.includes('gif') ||
      type.includes('webp'))
    ) {
      Toast.show('File type \"' + type + '\" is not supported try using any of JPEG, PNG, TIFF, BMP, GIF, WEBP', Toast.LONG);
      console.log('image type ' + type + ' not supported use any of JPEG, PNG, TIFF, BMP, GIF, WEBP')
      return this.setState({ isResult: false, isLoading: false, isHotDog: false })
    }

    const clarifai = new Clarifai.App({
      apiKey: 'abc123' // todo your api key here (a better way is to store the key somewhere else)
    })
    
    clarifai.models.predict(
      {
        id: Clarifai.GENERAL_MODEL,
        version: "aa7f35c01e0642fda5cf400f543e7c40",
      }, 
      data
    ).then(response => {

      // a list of all concepts in the image e.g.
      // {id:ai_LRzQhTHd, name:puppy, value:0.9876596, app_id:main}
      const concepts = response.outputs[0].data.concepts;
      
      if (concepts && concepts.length > 0) {
        console.log('concepts ok');

        hotdogStats = {
          hotdog: -1,
          dog: -1,
          tongue: -1,
        }

        for (const concept of concepts) {
          
          // console.log(concept.value + ' concept.name = ' + concept.name);
          if(concept.name === 'hotdog')
            hotdogStats.hotdog = concept.value
          else if(concept.name === 'dog') 
            hotdogStats.dog = concept.value
          else if(concept.name === 'tongue') 
            hotdogStats.tongue = concept.value
          
          if(hotdogStats.hotdog >= 0.95)
            return this.setState({
              isLoading: false,
              isResult: true, 
              isHotDog: true, 
              accuracy: hotdogStats.hotdog 
            })
          
          if(hotdogStats.dog >= 0.95 && hotdogStats.tongue >= 0.9)
            return this.setState({
              isLoading: false,
              isResult: true,
              isHotDog: true,
              accuracy: hotdogStats.dog * hotdogStats.tongue,
            })
          
        }
      }
      this.setState({ isResult: true, isLoading: false, })
    })
    .catch(() => {
      Alert.alert(
        'An error has occurred',
        'Sorry, the quota may have been exceeded, try again later!',
        [
          { text: 'OK', onPress: () => this._cancel() },
        ],
        { cancelable: false }
      )
    })
  }

  render() {
    return (<>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={require('./assets/nhd_background.png')} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safe_area}>
  
        <View style={styles.parent}>
        
          <View style={styles.top}>
            <TouchableOpacity style={styles.top_button_touchable} onPress={this._onClick} > 
              <Text style={styles.top_button_text}>
                Get Hot Dog Pic ¿
              </Text>
            </TouchableOpacity >
          </View>

          {this.state.currentPath != null ?
            <Image style={styles.pic} source={{ 
              uri:'file://' + this.state.currentPath
            }} />
            :
            <View style={styles.no_pic}>
              <Text style={styles.no_pic_text}>
                Click "Get Hot Dog Pic ¿" above to load a picture from device or camera
              </Text>
            </View>
          }
          
          {this.state.isLoading ? 
            <View style={styles.low_results_container}>
              <Text style={styles.low_text_title}>
              Results:
              </Text>
              <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />
            </View>
            :
            (this.state.isResult ? 
              <View style={styles.low_results_container}>
                <Text style={styles.low_text_title}>
                Results:
                </Text>
                <Text style={styles.low_text_result}>
                  {this.state.isHotDog ? 'Hotdog!' : 'Not Hotdog!'}
                </Text>
                {this.state.isHotDog && (
                  <Text style={styles.low_text_result}>
                    Accuracy : {this.getPercent1dp()}%
                  </Text>
                )}
              </View>
              :
              <View style={styles.low}/>
            )
          }

        </View>
        
      </SafeAreaView>
      </ImageBackground>
    </>);
  }

  getPercent1dp() {
    res = Math.round(this.state.accuracy * 1000) * 0.1 
    return res.toFixed(1)
  }
  
}

const black = '#000000'
const white = '#ffffff'
const darkBlue = '#147efb'
const green = '#53d769'

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain',
    height: '100%',
    width: '100%',
    backgroundColor: green,
  },
  safe_area: {
    flex: 1,
  },
  parent: {
    flex: 1,
  },
  
  top: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  top_button_touchable: {
    paddingStart: 20,
    paddingEnd: 20,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: white,
    borderWidth: 5,
    borderColor: black,
    borderRadius: 20,
    shadowOffset: { width: 10, height: 10, },
    shadowColor: black,
    shadowOpacity: 0.3,
  },
  top_button_text: {
    color: darkBlue,
    fontSize: 24,
  },
  no_pic: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'black',
    paddingLeft: '16%',
    paddingRight: '16%',
    backgroundColor: white,
  },
  no_pic_text: {
    fontSize: 20,
  },
  pic: {
    width: '100%',
    flex: 4,
    resizeMode:'contain',
  },

  low: {
    flex: 1,
  },
  low_results_container: {
    flex: 1,
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white,
    borderRadius: 40,
  },
  low_text_title: {
    alignSelf: 'flex-start',
    paddingStart: 40,
    fontSize: 15,
    fontWeight: "bold",
  },
  low_text_result: {
    fontSize: 24,
    fontWeight: "bold",
  },
  loader: {
    color: green,
  }
});

export default App;