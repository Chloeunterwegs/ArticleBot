import json
import subprocess
import os

def main():
    # Step 1: 读取输入
    input_data = input("Enter JSON input: ")
    
    # Step 2: 解析输入
    try:
        data = json.loads(input_data)
        task = data.get("task", "").strip()
        content = data.get("content", "").strip()
    except json.JSONDecodeError:
        print("Invalid JSON input")
        return
    
    # Step 3: 设置 ollama 的绝对路径
    OLLAMA_PATH = r"E:\software\Ollama\ollama.exe"
    
    if not os.path.exists(OLLAMA_PATH):
        print(f"OLLAMA_PATH does not exist: {OLLAMA_PATH}")
        return
    
    # Step 4: 检查 ollama 服务是否正在运行
    try:
        result = subprocess.run(["tasklist", "/FI", "IMAGENAME eq ollama.exe"], capture_output=True, text=True)
        if "ollama.exe" in result.stdout:
            print("ollama service is already running")
        else:
            print("Starting ollama service...")
            subprocess.run([OLLAMA_PATH, "serve"])
            subprocess.run(["timeout", "/t", "5"])
    except Exception as e:
        print(f"Error checking or starting ollama service: {e}")
        return
    
    # Step 5: 根据任务调用不同的命令
    try:
        if task == "summarize":
            subprocess.run([OLLAMA_PATH, "run", "qwen2:7b", "-InputObject", f"Summarize the following text: {content}"])
        elif task == "generateTags":
            subprocess.run([OLLAMA_PATH, "run", "qwen2:7b", "-InputObject", f"Generate tags for the following text: {content}"])
        else:
            print("Unknown task")
    except Exception as e:
        print(f"Error running ollama command: {e}")

if __name__ == "__main__":
    main()