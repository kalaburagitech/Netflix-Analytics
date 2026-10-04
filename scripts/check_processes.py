import psutil

print("Searching for netflix node processes...")
found = []
for p in psutil.process_iter(['pid', 'name', 'cmdline']):
    try:
        if p.info['name'] == 'node.exe':
            cmd = ' '.join(p.info['cmdline'] or [])
            if 'netflix' in cmd.lower():
                found.append((p.info['pid'], cmd))
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        pass

for pid, cmd in found:
    print(f"PID {pid}: {cmd}")

if not found:
    print("No netflix node processes found.")
