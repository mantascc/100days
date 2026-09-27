"""Refresh the local, unlabelled OSM map. Run from any working directory."""
import json
import urllib.parse
import urllib.request
from pathlib import Path

BOUNDS = [54.66, 25.195, 54.715, 25.315] # south, west, north, east
bbox = ','.join(map(str, BOUNDS))
query = f'''[out:json][timeout:90];(
way["highway"~"^(motorway|trunk|primary|secondary|tertiary|residential|unclassified|living_street|pedestrian)(_link)?$"]({bbox});
way["waterway"="river"]({bbox});
way["natural"="water"]({bbox});
);out geom;'''
if __name__ == '__main__':
    request = urllib.request.Request('https://overpass-api.de/api/interpreter', data=urllib.parse.urlencode({'data':query}).encode(), headers={'User-Agent':'VilniusGraffitiSketch/1.0'})
    with urllib.request.urlopen(request, timeout=120) as response:
        data = json.load(response)
    if data.get('remark'): raise RuntimeError(data['remark'])
    features = []
    for way in data['elements']:
        tags = way.get('tags', {})
        kind = 'water' if tags.get('natural') == 'water' else 'river' if tags.get('waterway') == 'river' else 'major' if tags.get('highway', '').split('_link')[0] in ('motorway','trunk','primary','secondary','tertiary') else 'road'
        points = [[round(p['lat'],6),round(p['lon'],6)] for p in way.get('geometry',[])]
        if len(points)>1: features.append({'type':kind,'points':points})
    features.sort(key=lambda item: {'water':0,'river':1,'road':2,'major':3}[item['type']])
    dest = Path(__file__).resolve().parents[1] / 'dist'
    (dest/'map.json').write_text(json.dumps(features,separators=(',',':'))+'\n')
    (dest/'map-provenance.json').write_text(json.dumps({'source':'https://www.openstreetmap.org/copyright','endpoint':'https://overpass-api.de/api/interpreter','timestamp':data['osm3s']['timestamp_osm_base'],'bounds':BOUNDS,'license':'ODbL 1.0','features':len(features)},indent=2)+'\n')
    print(f'Saved {len(features)} features; {len((dest/"map.json").read_bytes())} bytes')
