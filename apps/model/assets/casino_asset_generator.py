"""Original MODEL product assets. Run with Blender --background --python this_file -- --stage hero|all.

The hero stage is deliberately separate: inspect its previews before running all.
All dimensions are metres, Z is the face normal, and exports are centred at the origin.
"""
import argparse
import json
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT.parent / 'public'
COLLECTIONS = ['HERO', 'CHIPS', 'COINS', 'DICE', 'CARDS', 'ROULETTE', 'LIGHTING', 'CAMERAS']
MATERIALS = {}


def material(name, color, metallic=0, roughness=.32, emission=0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = roughness
    if emission:
        bsdf.inputs['Emission Color'].default_value = (*color, 1)
        bsdf.inputs['Emission Strength'].default_value = emission
    MATERIALS[name] = mat
    return mat


def setup():
    # This runs in a dedicated background process, never in the user's open scene.
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for c in list(bpy.data.collections):
        bpy.data.collections.remove(c)
    for name in COLLECTIONS:
        bpy.context.scene.collection.children.link(bpy.data.collections.new(name))
    material('M_Obsidian', (.007, .009, .013), .15, .23)
    MATERIALS['M_Obsidian'].node_tree.nodes.get('Principled BSDF').inputs['Specular IOR Level'].default_value = .22
    material('M_Gold', (.64, .48, .28), .92, .28)
    material('M_VioletEmission', (.32, .075, .65), .4, .28, 1.6)
    material('M_WhiteCeramic', (.76, .75, .7), .05, .3)


def finish(obj, name, mat, bevel=0):
    obj.name = name
    obj.data.materials.append(MATERIALS[mat])
    if bevel:
        modifier = obj.modifiers.new('Product edge', 'BEVEL')
        modifier.width = bevel
        modifier.segments = 2
    for face in obj.data.polygons:
        face.use_smooth = True
    modifier = obj.modifiers.new('Weighted normals', 'WEIGHTED_NORMAL')
    modifier.keep_sharp = True
    return obj


def disc(name, radius, thickness, z, mat, bevel=.025, vertices=64):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=thickness, location=(0, 0, z))
    return finish(bpy.context.object, name, mat, bevel)


def ring(name, radius, tube, z, mat, segments=64):
    bpy.ops.mesh.primitive_torus_add(major_radius=radius, minor_radius=tube, major_segments=segments,
                                   minor_segments=6, location=(0, 0, z))
    return finish(bpy.context.object, name, mat)


def box(name, location, scale, mat, bevel=.025):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, name, mat, bevel)


def group(name, collection, objects):
    root = bpy.data.objects.new(name, None)
    target = bpy.data.collections[collection]
    target.objects.link(root)
    for obj in objects:
        for existing in list(obj.users_collection):
            existing.objects.unlink(obj)
        target.objects.link(obj)
        obj.parent = root
    return root


def create_hero():
    objects = [disc('HeroToken_Core', 1.32, .28, 0, 'M_Obsidian', .055),
               disc('HeroToken_OuterRing', 1.39, .18, 0, 'M_Gold', .028)]
    # Two finished faces keep the silhouette convincing through a half turn.
    for side in [-1, 1]:
        objects += [disc(f'Face_{side}', 1.28, .1, side*.145, 'M_Obsidian', .035),
                    ring(f'GoldLip_{side}', 1.30, .022, side*.19, 'M_Gold'),
                    ring(f'VioletChannel_{side}', 1.16, .012, side*.204, 'M_VioletEmission'),
                    disc(f'InnerPlate_{side}', 1.08, .055, side*.20, 'M_Obsidian', .025),
                    ring(f'InnerInlay_{side}', 1.045, .012, side*.235, 'M_Gold')]
        # Original folded-chevron mark: no cryptocurrency symbol or existing logo.
        for i, (x, angle) in enumerate([(-.38, -.48), (0, .48), (.38, -.48)]):
            part = box(f'Fold_{side}_{i}', (x, 0, side*.27), (.17, .71, .065), 'M_Gold', .025)
            part.rotation_euler.z = angle
            objects.append(part)
        for i in range(24):
            a = i*math.tau/24
            part = box(f'Radial_{side}_{i}', (1.225*math.cos(a), 1.225*math.sin(a), side*.20),
                       (.04, .012, .009), 'M_Gold', .003)
            part.rotation_euler.z = a
            objects.append(part)
    return group('HeroCasinoToken', 'HERO', objects)


def create_chip(radius=1.1, thickness=.26, edge_segments=12, bevel=.035, accent='M_Gold', name='CasinoChip_BlackGold'):
    objects = [disc(name+'_body', radius, thickness, 0, 'M_Obsidian', bevel, 64),
               ring(name+'_rim', radius*.89, .028, thickness/2, accent, 64),
               disc(name+'_centre', radius*.66, .035, thickness/2, 'M_Obsidian', .015, 64)]
    for i in range(edge_segments):
        a = i*math.tau/edge_segments
        obj = box(name+f'_edge{i}', (radius*.87*math.cos(a), radius*.87*math.sin(a), 0),
                  (.19, .10, thickness+.012), accent, .015)
        obj.rotation_euler.z = a
        objects.append(obj)
    return group(name, 'CHIPS', objects)


def create_coin(radius=1, thickness=.14, edge_ridges=32, accent='M_Gold', name='CryptoCoin_BlackGold'):
    objects = [disc(name+'_body', radius, thickness, 0, accent, .025, 64),
               disc(name+'_inlay', radius*.87, .035, thickness/2, 'M_Obsidian', .018, 64)]
    for i in range(edge_ridges):
        a = i*math.tau/edge_ridges
        obj = box(name+f'_ridge{i}', (radius*.97*math.cos(a), radius*.97*math.sin(a), 0),
                  (.045, .026, thickness*.65), 'M_Obsidian', .006)
        obj.rotation_euler.z = a
        objects.append(obj)
    for r in [.38, .57]:
        objects.append(ring(name+'_abstract', r, .035, thickness/2+.04, accent, 48))
    return group(name, 'COINS', objects)


def create_dice(size=1.25, bevel=.14):
    objects = [box('DiceBody', (0, 0, 0), (size, size, size), 'M_Obsidian', bevel)]
    faces = [(2, 1, [(0, 0)]), (2, -1, [(-.25,-.3),(-.25,0),(-.25,.3),(.25,-.3),(.25,0),(.25,.3)]),
             (1, -1, [(-.25,-.25),(.25,.25)]), (1, 1, [(-.25,-.25),(.25,.25),(-.25,.25),(.25,-.25),(0,0)]),
             (0, 1, [(-.25,-.25),(0,0),(.25,.25)]), (0, -1, [(-.25,-.25),(.25,.25),(-.25,.25),(.25,-.25)])]
    for axis, side, dots in faces:
        for u, v in dots:
            obj = disc('DicePip', .075, .012, 0, 'M_Gold', .008, 16)
            pos = [u, v, side*(size/2+.002)]
            if axis == 1:
                obj.rotation_euler.x = math.pi/2
                pos = [u, side*(size/2+.002), v]
            if axis == 0:
                obj.rotation_euler.y = math.pi/2
                pos = [side*(size/2+.002), u, v]
            obj.location = pos
            objects.append(obj)
    return group('CasinoDice', 'DICE', objects)


def create_card(width=1.2, height=1.8, thickness=.04):
    objects = [box('CardBody', (0,0,0), (width,height,thickness), 'M_WhiteCeramic', .06),
               box('CardBack', (0,0,-.026), (width*.91,height*.94,.012), 'M_Obsidian', .04)]
    mark = box('CardAbstractFace', (0,0,.035), (.34,.34,.015), 'M_Gold', .025)
    mark.rotation_euler.z = math.pi/4
    objects.append(mark)
    for x in [-.32, 0, .32]:
        for y in [-.55, -.18, .18, .55]:
            obj = box('CardBackPattern', (x,y,-.043), (.16,.16,.009), 'M_Gold', .012)
            obj.rotation_euler.z = math.pi/4
            objects.append(obj)
    return group('PlayingCard', 'CARDS', objects)


def create_roulette(radius=1.25, sectors=24):
    objects = [disc('RouletteBase', radius,.14,0,'M_Obsidian',.04,64),
               ring('RouletteRim',radius*.94,.035,.09,'M_Gold',64),
               ring('RouletteInner',radius*.52,.03,.11,'M_Gold',64),
               disc('RouletteHub',radius*.3,.18,.10,'M_Gold',.025,64)]
    for i in range(sectors):
        a=i*math.tau/sectors
        obj=box('RouletteDivider',(.9*math.cos(a),.9*math.sin(a),.095),(.4,.018,.018),'M_Gold',.005)
        obj.rotation_euler.z=a
        objects.append(obj)
    return group('RouletteElement','ROULETTE',objects)


def studio():
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 32
    scene.cycles.use_denoising = True
    scene.render.resolution_x = scene.render.resolution_y = 1024
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.world.color = (.06,.06,.06)
    scene.view_settings.view_transform = 'AgX'
    for name, location, energy, size, color in [
        ('Key',(-4,3,3),450,3,(1,.88,.70)), ('Rim',(3,1,2),650,2,(.78,.82,1)),
        ('Fill',(0,-4,2),120,2,(1,1,1)), ('Back',(-3,2,-4),400,3,(1,.88,.70))]:
        light = bpy.data.lights.new(name,'AREA')
        light.energy=energy; light.shape='DISK'; light.size=size; light.color=color
        obj=bpy.data.objects.new(name,light)
        bpy.data.collections['LIGHTING'].objects.link(obj)
        obj.location=location
        obj.rotation_euler=(-obj.location).to_track_quat('-Z','Y').to_euler()
    camera=bpy.data.objects.new('ProductPreview',bpy.data.cameras.new('ProductPreview'))
    bpy.data.collections['CAMERAS'].objects.link(camera)
    scene.camera=camera
    camera.data.type='ORTHO'; camera.data.ortho_scale=3.65


def show_only(root):
    visible=set(root.children_recursive)
    for obj in bpy.data.objects:
        if obj.type=='MESH': obj.hide_render=obj not in visible


def render(root, filename, angle=25, scale=3.65):
    show_only(root)
    camera=bpy.context.scene.camera
    a=math.radians(angle)
    camera.location=(4*math.sin(a),-1.1,4*math.cos(a))
    camera.rotation_euler=(-camera.location).to_track_quat('-Z','Y').to_euler()
    camera.data.ortho_scale=scale
    target=PUBLIC/'renders'/filename
    target.parent.mkdir(parents=True,exist_ok=True)
    bpy.context.scene.render.filepath=str(target)
    bpy.ops.render.render(write_still=True)


def export(root, filename, budget):
    bpy.ops.object.select_all(action='DESELECT')
    depsgraph=bpy.context.evaluated_depsgraph_get()
    triangles=0
    for obj in root.children_recursive:
        mesh=obj.evaluated_get(depsgraph).to_mesh()
        mesh.calc_loop_triangles(); triangles+=len(mesh.loop_triangles)
        obj.evaluated_get(depsgraph).to_mesh_clear()
        obj.hide_set(False); obj.select_set(True)
    assert triangles<=budget, f'{root.name}: {triangles} exceeds {budget}'
    root.select_set(True)
    target=PUBLIC/'models'/filename
    target.parent.mkdir(parents=True,exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=str(target),export_format='GLB',use_selection=True,
                             export_apply=True,export_cameras=False,export_lights=False)
    return {'file':filename,'triangles':triangles,'bytes':target.stat().st_size,'budget':budget}


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--stage',choices=['hero','all'],default='hero')
    args=parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
    setup(); hero=create_hero(); studio()
    report=[export(hero,'hero-casino-token.glb',20000)]
    for angle,label in [(0,'front'),(25,'angle'),(155,'back')]:
        render(hero,f'hero/{label}.png',angle)
    if args.stage=='all':
        items=[(create_chip(),'casino-chip.glb','chip'),(create_coin(),'crypto-coin.glb','coin'),
               (create_dice(),'casino-dice.glb','dice'),(create_card(),'playing-card.glb','card'),
               (create_roulette(),'roulette-element.glb','roulette')]
        for root,filename,folder in items:
            report.append(export(root,filename,10000))
            render(root,f'{folder}/angle.png',30,3.2)
            if folder in ['chip','coin']:
                render(root,f'{folder}/front.png',0,3.2)
        for root,folder in [(create_chip(accent='M_VioletEmission',name='CasinoChip_BlackViolet'),'chip'),
                            (create_chip(accent='M_Gold',name='CasinoChip_Gold'),'chip'),
                            (create_coin(accent='M_VioletEmission',name='CryptoCoin_Violet'),'coin')]:
            if root.name=='CasinoChip_Gold':
                root.children[0].data.materials[0]=MATERIALS['M_Gold']
            render(root,f'{folder}/{root.name}.png',30,3.2)
    # Optimized editable duplicate with applied modifiers, at the original origin.
    final=bpy.data.objects.new('HeroCasinoToken_FINAL',None)
    bpy.data.collections['HERO'].objects.link(final)
    for obj in list(hero.children):
        duplicate=obj.copy(); duplicate.data=obj.data.copy()
        bpy.data.collections['HERO'].objects.link(duplicate); duplicate.parent=final
        bpy.context.view_layer.objects.active=duplicate
        for modifier in list(duplicate.modifiers): bpy.ops.object.modifier_apply(modifier=modifier.name)
        duplicate.hide_render=True
    final.hide_viewport=True
    show_only(hero)
    for obj in bpy.data.objects:
        if obj.type=='MESH' and obj not in hero.children_recursive: obj.hide_set(True)
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'casino-assets.blend'))
    (ROOT/'asset-report.json').write_text(json.dumps(report,indent=2)+'\n')
    print('MODEL_ASSET_REPORT',json.dumps(report))


if __name__=='__main__': main()
