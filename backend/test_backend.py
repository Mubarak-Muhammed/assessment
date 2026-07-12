import requests
import time

print("Testing backend connectivity...")
print("Attempting to reach http://localhost:8000/health...")

try:
    start = time.time()
    response = requests.get('http://localhost:8000/health', timeout=3)
    elapsed = time.time() - start
    print(f"✓ Health check successful in {elapsed:.2f}s: {response.json()}")
except requests.exceptions.Timeout:
    print("✗ Request timed out after 3 seconds")
except requests.exceptions.ConnectionError as e:
    print(f"✗ Connection error: {e}")
except Exception as e:
    print(f"✗ Error: {e}")

print("\nAttempting /agent/chat endpoint...")
try:
    start = time.time()
    response = requests.post(
        'http://localhost:8000/agent/chat',
        json={"message": "Test", "context": None},
        timeout=5
    )
    elapsed = time.time() - start
    print(f"✓ Request successful in {elapsed:.2f}s")
    print(f"Response: {response.json()}")
except requests.exceptions.Timeout:
    print("✗ Request timed out after 5 seconds")
except requests.exceptions.ConnectionError as e:
    print(f"✗ Connection error: {e}")
except Exception as e:
    print(f"✗ Error: {e}")
