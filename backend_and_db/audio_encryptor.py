import wave

def encode_message_to_audio(audio_path, output_path, message):
    message += '###'  
    audio = wave.open(audio_path, mode='rb')
    
    frame_bytes = bytearray(list(audio.readframes(audio.getnframes())))
    
    message = message.encode('utf-8')
    message_bits = list(format(byte, '08b') for byte in message)
    message_bits = ''.join(message_bits)
    
    for i in range(len(message_bits)):
        frame_bytes[i] = (frame_bytes[i] & 254) | int(message_bits[i])

    with wave.open(output_path, 'wb') as modified_audio:
        modified_audio.setparams(audio.getparams())
        modified_audio.writeframes(bytes(frame_bytes))
    
    audio.close()

# audio_path = 'file_example_WAV_1MG.wav'
# output_path = 'encoded_audio.wav'
# message = 'RGV is great'
# encode_message(audio_path, output_path, message)
