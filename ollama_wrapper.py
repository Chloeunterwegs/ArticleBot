import json
import subprocess
import os

OLLAMA_PATH = r"E:\software\Ollama\ollama.exe"

def main():
    # 读取输入
    input_data = input("Enter JSON input: ")
    
    try:
        data = json.loads(input_data)
        task = data.get("task", "").strip()
        content = data.get("content", "").strip()
        model = data.get("model", "qwen2:7b").strip()  # 默认使用 qwen2:7b
    except json.JSONDecodeError:
        print("Invalid JSON input")
        return
    
    if not os.path.exists(OLLAMA_PATH):
        print(f"OLLAMA_PATH does not exist: {OLLAMA_PATH}")
        return
    
    try:
        if task == "summarize":
            subprocess.run([OLLAMA_PATH, "run", model, "-InputObject", f"Summarize the following text: {content}"])
        elif task == "generateTags":
            subprocess.run([OLLAMA_PATH, "run", model, "-InputObject", f"Generate tags for the following text: {content}"])
        else:
            print("Unknown task")
    except Exception as e:
        print(f"Error running ollama command: {e}")

if __name__ == "__main__":
    main()