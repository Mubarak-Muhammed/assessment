import socket

s = socket.socket()
s.settimeout(5)
try:
    s.connect(('127.0.0.1', 8000))
    s.sendall(b'GET /health HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n')
    data = b''
    while True:
        chunk = s.recv(4096)
        if not chunk:
            break
        data += chunk
    print(data.decode('replace'))
except Exception as e:
    print('ERROR', type(e).__name__, e)
finally:
    s.close()
