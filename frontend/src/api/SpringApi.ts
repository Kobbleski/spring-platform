export type SpringType =
    | "compression"
    | "extension"
    | "round_torsion"
    | "square_torsion"

export interface LinearSpringInput {
    wire_diameter: number
    coil_diameter: number
    active_coils: number
    force: number
    material: string
}

export interface ExtensionSpringInput extends LinearSpringInput {
    initial_tension: number
}

export interface TorsionSpringInput {
    wire_diameter: number
    coil_diameter: number
    active_coils: number
    angle_degrees: number
    material: string
}

export interface GraphPoint {
    deflection: number
    force: number
}

export interface CompressionSpringResult {
    spring_type: "compression"
    spring_rate: number
    outside_diameter: number
    inside_diameter: number
    spring_index: number
    solid_height: number
    stress: number
    graph_data: GraphPoint[]
}

export interface ExtensionSpringResult {
    spring_type: "extension"
    spring_rate: number
    outside_diameter: number
    inside_diameter: number
    spring_index: number
    initial_tension: number
    extension: number
    stress: number
    graph_data: GraphPoint[]
}

export interface TorsionSpringResult {
    spring_type: "round_torsion" | "square_torsion"
    torque_rate: number
    torque: number
    outside_diameter: number
    inside_diameter: number
    spring_index: number
    bending_stress: number
    graph_data: GraphPoint[]
}

export type SpringResult =
    | CompressionSpringResult
    | ExtensionSpringResult
    | TorsionSpringResult

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000"

async function postSpringCalculation<TInput, TResult>(
    path: string,
    inputs: TInput
): Promise<TResult> {
    const response = await fetch(
        `${API_BASE_URL}${path}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(inputs)
        }
    )

    if (!response.ok) {
        throw new Error("Failed to calculate spring")
    }

    return response.json()
}

export function calculateCompressionSpring(
    inputs: LinearSpringInput
): Promise<CompressionSpringResult> {
    return postSpringCalculation("/compression/calculate", inputs)
}

export function calculateExtensionSpring(
    inputs: ExtensionSpringInput
): Promise<ExtensionSpringResult> {
    return postSpringCalculation("/extension/calculate", inputs)
}

export function calculateRoundWireTorsionSpring(
    inputs: TorsionSpringInput
): Promise<TorsionSpringResult> {
    return postSpringCalculation("/torsion/round-wire/calculate", inputs)
}

export function calculateSquareSectionTorsionSpring(
    inputs: TorsionSpringInput
): Promise<TorsionSpringResult> {
    return postSpringCalculation("/torsion/square-section/calculate", inputs)
}
