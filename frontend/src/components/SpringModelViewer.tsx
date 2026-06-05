import {
    useEffect,
    useRef,
    useState,
} from 'react'

import {
    generateSpringMesh,
    meshToObj,
    meshToStl,
    type Mesh,
    type SpringModelSpec,
    type Vec3,
} from '../utils/springModel'


interface SpringModelViewerProps {
    modelSpec: SpringModelSpec | null
}


interface ProjectedPoint extends Vec3 {
    screenX: number
    screenY: number
}


interface DragState {
    mode: "rotate" | "pan"
    startX: number
    startY: number
    rotationX: number
    rotationZ: number
    offsetX: number
    offsetY: number
}


function rotatePoint(point: Vec3, rotationX: number, rotationZ: number): Vec3 {

    const cosZ = Math.cos(rotationZ)
    const sinZ = Math.sin(rotationZ)
    const zRotated = {
        x: point.x * cosZ - point.y * sinZ,
        y: point.x * sinZ + point.y * cosZ,
        z: point.z,
    }

    const cosX = Math.cos(rotationX)
    const sinX = Math.sin(rotationX)

    return {
        x: zRotated.x,
        y: zRotated.y * cosX - zRotated.z * sinX,
        z: zRotated.y * sinX + zRotated.z * cosX,
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

    return {
        x: vector.x / length,
        y: vector.y / length,
        z: vector.z / length,
    }
}


function projectMesh(
    mesh: Mesh,
    width: number,
    height: number,
    rotationX: number,
    rotationZ: number,
    zoom: number,
    offsetX: number,
    offsetY: number
): ProjectedPoint[] {

    const rotated = mesh.vertices.map((point) => rotatePoint(point, rotationX, rotationZ))
    const maxSize = rotated.reduce((size, point) => {
        return Math.max(size, Math.abs(point.x), Math.abs(point.y), Math.abs(point.z))
    }, 1)
    const scale = Math.min(width, height) * 0.38 * zoom / maxSize

    return rotated.map((point) => ({
        ...point,
        screenX: width / 2 + offsetX + point.x * scale,
        screenY: height / 2 + offsetY - point.y * scale,
    }))
}


function faceNormal(face: number[], points: ProjectedPoint[]): Vec3 {

    if (face.length < 3) {
        return {
            x: 0,
            y: 0,
            z: 1,
        }
    }

    return normalize(cross(
        subtract(points[face[1]], points[face[0]]),
        subtract(points[face[2]], points[face[0]])
    ))
}


function faceDepth(face: number[], points: ProjectedPoint[]): number {

    return face.reduce((sum, index) => sum + points[index].z, 0) / face.length
}


function downloadFile(filename: string, content: string, mimeType: string) {

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")

    anchor.href = url
    anchor.download = filename
    anchor.click()

    URL.revokeObjectURL(url)
}


function SpringModelViewer({
    modelSpec,
}: SpringModelViewerProps) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const dragRef = useRef<DragState | null>(null)
    const [rotationX, setRotationX] = useState(-0.65)
    const [rotationZ, setRotationZ] = useState(0.75)
    const [offsetX, setOffsetX] = useState(0)
    const [offsetY, setOffsetY] = useState(0)
    const [zoom, setZoom] = useState(1)
    const mesh = modelSpec ? generateSpringMesh(modelSpec) : null

    useEffect(() => {
        const canvas = canvasRef.current

        if (!canvas || !mesh) {
            return
        }

        const context = canvas.getContext("2d")

        if (!context) {
            return
        }

        const rect = canvas.getBoundingClientRect()
        const pixelRatio = window.devicePixelRatio || 1

        canvas.width = rect.width * pixelRatio
        canvas.height = rect.height * pixelRatio
        context.scale(pixelRatio, pixelRatio)
        context.clearRect(0, 0, rect.width, rect.height)

        const projected = projectMesh(mesh, rect.width, rect.height, rotationX, rotationZ, zoom, offsetX, offsetY)
        const sortedFaces = [...mesh.faces].sort((a, b) => faceDepth(a, projected) - faceDepth(b, projected))
        const lightDirection = normalize({
            x: -0.45,
            y: 0.3,
            z: 0.85,
        })

        context.fillStyle = "#eef6ff"
        context.fillRect(0, 0, rect.width, rect.height)

        sortedFaces.forEach((face) => {
            const normal = faceNormal(face, projected)
            const light = Math.max(0.18, normal.x * lightDirection.x + normal.y * lightDirection.y + normal.z * lightDirection.z)
            const hue = 215
            const saturation = 78
            const lightness = 34 + light * 34

            context.beginPath()

            face.forEach((index, pointIndex) => {
                const point = projected[index]

                if (pointIndex === 0) {
                    context.moveTo(point.screenX, point.screenY)
                    return
                }

                context.lineTo(point.screenX, point.screenY)
            })

            context.closePath()
            context.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
            context.fill()
            context.strokeStyle = "rgba(15, 23, 42, 0.18)"
            context.lineWidth = 0.45
            context.stroke()
        })
    }, [mesh, rotationX, rotationZ, zoom, offsetX, offsetY])

    function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {

        event.preventDefault()

        const isPan = event.button === 1 || event.button === 2 || event.shiftKey

        dragRef.current = {
            mode: isPan ? "pan" : "rotate",
            startX: event.clientX,
            startY: event.clientY,
            rotationX,
            rotationZ,
            offsetX,
            offsetY,
        }

        event.currentTarget.setPointerCapture(event.pointerId)
    }


    function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {

        const drag = dragRef.current

        if (!drag) {
            return
        }

        const deltaX = event.clientX - drag.startX
        const deltaY = event.clientY - drag.startY

        if (drag.mode === "pan") {
            setOffsetX(drag.offsetX + deltaX)
            setOffsetY(drag.offsetY + deltaY)
            return
        }

        setRotationZ(drag.rotationZ + deltaX * 0.01)
        setRotationX(Math.max(-Math.PI / 2, Math.min(Math.PI / 2, drag.rotationX + deltaY * 0.01)))
    }


    function handlePointerUp(event: React.PointerEvent<HTMLCanvasElement>) {

        dragRef.current = null
        event.currentTarget.releasePointerCapture(event.pointerId)
    }


    function handleWheel(event: React.WheelEvent<HTMLCanvasElement>) {

        event.preventDefault()

        setZoom((currentZoom) => {
            const nextZoom = currentZoom * (event.deltaY > 0 ? 0.9 : 1.1)

            return Math.max(0.35, Math.min(4, nextZoom))
        })
    }


    function resetView() {

        setRotationX(-0.65)
        setRotationZ(0.75)
        setOffsetX(0)
        setOffsetY(0)
        setZoom(1)
    }

    if (!modelSpec || !mesh) {
        return (
            <div className="bg-white rounded-xl shadow p-6 mt-6">
                <h2 className="text-2xl font-bold mb-4">3D Model</h2>
                <p>Run a calculation to generate a 3D spring preview and exportable CAD mesh.</p>
            </div>
        )
    }

    const modelName = `${modelSpec.springType}_spring`

    return (
        <div className="bg-white rounded-xl shadow p-6 mt-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-2">3D Model</h2>
                    <p className="text-sm text-gray-600">
                        Left-drag rotates. Shift/right-drag pans. Mouse wheel zooms. Exported mesh units are millimetres.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        className="bg-slate-200 text-slate-900 px-4 py-2 rounded"
                        onClick={resetView}
                    >
                        Reset View
                    </button>

                    <button
                        className="bg-slate-900 text-white px-4 py-2 rounded"
                        onClick={() => downloadFile(`${modelName}.stl`, meshToStl(mesh, modelName), "model/stl")}
                    >
                        Export STL
                    </button>

                    <button
                        className="bg-slate-700 text-white px-4 py-2 rounded"
                        onClick={() => downloadFile(`${modelName}.obj`, meshToObj(mesh, modelName), "model/obj")}
                    >
                        Export OBJ
                    </button>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                className="mt-4 h-96 w-full cursor-grab rounded-lg border border-slate-200 touch-none active:cursor-grabbing"
                onContextMenu={(event) => event.preventDefault()}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onWheel={handleWheel}
            />

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                <label>
                    <span className="text-sm text-gray-600">Tilt</span>
                    <input
                        className="w-full"
                        type="range"
                        min="-1.57"
                        max="1.57"
                        step="0.01"
                        value={rotationX}
                        onChange={(event) => setRotationX(Number(event.target.value))}
                    />
                </label>

                <label>
                    <span className="text-sm text-gray-600">Rotation</span>
                    <input
                        className="w-full"
                        type="range"
                        min="-3.14"
                        max="3.14"
                        step="0.01"
                        value={rotationZ}
                        onChange={(event) => setRotationZ(Number(event.target.value))}
                    />
                </label>

                <label>
                    <span className="text-sm text-gray-600">Zoom</span>
                    <input
                        className="w-full"
                        type="range"
                        min="0.35"
                        max="4"
                        step="0.01"
                        value={zoom}
                        onChange={(event) => setZoom(Number(event.target.value))}
                    />
                </label>
            </div>
        </div>
    )
}

export default SpringModelViewer
