import type {
    SpringType,
} from '../api/SpringApi'


export interface SpringModelSpec {
    springType: SpringType
    wireDiameter: number
    coilDiameter: number
    activeCoils: number
}


export interface Vec3 {
    x: number
    y: number
    z: number
}


export interface Mesh {
    vertices: Vec3[]
    faces: number[][]
}


function add(a: Vec3, b: Vec3): Vec3 {

    return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z,
    }
}


function scale(vector: Vec3, value: number): Vec3 {

    return {
        x: vector.x * value,
        y: vector.y * value,
        z: vector.z * value,
    }
}


function subtract(a: Vec3, b: Vec3): Vec3 {

    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z,
    }
}


function cross(a: Vec3, b: Vec3): Vec3 {

    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x,
    }
}


function normalize(vector: Vec3): Vec3 {

    const length = Math.hypot(vector.x, vector.y, vector.z)

    if (length === 0) {
        return {
            x: 0,
            y: 0,
            z: 0,
        }
    }

    return scale(vector, 1 / length)
}


function pitchForSpec(spec: SpringModelSpec): number {

    if (spec.springType === "extension") {
        return spec.wireDiameter * 1.08
    }

    if (spec.springType === "compression") {
        return spec.wireDiameter * 2.4
    }

    return spec.wireDiameter * 1.25
}


function createRoundRing(
    center: Vec3,
    radial: Vec3,
    vertical: Vec3,
    radius: number,
    segments: number
): Vec3[] {

    const ring: Vec3[] = []

    for (let i = 0; i < segments; i += 1) {
        const angle = (i / segments) * Math.PI * 2
        const point = add(
            center,
            add(
                scale(radial, Math.cos(angle) * radius),
                scale(vertical, Math.sin(angle) * radius)
            )
        )

        ring.push(point)
    }

    return ring
}


function createSquareRing(
    center: Vec3,
    radial: Vec3,
    vertical: Vec3,
    side: number
): Vec3[] {

    const halfSide = side / 2

    return [
        add(center, add(scale(radial, -halfSide), scale(vertical, -halfSide))),
        add(center, add(scale(radial, halfSide), scale(vertical, -halfSide))),
        add(center, add(scale(radial, halfSide), scale(vertical, halfSide))),
        add(center, add(scale(radial, -halfSide), scale(vertical, halfSide))),
    ]
}


function appendStraightSection(
    mesh: Mesh,
    start: Vec3,
    end: Vec3,
    spec: SpringModelSpec,
    crossSectionSegments: number
) {

    const direction = normalize(subtract(end, start))
    const vertical = {
        x: 0,
        y: 0,
        z: 1,
    }
    const side = normalize(cross(direction, vertical))
    const firstRingStart = mesh.vertices.length
    const rings = [start, end].map((center) => {
        return spec.springType === "square_torsion"
            ? createSquareRing(center, side, vertical, spec.wireDiameter)
            : createRoundRing(center, side, vertical, spec.wireDiameter / 2, crossSectionSegments)
    })

    mesh.vertices.push(...rings[0], ...rings[1])

    for (let j = 0; j < crossSectionSegments; j += 1) {
        const next = (j + 1) % crossSectionSegments

        mesh.faces.push([
            firstRingStart + j,
            firstRingStart + next,
            firstRingStart + crossSectionSegments + next,
            firstRingStart + crossSectionSegments + j,
        ])
    }

    mesh.faces.push(
        Array.from({ length: crossSectionSegments }, (_, index) => firstRingStart + crossSectionSegments - 1 - index)
    )
    mesh.faces.push(
        Array.from({ length: crossSectionSegments }, (_, index) => firstRingStart + crossSectionSegments + index)
    )
}


export function generateSpringMesh(spec: SpringModelSpec): Mesh {

    const mesh: Mesh = {
        vertices: [],
        faces: [],
    }
    const coilRadius = spec.coilDiameter / 2
    const pitch = pitchForSpec(spec)
    const pathSegments = Math.max(96, Math.ceil(spec.activeCoils * 48))
    const crossSectionSegments =
        spec.springType === "square_torsion" ? 4 : 12

    for (let i = 0; i <= pathSegments; i += 1) {
        const progress = i / pathSegments
        const theta = progress * spec.activeCoils * Math.PI * 2
        const radial = {
            x: Math.cos(theta),
            y: Math.sin(theta),
            z: 0,
        }
        const vertical = {
            x: 0,
            y: 0,
            z: 1,
        }
        const center = {
            x: Math.cos(theta) * coilRadius,
            y: Math.sin(theta) * coilRadius,
            z: (progress - 0.5) * spec.activeCoils * pitch,
        }

        const ring =
            spec.springType === "square_torsion"
                ? createSquareRing(center, radial, vertical, spec.wireDiameter)
                : createRoundRing(center, radial, vertical, spec.wireDiameter / 2, crossSectionSegments)

        mesh.vertices.push(...ring)

        if (i === 0) {
            continue
        }

        const previousStart = (i - 1) * crossSectionSegments
        const currentStart = i * crossSectionSegments

        for (let j = 0; j < crossSectionSegments; j += 1) {
            const next = (j + 1) % crossSectionSegments

            mesh.faces.push([
                previousStart + j,
                previousStart + next,
                currentStart + next,
                currentStart + j,
            ])
        }
    }

    mesh.faces.push(
        Array.from({ length: crossSectionSegments }, (_, index) => crossSectionSegments - 1 - index)
    )
    mesh.faces.push(
        Array.from(
            { length: crossSectionSegments },
            (_, index) => pathSegments * crossSectionSegments + index
        )
    )

    if (spec.springType === "round_torsion" || spec.springType === "square_torsion") {
        const height = spec.activeCoils * pitch
        const armLength = spec.coilDiameter
        const start = {
            x: coilRadius,
            y: 0,
            z: -height / 2,
        }
        const end = {
            x: coilRadius,
            y: 0,
            z: height / 2,
        }

        appendStraightSection(
            mesh,
            start,
            {
                x: start.x,
                y: start.y - armLength,
                z: start.z,
            },
            spec,
            crossSectionSegments
        )
        appendStraightSection(
            mesh,
            end,
            {
                x: end.x,
                y: end.y + armLength,
                z: end.z,
            },
            spec,
            crossSectionSegments
        )
    }

    return mesh
}


export function meshToObj(mesh: Mesh, name = "spring_model"): string {

    const lines = [`o ${name}`]

    mesh.vertices.forEach((vertex) => {
        lines.push(`v ${vertex.x.toFixed(6)} ${vertex.y.toFixed(6)} ${vertex.z.toFixed(6)}`)
    })

    mesh.faces.forEach((face) => {
        lines.push(`f ${face.map((index) => index + 1).join(" ")}`)
    })

    return lines.join("\n")
}


function trianglesFromFace(face: number[]): number[][] {

    const triangles: number[][] = []

    for (let i = 1; i < face.length - 1; i += 1) {
        triangles.push([face[0], face[i], face[i + 1]])
    }

    return triangles
}


export function meshToStl(mesh: Mesh, name = "spring_model"): string {

    const lines = [`solid ${name}`]

    mesh.faces.flatMap(trianglesFromFace).forEach((triangle) => {
        const a = mesh.vertices[triangle[0]]
        const b = mesh.vertices[triangle[1]]
        const c = mesh.vertices[triangle[2]]
        const normal = normalize(cross(subtract(b, a), subtract(c, a)))

        lines.push(`  facet normal ${normal.x.toFixed(6)} ${normal.y.toFixed(6)} ${normal.z.toFixed(6)}`)
        lines.push("    outer loop")
        lines.push(`      vertex ${a.x.toFixed(6)} ${a.y.toFixed(6)} ${a.z.toFixed(6)}`)
        lines.push(`      vertex ${b.x.toFixed(6)} ${b.y.toFixed(6)} ${b.z.toFixed(6)}`)
        lines.push(`      vertex ${c.x.toFixed(6)} ${c.y.toFixed(6)} ${c.z.toFixed(6)}`)
        lines.push("    endloop")
        lines.push("  endfacet")
    })

    lines.push(`endsolid ${name}`)

    return lines.join("\n")
}
