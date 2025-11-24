from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os
import whisper
from pydub import AudioSegment
import math

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://desgrabador-de-audios.web.app",
        "https://desgrabador-de-audios.firebaseapp.com",
        "*"  # Allow all for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper model
# Options: tiny, base, small, medium, large
# tiny = fastest (3-5x faster than base), good for Spanish
MODEL_TYPE = "tiny"
model = None

@app.on_event("startup")
def load_model():
    global model
    print(f"Loading Whisper model: {MODEL_TYPE}...")
    model = whisper.load_model(MODEL_TYPE)
    print("Model loaded successfully.")

@app.get("/")
def read_root():
    return {"message": "Audio Transcriber API is running"}

def split_audio(file_path, segment_length_ms=300000):  # 5 minutes = 300000 ms
    """Split audio into segments of specified length"""
    audio = AudioSegment.from_file(file_path)
    duration_ms = len(audio)
    segments = []
    
    for i in range(0, duration_ms, segment_length_ms):
        segment = audio[i:i + segment_length_ms]
        segment_path = f"{file_path}_segment_{i // segment_length_ms}.mp3"
        segment.export(segment_path, format="mp3")
        segments.append(segment_path)
    
    return segments

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    # Validate file extension
    allowed_extensions = {".mp3", ".wav", ".m4a", ".mp4", ".mpeg", ".mpga", ".webm"}
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}")

    # Save uploaded file temporarily
    temp_filename = f"temp_{file.filename}"
    segment_files = []
    
    try:
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Check file size and split if necessary (> 10MB)
        file_size_mb = os.path.getsize(temp_filename) / (1024 * 1024)
        
        if file_size_mb > 10:
            # Split audio into 5-minute segments
            print(f"File size: {file_size_mb:.2f}MB - Splitting into segments...")
            segment_files = split_audio(temp_filename)
            
            # Transcribe each segment
            full_transcription = []
            for idx, segment_path in enumerate(segment_files):
                print(f"Transcribing segment {idx + 1}/{len(segment_files)}...")
                result = model.transcribe(
                    segment_path,
                    language="es",
                    verbose=False
                )
                full_transcription.append(result["text"])
            
            transcription_text = " ".join(full_transcription)
        else:
            # Transcribe normally for small files
            result = model.transcribe(
                temp_filename,
                language="es",
                verbose=False
            )
            transcription_text = result["text"]
        
        # Return with explicit UTF-8 encoding
        return JSONResponse(
            content={
                "filename": file.filename,
                "transcription": transcription_text
            },
            media_type="application/json; charset=utf-8"
        )
    
    except Exception as e:
        print(f"Error during transcription: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
    
    finally:
        # Clean up all temporary files
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        for segment_file in segment_files:
            if os.path.exists(segment_file):
                os.remove(segment_file)

