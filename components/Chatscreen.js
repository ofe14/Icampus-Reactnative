import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';

const AssistantResponse = ({ text }) => (
  <View style={{ alignSelf: 'flex-start', marginBottom: 8 }}>
    <View style={{ backgroundColor: '#3498db', padding: 8, borderRadius: 8 }}>
      <Text style={{ color: 'white' }}>{text}</Text>
    </View>
  </View>
);

const UserMessage = ({ text }) => (
  <View style={{ alignSelf: 'flex-end', marginBottom: 8 }}>
    <View style={{ backgroundColor: '#2ecc71', padding: 8, borderRadius: 8 }}>
      <Text style={{ color: 'white' }}>{text}</Text>
    </View>
  </View>
);

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim() === '') return;

    // User message
    setMessages([...messages, { id: messages.length, text: inputText, type: 'user' }]);

    // Simple response (you can replace this with more sophisticated logic)
    setMessages([
      ...messages,
      { id: messages.length + 1, text: 'Hello! How can I assist you?', type: 'assistant' },
    ]);

    setInputText('');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end', padding: 16 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return item.type === 'assistant' ? (
            <AssistantResponse text={item.text} />
          ) : (
            <UserMessage text={item.text} />
          );
        }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, marginRight: 8 }}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={(text) => setInputText(text)}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

export default ChatScreen;

