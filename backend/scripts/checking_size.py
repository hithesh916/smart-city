import os

def get_dir_size(path):
    total = 0
    for root, dirs, files in os.walk(path):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.venv' in dirs:
            dirs.remove('.venv')
        if '.next' in dirs:
            dirs.remove('.next')
        if '.git' in dirs:
            dirs.remove('.git')
        for f in files:
            fp = os.path.join(root, f)
            if not os.path.islink(fp):
                total += os.path.getsize(fp)
    return total

size_bytes = get_dir_size(r"c:\Users\Hithesh\Desktop\smart-city-main - Copy")
print(f"Size excluding node_modules, .venv, .next, .git: {size_bytes / (1024*1024):.2f} MB")
