import os
import subprocess

# 设置目标目录
target_directory = r"E:\Coding\ArticleBot\ollama-proxy"

# 切换到目标目录
os.chdir(target_directory)

# 运行命令
try:
    subprocess.run(["node", "proxy-server.js"], check=True)
except subprocess.CalledProcessError as e:
    print(f"命令执行失败: {e}")
except FileNotFoundError:
    print("找不到node命令,请确保Node.js已安装并添加到系统PATH中")
except Exception as e:
    print(f"发生错误: {e}")

# 等待用户输入后退出
input("按Enter键退出...")