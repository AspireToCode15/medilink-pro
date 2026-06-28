import os
import re

directories = ['app', 'components']
use_client_pattern = re.compile(r'^\s*[\x22\x27]use client[\x22\x27]', re.MULTILINE)

client_components = []
server_components = []

for d in directories:
    dir_path = os.path.join(r'c:\Users\i_m_s\Downloads\medilink_pro', d)
    if not os.path.exists(dir_path):
        continue
    for root, _, files in os.walk(dir_path):
        for f in files:
            if not (f.endswith('.tsx') or f.endswith('.ts')):
                continue
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
            except Exception as e:
                continue
            
            is_client = use_client_pattern.search(content) is not None
            rel_path = os.path.relpath(path, r'c:\Users\i_m_s\Downloads\medilink_pro')
            if is_client:
                client_components.append(rel_path)
            else:
                server_components.append(rel_path)

print("CLIENT COMPONENTS:")
for c in client_components:
    print(f" - {c}")

print("\nSERVER COMPONENTS:")
for s in server_components:
    print(f" - {s}")
