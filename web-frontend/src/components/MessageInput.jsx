import React, { useState } from 'react';
import {
  Box,
  Input,
  Button,
  IconButton,
  HStack,
  Image,
} from '@chakra-ui/react';
import { AttachmentIcon } from '@chakra-ui/icons';

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const handleSend = () => {
    if (text || image) {
      onSend({ text, image, isUser: true });
      setText('');
      setImage(null);
    }
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Box className="message-input" mt={4} w="100%">
      <HStack spacing={2}>
        <Input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          display="none"
          id="file-upload"
        />
        <IconButton
          as="label"
          htmlFor="file-upload"
          icon={<AttachmentIcon />}
          variant="outline"
        />
        <Button onClick={handleSend} colorScheme="teal">
          Send
        </Button>
      </HStack>
      {image && (
        <Box mt={2}>
          <Image src={image} alt="Preview" maxH="100px" borderRadius="md" />
        </Box>
      )}
    </Box>
  );
};

export default MessageInput;
