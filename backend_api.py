# Step 2: eCTD Backend API
# Run server: uvicorn backend_api:app --reload

from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import hashlib
import uuid
from datetime import datetime

app = FastAPI(title="eCTD v4.0 Core API", version="1.0.0")

# Allow React Frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online", "system": "Nexus eCTD v4.0 Engine"}

@app.get("/api/v1/dossier/tree")
def get_dossier_tree():
    """
    Simulates fetching the hierarchical Context of Use (CoU) structure from the database.
    """
    return {
        "tree": [
            {
                "id": "m1", "title": "Module 1 - Regional", "type": "folder", "isOpen": True,
                "children": [{"id": "m1-us", "title": "1.14 Labeling", "type": "folder", "isOpen": False, "children": []}]
            },
            { "id": "m2", "title": "Module 2 - Summaries", "type": "folder", "isOpen": False, "children": [] },
            {
                "id": "m3", "title": "Module 3 - Quality", "type": "folder", "isOpen": True,
                "children": [] 
            }
        ]
    }

@app.post("/api/v1/documents/ingest")
async def ingest_document(file: UploadFile = File(...)):
    """
    Handles PDF ingestion, memory buffering, UUID generation, and cryptographic hashing.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # 1. Buffer file in memory
    file_content = await file.read()
    
    # 2. Generate eCTD master UUID
    document_uuid = str(uuid.uuid4())
    
    # 3. Calculate MD5 Hash for FDA Integrity Check
    md5_hash = hashlib.md5(file_content).hexdigest()
    
    # [Database operations would occur here]
    # - INSERT INTO tb_documents
    # - Upload physical file to AWS S3
    # - INSERT INTO tb_audit_trail
    
    return {
        "status": "success",
        "message": "File ingested and hashed securely.",
        "data": {
            "document_uuid": document_uuid,
            "file_name": file.filename,
            "checksum_md5": md5_hash,
            "size_bytes": len(file_content),
            "timestamp": datetime.utcnow().isoformat()
        }
    }

@app.get("/api/v1/validation/run")
def run_validation_engine():
    """
    Simulates the validation engine running checks against HL7 XSD schemas and DB integrity.
    """
    return {
        "status": "completed",
        "metrics": {"errors": 1, "warnings": 1, "passed": 1},
        "results": [
            {"id": "ERR-V4-0012", "sev": "High", "msg": "Target ContextOfUse UUID for Replace not found.", "node": "Module 3.2.S.1"},
            {"id": "WARN-PDF-003", "sev": "Warning", "msg": "PDF contains non-embedded fonts.", "node": "batch_analysis_001.pdf"},
            {"id": "PASS-V4-0045", "sev": "Pass", "msg": "HL7 submissionunit.xml validates successfully.", "node": "Root Message"}
        ]
    }