import base64
import struct

import numpy as np
import pygltflib
import pyrr
import logging

logger = logging.getLogger("uvicorn.error")


def count_vertices(gltf):
    count = 0
    for node in gltf.nodes:
        if node.mesh is not None:
            mesh = gltf.meshes[node.mesh]
            for primitive in mesh.primitives:
                count += gltf.accessors[primitive.attributes.POSITION].count
    return count


def get_vertices(gltf, primitive):
    # get the binary data for this mesh primitive from the buffer
    accessor = gltf.accessors[primitive.attributes.POSITION]
    bufferView = gltf.bufferViews[accessor.bufferView]
    buffer = gltf.buffers[bufferView.buffer]
    data = gltf.get_data_from_buffer_uri(buffer.uri)

    # pull each vertex from the binary buffer and convert it into a tuple of python floats
    vertices = []
    for i in range(accessor.count):
        index = (
            bufferView.byteOffset + accessor.byteOffset + i * 12
        )  # the location in the buffer of this vertex
        d = data[index : index + 12]  # the vertex data
        v = struct.unpack("<fff", d)  # convert from base64 to three floats
        vertices.append(v)
    return np.array(vertices, dtype=np.float32)


def get_triangles(gltf, primitive):
    # get the binary data for this mesh primitive from the buffer
    accessor = gltf.accessors[primitive.indices]
    bufferView = gltf.bufferViews[accessor.bufferView]
    buffer = gltf.buffers[bufferView.buffer]
    data = gltf.get_data_from_buffer_uri(buffer.uri)

    triangles = []
    for i in range(accessor.count):
        index = (
            bufferView.byteOffset + accessor.byteOffset + i * 2
        )  # the location in the buffer of this vertex
        d = data[index : index + 2]  # the vertex data
        v = struct.unpack("<H", d)  # convert from base64 to one uint
        triangles.append(v[0])
    return np.array(triangles, dtype=np.uint16)


def apply_parent_transform(node, mat, nodes):
    for n in nodes:
        if n.children and n.children.includes(node):
            return get_transformation(n, mat, nodes)
    return pyrr.matrix44.create_identity()


def get_transformation(node, mat, nodes):
    mat @= apply_parent_transform(node, mat, nodes)

    if node.matrix:
        mat @= node.matrix
    else:
        rotation = pyrr.matrix44.create_identity()
        translation = pyrr.matrix44.create_identity()
        scale = pyrr.matrix44.create_identity()
        if node.rotation:
            rotation = pyrr.matrix44.create_from_quaternion(node.rotation).transpose()
        if node.translation:
            translation = pyrr.matrix44.create_from_translation(node.translation)
        if node.scale:
            scale = pyrr.matrix44.create_from_scale(node.scale)
        return mat @ (scale @ rotation @ translation)
    return mat


def gltf_transform(gltf_input, transformer=None):
    buffer_view_counter = 0
    mesh_counter = 0
    buffer_offset = 0

    gltf_output = pygltflib.GLTF2()
    gltf_output.scenes = gltf_input.scenes
    gltf_output.scene = gltf_input.scene
    gltf_output.nodes = gltf_input.nodes
    gltf_output.buffers = [pygltflib.Buffer()]
    data = b""
    for i, node in enumerate(gltf_input.nodes):
        if node.mesh is not None:
            mesh_input = gltf_input.meshes[node.mesh]
            gltf_output.nodes[i].mesh = mesh_counter
            mesh_counter += 1
            mat = get_transformation(
                node, pyrr.matrix44.create_identity(), gltf_input.nodes
            )
            primitives_output = []
            for primitive in mesh_input.primitives:
                vertices = get_vertices(gltf_input, primitive)
                transform = (
                    (
                        lambda vertex: transformer.transform(
                            *pyrr.matrix44.apply_to_vector(mat, vertex)
                        )
                    )
                    if transformer
                    else (lambda vertex: pyrr.matrix44.apply_to_vector(mat, vertex))
                )

                vertices_transformed = np.array(
                    ([transform(vertex) for vertex in vertices]),
                    dtype=np.float32,
                )

                indices = get_triangles(gltf_input, primitive)

                indices_bytes = indices.tobytes()
                vertices_bytes = vertices_transformed.tobytes()

                primitives_output.append(
                    pygltflib.Primitive(
                        attributes=pygltflib.Attributes(
                            POSITION=buffer_view_counter + 1
                        ),
                        indices=buffer_view_counter,
                        extras=primitive.extras,
                    )
                )

                gltf_output.accessors.append(
                    pygltflib.Accessor(
                        bufferView=buffer_view_counter,
                        componentType=pygltflib.UNSIGNED_SHORT,
                        count=indices.size,
                        type=pygltflib.SCALAR,
                        max=[int(indices.max())],
                        min=[int(indices.min())],
                    )
                )
                gltf_output.accessors.append(
                    pygltflib.Accessor(
                        bufferView=buffer_view_counter + 1,
                        componentType=pygltflib.FLOAT,
                        count=vertices_transformed.size // 3,
                        type=pygltflib.VEC3,
                        max=vertices_transformed.max(axis=0).tolist(),
                        min=vertices_transformed.min(axis=0).tolist(),
                    )
                )

                gltf_output.bufferViews.append(
                    pygltflib.BufferView(
                        buffer=0,
                        byteOffset=buffer_offset,
                        byteLength=len(indices_bytes),
                        target=pygltflib.ELEMENT_ARRAY_BUFFER,
                    )
                )
                buffer_offset += len(indices_bytes)
                gltf_output.bufferViews.append(
                    pygltflib.BufferView(
                        buffer=0,
                        byteOffset=buffer_offset,
                        byteLength=len(vertices_bytes),
                        target=pygltflib.ARRAY_BUFFER,
                    )
                )
                buffer_offset += len(vertices_bytes)
                data += indices_bytes + vertices_bytes
                buffer_view_counter += 2

            gltf_output.meshes.append(
                pygltflib.Mesh(
                    name=f"{mesh_input.name}",
                    primitives=primitives_output,
                    extras=mesh_input.extras,
                )
            )
        gltf_output.nodes[i].translation = [0, 0, 0]
        gltf_output.nodes[i].rotation = [0, 0, 0, 1]
        gltf_output.nodes[i].scale = [1, 1, 1]
    gltf_output.buffers[0].byteLength = buffer_offset
    data = base64.b64encode(data).decode("utf-8")
    gltf_output.buffers[0].uri = f"data:application/octet-stream;base64,{data}"
    return gltf_output
