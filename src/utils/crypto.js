// Helper: Convert a raw buffer of bytes to a Base64 string (safe for MongoDB / JSON)
export function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Helper: Convert a Base64 string back into raw bytes (so we can decrypt it)
export function base64ToBuffer(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

// Function: Turn a master password + salt into an AES-256 CryptoKey
export async function deriveKey(masterPassword, saltBase64) {
    const encoder = new TextEncoder();

    // 1. Convert human password text into raw bytes
    const passwordBytes = encoder.encode(masterPassword);

    // 2. Decode the user's salt from Base64 back into raw bytes
    const saltBuffer = base64ToBuffer(saltBase64);

    // 3. Import the password into Web Crypto as raw key material
    const baseKey = await window.crypto.subtle.importKey(
        'raw',
        passwordBytes,
        { name: 'PBKDF2' },
        false, // Don't let anything export this raw password
        ['deriveKey'] // Only allow this to derive other keys
    );

    // 4. Grind it 100,000 times with PBKDF2 to get the AES-GCM 256-bit key
    const aesKey = await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: saltBuffer,
            iterations: 100000,
            hash: 'SHA-256',
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false, // Key cannot be extracted from browser memory
        ['encrypt', 'decrypt'] // This key can encrypt and decrypt!
    );

    return aesKey;
}

// Function: Encrypt a plain password using AES-256-GCM
export async function encryptPassword(plaintext, key) {
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(plaintext);

    // 1. Generate a fresh, random 12-byte IV (initialization vector)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // 2. Encrypt the data using AES-GCM
    const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        dataBytes
    );

    // 3. Return both the ciphertext and iv as safe Base64 strings for MongoDB
    return {
        ciphertext: bufferToBase64(encryptedBuffer),
        iv: bufferToBase64(iv),
    };
}
// Function: Decrypt ciphertext back to the original password
export async function decryptPassword(ciphertextBase64, ivBase64, key) {
    const decoder = new TextDecoder();

    // 1. Convert the Base64 strings back to raw buffers
    const ciphertextBuffer = base64ToBuffer(ciphertextBase64);
    const ivBuffer = base64ToBuffer(ivBase64);

    // 2. Decrypt using AES-GCM
    const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: new Uint8Array(ivBuffer),
        },
        key,
        ciphertextBuffer
    );

    // 3. Convert unlocked bytes back into a readable human string
    return decoder.decode(decryptedBuffer);
}
