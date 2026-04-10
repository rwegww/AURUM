import os
import re

def check_imports(start_dir):
    js_files = []
    for root, dirs, files in os.walk(start_dir):
        for file in files:
            if file.endswith(".js"):
                js_files.append(os.path.join(root, file))

    mismatches = []
    
    for file_path in js_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Find relative imports
            imports = re.findall(r"from\s+['\"](\./[^'\"]+| \.\./[^'\"]+)['\"]", content)
            
            dir_name = os.path.dirname(file_path)
            
            for imp in imports:
                # Add .js if missing (some people omit it, though this project seems to use it)
                target_rel = imp.strip()
                if not target_rel.endswith(".js"):
                    # Might be a directory or just missing extension
                    test_path = os.path.join(dir_name, target_rel + ".js")
                else:
                    test_path = os.path.join(dir_name, target_rel)
                
                test_path = os.path.normpath(test_path)
                
                if os.path.exists(test_path):
                    # Check casing
                    actual_dir = os.path.dirname(test_path)
                    actual_name = os.path.basename(test_path)
                    
                    try:
                        files_in_dir = os.listdir(actual_dir)
                        if actual_name not in files_in_dir:
                            # Find the one that matches case-insensitively
                            correct_name = next((f for f in files_in_dir if f.lower() == actual_name.lower()), "NOT_FOUND")
                            mismatches.append({
                                "file": file_path,
                                "import": imp,
                                "expected": actual_name,
                                "actual": correct_name
                            })
                    except Exception as e:
                        print(f"Error reading {actual_dir}: {e}")

    return mismatches

if __name__ == "__main__":
    base_dir = r"c:\Users\nguye\.gemini\antigravity\scratch\chem-odyssey\api"
    results = check_imports(base_dir)
    if not results:
        print("No casing mismatches found.")
    for m in results:
        print(f"MISMATCH in {os.path.basename(m['file'])}:")
        print(f"  Import: {m['import']}")
        print(f"  Actual file on disk: {m['actual']}")
        print("-" * 20)
