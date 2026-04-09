autotrain setup --dupdate-torch

// train bằng config dùng autotrain của huggingface
autotrain --config config.yml

// run App.js
python -m flask --app App run --port=5000

// gpu torch 
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128