import os
import re

directories = ['app', 'components']
hook_patterns = [
    re.compile(r'useState\('),
    re.compile(r'useEffect\('),
    re.compile(r'useContext\('),
    re.compile(r'useRef\('),
    re.compile(r'useMemo\('),
    re.compile(r'useCallback\('),
    re.compile(r'useRouter\('),
    re.compile(r'usePathname\('),
    re.compile(r'useSearchParams\('),
]
use_client_pattern = re.compile(r'^\s*[\x22\x27]use client[\x22\x27]', re.MULTILINE)

scanned_count = 0
matches_count = 0

for d in directories:
    dir_path = os.path.join(r'c:\Users\i_m_s\Downloads\medilink_pro', d)
    if not os.path.exists(dir_path):
        print(f"Directory not found: {dir_path}")
        continue
    for root, _, files in os.walk(dir_path):
        for f in files:
            if not (f.endswith('.tsx') or f.endswith('.ts')):
                continue
            path = os.path.join(root, f)
            scanned_count += 1
            try:
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
            except Exception as e:
                print(f"Error reading {path}: {e}")
                continue
            
            has_hook = any(pattern.search(content) for pattern in hook_patterns)
            has_use_client = use_client_pattern.search(content) is not None
            
            if has_hook:
                matches_count += 1
                if not has_use_client:
                    print(f"MISSING_USE_CLIENT: {os.path.relpath(path, r'c:\Users\i_m_s\Downloads\medilink_pro')}")

print(f"Scanned {scanned_count} files, found {matches_count} files with hooks.")

