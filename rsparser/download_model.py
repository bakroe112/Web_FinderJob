"""
Script to download or fix the resume classifier model.
If you have the model on Hugging Face, update the model_name below.
"""
from huggingface_hub import snapshot_download
import os

# If your model is on Hugging Face, replace with the actual model name
# Example: "username/autotrain-resume-classifier3"
MODEL_NAME = "autotrain-resume-classifier3"  # Update this!

def download_model():
    """Download model from Hugging Face Hub"""
    try:
        print(f"Downloading model: {MODEL_NAME}")
        model_path = snapshot_download(
            repo_id=MODEL_NAME,
            local_dir="./autotrain-resume-classifier3",
            local_dir_use_symlinks=False
        )
        print(f"Model downloaded successfully to: {model_path}")
        return True
    except Exception as e:
        print(f"Error downloading model: {e}")
        print("\nIf the model is not on Hugging Face:")
        print("1. Copy the original model files to rsparser/autotrain-resume-classifier3/")
        print("2. Make sure model.safetensors is not corrupted (should be several MB)")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("Resume Classifier Model Downloader")
    print("=" * 60)
    
    # Check current model file
    model_file = "./autotrain-resume-classifier3/model.safetensors"
    if os.path.exists(model_file):
        size = os.path.getsize(model_file)
        print(f"\nCurrent model.safetensors size: {size} bytes")
        if size < 1000:
            print("⚠️  Model file is corrupted (too small)")
            print("Attempting to re-download...")
            download_model()
        else:
            print("✓ Model file looks OK")
    else:
        print("\n⚠️  Model file not found")
        print("Attempting to download...")
        download_model()
