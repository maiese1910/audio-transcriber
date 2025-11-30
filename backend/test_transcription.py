import requests
import sys
import os

def test_transcription(file_path, url="http://localhost:7860/transcribe"):
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found.")
        return

    print(f"Sending '{file_path}' to {url}...")
    try:
        with open(file_path, "rb") as f:
            files = {"file": f}
            response = requests.post(url, files=files)
        
        if response.status_code == 200:
            data = response.json()
            print("\n--- Transcription Success ---")
            print(f"Filename: {data.get('filename')}")
            print(f"Language: {data.get('language')}")
            print(f"Duration: {data.get('duration'):.2f}s")
            print("\nTranscription:")
            print(data.get("transcription")[:500] + "..." if len(data.get("transcription")) > 500 else data.get("transcription"))
        else:
            print(f"\nError: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"\nRequest failed: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_transcription.py <path_to_audio_file>")
    else:
        test_transcription(sys.argv[1])
