"""Inspect exported GLB structure without Blender or a GPU."""
import json
import math
import struct
from pathlib import Path

root = Path(__file__).resolve().parents[1]
report = []
for path in sorted((root / 'public/models').glob('*.glb')):
    data = path.read_bytes()
    magic, version, length = struct.unpack_from('<4sII', data)
    assert magic == b'glTF' and version == 2 and length == len(data)
    chunk_length, chunk_type = struct.unpack_from('<II', data, 12)
    assert chunk_type == 0x4E4F534A
    gltf = json.loads(data[20:20 + chunk_length])
    assert not gltf.get('cameras') and 'KHR_lights_punctual' not in gltf.get('extensions', {})
    assert not gltf.get('images'), 'These assets use simple PBR materials, not textures'
    triangles = 0
    for mesh in gltf['meshes']:
        for primitive in mesh['primitives']:
            assert primitive.get('mode', 4) == 4
            assert 'NORMAL' in primitive['attributes']
            position = gltf['accessors'][primitive['attributes']['POSITION']]
            assert all(math.isfinite(v) for v in position['min'] + position['max'])
            triangles += gltf['accessors'][primitive['indices']]['count'] // 3
    budget = 20000 if path.name.startswith('hero-') else 10000
    assert triangles <= budget
    report.append(dict(file=path.name, bytes=len(data), triangles=triangles,
                       materials=[m['name'] for m in gltf['materials']], normals=True,
                       textures=0, cameras=0, lights=0))
(root / 'assets/export-validation.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
