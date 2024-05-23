import wave

def decode_message_from_audio(audio_path):
    audio = wave.open(audio_path, mode='rb')

    frame_bytes = bytearray(list(audio.readframes(audio.getnframes())))

    extracted_bits = [frame_bytes[i] & 1 for i in range(len(frame_bytes))]

    message = "".join(chr(int("".join(map(str, extracted_bits[i:i+8])), 2)) for i in range(0, len(extracted_bits), 8))
    
    decoded_message = message.split('###')[0]
    
    audio.close()
    return decoded_message

# audio_path = 'audio.wav'
# print(decode_message_from_audio(audio_path))
