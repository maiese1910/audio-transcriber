import shutil
import os
from typing import Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from faster_whisper import WhisperModel
import torch
try:
    from pyannote.audio import Pipeline
except ImportError:
    print("pyannote.audio not installed, diarization will not work")
    Pipeline = None

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
# small = better balance for Spanish coherence
MODEL_TYPE = "small"
model = None

@app.on_event("startup")
def load_model():
    global model
    print(f"Loading Faster Whisper model: {MODEL_TYPE}...")
    # Run on CPU with INT8 quantization for speed and low memory usage
    model = WhisperModel(MODEL_TYPE, device="cpu", compute_type="int8")
    print("Model loaded successfully.")

@app.get("/")
def read_root():
    return {"message": "Audio Transcriber API is running"}

@app.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    hf_token: Optional[str] = Form(None)
):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    # Validate file extension
    allowed_extensions = {".mp3", ".wav", ".m4a", ".mp4", ".mpeg", ".mpga", ".webm"}
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}")

    # Save uploaded file temporarily
    temp_filename = f"temp_{file.filename}"
    
    try:
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        print(f"Transcribing {file.filename}...")
        
        # Transcribe using faster-whisper
        # Added initial_prompt for context and vad_filter to reduce hallucinations
        segments_generator, info = model.transcribe(
            temp_filename, 
            language="es", 
            beam_size=5,
            initial_prompt="Esta es una transcripción clara, coherente y bien puntuada en español.",
            vad_filter=True,
            vad_parameters=dict(min_silence_duration_ms=500)
        )
        
        print(f"Detected language '{info.language}' with probability {info.language_probability}")

        full_transcription = []
        segments_list = []
        
        for segment in segments_generator:
            # print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
            full_transcription.append(segment.text)
            segments_list.append({
                "start": segment.start,
                "end": segment.end,
                "text": segment.text
            })
        
        # Diarization Logic
        diarization_segments = []
        speaker_count = 0
        speakers_set = set()
        
        if hf_token and Pipeline:
            try:
                print(f"Starting diarization with token: {hf_token[:4]}...")
                pipeline = Pipeline.from_pretrained(
                    "pyannote/speaker-diarization-3.1",
                    use_auth_token=hf_token
                )
                
                if pipeline:
                    # Use CPU or GPU
                    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
                    pipeline.to(device)
                    
                    diarization = pipeline(temp_filename)
                    
                    for turn, _, speaker in diarization.itertracks(yield_label=True):
                        diarization_segments.append({
                            "start": turn.start,
                            "end": turn.end,
                            "speaker": speaker
                        })
                        speakers_set.add(speaker)
                    
                    speaker_count = len(speakers_set)
                    print(f"Diarization complete. Found {speaker_count} speakers.")
                    
                    # Align speakers with transcription segments
                    for seg in segments_list:
                        seg_start = seg["start"]
                        seg_end = seg["end"]
                        
                        # Find speaker with max overlap
                        best_speaker = "Unknown"
                        max_overlap = 0
                        
                        for diag in diarization_segments:
                            # Calculate overlap
                            overlap_start = max(seg_start, diag["start"])
                            overlap_end = min(seg_end, diag["end"])
                            overlap = max(0, overlap_end - overlap_start)
                            
                            if overlap > max_overlap:
                                max_overlap = overlap
                                best_speaker = diag["speaker"]
                        
                        if max_overlap > 0:
                            seg["speaker"] = best_speaker
                        else:
                             # Fallback: try to find the closest speaker if no overlap
                             # For simplicity, leave as Unknown or try nearest
                             pass

            except Exception as e:
                print(f"Diarization error: {str(e)}")
                # Continue without diarization
        else:
             print("Skipping diarization (no token or library missing)")
        
        transcription_text = " ".join(full_transcription).strip()
        
        # Return with explicit UTF-8 encoding
        return JSONResponse(
            content={
                "filename": file.filename,
                "transcription": transcription_text,
                "language": info.language,
                "duration": info.duration,
                "duration": info.duration,
                "segments": segments_list,
                "speaker_count": speaker_count,
                "speakers": list(speakers_set)
            },
            media_type="application/json; charset=utf-8"
        )
    
    except Exception as e:
        print(f"Error during transcription: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
    
    finally:
        # Clean up temporary file
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

