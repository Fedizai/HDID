import os
import json
import shutil
import glob

history_dir = "/Users/fedizayen/Library/Application Support/Antigravity/User/History"
restore_dir = "/Users/fedizayen/.gemini/antigravity/scratch/Hdid"

if not os.path.exists(restore_dir):
    os.makedirs(restore_dir)

# Helper function
def get_latest_entry(repo_dir):
    entries_file = os.path.join(repo_dir, "entries.json")
    if not os.path.exists(entries_file): return None
    
    with open(entries_file, "r") as f:
        try:
            data = json.load(f)
        except:
            return None
    
    resource = data.get("resource", "")
    # Check if this was a file from the user's project
    if "clothing-ecommerce" not in resource:
        return None
    
    entries = data.get("entries", [])
    if not entries: return None
    
    # Sort just in case, but typically JSON entries are ordered by time
    entries.sort(key=lambda x: x.get("timestamp", 0))
    latest_id = entries[-1].get("id")
    
    # Calculate relative target path to restore to the correct subfolder
    rel_path = resource.split("clothing-ecommerce/")[-1]
    
    return {
        "src": os.path.join(repo_dir, latest_id),
        "dst": os.path.join(restore_dir, rel_path)
    }


recovered = 0
for folder in os.listdir(history_dir):
    folder_path = os.path.join(history_dir, folder)
    if os.path.isdir(folder_path):
        action = get_latest_entry(folder_path)
        if action and os.path.exists(action["src"]):
            # Create subdirectories if needed (e.g. for src/style.css)
            os.makedirs(os.path.dirname(action["dst"]), exist_ok=True)
            shutil.copy2(action["src"], action["dst"])
            print(f"Restored: {action['dst']}")
            recovered += 1

print(f"\nSuccessfully recovered {recovered} files.")
