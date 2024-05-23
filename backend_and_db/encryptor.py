from PIL import Image
import binascii
import base64

# Function to embed encrypted data into an image
def embed_data_to_image(data, image_path):
    image = Image.open(image_path)
    encoded = image.copy()
    width, height = image.size
    index = 0

    data = data.encode('utf-8')

    data += b'\x00' * 3  # Padding to ensure end of data can be identified
    data_bits = [format(byte, '08b') for byte in data]

    for i in range(len(data_bits)):
        for bit in data_bits[i]:
            x, y = index % width, index // width
            pixel = list(image.getpixel((x, y)))
            pixel[0] = pixel[0] & ~1 | int(bit)
            encoded.putpixel((x, y), tuple(pixel))
            index += 1
            if index // width == height:
                break
        if index // width == height:
            break

    encoded_image_path = 'encoded_image.png'
    encoded.save(encoded_image_path)

    return encoded

# Function to extract data from an image
def extract_data_from_image(image_path):
    image = Image.open(image_path)
    binary_data = ""
    for y in range(image.height):
        for x in range(image.width):
            pixel = image.getpixel((x, y))
            binary_data += str(pixel[0] & 1)

    # Convert binary data to bytes
    all_bytes = [binary_data[i: i+8] for i in range(0, len(binary_data), 8)]
    data_bytes = bytearray()
    for byte in all_bytes:
        data_bytes.append(int(byte, 2))
        if data_bytes[-3:] == b'\x00' * 3:  # Check for padding indicating end of data
            data_bytes = data_bytes[:-3]  # Remove padding
            break

    return bytes(data_bytes)





# # Encrypt the message
# message = "Hello, this is a secret message!"

# # Embed the encrypted message into an image
# image_path = 'img.jpeg'  
# encoded_image = embed_data_to_image(message, image_path)

# decrypted_message = extract_data_from_image('check.jpeg')

# # print("Original Message:", message)
# print("Decrypted Message:", decrypted_message)
