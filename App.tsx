import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity, Image, SafeAreaView,Button } from 'react-native';
import { login, sendMessage } from './api';
import store, { addMessage, clearMessages } from './redux/store';
import { Icon } from 'react-native-elements';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const ChatScreen = () => {
  const [input, setInput] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const messages = useSelector((state) => state.messages);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const userToken = await login(username);
      if (userToken) {
        setToken(userToken);
      } else {
        setError('Login failed');
      }
    } catch (error) {
      setError('Login failed');
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    dispatch(addMessage(userMessage));
    setInput('');

    try {
      const botResponse = await sendMessage(token,input);
      const botMessage = { role: 'assistant', content: botResponse };
      dispatch(addMessage(botMessage));
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <View style={styles.container}>
      {token ? (
        <View style={styles.chatContainer}>
          <View style={styles.header}>
            <Image source={{ uri: 'https://example.com/chatgpt-logo.png' }} style={styles.logo} />
            <Text style={styles.title}>Welcome to ChatGPT</Text>
          </View>
          <ScrollView>
            {messages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageContainer,
                  message.role === 'user' ? styles.userMessage : styles.botMessage,
                ]}
              >
                <Text style={styles.messageText}>{message.content}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type your message"
              placeholderTextColor="grey"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Icon name="send" color="white" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.inputs}
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
          />
          <Button title="Login" onPress={handleLogin} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      )}
    </View>
  );
};

const HistoryScreen = () => {
  const messages = useSelector((state) => state.messages);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.role === 'user' ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.content}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Chat">
      <Drawer.Screen name="Chat" component={ChatScreen} />
      <Drawer.Screen name="History" component={HistoryScreen} />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    padding: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    marginTop: 10,
    backgroundColor: '#0B93F6',
    color: 'white',
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0B93F6',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    color: 'white',
  },
  sendButton: {
    backgroundColor: '#0B93F6',
    borderRadius: 20,
    padding: 10,
  },
  inputs: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: 'white',
  },
});
