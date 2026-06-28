import os

root_dir = r"c:\Users\i_m_s\Downloads\medilink_pro"
exclude_dirs = {"node_modules", ".next", ".git", ".agents"}

files_with_mtime = []

for root, dirs, files in os.walk(root_dir):
    # modify dirs in place to skip excluded directories
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        filepath = os.path.join(root, file)
        try:
            mtime = os.path.getmtime(filepath)
            files_with_mtime.append((filepath, mtime))
        except OSError:
            pass

files_with_mtime.sort(key=lambda x: x[1], reverse=True)

for filepath, mtime in files_with_mtime[:5]:
    print(filepath)
