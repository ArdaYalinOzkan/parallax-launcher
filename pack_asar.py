#!/usr/bin/env python3
"""
Parallax Launcher — ASAR Paketleyici (Doğru Chromium Pickle Formatı)

Kullanım:
  python3 pack_asar.py          # Sadece kaynak dosyalar
  python3 pack_asar.py --full   # Kaynak + Firebase node_modules (binary için)
"""

import struct
import json
import os
import sys

SRC_DIR  = os.path.join(os.path.dirname(os.path.abspath(__file__)), "App_Core")
ASAR_OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "linux-unpacked", "resources", "app.asar")

SOURCE_FILES = [
    "main.js", "preload.js", "LibraryManager.js", "package.json",
]
SOURCE_DIRS = ["renderer", "Assets_Default"]

# Runtime bağımlılıkları (sadece --full modunda dahil edilir)
RUNTIME_PACKAGES = [
    "electron-squirrel-startup",
]


def pad4(n):
    """n'i 4'ün katına yuvarla."""
    return n + (4 - n % 4) % 4


def collect_files(include_node_modules=False):
    files = {}

    for name in SOURCE_FILES:
        full = os.path.join(SRC_DIR, name)
        if os.path.exists(full):
            files[name] = full

    for d in SOURCE_DIRS:
        base = os.path.join(SRC_DIR, d)
        if not os.path.isdir(base):
            continue
        for root, _, fnames in os.walk(base):
            for fname in fnames:
                if fname.endswith(".bak"):
                    continue
                full = os.path.join(root, fname)
                rel = os.path.relpath(full, SRC_DIR).replace("\\", "/")
                files[rel] = full

    if include_node_modules:
        nm_base = os.path.join(SRC_DIR, "node_modules")
        if os.path.isdir(nm_base):
            for pkg in RUNTIME_PACKAGES:
                pkg_dir = os.path.join(nm_base, pkg)
                if not os.path.isdir(pkg_dir):
                    continue
                for root, _, fnames in os.walk(pkg_dir):
                    for fname in fnames:
                        if fname.endswith((".map", ".bak")):
                            continue
                        full = os.path.join(root, fname)
                        rel = os.path.relpath(full, SRC_DIR).replace("\\", "/")
                        files[rel] = full

    return files


def build_header_dict(files_map):
    header = {"files": {}}
    ordered = []
    offset = 0

    for rel, abs_path in sorted(files_map.items()):
        size = os.path.getsize(abs_path)
        parts = rel.split("/")
        node = header["files"]
        for part in parts[:-1]:
            if part not in node:
                node[part] = {"files": {}}
            node = node[part]["files"]
        node[parts[-1]] = {"size": size, "offset": str(offset)}
        ordered.append((rel, abs_path, size))
        offset += size

    return header, ordered


def pack(include_node_modules=False):
    files_map = collect_files(include_node_modules)
    print(f"  {len(files_map)} dosya paketleniyor...")

    header_dict, ordered = build_header_dict(files_map)
    header_json = json.dumps(header_dict, separators=(',', ':')).encode("utf-8")
    json_len = len(header_json)
    json_len_padded = pad4(json_len)

    # Chromium Pickle formatı (4 uint32 = 16 byte header):
    # [0-3]  : 4  (sabit - outer pickle alignment)
    # [4-7]  : json_len_padded + 8  (outer payload size)
    # [8-11] : json_len_padded + 4  (inner payload size)
    # [12-15]: json_len              (gerçek JSON uzunluğu)
    # [16 .. 16+json_len_padded-1]: JSON + zero padding
    # [16+json_len_padded ..]: dosya verisi

    outer_payload = json_len_padded + 8
    inner_payload = json_len_padded + 4

    with open(ASAR_OUT, "wb") as f:
        f.write(struct.pack("<I", 4))               # sabit
        f.write(struct.pack("<I", outer_payload))   # outer pickle payload
        f.write(struct.pack("<I", inner_payload))   # inner pickle payload
        f.write(struct.pack("<I", json_len))        # gerçek JSON uzunluğu
        f.write(header_json)                        # JSON
        # 4-byte hizalama için sıfır padding
        f.write(b'\x00' * (json_len_padded - json_len))

        for rel, abs_path, _ in ordered:
            with open(abs_path, "rb") as src:
                f.write(src.read())

    out_size = os.path.getsize(ASAR_OUT)
    print(f"\nTamamlandı → {ASAR_OUT}")
    print(f"Paket boyutu: {out_size / 1024 / 1024:.2f} MB")
    print(f"\nÇalıştır:")
    print(f'  "/home/arda/Projects/Parallax Launcher/linux-unpacked/parallax-launcher" --no-sandbox')


if __name__ == "__main__":
    full = "--full" in sys.argv
    print("Parallax Launcher ASAR Paketleyici")
    print("=" * 40)
    print(f"Mod: {'FULL (kaynak + node_modules)' if full else 'KAYNAK ONLY'}")
    print()
    pack(include_node_modules=full)
